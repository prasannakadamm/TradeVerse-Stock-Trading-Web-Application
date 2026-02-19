import React from 'react';
import Card from './Card';

const StatWidget = ({ title, value, change, isPositive, icon }) => {
    return (
        <Card className="hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                    <h4 className="text-2xl font-bold text-white font-mono tracking-tight">{value}</h4>
                </div>
                {icon && (
                    <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                        {icon}
                    </div>
                )}
            </div>

            {change && (
                <div className="mt-3 flex items-center text-sm font-mono">
                    <span className={`${isPositive ? 'text-emerald-400' : 'text-red-400'} flex items-center font-medium`}>
                        {isPositive ? '↑' : '↓'} {change}
                    </span>
                    <span className="text-slate-500 ml-2 text-xs">vs last week</span>
                </div>
            )}
        </Card>
    );
};

export default StatWidget;
