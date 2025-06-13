import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faBell, faExclamationTriangle, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import Card from '../ui/Card';

const iconMap = {
    bell: faBell,
    'exclamation-triangle': faExclamationTriangle,
    'check-circle': faCheckCircle,
    clock: faClock,
};

const StatCard = ({ title, value, trend, trendUp, icon }) => {
    return (
        <Card>
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-text">{title}</p>
                    <p className="text-3xl font-bold text-light">{value}</p>
                </div>
                <div className="p-3 rounded-md bg-primary/10 text-primary">
                    <FontAwesomeIcon icon={iconMap[icon]} size="lg" />
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