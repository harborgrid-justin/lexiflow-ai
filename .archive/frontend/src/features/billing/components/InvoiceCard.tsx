// Invoice Card - Summary card for invoice in list view
import React from 'react';
import { FileText, Mail, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Invoice, INVOICE_STATUS_LABELS, INVOICE_STATUS_COLORS } from '../api/billing.types';
import { formatCurrency, formatDate, getDaysOverdue } from '../utils/formatters';

interface InvoiceCardProps {
  invoice: Invoice;
  onClick?: () => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => {
  const getStatusBadgeClass = (status: Invoice['status']) => {
    const color = INVOICE_STATUS_COLORS[status];
    switch (color) {
      case 'gray':
        return 'bg-slate-100 text-slate-700';
      case 'blue':
        return 'bg-blue-100 text-blue-700';
      case 'cyan':
        return 'bg-cyan-100 text-cyan-700';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-700';
      case 'green':
        return 'bg-green-100 text-green-700';
      case 'red':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const daysOverdue =
    invoice.status === 'overdue' ? getDaysOverdue(invoice.dueDate) : 0;

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {invoice.invoiceNumber}
            </h3>
            <p className="text-sm text-slate-600">{invoice.clientName}</p>
            {invoice.caseName && (
              <p className="text-xs text-slate-500">{invoice.caseName}</p>
            )}
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
            invoice.status
          )}`}
        >
          {INVOICE_STATUS_LABELS[invoice.status]}
        </span>
      </div>

      {/* Amount */}
      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-slate-100">
        <div>
          <p className="text-xs text-slate-500 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(invoice.total)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 mb-1">Balance Due</p>
          <p
            className={`text-2xl font-bold ${
              invoice.balance > 0 ? 'text-orange-600' : 'text-green-600'
            }`}
          >
            {formatCurrency(invoice.balance)}
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Issued: {formatDate(invoice.issueDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="w-4 h-4" />
          <span>Due: {formatDate(invoice.dueDate)}</span>
        </div>
      </div>

      {/* Overdue Warning */}
      {invoice.status === 'overdue' && (
        <div className="mt-4 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-700 font-medium">
            {daysOverdue} days overdue
          </span>
        </div>
      )}

      {/* Sent Info */}
      {invoice.sentDate && (
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Mail className="w-3 h-3" />
          <span>Sent {formatDate(invoice.sentDate)}</span>
        </div>
      )}
    </div>
  );
};
