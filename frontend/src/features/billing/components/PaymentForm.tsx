// Payment Form - Record payment for an invoice
import React, { useState } from 'react';
import { X, DollarSign, Calendar, CreditCard } from 'lucide-react';
import { useRecordPayment } from '../api/invoices.api';
import { PaymentMethod, PAYMENT_METHOD_LABELS } from '../api/billing.types';
import { formatCurrency } from '../utils/formatters';

interface PaymentFormProps {
  invoiceId: string;
  invoiceNumber: string;
  balanceDue: number;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  invoiceId,
  invoiceNumber,
  balanceDue,
  onClose,
  onSuccess,
}) => {
  const recordPaymentMutation = useRecordPayment();

  const [formData, setFormData] = useState({
    amount: balanceDue,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'check' as PaymentMethod,
    transactionId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (formData.amount <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (formData.amount > balanceDue) {
      newErrors.amount = `Amount cannot exceed balance due (${formatCurrency(balanceDue)})`;
    }
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await recordPaymentMutation.mutateAsync({
        invoiceId,
        ...formData,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to record payment:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Record Payment</h2>
            <p className="text-sm text-slate-500">{invoiceNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Balance Due Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">Balance Due</span>
              <span className="text-2xl font-bold text-blue-700">
                {formatCurrency(balanceDue)}
              </span>
            </div>
          </div>

          {/* Payment Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
                }
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount}</p>}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, amount: balanceDue })}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Full Amount
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, amount: balanceDue / 2 })}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Half Amount
              </button>
            </div>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.paymentDate && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentDate}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={formData.paymentMethod}
                onChange={(e) =>
                  setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })
                }
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(PAYMENT_METHOD_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Transaction ID / Check Number
            </label>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Optional"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="Optional notes about this payment"
            />
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={recordPaymentMutation.isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};
