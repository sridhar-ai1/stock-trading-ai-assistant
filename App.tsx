import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import StockInputForm from './components/StockInputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';
import { getStockAnalysis } from './services/geminiService';
import type { AnalysisResult } from './types';

const App: React.FC = () => {
  const [ticker, setTicker] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevent the default browser prompt
      setInstallPromptEvent(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA installation');
        } else {
          console.log('User dismissed the PWA installation');
        }
        setInstallPromptEvent(null); // The prompt can only be used once
      });
    }
  };


  const getFormattedDate = (date: Date): string => date.toISOString().split('T')[0];
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  
  const [startDate, setStartDate] = useState<string>(getFormattedDate(oneYearAgo));
  const [endDate, setEndDate] = useState<string>(getFormattedDate(today));

  const handleAnalyze = useCallback(async () => {
    if (!ticker.trim()) {
      setError('Please enter a stock ticker.');
      return;
    }
     if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
        setError('Please select a valid date range.');
        return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await getStockAnalysis(ticker.trim().toUpperCase(), startDate, endDate);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('Failed to get analysis. The stock ticker might be invalid or there was an API error.');
    } finally {
      setIsLoading(false);
    }
  }, [ticker, startDate, endDate]);

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col font-sans">
      <Header onInstallClick={handleInstallClick} showInstallButton={!!installPromptEvent} />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl text-center">
          <p className="text-lg text-gray-400 mb-8">
            Enter a stock ticker and select a date range for a historical, AI-powered analysis.
          </p>
          <StockInputForm
            ticker={ticker}
            setTicker={setTicker}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
          />
        </div>

        <div className="w-full max-w-2xl mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center">{error}</div>}
          
          {!isLoading && !error && !analysisResult && (
             <div className="text-center p-8 bg-gray-900/50 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-semibold text-gray-300">Ready for your first analysis?</h2>
                <p className="text-gray-400 mt-2">Your AI-generated stock insights will appear here.</p>
             </div>
          )}

          {analysisResult && <AnalysisDisplay result={analysisResult} />}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;