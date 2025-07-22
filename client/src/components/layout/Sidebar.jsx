// client/src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faChartLine, faBell, faFileAlt, faDatabase, faUsersCog, faCog } from '@fortawesome/free-solid-svg-icons';

// Using absolute paths is now more stable with the new routing structure.
const navItems = [
    { to: '/dashboard', icon: faChartLine, text: 'Dashboard' },
    { to: '/dashboard/alerts', icon: faBell, text: 'Alerts' },
    { to: '/dashboard/reports', icon: faFileAlt, text: 'Reports' },
    { to: '/dashboard/log-management', icon: faDatabase, text: 'Log Management' },
    { to: '/dashboard/rbac', icon: faUsersCog, text: 'RBAC Settings' },
    { to: '/dashboard/settings', icon: faCog, text: 'System Settings' },
];

const Sidebar = () => {
    return (
        <aside className="bg-sidebar-bg border-r border-border flex flex-col">
            <div className="p-6 border-b border-border">
                {/* ... header ... */}
            </div>
            <nav className="flex flex-col gap-2 py-6">
                {navItems.map((item) => (
                    <NavLink
                        key={item.text}
                        to={item.to}
                        // The 'end' prop is crucial for the main /dashboard link
                        end={item.to === '/dashboard'}
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