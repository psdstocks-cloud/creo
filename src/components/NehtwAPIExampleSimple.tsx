'use client';

import React, { useState } from 'react';

const NehtwAPIExampleSimple: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleCreateOrder = async () => {
    setIsLoading(true);
    setMessage('Creating order...');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Order created successfully!');
    }, 2000);
  };

  const handleCheckStatus = async () => {
    setIsLoading(true);
    setMessage('Checking status...');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Status: Completed');
    }, 1500);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    setMessage('Generating download link...');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setMessage('Download link ready!');
    }, 1000);
  };

  return (
    <div className="nehtw-api-example p-6 glass-card">
      <h2 className="text-2xl font-bold mb-4">Nehtw API Example</h2>
      
      <div className="space-y-4">
        <button 
          onClick={handleCreateOrder} 
          disabled={isLoading}
          className="px-4 py-2 bg-primaryOrange-500 text-white rounded hover:bg-primaryOrange-600 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Order'}
        </button>
        
        <button 
          onClick={handleCheckStatus} 
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>
        
        <button 
          onClick={handleDownload} 
          disabled={isLoading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Download'}
        </button>
      </div>
      
      {message && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default NehtwAPIExampleSimple;
