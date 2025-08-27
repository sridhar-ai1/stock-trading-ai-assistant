import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black border-t border-gray-900 mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500 text-sm">
        <p className="font-semibold text-yellow-500">Disclaimer</p>
        <p className="mt-1">
          This is not financial advice. All analysis is AI-generated and for informational purposes only. Please consult a certified financial advisor before making any investment decisions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;