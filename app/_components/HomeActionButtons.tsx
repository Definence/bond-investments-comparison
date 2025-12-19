import React from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const HomeActionButtons: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <div className="mb-6">
        <button
          onClick={() => router.push('/bonds/new')}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Додати облігацію
        </button>
      </div>

      <button
        onClick={() => router.push('/results')}
        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <TrendingUp className="w-5 h-5" />
        Розрахувати та порівняти
      </button>
    </>
  );
};
