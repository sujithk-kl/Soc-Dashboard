// server/windowsEventReader.js
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const os = require('os');
const fs = require('fs');

class WindowsEventReader {
	constructor() {
		this.lastEventId = null;
		this.isRunning = false;
		this.powershellPath = this.resolvePowerShellPath();
		this.logExistenceCache = new Map();
	}

	// Resolve a working PowerShell binary
	resolvePowerShellPath() {
		if (os.platform() !== 'win32') return 'pwsh';
		const candidates = [
			// PowerShell 7+
			'C:\\Program Files\\PowerShell\\7\\pwsh.exe',
			'C:\\Program Files\\PowerShell\\7-preview\\pwsh.exe',
			'pwsh.exe',
			// Windows PowerShell 5.1
			'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
			'C:\\Windows\\SysWOW64\\WindowsPowerShell\\v1.0\\powershell.exe',
			'powershell.exe',
		];
		for (const p of candidates) {
			try {
				if (p.endsWith('.exe') && fs.existsSync(p)) return p;
				// If not absolute, assume in PATH and try a no-op invocation
				if (!p.includes('\\')) return p;
			} catch (_) {}
		}
		return 'pwsh';
	}

	// Generic: read from any Windows event channel
	async readFromLog(logName, maxEvents = 25, filterIds = []) {
		// Fast exit if the channel isn't present
		const exists = await this.logExists(logName);
		if (!exists) return [];
		try {
			let cmd;
			if (filterIds && filterIds.length > 0) {
				// Use FilterHashtable for specific IDs
				const ids = filterIds.join(',');
				cmd = `"${this.powershellPath}" -NoProfile -NonInteractive -Command "Get-WinEvent -FilterHashtable @{LogName='${logName}'; Id=@(${ids})} -MaxEvents ${maxEvents} | Select-Object TimeCreated, Id, LevelDisplayName, Message | ConvertTo-Json -Depth 3"`;
			} else {
				cmd = `"${this.powershellPath}" -NoProfile -NonInteractive -Command "Get-WinEvent -LogName '${logName}' -MaxEvents ${maxEvents} | Select-Object TimeCreated, Id, LevelDisplayName, Message | ConvertTo-Json -Depth 3"`;
			}
			const { stdout } = await execAsync(cmd);
			if (stdout && stdout.trim()) {
				const events = JSON.parse(stdout);
				return Array.isArray(events) ? events : [events];
			}
			return [];
		} catch (error) {
			// Fall back to wevtutil
			return await this.readEventsViaWevtutil(maxEvents, logName);
		}
	}

	// Read Windows Security events using PowerShell (preferred)
	async readSecurityEvents(maxEvents = 10) {
		try {
			const command = `"${this.powershellPath}" -NoProfile -NonInteractive -Command "Get-WinEvent -LogName Security -MaxEvents ${maxEvents} | Select-Object TimeCreated, Id, LevelDisplayName, Message | ConvertTo-Json -Depth 3"`;
			const { stdout } = await execAsync(command);
			if (stdout && stdout.trim()) {
				const events = JSON.parse(stdout);
				return Array.isArray(events) ? events : [events];
			}
			return [];
		} catch (error) {
			console.error('Error reading Windows events:', error.message);
			return await this.readEventsViaWevtutil(maxEvents, 'Security');
		}
	}

	// Fallback: use wevtutil (built-in) with XML output and light parsing
	async readEventsViaWevtutil(maxEvents = 10, logName = 'Security') {
		try {
			// /rd:true reverses order to get most recent first
			const command = `wevtutil qe "${logName}" /c:${maxEvents} /rd:true /f:xml`;
			const { stdout } = await execAsync(command);
			if (!stdout || !stdout.trim()) return [];
			return this.parseWevtutilXml(stdout);
		} catch (error) {
			// Suppress noise for missing channels; otherwise log once
			if (typeof error.message === 'string' && error.message.toLowerCase().includes('specified channel could not be found')) {
				return [];
			}
			console.error('wevtutil fallback failed:', error.message);
			return [];
		}
	}

