// client/src/components/layout/Sidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faChartLine, faBell, faGlobe, faFileAlt, faDatabase, faUsersCog, faCog } from '@fortawesome/free-solid-svg-icons';

// --- PATHS ARE NOW RELATIVE ---
// Since this Sidebar is rendered inside the '/dashboard/*' route, all links
// are relative to '/dashboard'.
const navItems = [
    // `to="."` correctly links to the parent's index route: /dashboard
    { to: '.', icon: faChartLine, text: 'Dashboard' },
    // `to="alerts"` correctly links to a child route: /dashboard/alerts
    { to: 'alerts', icon: faBell, text: 'Alerts' },
    { to: 'threat-map', icon: faGlobe, text: 'Threat Map' },
    { to: 'reports', icon: faFileAlt, text: 'Reports' },
    { to: 'log-management', icon: faDatabase, text: 'Log Management' },
    { to: 'rbac', icon: faUsersCog, text: 'RBAC Settings' },
    { to: 'settings', icon: faCog, text: 'System Settings' },
];

const Sidebar = () => {
    return (
        <aside className="bg-sidebar-bg border-r border-border flex flex-col">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3 text-2xl font-bold">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary" />
                    <span className="text-light">CyberShield</span>
                </div>
            </div>
            <nav className="flex flex-col gap-2 py-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.text}
                        to={item.to}
                        // The `end` prop is crucial for the main Dashboard link (to=".").
                        // It ensures this link is only "active" when the URL is exactly
                        // '/dashboard', and not for child routes like '/dashboard/alerts'.
                        end={item.to === '.'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-3 text-light font-medium transition-colors duration-200 hover:bg-primary/10 ${
                                isActive ? 'bg-primary/10 border-r-4 border-primary text-primary' : ''
                            }`
                        }
                    >
                        <FontAwesomeIcon icon={item.icon} className="w-6 text-center" />
                        <span>{item.text}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;