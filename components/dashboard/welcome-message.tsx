import React from 'react';

interface WelcomeMessageProps {
  firstName?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ firstName }) => {
  const greeting = getGreeting();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md p-6 text-gray-900 dark:text-white">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting}, {firstName || 'User'}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to your Chemoventry dashboard. Here's an overview of your inventory.
          </p>
        </div>
        <div className="hidden md:block">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="text-gray-400 dark:text-gray-700"
          >
            <path d="M10 2v4c0 1.1-.9 2-2 2H4" />
            <path d="M2 12h3" />
            <path d="M2 16h3" />
            <path d="M2 20h3" />
            <path d="M14 2v4c0 1.1.9 2 2 2h4" />
            <path d="M22 12h-3" />
            <path d="M22 16h-3" />
            <path d="M22 20h-3" />
            <path d="M17 12a5 5 0 1 0-5 5" />
            <path d="M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" />
            <path d="m15 19-3-3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good morning';
  } else if (hour < 18) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
};

export default WelcomeMessage;