	// Minimal XML parser for EventID, TimeCreated and a short message snippet
	parseWevtutilXml(xmlString) {
		const events = [];
		const eventBlocks = xmlString.split('<Event>').slice(1); // naive split
		for (const block of eventBlocks) {
			const idMatch = block.match(/<EventID>(.*?)<\/EventID>/);
			const timeMatch = block.match(/<TimeCreated SystemTime=\"(.*?)\"\/>/);
			const msgMatch = block.match(/<RenderingInfo.*?>[\s\S]*?<Message>([\s\S]*?)<\/Message>/);
			const evt = {
				Id: idMatch ? Number(idMatch[1]) : undefined,
				TimeCreated: timeMatch ? timeMatch[1] : undefined,
				Message: msgMatch ? msgMatch[1].trim() : undefined,
			};
			if (evt.Id || evt.TimeCreated || evt.Message) events.push(evt);
		}
		return events;
	}

	// Check if a given event channel exists (cached)
	async logExists(logName) {
		const cached = this.logExistenceCache.get(logName);
		if (typeof cached === 'boolean') return cached;
		try {
			const { stdout } = await execAsync('wevtutil el');
			const exists = stdout.split(/\r?\n/).some(line => line.trim().toLowerCase() === logName.trim().toLowerCase());
			this.logExistenceCache.set(logName, exists);
			return exists;
		} catch (_) {
			// If enumeration fails, assume not present to avoid noisy errors
			this.logExistenceCache.set(logName, false);
			return false;
		}
	}

	async getFailedLogins(maxEvents = 20) {
		try {
			const command = `"${this.powershellPath}" -NoProfile -NonInteractive -Command "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents ${maxEvents} | Select-Object TimeCreated, Id, LevelDisplayName, Message | ConvertTo-Json -Depth 3"`;
			const { stdout } = await execAsync(command);
			if (stdout && stdout.trim()) {
				const events = JSON.parse(stdout);
				return Array.isArray(events) ? events : [events];
			}
			return [];
		} catch (error) {
			console.error('Error reading failed logins:', error.message);
			// Fallback: filter parsed XML
			const all = await this.readEventsViaWevtutil(maxEvents * 2, 'Security');
			return all.filter(e => e.Id === 4625).slice(0, maxEvents);
		}
	}

	async getSuccessfulLogins(maxEvents = 20) {
		try {
			const command = `"${this.powershellPath}" -NoProfile -NonInteractive -Command "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4624} -MaxEvents ${maxEvents} | Select-Object TimeCreated, Id, LevelDisplayName, Message | ConvertTo-Json -Depth 3"`;
			const { stdout } = await execAsync(command);
			if (stdout && stdout.trim()) {
				const events = JSON.parse(stdout);
				return Array.isArray(events) ? events : [events];
			}
			return [];
		} catch (error) {
			console.error('Error reading successful logins:', error.message);
			const all = await this.readEventsViaWevtutil(maxEvents * 2, 'Security');
			return all.filter(e => e.Id === 4624).slice(0, maxEvents);
		}
	}

	async getNewProcesses(maxEvents = 20) {
		try {
			const command = `"${this.powershellPath}" -NoProfile -NonInteractive -Command "Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4688} -MaxEvents ${maxEvents} | Select-Object TimeCreated, Id, LevelDisplayName, Message | ConvertTo-Json -Depth 3"`;
			const { stdout } = await execAsync(command);
			if (stdout && stdout.trim()) {
				const events = JSON.parse(stdout);
				return Array.isArray(events) ? events : [events];
			}
			return [];
		} catch (error) {
			console.error('Error reading new processes:', error.message);
			const all = await this.readEventsViaWevtutil(maxEvents * 2, 'Security');
			return all.filter(e => e.Id === 4688).slice(0, maxEvents);
		}
	}

	startMonitoring(intervalMs = 10000) {
		if (this.isRunning) return;
		this.isRunning = true;
		console.log('🖥️  Starting Windows Security Event monitoring...');
		this.monitorInterval = setInterval(async () => {
			try {
				const events = await this.readSecurityEvents(5);
				if (events.length > 0) {
					console.log(`📊 Captured ${events.length} new security events`);
					// Hook: emit via Socket.IO or persist
				}
			} catch (error) {
				console.error('Monitoring error:', error.message);
			}
		}, intervalMs);
	}

	stopMonitoring() {
		if (this.monitorInterval) {
			clearInterval(this.monitorInterval);
			this.isRunning = false;
			console.log('🛑 Windows Security Event monitoring stopped');
		}
	}
}

module.exports = WindowsEventReader;
