import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Search, FileText, Eye, Clock, Shield } from 'lucide-react';
import { DataContext } from '../../context/DataContext';
import { KYC_STATUS } from '../../utils/constants';

const AdminKYC = () => {
    const { kycRequests, updateKYCStatus } = useContext(DataContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('pending'); // all, pending, approved, rejected
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [actionNote, setActionNote] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const filteredRequests = kycRequests.filter(req => {
        const matchesSearch =
            req.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        return matchesSearch && req.status === filter;
    });

    const handleAction = async (status) => {
        if (!selectedRequest) return;

        setIsProcessing(true);
        const result = updateKYCStatus(selectedRequest.id, status, actionNote);

        if (result.success) {
            setTimeout(() => {
                setIsProcessing(false);
                setSelectedRequest(null);
                setActionNote('');
            }, 500);
        } else {
            setIsProcessing(false);
            // maybe show toast error
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
                    <p className="text-gray-500">Manage user identity verification requests</p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <div className="sm:col-span-2 flex bg-white rounded-lg border border-gray-200 p-1">
                    {['all', 'pending', 'approved', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium capitalize transition-all ${filter === f
                                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.length > 0 ? (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                                                    {request.userName?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{request.userName}</div>
                                                    <div className="text-xs text-gray-500">{request.userEmail}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900 capitalize">{request.type.replace('_', ' ')}</span>
                                                <span className="text-xs text-gray-500 font-mono">{request.documentNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setSelectedRequest(request)}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium inline-flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" /> Review
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No requests found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {selectedRequest && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Review KYC Request</h3>
                                    <p className="text-sm text-gray-500">Submitted by {selectedRequest.userName} on {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">User Details</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs text-gray-400">Full Name</label>
                                                    <p className="font-medium">{selectedRequest.userName}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400">Email Address</label>
                                                    <p className="font-medium">{selectedRequest.userEmail}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400">Document Type</label>
                                                    <p className="font-medium capitalize">{selectedRequest.type.replace('_', ' ')}</p>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-400">Document Number</label>
                                                    <p className="font-medium font-mono bg-gray-100 px-2 py-1 rounded inline-block">{selectedRequest.documentNumber}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Verification Decision</h4>
                                            <textarea
                                                value={actionNote}
                                                onChange={(e) => setActionNote(e.target.value)}
                                                placeholder="Add a note (optional for approval, required for rejection)..."
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 min-h-[100px] text-sm"
                                            />

                                            {selectedRequest.status === 'pending' && (
                                                <div className="grid grid-cols-2 gap-3 mt-4">
                                                    <button
                                                        onClick={() => handleAction('rejected')}
                                                        disabled={isProcessing}
                                                        className="py-2.5 px-4 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <X className="w-4 h-4" /> Reject
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('approved')}
                                                        disabled={isProcessing}
                                                        className="py-2.5 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                                                    >
                                                        <Check className="w-4 h-4" /> Approve
                                                    </button>
                                                </div>
                                            )}

                                            {selectedRequest.status !== 'pending' && (
                                                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${selectedRequest.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                                    {selectedRequest.status === 'approved' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                                    <span className="font-medium capitalize">Request {selectedRequest.status}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                            <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Document - Front</h4>
                                            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-900 flex items-center justify-center aspect-video">
                                                {selectedRequest.frontImage ? (
                                                    <img src={selectedRequest.frontImage} alt="Front ID" className="max-w-full max-h-full object-contain" />
                                                ) : (
                                                    <span className="text-gray-500 text-xs">No image uploaded</span>
                                                )}
                                            </div>
                                        </div>

                                        {selectedRequest.backImage && (
                                            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                                <h4 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Document - Back</h4>
                                                <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-900 flex items-center justify-center aspect-video">
                                                    <img src={selectedRequest.backImage} alt="Back ID" className="max-w-full max-h-full object-contain" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminKYC;
