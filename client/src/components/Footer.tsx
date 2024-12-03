import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          © 2024 Payment Manager. All rights reserved.
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">Developed by:</span>
          <img
            src="/developer-logo.svg"
            alt="Developer Logo"
            className="h-6 w-6"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
