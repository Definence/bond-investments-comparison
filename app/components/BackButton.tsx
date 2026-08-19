'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

type BackButtonProps = {
  text?: string;
};

export const BackButton: React.FC<BackButtonProps> = ({
  text = 'Назад',
}) => {
  const router = useRouter();

  return (
    <button
      onClick={router.back}
      className="mb-6 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2 text-gray-700 hover:text-indigo-600"
    >
      <ArrowLeft className="w-5 h-5" />
      {text}
    </button>
  );
};
