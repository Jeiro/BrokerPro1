import React, { useContext, useState } from 'react';
import { ArrowDownRight, Check, X, Eye } from 'lucide-react';
import Navbar from '../shared/Navbar';
import { DataContext } from '../../context/DataContext';
import { TRANSACTION_STATUS } from '../../utils/constants';
import StatusBadge from '../shared/StatusBadge';

const PendingDeposits = () => {
  const { deposits, approveDeposit, rejectDeposit } = useContext(DataContext);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const pendingDeposits = deposits.filter(d => d.status === TRANSACTION_STATUS.PENDING);

  const handleApprove = async (depositId) => {
    setProcessing(true);
    setTimeout(() => {
      const result = approveDeposit(depositId, adminNote);
      if (result.success) {
        alert('Deposit approved successfully!');
        setSelectedDeposit(null);
        setAdminNote('');
      } else {
        alert('Failed to approve deposit');
      }
      setProcessing(false);
    }, 500);
  };

  const handleReject = async (depositId) => {
    if (!adminNote.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    
    setProcessing(true);
    setTimeout(() => {
      const result = rejectDeposit(depositId, adminNote);
      if (result.success) {
        alert('Deposit rejected');
        setSelectedDeposit(null);
        setAdminNote('');
      } else {
        alert('Failed to reject deposit');
      }
      setProcessing(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <ArrowDownRight className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Pending Deposits</h1>
          </div>
          <p className="text-gray-600">Review and approve user deposit requests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Deposits List */}
          <div className="lg:col-span-2 space-y-4">
            {pendingDeposits.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <ArrowDownRight className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending deposits</p>
              </div>
            ) : (
              pendingDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all ${
                    selectedDeposit?.id === deposit.id ? 'ring-2 ring-primary-600' : 'hover:shadow-lg'
                  }`}
                  onClick={() => setSelectedDeposit(deposit)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{deposit.userName}</h3>
                        <StatusBadge status={deposit.status} />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{deposit.userEmail}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="font-semibold text-gray-900">
                          {deposit.amount} {deposit.currency}
                        </span>
                        <span className="text-gray-500">
                          {new Date(deposit.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 h-fit">
            {selectedDeposit ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Deposit Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-600">User</label>
                    <p className="font-semibold text-gray-900">{selectedDeposit.userName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-semibold text-gray-900">{selectedDeposit.userEmail}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Currency</label>
                    <p className="font-semibold text-gray-900">{selectedDeposit.currency}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Amount</label>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedDeposit.amount} {selectedDeposit.currency}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Transaction Hash</label>
                    <p className="text-xs font-mono text-gray-900 break-all">
                      {selectedDeposit.txHash}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-gray-600">Submitted</label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedDeposit.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {selectedDeposit.proofImage && (
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Proof of Payment</label>
                      <img 
                        src={selectedDeposit.proofImage} 
                        alt="Proof of payment" 
                        className="w-full rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Note (Optional)
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a note..."
                  />
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleApprove(selectedDeposit.id)}
                    disabled={processing}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>{processing ? 'Processing...' : 'Approve Deposit'}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReject(selectedDeposit.id)}
                    disabled={processing}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>{processing ? 'Processing...' : 'Reject Deposit'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a deposit to review</p>
              </div>
            )}
          </div>
        </div>

        {/* All Deposits History */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">All Deposits</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {deposits.map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-medium text-gray-900">{deposit.userName}</p>
                        <p className="text-sm text-gray-500">{deposit.userEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900">
                        {deposit.amount} {deposit.currency}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={deposit.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {deposit.adminNote || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingDeposits;