import React from 'react';

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const InstallIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

interface HeaderProps {
    onInstallClick: () => void;
    showInstallButton: boolean;
}

const Header: React.FC<HeaderProps> = ({ onInstallClick, showInstallButton }) => {
  return (
    <header className="bg-gray-900/30 backdrop-blur-sm border-b border-gray-800 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <ChartIcon />
            <h1 className="text-2xl md:text-3xl font-bold text-white ml-3 tracking-wider">
              AI Stock Advisor
            </h1>
        </div>
        {showInstallButton && (
          <button
            onClick={onInstallClick}
            className="hidden sm:flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 animate-fade-in"
            aria-label="Install App"
          >
            <InstallIcon />
            Install App
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;