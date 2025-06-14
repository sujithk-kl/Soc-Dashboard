// client/src/components/layout/Header.jsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import useClickOutside from '../../hooks/useClickOutside'; // <-- IMPORT HOOK
import ProfileDropdown from './ProfileDropdown'; // <-- IMPORT DROPDOWN

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    
    // --- NEW: State to manage dropdown visibility ---
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // --- NEW: Logic to close dropdown on outside click ---
    const dropdownRef = useClickOutside(() => {
        setIsDropdownOpen(false);
    });

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

                {/* --- Profile section is now a button that toggles the dropdown --- */}
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

                    {/* --- Conditionally render the dropdown --- */}
                    {isDropdownOpen && <ProfileDropdown onClose={() => setIsDropdownOpen(false)} />}
                </div>
            </div>
        </header>
    );
};

export default Header;