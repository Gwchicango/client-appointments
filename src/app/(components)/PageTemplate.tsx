"use client";

import React from 'react';
import Nav from './Nav';
import Loading from './Loading';

interface PageTemplateProps {
  children: React.ReactNode;
  loading: boolean;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children, loading }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-1 bg-gray-100 p-6 text-black overflow-y-auto ml-64"> {/* Agrega ml-64 para el margen izquierdo */}
        {loading ? <Loading /> : children}
      </div>
    </div>
  );
};

export default PageTemplate;