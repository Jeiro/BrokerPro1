import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full animate-pulse" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertCircle className="w-12 h-12 text-primary-500" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white">Page Not Found</h1>
                    <p className="text-slate-400">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-all font-medium"
                >
                    <Home className="w-4 h-4" />
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
