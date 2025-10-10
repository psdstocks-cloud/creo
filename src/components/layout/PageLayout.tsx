import React from 'react';

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {children}
    </div>
  );
};