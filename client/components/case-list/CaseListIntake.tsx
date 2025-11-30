
import React, { useState } from 'react';
import { GripVertical, Calendar, Plus } from 'lucide-react';

interface Lead {
  id: number;
  client: string;
  matter: string;
  stage: string;
  value: string;
  age: string;
}

export const CaseListIntake: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 1, client: 'Horizon Tech', matter: 'IP Dispute', stage: 'Conflict Check', value: '$50k', age: '2d' },
    { id: 2, client: 'Dr. A. Smith', matter: 'Malpractice Defense', stage: 'Engagement Letter', value: '$120k', age: '5d' },
    { id: 3, client: 'RetailCo', matter: 'Lease Negotiation', stage: 'New Lead', value: '$15k', age: '1d' },
    { id: 4, client: 'StartUp Inc', matter: 'Series A Funding', stage: 'New Lead', value: '$200k', age: '4h' },
  ]);
  const [draggedLeadId, setDraggedLeadId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (stage: string) => {
    if (draggedLeadId !== null) {
      setLeads(prev => prev.map(lead => 
        lead.id === draggedLeadId ? { ...lead, stage } : lead
      ));
    }
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleAddLead = () => {
    const newLead: Lead = {
      id: Date.now(),
      client: 'New Prospect',
      matter: 'Pending Intake',
      stage: 'New Lead',
      value: '$0',
      age: 'Just now'
    };
    setLeads([...leads, newLead]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-slate-900">Pipeline Board</h3>
        <p className="text-sm text-slate-500 flex items-center">
          <GripVertical className="h-4 w-4 mr-1"/> Drag cards to move stages
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] overflow-x-auto pb-4">
        {['New Lead', 'Conflict Check', 'Engagement Letter', 'Matter Created'].map((stage, idx) => (
          <div 
            key={stage} 
            className={`flex flex-col rounded-lg p-3 h-full border-2 transition-colors duration-200 ${
              dragOverStage === stage 
                ? 'bg-blue-50 border-blue-300' 
                : 'bg-slate-100 border-transparent'
            }`}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(stage)}
          >
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="font-bold text-slate-700 text-sm">{stage}</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
                {leads.filter(l => l.stage === stage).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {leads.filter(l => l.stage === stage).map(lead => (
                <div 
                  key={lead.id} 
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className={`bg-white p-3 rounded-lg shadow-sm border cursor-move transition-all duration-200 group ${
                    draggedLeadId === lead.id 
                      ? 'opacity-50 ring-2 ring-blue-400 rotate-2 scale-95' 
                      : 'border-slate-200 hover:shadow-md hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 line-clamp-1">{lead.client}</h4>
                    <GripVertical className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100"/>
                  </div>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-1">{lead.matter}</p>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                    <span className="font-mono text-emerald-600 font-medium">{lead.value}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3"/> {lead.age}
                    </span>
                  </div>
                </div>
              ))}
              {leads.filter(l => l.stage === stage).length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  Drop items here
                </div>
              )}
            </div>

            {idx === 0 && (
              <button 
                onClick={handleAddLead}
                className="mt-3 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-bold hover:bg-white hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center"
              >
                <Plus className="h-3 w-3 mr-1"/> Add Lead
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
