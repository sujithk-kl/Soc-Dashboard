// client/src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faChartLine, faBell, faGlobe, faFileAlt, faDatabase, faUsersCog, faCog } from '@fortawesome/free-solid-svg-icons';

const navItems = [
    { to: '/', icon: faChartLine, text: 'Dashboard' },
    { to: '/alerts', icon: faBell, text: 'Alerts' },
    { to: '/threat-map', icon: faGlobe, text: 'Threat Map' }, // You can create a page for this too
    { to: '/reports', icon: faFileAlt, text: 'Reports' },
    { to: '/log-management', icon: faDatabase, text: 'Log Management' },
    { to: '/rbac', icon: faUsersCog, text: 'RBAC Settings' },
    { to: '/settings', icon: faCog, text: 'System Settings' },
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
                        // The `isActive` property is provided by NavLink
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-6 py-3 text-light font-medium transition-colors duration-200 hover:bg-primary/10 ${isActive ? 'bg-primary/10 border-r-4 border-primary text-primary' : ''}`
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