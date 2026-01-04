import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell, Shield, Mail, Phone, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { currentUser, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    // Initialize from user profile or defaults
    const [notifications, setNotifications] = useState(currentUser?.settings?.notifications || {
        email: true,
        push: true,
        marketing: false
    });

    const handleSave = async () => {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = updateProfile({
            settings: {
                ...currentUser?.settings,
                notifications
            }
        });

        setLoading(false);

        if (result.success) {
            toast.success('Settings saved successfully');
        } else {
            toast.error(result.message || 'Failed to save settings');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1">Manage your account preferences</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSave}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 text-white rounded-lg transition-all flex items-center gap-2 font-medium shadow-lg shadow-primary-500/20"
                >
                    <Save className="w-4 h-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
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
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" />
                            Security
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                                <div>
                                    <h3 className="font-medium text-white">Password</h3>
                                    <p className="text-sm text-slate-400">Last changed 30 days ago</p>
                                </div>
                                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">Change</button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                                <div>
                                    <h3 className="font-medium text-white">Two-Factor Authentication</h3>
                                    <p className="text-sm text-slate-400">Add an extra layer of security</p>
                                </div>
                                <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs rounded-lg transition-colors">
                                    Enable
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Notifications Section */}
                <div className="space-y-6">
                    <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-accent-500" />
                            Notifications
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between group">
                                <span className="text-slate-200 group-hover:text-white transition-colors">Email Notifications</span>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <motion.div
                                        layout
                                        className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifications.email ? 'left-7' : 'left-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between group">
                                <span className="text-slate-200 group-hover:text-white transition-colors">Push Notifications</span>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <motion.div
                                        layout
                                        className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifications.push ? 'left-7' : 'left-1'}`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between group">
                                <span className="text-slate-200 group-hover:text-white transition-colors">Marketing Emails</span>
                                <button
                                    onClick={() => setNotifications(prev => ({ ...prev, marketing: !prev.marketing }))}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications.marketing ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <motion.div
                                        layout
                                        className={`w-4 h-4 rounded-full bg-white absolute top-1 ${notifications.marketing ? 'left-7' : 'left-1'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6 bg-gradient-to-br from-primary-900/20 to-accent-900/20 backdrop-blur-sm border border-primary-500/20">
                        <h3 className="font-bold text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Have questions about your account security or settings? Contact our support team.
                        </p>
                        <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm font-medium">
                            Contact Support
                        </button>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Settings;
