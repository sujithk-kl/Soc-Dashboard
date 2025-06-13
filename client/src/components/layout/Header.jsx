import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

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
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-white">JD</div>
                    <div>
                        <div className="font-semibold text-light">John Doe</div>
                        <div className="text-xs text-gray-text">Security Admin</div>
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-text" />
                </div>
            </div>
        </header>
    );
};

export default Header;