import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faChartLine, faBell, faGlobe, faFileAlt, faDatabase, faUsersCog, faCog } from '@fortawesome/free-solid-svg-icons';

const NavLink = ({ icon, text, active = false }) => (
    <a href="#" className={`flex items-center gap-3 px-6 py-3 text-light font-medium transition-colors duration-200 hover:bg-primary/10 ${active ? 'bg-primary/10 border-r-4 border-primary text-primary' : ''}`}>
        <FontAwesomeIcon icon={icon} className="w-6 text-center" />
        <span>{text}</span>
    </a>
);

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
                <NavLink icon={faChartLine} text="Dashboard" active />
                <NavLink icon={faBell} text="Alerts" />
                <NavLink icon={faGlobe} text="Threat Map" />
                <NavLink icon={faFileAlt} text="Reports" />
                <NavLink icon={faDatabase} text="Log Management" />
                <NavLink icon={faUsersCog} text="RBAC Settings" />
                <NavLink icon={faCog} text="System Settings" />
            </nav>
        </aside>
    );
};

export default Sidebar;