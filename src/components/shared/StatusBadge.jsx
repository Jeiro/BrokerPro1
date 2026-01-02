import React from 'react';
import { TRANSACTION_STATUS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case TRANSACTION_STATUS.PENDING:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case TRANSACTION_STATUS.APPROVED:
      case TRANSACTION_STATUS.COMPLETED:
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case TRANSACTION_STATUS.REJECTED:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
      {status?.toUpperCase() || 'UNKNOWN'}
    </span>
  );
};

export default StatusBadge;