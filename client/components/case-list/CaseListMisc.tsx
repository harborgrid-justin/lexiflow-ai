
import React from 'react';
import { ShieldAlert, Search, Mic2, Plus, FileCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '../common/Button';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';

export const CaseListConflicts: React.FC = () => (
  <div className="max-w-2xl mx-auto mt-8 space-y-6">
    <div className="text-center">
      <div className="bg-slate-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
        <ShieldAlert className="h-10 w-10 text-slate-400"/>
      </div>
      <h3 className="text-xl font-bold text-slate-900">Global Conflict Search</h3>
      <p className="text-slate-500">Search across all matters, parties, and intakes.</p>
    </div>
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500"/>
      <input className="w-full pl-12 pr-28 py-4 rounded-full border border-slate-300 shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all" placeholder="Enter name or entity..." />
      <button className="absolute right-2 top-2 bottom-2 bg-blue-600 text-white px-6 rounded-full font-medium hover:bg-blue-700 transition-colors">Search</button>
    </div>
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center"><AlertCircle className="h-4 w-4 mr-2"/> Recent Potential Hits</h4>
      <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
        <li><strong>John Smith</strong> matched in <em>State v. GreenEnergy</em> (Witness)</li>
        <li><strong>Acme Corp</strong> matched in <em>Archive 2019-044</em> (Opposing Party)</li>
      </ul>
    </div>
  </div>
);

export const CaseListTasks: React.FC = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-slate-900">My Active Tasks</h3>
      <Button variant="outline" size="sm">View Team Tasks</Button>
    </div>
    <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 shadow-sm">
      {[1,2,3].map(i => (
        <div key={i} className="p-4 flex items-center hover:bg-slate-50 transition-colors group cursor-pointer">
          <input type="checkbox" className="h-4 w-4 text-blue-600 rounded border-slate-300 mr-4 cursor-pointer"/>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600">Review deposition transcript for inconsistencies</p>
            <p className="text-xs text-slate-500 mt-0.5">Martinez v. TechCorp • Due Tomorrow</p>
          </div>
          <Badge variant={i===1 ? 'error' : 'info'}>{i===1 ? 'High' : 'Normal'}</Badge>
        </div>
      ))}
    </div>
  </div>
);

export const CaseListReporters: React.FC = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Mic2 className="h-10 w-10 text-slate-400"/>
    </div>
    <h3 className="text-xl font-medium text-slate-900">Court Reporter Directory</h3>
    <p className="text-slate-500 max-w-sm mx-auto mt-2">Manage preferred reporting agencies, individual reporters, and video services.</p>
    <Button variant="primary" className="mt-6" icon={Plus}>Add Agency</Button>
  </div>
);

export const CaseListClosing: React.FC = () => (
  <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <FileCheck className="h-10 w-10 text-slate-400"/>
    </div>
    <h3 className="text-xl font-medium text-slate-900">Closing Binder Generator</h3>
    <p className="text-slate-500 max-w-sm mx-auto mt-2">Compile all final pleadings, orders, and executed agreements into a searchable PDF binder.</p>
    <Button variant="primary" className="mt-6" icon={ArrowRight}>Start New Binder</Button>
  </div>
);

export const CaseListArchived: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-slate-100 p-4 rounded text-center text-slate-500 italic text-sm border border-slate-200">
      Showing cases closed in the last 12 months. Older cases are in Cold Storage.
    </div>
    <TableContainer>
      <TableHeader>
        <TableHead>Closed Date</TableHead>
        <TableHead>Matter</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Outcome</TableHead>
        <TableHead className="text-right">Action</TableHead>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="text-slate-500 font-mono text-xs">Jan 15, 2023</TableCell>
          <TableCell className="font-medium text-slate-900">State v. GreenEnergy</TableCell>
          <TableCell>GreenEnergy Corp</TableCell>
          <TableCell><Badge variant="success">Settled</Badge></TableCell>
          <TableCell className="text-right"><Button variant="ghost" size="sm">Retrieve</Button></TableCell>
        </TableRow>
      </TableBody>
    </TableContainer>
  </div>
);
