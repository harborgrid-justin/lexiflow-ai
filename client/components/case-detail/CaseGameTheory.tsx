import React, { useState } from 'react';
import { useGameTheory } from '../../enzyme/hooks/useGameTheory';
import { Card, Button } from '../common';
import { Play, GitBranch, TrendingUp, DollarSign } from 'lucide-react';

interface CaseGameTheoryProps {
  caseId: string;
}

export const CaseGameTheory: React.FC<CaseGameTheoryProps> = ({ caseId }) => {
  const { 
    simulations, 
    decisionTree, 
    optimalSettlement, 
    runMonteCarlo, 
    isLoading 
  } = useGameTheory(caseId);

  const [iterations, setIterations] = useState(1000);

  const handleRunMonteCarlo = async () => {
    await runMonteCarlo({ caseId, iterations });
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading Game Theory Analysis...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Decision Tree Analysis">
          <div className="p-4">
            {decisionTree ? (
              <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-60">
                {JSON.stringify(decisionTree, null, 2)}
              </pre>
            ) : (
              <div className="text-slate-500 text-center py-8">No decision tree generated yet.</div>
            )}
          </div>
        </Card>

        <Card title="Settlement Optimization">
          <div className="p-4">
             {optimalSettlement ? (
               <div className="space-y-2">
                 <div className="flex justify-between">
                   <span className="text-slate-600">Recommended Range:</span>
                   <span className="font-medium">${optimalSettlement.min?.toLocaleString()} - ${optimalSettlement.max?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-slate-600">Win Probability:</span>
                   <span className="font-medium">{(optimalSettlement.winProbability * 100).toFixed(1)}%</span>
                 </div>
               </div>
             ) : (
               <div className="text-slate-500 text-center py-8">No settlement data available.</div>
             )}
          </div>
        </Card>
      </div>

      <Card title="Monte Carlo Simulations">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">Iterations</label>
              <input 
                type="number" 
                value={iterations} 
                onChange={(e) => setIterations(Number(e.target.value))}
                className="border rounded px-3 py-2 w-32 text-sm"
                min="100"
                max="10000"
              />
            </div>
            <div className="mt-5">
              <Button onClick={handleRunMonteCarlo} icon={Play}>
                Run Simulation
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-3 text-sm text-slate-700">Recent Simulations</h4>
            {simulations.length > 0 ? (
              <ul className="space-y-2">
                {simulations.map(sim => (
                  <li key={sim.id} className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-100">
                    <span className="font-medium text-sm">{sim.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      sim.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      sim.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sim.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-500 text-sm italic">No simulations run yet.</div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
