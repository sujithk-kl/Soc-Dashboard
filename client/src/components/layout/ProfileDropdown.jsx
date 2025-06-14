// client/src/components/layout/ProfileDropdown.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const ProfileDropdown = ({ onClose }) => {
    const { user, testUsers, switchUser } = useAuth();

    const handleSwitchRole = (role) => {
        const userToSwitch = testUsers.find(u => u.role === role);
        if (userToSwitch) {
            switchUser(userToSwitch);
        }
        onClose(); // Close dropdown after switching
    };

    return (
        <div className="absolute top-14 right-0 w-64 bg-card-bg border border-border rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="p-4 border-b border-border">
                <p className="font-semibold text-light">{user.name}</p>
                <p className="text-sm text-gray-text">{user.role}</p>
            </div>
            <div className="py-2">
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-light hover:bg-dark-gray/20">
                    <FontAwesomeIcon icon={faUser} className="w-4" />
                    Profile
                </a>
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-light hover:bg-dark-gray/20">
                    <FontAwesomeIcon icon={faCog} className="w-4" />
                    Settings
                </a>
            </div>
            <div className="py-2 border-t border-border">
                <p className="px-4 py-1 text-xs font-bold text-gray-text uppercase">Switch Role (Dev)</p>
                {testUsers.map(testUser => (
                    <button 
                        key={testUser.role}
                        onClick={() => handleSwitchRole(testUser.role)}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-light hover:bg-dark-gray/20 disabled:opacity-50"
                        disabled={user.role === testUser.role}
                    >
                        <FontAwesomeIcon icon={faShieldAlt} className={`w-4 ${user.role === testUser.role ? 'text-primary' : ''}`} />
                        {testUser.role}
                    </button>
                ))}
            </div>
            <div className="py-2 border-t border-border">
                <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-light hover:bg-dark-gray/20">
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                    Logout
                </a>
            </div>
        </div>
    );
};

export default ProfileDropdown;