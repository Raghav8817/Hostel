import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark-mode');

    useEffect(() => {
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark-mode' ? 'light-mode' : 'dark-mode');
    };

    return (
        <div className="floating-theme-toggle">
            <div className="theme-switch-wrapper">
                <span className="theme-icon">{theme === 'light-mode' ? '☀️' : '🌙'}</span>
                <label className="theme-switch" htmlFor="global-theme-checkbox">
                    <input 
                        type="checkbox" 
                        id="global-theme-checkbox" 
                        checked={theme === 'dark-mode'} 
                        onChange={toggleTheme} 
                    />
                    <div className="slider round"></div>
                </label>
            </div>
        </div>
    );
};

export default ThemeToggle;
