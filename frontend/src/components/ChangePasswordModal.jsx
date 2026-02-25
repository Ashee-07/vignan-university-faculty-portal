import React, { useState } from 'react';
import facultyService from '../services/facultyService';

export default function ChangePasswordModal({ isOpen, onClose, facultyId }) {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (passwords.new !== passwords.confirm) {
            return setMessage({ text: "Passwords don't match", type: 'error' });
        }

        if (passwords.new.length < 6) {
            return setMessage({ text: "Password must be at least 6 characters", type: 'error' });
        }

        setLoading(true);
        try {
            await facultyService.changePassword(facultyId, passwords.current, passwords.new);
            setMessage({ text: "Password updated successfully!", type: 'success' });
            setTimeout(() => {
                onClose();
                setPasswords({ current: '', new: '', confirm: '' });
                setMessage({ text: '', type: '' });
            }, 2000);
        } catch (err) {
            setMessage({
                text: err.response?.data?.message || "Failed to update password",
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="modal-content glass-card" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '2rem',
                position: 'relative',
                animation: 'slideUp 0.3s ease-out'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                }}><i className="fas fa-times"></i></button>

                <h3 style={{ color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-key" style={{ color: '#4cc9f0' }}></i> Change Password
                </h3>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Current Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.current}
                            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>New Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                    </div>

                    {message.text && (
                        <div style={{
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            color: message.type === 'success' ? '#22c55e' : '#ef4444',
                            border: `1px solid ${message.type === 'success' ? '#22c55e33' : '#ef444433'}`
                        }}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: '#4cc9f0',
                            color: '#030712',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
