import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Card from '../../components/ui/Card';
import { getAllAlerts } from '../../services/api';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const SEVERITY_OPTIONS = ['all', 'critical', 'high', 'medium', 'low'];

function formatDate(value) {
  if (!value) return 'N/A';
  try {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString();
  } catch (_) {
    return 'N/A';
  }
}

const toCsv = (rows) => {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  const headers = ['createdAt', 'title', 'source', 'severity', 'status', 'description'];
  const escape = (val) => {
    const s = String(val ?? '').replace(/"/g, '""');
    return `"${s}"`;
  };
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push([
      escape(r.createdAt || ''),
      escape(r.title || ''),
      escape(r.source || ''),
      escape(r.severity || ''),
      escape(r.status || ''),
      escape(r.description || ''),
    ].join(','));
  }
  return lines.join('\n');
};

const ReportsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [severity, setSeverity] = useState('all');
  const [source, setSource] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Fetch all alerts once
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllAlerts();
        if (!isMounted) return;
        setAlerts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!isMounted) return;
        setError('Failed to load reports');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const sources = useMemo(() => {
    const set = new Set((alerts || []).map(a => a?.source).filter(Boolean));
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [alerts]);

  const processed = useMemo(() => {
    const items = Array.isArray(alerts) ? alerts.slice() : [];
    const startTs = startDate ? new Date(startDate).getTime() : null;
    const endTs = endDate ? new Date(endDate).getTime() + 24 * 60 * 60 * 1000 - 1 : null; // include whole end day

    const filtered = items.filter(a => {
      const title = (a?.title || '').toLowerCase();
      const desc = (a?.description || '').toLowerCase();
      const src = (a?.source || '').toLowerCase();
      const sev = (a?.severity || '').toLowerCase();

      if (severity !== 'all' && sev !== severity) return false;
      if (source !== 'all' && (a?.source || '') !== source) return false;

      if (startTs || endTs) {
        const ts = a?.createdAt ? new Date(a.createdAt).getTime() : null;
        if (ts === null || Number.isNaN(ts)) return false;
        if (startTs && ts < startTs) return false;
        if (endTs && ts > endTs) return false;
      }
      return true;
    });

    filtered.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      const av = a?.[sortKey];
      const bv = b?.[sortKey];
      if (sortKey === 'createdAt') {
        const at = av ? new Date(av).getTime() : 0;
        const bt = bv ? new Date(bv).getTime() : 0;
        return (at - bt) * dir;
      }
      return String(av ?? '').localeCompare(String(bv ?? '')) * dir;
    });

    return filtered;
  }, [alerts, severity, source, startDate, endDate, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processed.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processed.slice(start, start + pageSize);
  }, [processed, currentPage, pageSize]);

  const requestSort = useCallback((key) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }, [sortKey]);

  const download = useCallback((content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, []);

  const exportCSV = useCallback(() => {
    const csv = toCsv(processed);
    download(csv, 'alerts-report.csv', 'text/csv;charset=utf-8;');
  }, [processed, download]);

  const exportJSON = useCallback(() => {
    const json = JSON.stringify(processed, null, 2);
    download(json, 'alerts-report.json', 'application/json');
  }, [processed, download]);

  const exportPDF = useCallback(() => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Alerts Report', 14, 12);
    const headers = ['Date', 'Title', 'Source', 'Severity', 'Status'];
    const rows = processed.map(a => [
      formatDate(a.createdAt),
      String(a.title || ''),
      String(a.source || ''),
      String(a.severity || ''),
      String(a.status || 'open'),
    ]);
    autoTable(doc, { head: [headers], body: rows, startY: 16, styles: { fontSize: 8 } });
    // Use a Blob download to avoid file:/// navigation attempts
    const arrayBuffer = doc.output('arraybuffer');
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alerts-report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [processed]);

  useEffect(() => { setPage(1); }, [severity, source, startDate, endDate, pageSize]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-light">Reports</h1>
      <p className="text-gray-text mt-2">Search, filter, and export alert data.</p>

      <Card className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          >
            {SEVERITY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
            ))}
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          >
            {sources.map(opt => (
              <option key={opt} value={opt}>{opt === 'all' ? 'All Sources' : opt}</option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 bg-dark border border-border rounded-md text-light"
          />
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="bg-primary text-white px-3 py-2 rounded-md w-full md:w-auto">Export CSV</button>
            <button onClick={exportJSON} className="bg-primary/70 text-white px-3 py-2 rounded-md w-full md:w-auto">Export JSON</button>
            <button onClick={exportPDF} className="bg-primary/60 text-white px-3 py-2 rounded-md w-full md:w-auto">Export PDF</button>
          </div>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-gray-text text-sm">Total: {processed.length} results</div>
          <div className="flex items-center gap-2">
            <label className="text-gray-text text-sm">Rows per page:</label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-2 py-1 bg-dark border border-border rounded-md text-light"
            >
              {PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-card-bg">
              <tr>
                <th className="text-left p-2 cursor-pointer" onClick={() => requestSort('createdAt')}>Date</th>
                <th className="text-left p-2 cursor-pointer" onClick={() => requestSort('title')}>Title</th>
                <th className="text-left p-2 cursor-pointer" onClick={() => requestSort('source')}>Source</th>
                <th className="text-left p-2 cursor-pointer" onClick={() => requestSort('severity')}>Severity</th>
                <th className="text-left p-2 cursor-pointer" onClick={() => requestSort('status')}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-2"><div className="h-4 bg-gray-text/20 rounded w-24" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-text/20 rounded w-64" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-text/20 rounded w-28" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-text/20 rounded w-20" /></td>
                    <td className="p-2"><div className="h-4 bg-gray-text/20 rounded w-20" /></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-danger">{error}</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-text">No results</td>
                </tr>
              ) : (
                paginated.map((a, idx) => (
                  <tr key={a._id || idx} className="border-t border-border hover:bg-white/5 transition-colors">
                    <td className="p-2 whitespace-nowrap">{formatDate(a.createdAt)}</td>
                    <td className="p-2 max-w-xl truncate" title={a.title || ''}>{a.title || 'N/A'}</td>
                    <td className="p-2 whitespace-nowrap">{a.source || 'N/A'}</td>
                    <td className="p-2 whitespace-nowrap capitalize">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        a.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        a.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        a.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-400'
                      }`}>{a.severity || 'N/A'}</span>
                    </td>
                    <td className="p-2 whitespace-nowrap capitalize">{a.status || 'open'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="text-gray-text text-xs">Page {currentPage} of {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border border-border text-light disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border border-border text-light disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsPage;