import React, { useState, useEffect } from 'react';

const SessionTimer = () => {
    const [timeLeft, setTimeLeft] = useState('');
    const [isLow, setIsLow] = useState(false);

    useEffect(() => {
        const updateTimer = () => {
            let loginTime = localStorage.getItem('loginTime');
            
            // Fallback: If no login time exists (old session), set it to now
            if (!loginTime) {
                loginTime = Date.now().toString();
                localStorage.setItem('loginTime', loginTime);
            }

            const currentTime = Date.now();
            const elapsedTime = currentTime - parseInt(loginTime);
            const thirtyMinutes = 30 * 60 * 1000;
            const remaining = thirtyMinutes - elapsedTime;

            if (remaining <= 0) {
                setTimeLeft('00:00');
                localStorage.clear();
                window.location.href = "/";
                return;
            }

            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            setIsLow(minutes < 5);
            setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        };

        const interval = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(interval);
    }, []);

    const timerStyle = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: isLow ? '#fee2e2' : 'white',
        color: isLow ? '#ef4444' : '#64748b',
        padding: '8px 16px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: `2px solid ${isLow ? '#ef4444' : '#e2e8f0'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: '700',
        fontSize: '0.9rem',
        fontFamily: 'Poppins, sans-serif',
        transition: 'all 0.3s ease'
    };

    return (
        <div style={timerStyle} title="Time until automatic logout">
            <i className={`fas ${isLow ? 'fa-hourglass-half fa-spin' : 'fa-clock'}`} style={{ color: isLow ? '#ef4444' : '#b8235a' }}></i>
            <span>{timeLeft}</span>
        </div>
    );
};

export default SessionTimer;
