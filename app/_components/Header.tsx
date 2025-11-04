import React from 'react';
import { Calculator, Trash2 } from 'lucide-react';

type HeaderProps = {
  onClearAllData: () => void;
  hasBonds: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  onClearAllData,
  hasBonds,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Calculator className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Калькулятор облігацій</h1>
      </div>
      {hasBonds && (
        <button
          onClick={onClearAllData}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Очистити всі дані
        </button>
      )}
    </div>
  );
};
