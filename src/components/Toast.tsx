import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { notification } = useApp();

  if (!notification) return null;

  const bgColors = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  };

  const Icon = icons[notification.type];

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl ${bgColors[notification.type]} backdrop-blur-md border border-white/20`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm font-medium pr-2">{notification.message}</span>
      </div>
    </div>
  );
};
