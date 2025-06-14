// client/src/components/layout/Header.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useClickOutside from '../../hooks/useClickOutside';
import ProfileDropdown from './ProfileDropdown';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useClickOutside(() => {
        setIsDropdownOpen(false);
    });

    // --- THE FIX IS HERE ---
    // If the user object is null (e.g., during logout), render nothing.
    // This prevents the component from trying to access properties of null.
    if (!user) {
        return null;
    }

    // This code below will now only run if 'user' is a valid object.
    return (
        <header className="bg-header-bg border-b border-border p-4 px-6 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-semibold text-light">Security Operations Dashboard</h1>
                <p className="text-sm text-gray-text">Real-time monitoring of network security events</p>
            </div>
            <div className="flex items-center gap-4">
                <button onClick={toggleTheme} className="text-light text-xl">
                    <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsDropdownOpen(prev => !prev)} 
                        className="flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">{user.initials}</div>
                        <div>
                            <div className="font-semibold text-light">{user.name}</div>
                            <div className="text-xs text-gray-text text-left">{user.role}</div>
                        </div>
                        <FontAwesomeIcon icon={faChevronDown} className={`text-gray-text transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && <ProfileDropdown onClose={() => setIsDropdownOpen(false)} />}
                </div>
            </div>
        </header>
    );
};

export default Header;