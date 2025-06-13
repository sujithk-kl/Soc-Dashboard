import React from 'react';

const Card = ({ title, children, className = '' }) => {
    return (
        <div className={`bg-card-bg border border-border rounded-lg shadow-sm p-4 ${className}`}>
            {title && (
                <div className="pb-3 mb-3 border-b border-border">
                    <h3 className="text-lg font-semibold text-light">{title}</h3>
                </div>
            )}
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );
};

export default Card;