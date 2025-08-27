import React from 'react';

interface StockInputFormProps {
  ticker: string;
  setTicker: (ticker: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const StockInputForm: React.FC<StockInputFormProps> = ({ 
  ticker, setTicker,
  startDate, setStartDate,
  endDate, setEndDate,
  onAnalyze, isLoading 
}) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze();
  };

  const inputStyles = "w-full px-4 py-3 bg-gray-900 border-2 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500 transition-all duration-200 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter Stock Ticker..."
        className={inputStyles}
        disabled={isLoading}
        aria-label="Stock Ticker"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-400 mb-1 text-left">Start Date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputStyles}
            disabled={isLoading}
            aria-label="Analysis Start Date"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-400 mb-1 text-left">End Date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={inputStyles}
            disabled={isLoading}
            aria-label="Analysis End Date"
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 flex items-center justify-center mt-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </>
        ) : (
          'Analyze'
        )}
      </button>
    </form>
  );
};

export default StockInputForm;