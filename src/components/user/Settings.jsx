import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Shield, Mail, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(false);

    // Mock state for toggle settings
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false
    });

    const handleSave = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        toast.success('Settings saved successfully');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1">Manage your account preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-2 font-medium"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-400" />
                            Profile Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Full Name</label>
                                <div className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200">
                                    {currentUser?.fullName}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Email Address</label>
                                <div className="flex items-center w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200">
                                    <Mail className="w-4 h-4 mr-2 text-slate-500" />
                                    {currentUser?.email}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Phone Number</label>
                                <div className="flex items-center w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200">
                                    <Phone className="w-4 h-4 mr-2 text-slate-500" />
                                    {currentUser?.phoneNumber || 'Not set'}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Account ID</label>
                                <div className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-500 cursor-not-allowed">
                                    {currentUser?.id?.slice(0, 8).toUpperCase() || '...'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            Security
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                <div>
                                    <h3 className="font-medium text-white">Password</h3>
                                    <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                                </div>
                                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">Change</button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30">
                                <div>
                                    <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                                    <p className="text-sm text-slate-400">Add an extra layer of security</p>
                                </div>
                                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors">
                                    Enable
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="space-y-6">
                    <div className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-accent-500" />
                            Notifications
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-200">Email Notifications</span>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications.email ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-200">Push Notifications</span>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications.push ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-200">Marketing Emails</span>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.marketing ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${notifications.marketing ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel rounded-xl p-6 bg-gradient-to-br from-primary-900/20 to-accent-900/20">
                        <h3 className="font-bold text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Have questions about your account security or settings? Contact our support team.
                        </p>
                        <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
