import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserRoleByEmail } from '../services/api';

const RootLoginPage = () => {
    const { login, isAuthenticated, ROLES, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (isAuthenticated) {
        if (user?.role !== ROLES.ADMIN) return <Navigate to="/login/iam" />;
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Pre-check role by email. Only Admins should proceed here.
            const info = await getUserRoleByEmail(email);
            if (info?.role && info.role !== ROLES.ADMIN) {
                toast.error('Only Admins can use Root login. Use IAM login.');
                setIsLoading(false);
                return navigate('/login/iam');
            }
        } catch (_) {
            // If lookup fails, continue and rely on post-check
        }

        const logged = await login(email, password);
        setIsLoading(false);
        if (!logged) return;
        if (logged.role !== ROLES.ADMIN) {
            toast.error('Only Admins can use Root login.');
            return navigate('/login/iam', { replace: true });
        }
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-dark flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
                <h1 className="text-2xl font-bold text-light mb-4">Sign in as Root User</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-text">Email address</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 bg-dark text-light border border-border rounded" required />
                    </div>
                    <div>
                        <label className="text-sm text-gray-text">Password</label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 bg-dark text-light border border-border rounded" required />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 rounded disabled:opacity-60">
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>
                <div className="mt-4">
                    <Link to="/" className="inline-block px-4 py-2 text-sm font-semibold text-light border border-white/20 rounded hover:border-white/40">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RootLoginPage;


