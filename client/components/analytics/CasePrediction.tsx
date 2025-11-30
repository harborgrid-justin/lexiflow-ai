
import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface CasePredictionProps {
  outcomeData: any[];
}

export const CasePrediction: React.FC<CasePredictionProps> = ({ outcomeData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Case Strength Assessment">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={outcomeData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{fontSize: 11}}/>
              <PolarRadiusAxis angle={30} domain={[0, 100]}/>
              <Radar name="Current Case" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Outcome Forecast">
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-1"><span>Probability of Dismissal</span><span className="font-bold">24%</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-red-400 h-2 rounded-full w-[24%]"></div></div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1"><span>Probability of Settlement</span><span className="font-bold">68%</span></div>
            <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full w-[68%]"></div></div>
          </div>
          <div className="p-4 bg-green-50 rounded border border-green-200 mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-green-800">Estimated Value Band</span>
              <TrendingUp className="h-4 w-4 text-green-600"/>
            </div>
            <p className="text-2xl font-mono font-bold text-slate-900">$1.2M - $1.8M</p>
            <p className="text-xs text-green-700 mt-1">Based on 45 similar cases in CA Superior Court</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
