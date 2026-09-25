import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onAskCopilotQuick: () => void;
  isCopilotActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onAskCopilotQuick,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string; badge?: boolean }[] = [
    { id: 'overview', label: 'Overview', icon: 'grid_view' },
    { id: 'ai-builder', label: 'AI Builder', icon: 'neurology' },
    { id: 'copilot', label: 'Copilot', icon: 'chat_spark', badge: true },
    { id: 'data', label: 'Data', icon: 'database' },
    { id: 'reports', label: 'Reports', icon: 'description' },
  ];

  return (
    <>
      {/* Floating Action Button (FAB) - "Ask Copilot" */}
      {activeTab !== 'copilot' && (
        <div className="fixed bottom-20 right-4 z-40">
          <button
            onClick={onAskCopilotQuick}
            aria-label="Contextual AI Assistant"
            className="flex items-center gap-2 h-11 px-4 rounded-full bg-secondary text-on-secondary shadow-[0_4px_16px_rgba(107,56,212,0.35)] hover:bg-secondary-container active:scale-95 transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">
              auto_awesome
            </span>
            <span className="text-xs font-semibold tracking-wide">
              Ask Copilot
            </span>
          </button>
        </div>
      )}

      {/* Main Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container/70 shadow-[0_-2px_12px_rgba(0,0,0,0.04)]"
        aria-label="Primary mobile navigation"
      >
        <div className="max-w-md mx-auto flex justify-around items-center h-16 px-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-w-[56px] h-14 transition-all gap-0.5 relative ${
                  isActive
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface font-normal'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`material-symbols-outlined text-[22px] transition-transform ${
                      isActive ? 'scale-110' : ''
                    }`}
                  >
                    {item.icon}
                  </span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary" />
                    </span>
                  )}
                </div>
                <span className="text-[11px] leading-tight tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
