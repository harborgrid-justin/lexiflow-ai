
import React from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { TableContainer, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { UserAvatar } from '../common/UserAvatar';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface Contact {
  id: string;
  name: string;
  role: string;
  status: string;
  email: string;
  department: string;
}

interface MessengerContactsProps {
  contacts: Contact[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onMessageClick: () => void;
}

export const MessengerContacts: React.FC<MessengerContactsProps> = ({ contacts, searchTerm, setSearchTerm, onMessageClick }) => {
  return (
    <div className="w-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Firm & Client Directory</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <TableContainer className="border-0 shadow-none rounded-none">
          <TableHeader>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableHeader>
          <TableBody>
            {contacts.map(c => (
              <TableRow key={c.id}>
                <TableCell className="font-medium text-slate-900 flex items-center gap-3">
                  <UserAvatar name={c.name} size="sm"/> {c.name}
                </TableCell>
                <TableCell>{c.role}</TableCell>
                <TableCell>{c.department}</TableCell>
                <TableCell>
                  <Badge variant={c.status === 'online' ? 'success' : 'neutral'}>{c.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" icon={MessageSquare} onClick={onMessageClick}>Message</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableContainer>
      </div>
    </div>
  );
};
