import React, { useState, useEffect } from 'react';
import '../styles/PuppyAnimation.css';

const PuppyAnimation = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [progress, setProgress] = useState(15);

    const bootSteps = [
        "Sending spin-up signal to cloud host...",
        "Server waking up from standby mode...",
        "Initializing database connections...",
        "Finalizing secure handshake & launch..."
    ];

    useEffect(() => {
        // Step cycle timer
        const stepInterval = setInterval(() => {
            setStepIndex((prev) => (prev < bootSteps.length - 1 ? prev + 1 : prev));
        }, 4000);

        // Smooth progress animation increment
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 92) return 92; // Hold at 92% until request completes
                return prev + Math.floor(Math.random() * 8) + 3;
            });
        }, 1200);

        return () => {
            clearInterval(stepInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="server-loading-overlay">
            <div className="server-loading-card">
                {/* Background Ambient Glow FX */}
                <div className="ambient-glow glow-cyan"></div>
                <div className="ambient-glow glow-purple"></div>

                {/* Animated Server Node Graphic */}
                <div className="server-graphic-container">
                    <div className="orbital-ring ring-1"></div>
                    <div className="orbital-ring ring-2"></div>
                    <div className="radar-pulse"></div>

                    {/* Futuristic Server Rack SVG */}
                    <div className="server-rack-box">
                        <svg className="server-svg" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Cloud Icon floating top */}
                            <g className="cloud-group">
                                <path d="M40 38C40 31.3726 45.3726 26 52 26C57.4477 26 62.0035 29.637 63.4697 34.6293C64.9125 33.5855 66.8837 33 69 33C74.5228 33 79 37.4772 79 43C79 43.6841 78.9312 44.3517 78.8003 44.996C81.8213 46.4024 84 49.4601 84 53C84 57.9706 79.9706 62 75 62H41C35.4772 62 31 57.5228 31 52C31 47.1652 34.4328 43.1317 39.0537 42.2223C39.6644 40.8358 40 39.4607 40 38Z" 
                                      fill="url(#cloudGrad)" opacity="0.9" />
                            </g>

                            {/* Server Blade 1 */}
                            <rect x="25" y="55" width="70" height="18" rx="4" fill="#1e293b" stroke="#00c6ff" strokeWidth="1.5" className="blade blade-1" />
                            <circle cx="33" cy="64" r="2.5" className="led led-green" />
                            <circle cx="41" cy="64" r="2.5" className="led led-blue" />
                            <line x1="52" y1="64" x2="85" y2="64" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="52" y1="64" x2="72" y2="64" stroke="#00c6ff" strokeWidth="2.5" strokeLinecap="round" className="data-stream" />

                            {/* Server Blade 2 */}
                            <rect x="25" y="77" width="70" height="18" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" className="blade blade-2" />
                            <circle cx="33" cy="86" r="2.5" className="led led-amber" />
                            <circle cx="41" cy="86" r="2.5" className="led led-green" />
                            <line x1="52" y1="86" x2="85" y2="86" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                            <line x1="52" y1="86" x2="65" y2="86" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" className="data-stream delay-1" />

                            {/* Server Base */}
                            <path d="M20 100 H100" stroke="#00c6ff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

                            <defs>
                                <linearGradient id="cloudGrad" x1="31" y1="26" x2="84" y2="62" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#00c6ff" />
                                    <stop offset="1" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                {/* Notice Header Text */}
                <h3 className="server-notice-heading">
                    Free Deployments takes time to wake up the server
                </h3>

                {/* Dynamic Step Status */}
                <div className="boot-status-pill">
                    <span className="pulse-dot"></span>
                    <span className="boot-text">{bootSteps[stepIndex]}</span>
                </div>

                {/* Custom Progress Bar */}
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }}>
                        <div className="progress-glow"></div>
                    </div>
                </div>

                {/* Subtext info */}
                <p className="server-notice-subtext">
                    ⏱️ Free tier instances automatically spin down when idle. Cold starts usually take ~30–50 seconds. Thank you for your patience!
                </p>
            </div>
        </div>
    );
};

export default PuppyAnimation;