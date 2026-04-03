import React from 'react';
import { Calculator, ListChecks, Trash2, TestTube } from 'lucide-react';
import { Dropdown } from '@/app/components';

type HomeHeaderProps = {
  onClearAllData: () => void;
  onLoadTestData: () => void;
  hasBonds: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  onClearAllData,
  onLoadTestData,
  hasBonds,
  onSelectAll,
  onDeselectAll,
}) => {
  return (
    <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
      <div className="flex items-center gap-3 min-w-0">
        <Calculator className="w-8 h-8 text-indigo-600 shrink-0" />
        <h1 className="text-3xl font-bold text-gray-800">Калькулятор облігацій</h1>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!hasBonds && (
          <button
            type="button"
            onClick={onLoadTestData}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <TestTube className="w-4 h-4" />
            Завантажити тестові дані
          </button>
        )}
        {hasBonds && (
          <>
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="cursor-pointer p-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100 transition-colors flex items-center justify-center"
                >
                  <span className="sr-only">Обрання для розрахунку</span>
                  <ListChecks className="w-5 h-5" aria-hidden />
                </button>
              }
            >
              {(close) => (
                <>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-800 hover:bg-indigo-50"
                    onClick={() => {
                      onSelectAll();
                      close();
                    }}
                  >
                    Обрати всі
                  </button>
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                    onClick={() => {
                      onDeselectAll();
                      close();
                    }}
                  >
                    Зняти обрання з усіх
                  </button>
                </>
              )}
            </Dropdown>
            <button
              type="button"
              onClick={onClearAllData}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Очистити всі дані
            </button>
          </>
        )}
      </div>
    </div>
  );
};
