// client/src/components/layout/ProfileDropdown.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ onClose }) => {
    const { user, logout, ROLES } = useAuth();
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        const roleAtLogout = user?.role;
        logout();
        onClose();
        if (roleAtLogout === ROLES.ADMIN) {
            navigate('/login/root');
        } else {
            navigate('/login/iam');
        }
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
                <button 
                    onClick={handleLogout} 
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-light hover:bg-dark-gray/20"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default ProfileDropdown;