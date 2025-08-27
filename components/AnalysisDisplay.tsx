import React, { useState } from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    Brush,
    AreaChart,
    Area
} from 'recharts';
import type { AnalysisResult, Suggestion } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const getSuggestionUIConfig = (suggestion: Suggestion): { badge: string, line: string } => {
  switch (suggestion) {
    case 'Strong Buy':
    case 'Moderate Buy':
      return { badge: 'bg-green-500/10 text-green-400 border-green-500/30', line: '#22c55e' }; // green-500
    case 'Hold':
      return { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', line: '#eab308' }; // yellow-500
    case 'Moderate Sell':
    case 'Strong Sell':
      return { badge: 'bg-red-500/10 text-red-400 border-red-500/30', line: '#ef4444' }; // red-500
    default:
      return { badge: 'bg-gray-500/10 text-gray-400 border-gray-500/30', line: '#6b7280' }; // gray-500
  }
};


const PositiveIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-green-400" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);
  
const RiskIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
);

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
};
const formatFullDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-md p-3 shadow-lg">
          <p className="label text-sm font-semibold text-gray-200">{`${formatFullDate(label)}`}</p>
          <p className="intro text-sm text-cyan-400">{`Price: ₹${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
    const { ticker, suggestion, confidence, analysis, risks, startDate, endDate, historicalData } = result;
    const uiConfig = getSuggestionUIConfig(suggestion);
    
    const [zoomDomain, setZoomDomain] = useState<{ startIndex: number, endIndex: number }>({ 
        startIndex: 0, 
        endIndex: historicalData.length - 1 
    });

    const handleBrushChange = (newDomain: any) => {
        if (newDomain) {
            setZoomDomain({ startIndex: newDomain.startIndex, endIndex: newDomain.endIndex });
        }
    };
    
    const resetZoom = () => {
         setZoomDomain({ startIndex: 0, endIndex: historicalData.length - 1 });
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg shadow-2xl p-6 w-full animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">{ticker} Analysis</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Period: {formatFullDate(startDate)} to {formatFullDate(endDate)}
                    </p>
                </div>
                <div className={`mt-3 sm:mt-0 text-center px-4 py-2 rounded-lg border text-lg font-semibold ${uiConfig.badge}`}>
                    {suggestion}
                    <span className="block text-xs font-normal opacity-80">{confidence} Confidence</span>
                </div>
            </div>

            {/* Chart Section */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-200 mb-4">Historical Price Chart</h3>
                <div className="h-80 w-full bg-gray-900 p-4 rounded-md border border-gray-800">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalData} syncId="stockChart" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={formatDate}
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis 
                                domain={['dataMin - 5', 'dataMax + 5']} 
                                stroke="#9ca3af"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `₹${Number(value).toFixed(0)}`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line 
                                type="monotone" 
                                dataKey="price" 
                                stroke={uiConfig.line} 
                                strokeWidth={2} 
                                dot={false} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                 <div className="h-24 w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={historicalData} syncId="stockChart" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={uiConfig.line} stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor={uiConfig.line} stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="date" tick={false} axisLine={false} />
                            <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={false} axisLine={false} />
                            <Area type="monotone" dataKey="price" stroke={uiConfig.line} fillOpacity={1} fill="url(#colorUv)" />
                            <Brush 
                                startIndex={zoomDomain.startIndex}
                                endIndex={zoomDomain.endIndex}
                                onChange={handleBrushChange}
                                dataKey="date" 
                                height={30} 
                                stroke="#60a5fa"
                                fill="#1f2937"
                                travellerWidth={10}
                            />
                         </AreaChart>
                     </ResponsiveContainer>
                </div>
                <div className="text-right mt-2">
                    <button 
                        onClick={resetZoom}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        Reset Zoom
                    </button>
                </div>
            </div>

            {/* Analysis & Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Analysis Points */}
                <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                        <PositiveIcon className="mr-2" />
                        Key Observations
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        {analysis.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-green-400 mr-2 mt-1">&#8227;</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Risk Factors */}
                <div className="bg-gray-900 p-4 rounded-md border border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                        <RiskIcon className="mr-2" />
                        Potential Risks
                    </h3>
                    <ul className="space-y-2 text-gray-300 text-sm">
                        {risks.map((point, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-red-400 mr-2 mt-1">&#8227;</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AnalysisDisplay;