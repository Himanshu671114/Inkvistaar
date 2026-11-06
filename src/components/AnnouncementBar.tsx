import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AnnouncementBar: React.FC = () => {
  const { announcementText } = useStore();

  return (
    <div className="bg-neutral-900 text-neutral-200 text-xs py-2 px-4 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-center sm:text-left">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
          <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
          <span className="font-medium tracking-tight text-neutral-100">
            {announcementText}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-neutral-400">
          <Link
            to="/shop"
            className="text-amber-400 hover:text-white transition-colors flex items-center gap-1 group font-semibold"
          >
            <span>Explore Collection</span>
            <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <span className="text-neutral-600">·</span>
          <span>Fast 24H Dispatch</span>
        </div>
      </div>
    </div>
  );
};
