
import React from 'react';
import { TimeEntry, BillingModel } from '../../types';
import { Download } from 'lucide-react';

interface CaseBillingProps {
    billingModel: BillingModel;
    value: number;
    entries: TimeEntry[];
}

export const CaseBilling: React.FC<CaseBillingProps> = ({ billingModel, value, entries }) => {
    // Calculate totals dynamically based on props
    const unbilledTotal = entries
        .filter(e => e.status === 'Unbilled')
        .reduce((sum, e) => sum + e.total, 0);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 text-white p-4 rounded-lg">
                    <p className="text-xs opacity-70 uppercase font-bold">Model</p>
                    <p className="text-xl font-bold">{billingModel || 'Hourly'}</p>
                </div>
                <div className="bg-white border p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold">Budget / Value</p>
                    <p className="text-xl font-bold text-slate-900">${value.toLocaleString()}</p>
                </div>
                <div className="bg-white border p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold">Unbilled WIP</p>
                    <p className="text-xl font-bold text-blue-600">${unbilledTotal.toLocaleString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Time Entries</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center"><Download className="h-4 w-4 mr-1"/> Export</button>
                </div>
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Desc</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Hrs</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {entries.length > 0 ? entries.map(e => (
                            <tr key={e.id}>
                                <td className="px-6 py-4 text-sm text-slate-900">{e.date}</td>
                                <td className="px-6 py-4 text-sm text-slate-500">{e.description}</td>
                                <td className="px-6 py-4 text-sm text-slate-900 text-right">{(e.duration/60).toFixed(1)}</td>
                                <td className="px-6 py-4 text-sm text-slate-900 text-right">${e.total.toFixed(2)}</td>
                                <td className="px-6 py-4 text-right"><span className={`text-xs px-2 py-1 rounded ${e.status==='Billed'?'bg-green-100 text-green-700':'bg-yellow-100 text-yellow-700'}`}>{e.status}</span></td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-slate-500 italic">No time entries recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
