
/**
 * CasePrediction Component
 *
 * ENZYME MIGRATION - Agent 32 (December 2, 2025)
 *
 * Features:
 * - useTrackEvent() for analytics tracking of chart interactions and forecast views
 * - useLatestCallback for stable event handlers
 *
 * Analytics Events:
 * - case_prediction_chart_viewed: Tracks when user views the strength assessment chart (tracks dataPointCount)
 * - case_prediction_forecast_viewed: Tracks when outcome forecast is displayed (tracks dismissalProb, settlementProb, estimatedValueBand)
 *
 * Hydration Strategy:
 * - No progressive hydration needed (lightweight analytics component, renders immediately)
 */

import React, { useEffect } from 'react';
import { Card } from '../common/Card';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import {
  useLatestCallback,
  useTrackEvent
} from '../../enzyme';

interface CasePredictionProps {
  outcomeData: any[];
}

export const CasePrediction: React.FC<CasePredictionProps> = ({ outcomeData }) => {
  const trackEvent = useTrackEvent();

  // Track when chart data is viewed
  useEffect(() => {
    if (outcomeData && outcomeData.length > 0) {
      trackEvent('case_prediction_chart_viewed', {
        dataPointCount: outcomeData.length
      });
    }
  }, [outcomeData, trackEvent]);

  // Track when forecast is displayed (component mount)
  useEffect(() => {
    trackEvent('case_prediction_forecast_viewed', {
      dismissalProb: 24,
      settlementProb: 68,
      estimatedValueBand: '$1.2M - $1.8M'
    });
  }, [trackEvent]);
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
