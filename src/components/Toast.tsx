import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2 } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useStore();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-neutral-950 text-white px-5 py-3 rounded-full shadow-2xl border border-neutral-800 animate-fadeIn">
      <CheckCircle2 size={16} className="text-amber-400 shrink-0" />
      <span className="text-xs font-medium tracking-normal">{toastMessage}</span>
    </div>
  );
};
