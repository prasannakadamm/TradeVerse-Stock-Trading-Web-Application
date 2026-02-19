import React from 'react';

const Card = ({ children, className = '', title, action }) => {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h3 className="text-lg font-semibold text-white/90">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="text-slate-300">
        {children}
      </div>
    </div>
  );
};

export default Card;
