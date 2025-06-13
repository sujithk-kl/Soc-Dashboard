// client/src/components/dashboard/StatCard.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';

const StatCard = ({ title, value, trend, trendUp, icon }) => {
    return (
        <Card>
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-text">{title}</p>
                    <p className="text-3xl font-bold text-light">{value}</p>
                </div>
                <div className="p-3 rounded-md bg-primary/10 text-primary">
                    {/* Use the icon string directly with Font Awesome's library */}
                    <FontAwesomeIcon icon={['fas', icon]} size="lg" />
                </div>
            </div>
            <div className={`flex items-center gap-1 text-sm ${trendUp ? 'text-success' : 'text-danger'}`}>
                <FontAwesomeIcon icon={trendUp ? faArrowUp : faArrowDown} />
                <span>{trend}</span>
            </div>
        </Card>
    );
};

export default StatCard;