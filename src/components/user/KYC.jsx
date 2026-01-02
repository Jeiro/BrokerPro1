import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Clock, FileText, Shield } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { AuthContext } from '../../context/AuthContext';
import { KYC_STATUS } from '../../utils/constants';

const KYC = () => {
    const { currentUser } = useContext(AuthContext);
    const { kycRequests, submitKYC } = useContext(DataContext);

    // Check if user has a pending or completed request
    const currentRequest = kycRequests.find(r => r.userId === currentUser.id && r.status !== KYC_STATUS.REJECTED);
    const lastRejectedRequest = kycRequests
        .filter(r => r.userId === currentUser.id && r.status === KYC_STATUS.REJECTED)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    // Form State
    const [idType, setIdType] = useState('passport');
    const [docNumber, setDocNumber] = useState('');
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [previewFront, setPreviewFront] = useState(null);
    const [previewBack, setPreviewBack] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleImageChange = (e, side) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB restriction for localStorage
                setMessage({ type: 'error', text: 'File size too large. Max 2MB.' });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                if (side === 'front') {
                    setFrontImage(reader.result);
                    setPreviewFront(reader.result);
                } else {
                    setBackImage(reader.result);
                    setPreviewBack(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!frontImage) {
            setMessage({ type: 'error', text: 'Front image is required.' });
            return;
        }

        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            const result = submitKYC({
                type: idType,
                documentNumber: docNumber,
                frontImage,
                backImage
            });

            if (result.success) {
                setMessage({ type: 'success', text: result.message });
            } else {
                setMessage({ type: 'error', text: result.message });
            }
            setIsLoading(false);
        }, 1500);
    };

    if (currentRequest && currentRequest.status !== KYC_STATUS.REJECTED) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto space-y-6"
            >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                    {currentRequest.status === KYC_STATUS.PENDING ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Verification Pending</h2>
                            <p className="text-gray-500 max-w-md">
                                Your documents have been submitted and are currently under review by our compliance team. This usually takes 24-48 hours.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 w-full max-w-sm text-left text-sm mt-6">
                                <div className="flex justify-between py-2 border-b border-gray-200">
                                    <span className="text-gray-500">Document Type</span>
                                    <span className="font-medium capitalize">{currentRequest.type.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-500">Submitted On</span>
                                    <span className="font-medium">{new Date(currentRequest.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Identity Verified</h2>
                            <p className="text-gray-500 max-w-md">
                                Congratulations! Your account has been fully verified. You now have access to all platform features.
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Identity Verification (KYC)</h1>
                <p className="text-gray-500">Verify your identity to unlock full trading limits and withdrawals.</p>
            </header>

            {lastRejectedRequest && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-red-900">Previous Attempt Rejected</h3>
                        <p className="text-sm text-red-700 mt-1">{lastRejectedRequest.adminNote || 'Document details did not match our records.'}</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    {/* ID Type Selection */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Document Type</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['passport', 'id_card', 'driver_license'].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setIdType(type)}
                                        className={`cursor-pointer border rounded-lg p-4 hover:bg-gray-50 transition-colors ${idType === type ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <FileText className={`w-6 h-6 ${idType === type ? 'text-blue-600' : 'text-gray-400'}`} />
                                            <span className="font-medium capitalize text-sm">{type.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Document Number</label>
                            <input
                                type="text"
                                required
                                value={docNumber}
                                onChange={(e) => setDocNumber(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                                placeholder="Enter your ID/Passport number"
                            />
                        </div>

                        {/* File Uploads */}
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Front Side</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'front')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    {previewFront ? (
                                        <div className="relative">
                                            <img src={previewFront} alt="Front preview" className="max-h-32 mx-auto rounded shadow-sm" />
                                            <div className="mt-2 text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Selected
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Click or Drag to Upload</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Back Side (Optional)</label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'back')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="text-center">
                                    {previewBack ? (
                                        <div className="relative">
                                            <img src={previewBack} alt="Back preview" className="max-h-32 mx-auto rounded shadow-sm" />
                                            <div className="mt-2 text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Selected
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">Click or Drag to Upload</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                            <p className="font-medium text-sm">{message.text}</p>
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Submitting Documents...
                                </div>
                            ) : (
                                'Submit for Verification'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-gray-400 shrink-0" />
                    <p>Your data is encrypted and stored securely. We never share your personal information.</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                    <p>Verification typically takes 24-48 hours. You'll be notified via email.</p>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-gray-400 shrink-0" />
                    <p>Make sure your documents are valid and the text is clearly readable.</p>
                </div>
            </div>
        </div>
    );
};

export default KYC;
