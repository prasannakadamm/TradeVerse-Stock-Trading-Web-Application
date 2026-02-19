import React from 'react';

const Badge = ({ children, type = 'info', className = '' }) => {
    const styles = {
        success: 'bg-green-500/10 text-green-400 border-green-500/20',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };

    const styleClass = styles[type] || styles.neutral;

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styleClass} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
