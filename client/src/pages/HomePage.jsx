// client/src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faEye, faChartPie, faCodeBranch } from '@fortawesome/free-solid-svg-icons';

// Reusable Feature Card component for this page
const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className="bg-white/5 backdrop-blur-md p-6 rounded-lg border border-white/10"
    >
        <FontAwesomeIcon icon={icon} className="text-3xl text-primary mb-4" />
        <h3 className="font-bold text-xl text-light mb-2">{title}</h3>
        <p className="text-gray-text">{description}</p>
    </motion.div>
);

const HomePage = () => {
    const features = [
        { icon: faEye, title: 'Real-Time Monitoring', description: 'Instantly view security logs, alerts, and global threats as they happen with our WebSocket-powered feed.', delay: 0.1 },
        { icon: faChartPie, title: 'Visualized Data', description: 'Understand complex data at a glance with interactive charts, a live threat map, and a clear event timeline.', delay: 0.2 },
        { icon: faCodeBranch, title: 'Actionable Insights', description: 'Empower your analysts with role-based access and response actions like "Isolate Host" directly from the dashboard.', delay: 0.3 },
    ];

    return (
        <div className="bg-homepage text-light overflow-x-hidden">
            {/* Header */}
            <header className="p-4 md:px-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-3xl text-primary" />
                    <span className="font-bold text-2xl">CyberShield</span>
                </div>
                <Link to="/login" className="bg-primary text-white font-bold py-2 px-5 rounded-md hover:bg-primary-dark transition-colors">
                    Go to Dashboard
                </Link>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-20 md:py-32 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-light mb-4">
                        Unified Security at the Speed of Light
                    </h1>
                    <p className="text-lg md:text-xl text-gray-text max-w-3xl mx-auto mb-8">
                        CyberShield is a full-stack Security Operations Center (SOC) dashboard designed for modern security teams to detect, analyze, and respond to threats in real-time.
                    </p>
                    <Link to="/login" className="bg-primary text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-primary-dark transition-colors shadow-lg">
                        Login & Secure Your Network
                    </Link>
                </motion.div>
            </main>
            
            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center p-8 border-t border-white/10">
                <p className="text-gray-text">© {new Date().getFullYear()} CyberShield. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;