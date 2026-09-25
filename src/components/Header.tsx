import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  tenant: string;
  onTenantChange: (tenant: string) => void;
  onOpenAuth: () => void;
  onOpenNotifications: () => void;
  unreadNotificationsCount?: number;
  viewMode: 'mobile' | 'responsive';
  onToggleViewMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  tenant,
  onTenantChange,
  onOpenAuth,
  onOpenNotifications,
  unreadNotificationsCount = 2,
  viewMode,
  onToggleViewMode,
}) => {
  const { currentUser, userProfile } = useAuth();
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);

  const tenants = [
    'Global Retail Corp',
    'North America Commerce',
    'EMEA Wholesale Ltd',
    'APAC Enterprise Hub',
  ];

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-container/60 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="InsightAI Logo"
            className="h-8 w-auto object-contain shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1Uy8Lipxa_u3ti-rzaK3LSztmg-e1DNIwMWJqhVIs4pSI4YRURWT3cbdAwRygbhV-23rxanAQnpDYVrWQiIfuZE4uS6AZkznNnMl448ZvYnLRMx3RZBzCzwK3Nx1rlUEK7q02HPg1y8CzlVXmzklPHfALJnxVEeq2akhGA_co7xoeU6AkYuPeMHgGJUaZWyOvF1DSS4FJX_XhbteshMTSLevVw3KzJZwxcPgP_4ALuzxK-6npUIlD7kCy-g"
            onError={(e) => {
              // Graceful fallback if hotlink fails
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1 leading-none">
              <span className="font-semibold text-base text-on-surface tracking-tight truncate">
                InsightAI
              </span>
              <span className="text-[0.625rem] px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold tracking-wide uppercase leading-none">
                AI
              </span>
            </div>

            {/* Tenant switcher dropdown */}
            <div className="relative">
              <button
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center gap-0.5 text-left group mt-0.5 focus:outline-none"
                aria-label="Switch organization tenant"
              >
                <span className="text-[11px] font-medium text-on-surface-variant group-hover:text-primary transition-colors truncate max-w-[130px]">
                  {tenant}
                </span>
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                  arrow_drop_down
                </span>
              </button>

              {tenantDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setTenantDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-1 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-1 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-2.5 py-1 text-[10px] font-semibold text-outline uppercase tracking-wider">
                      Workspaces
                    </div>
                    {tenants.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          onTenantChange(item);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          tenant === item
                            ? 'bg-primary-fixed/40 text-primary font-semibold'
                            : 'text-on-surface hover:bg-surface-container'
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        {tenant === item && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Device viewport toggle */}
          <button
            onClick={onToggleViewMode}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant text-[11px] font-medium transition-colors"
            title={`Toggle between mobile chassis view and responsive view (Currently: ${viewMode})`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {viewMode === 'mobile' ? 'smartphone' : 'desktop_windows'}
            </span>
            <span>{viewMode === 'mobile' ? 'Mobile Frame' : 'Full Canvas'}</span>
          </button>

          {/* Notifications button */}
          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface animate-pulse" />
            )}
          </button>

          {/* Profile / Account trigger */}
          <button
            aria-label="User Profile and Security"
            onClick={onOpenAuth}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:opacity-90 transition-opacity ring-1 ring-surface-container-high focus:outline-none"
            title={currentUser ? `${currentUser.displayName || currentUser.email} (Connected)` : 'Sign In to Workspace'}
          >
            {currentUser?.photoURL ? (
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                src={currentUser.photoURL}
              />
            ) : currentUser ? (
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-xs">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'U'}
              </div>
            ) : (
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover shadow-[0_1px_3px_rgba(0,0,0,0.08)] opacity-75"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD8ruADtIb2GoTckJfYLuppw4OSeRZZcQH8YB7-0sHxgZxXyaKXqRKO9InkJDMm72gzWhiyo1upAi7Ne3EG7BByZGFrhI2sV2eVp1E5r17zzx-0pBUHqmXRhJX1htmsUbW6_03DyzrkITfrUfmkVeY65ukhYZSwSkk_4j3bZ9pCbBrOv3v7n2RQ8oqVaghiW-24BoaABR6s4v8sxDoaMNPpLWyA6QNgsBbfDqBjWmcHRiiTqy3WkRnPQ"
              />
            )}
            {currentUser && (
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-tertiary ring-2 ring-surface" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

