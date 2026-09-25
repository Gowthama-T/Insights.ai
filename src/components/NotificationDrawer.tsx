import React from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToInsight?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateToInsight,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'East Margin Compression Alert (-7.8%)',
      time: '12m ago',
      desc: 'Electronics category dropped below regional baseline threshold. AI diagnostic breakdown ready.',
      type: 'alert',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'PostgreSQL Core DB Synced',
      time: '14m ago',
      desc: 'Auto-Schema Sense indexed 5 tables across 240K rows. No PII violations detected.',
      type: 'info',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'South Region Expansion Target Exceeded',
      time: '2h ago',
      desc: 'Revenue crossed ₹4.5 Cr milestone ahead of Q3 forecast schedule.',
      type: 'success',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-inverse-surface/40 backdrop-blur-xs p-3 pt-16 animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-surface-container-lowest rounded-3xl max-w-sm w-full p-4 shadow-2xl border border-surface-container flex flex-col gap-3 z-10 animate-in slide-in-from-top-4 duration-200">
        <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
            <h3 className="text-sm font-bold text-on-surface">Notifications & Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                onClose();
                if (onNavigateToInsight) onNavigateToInsight();
              }}
              className={`p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                n.unread
                  ? 'bg-surface-container-low border-primary/20 hover:bg-surface-container'
                  : 'bg-surface-container-lowest border-surface-container/60 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-on-surface flex items-center gap-1.5">
                  {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                  {n.title}
                </span>
                <span className="text-[10px] text-outline font-medium">{n.time}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full h-9 rounded-xl bg-surface-container text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
};
