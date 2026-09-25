import React, { useState } from 'react';
import { INITIAL_CONNECTORS, INITIAL_INGEST_STREAMS } from '../data/mockData';
import { DataConnector } from '../types';
import { useAuth } from '../context/AuthContext';
import { saveUserDataSource } from '../services/firebase';

export const DataScreen: React.FC = () => {
  const { currentUser } = useAuth();
  const [connectors, setConnectors] = useState<DataConnector[]>(INITIAL_CONNECTORS);
  const [activeCategory, setActiveCategory] = useState<'all' | 'databases' | 'warehouses' | 'files' | 'saas'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrawerConnector, setSelectedDrawerConnector] = useState<DataConnector | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Connect Drawer form states
  const [host, setHost] = useState('db.company.internal');
  const [port, setPort] = useState('3306');
  const [dbName, setDbName] = useState('sales_prod');
  const [username, setUsername] = useState('insight_ingest_bot');
  const [password, setPassword] = useState('SecurePass2026!');
  const [enforceSSL, setEnforceSSL] = useState(true);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [isTestVerified, setIsTestVerified] = useState(true);
  const [selectedTables, setSelectedTables] = useState([
    { name: 'customers', rows: '240K', icon: 'person' },
    { name: 'orders', rows: '820K', icon: 'shopping_cart' },
    { name: 'products', rows: '1.2K', icon: 'inventory_2' },
    { name: 'payments', rows: '815K', icon: 'credit_card' },
    { name: 'regions', rows: '14', icon: 'public' },
  ]);
  const [activeLogsModal, setActiveLogsModal] = useState(false);
  const [streamManageItem, setStreamManageItem] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredConnectors = connectors.filter((c) => {
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDrawer = (connector: DataConnector) => {
    setSelectedDrawerConnector(connector);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const runConnectionTest = () => {
    setIsTestingPing(true);
    setTimeout(() => {
      setIsTestingPing(false);
      setIsTestVerified(true);
      showToast(`${selectedDrawerConnector?.name || 'Database'} Host ping verified: 18ms latency`);
    }, 800);
  };

  const commitConnection = () => {
    if (selectedDrawerConnector) {
      setConnectors((prev) =>
        prev.map((c) =>
          c.id === selectedDrawerConnector.id
            ? { ...c, connected: true, tag: 'Connected', tagColor: 'bg-tertiary-fixed text-on-tertiary-fixed' }
            : c
        )
      );

      if (currentUser) {
        saveUserDataSource(currentUser.uid, {
          name: selectedDrawerConnector.name,
          category: selectedDrawerConnector.category,
          host,
          status: 'connected',
        });
      }
    }
    setIsDrawerOpen(false);
    showToast(
      `${selectedDrawerConnector?.name || 'MySQL'} pipeline connected! ${selectedTables.length} tables queued for AI ingest.`
    );
  };

  const removeTable = (tblName: string) => {
    setSelectedTables((prev) => prev.filter((t) => t.name !== tblName));
  };

  const resetAllTables = () => {
    setSelectedTables([
      { name: 'customers', rows: '240K', icon: 'person' },
      { name: 'orders', rows: '820K', icon: 'shopping_cart' },
      { name: 'products', rows: '1.2K', icon: 'inventory_2' },
      { name: 'payments', rows: '815K', icon: 'credit_card' },
      { name: 'regions', rows: '14', icon: 'public' },
    ]);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 gap-4 pb-28 pt-2 animate-in fade-in duration-200">
      {/* Top Value Proposition & Intro */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-xs">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="text-[11px] font-bold tracking-wide">
            3 Active Sources Connected • 1.2M Records Synced
          </span>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">
          Connect your data
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Bring your business data into InsightAI and let our cognitive engine automatically model schemas, infer joins, and synthesize actionable executive dashboards.
        </p>
      </div>

      {/* AI Ingestion Callout Banner */}
      <div className="rounded-2xl p-4 bg-secondary-fixed text-on-secondary-fixed shadow-sm border border-secondary/20 flex items-start gap-3 relative overflow-hidden">
        <div className="p-2 rounded-xl bg-surface/80 text-secondary shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            auto_awesome
          </span>
        </div>
        <div className="flex flex-col min-w-0 pr-2 z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase tracking-wider text-secondary font-bold">
              Auto-Schema Sense
            </span>
            <span className="px-1.5 py-0.2 rounded-full bg-secondary text-on-secondary text-[10px] font-bold">
              Zero Config
            </span>
          </div>
          <p className="text-xs text-on-secondary-fixed-variant mt-0.5 leading-relaxed">
            InsightAI detects PII, normalizes dates across timezones, and generates preliminary semantic metrics upon connection.
          </p>
        </div>
        <span className="material-symbols-outlined absolute -bottom-3 -right-2 text-6xl text-secondary/15 select-none pointer-events-none">
          hub
        </span>
      </div>

      {/* Active Connected Sources Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs uppercase text-on-surface-variant font-bold tracking-wider">
              Active Ingest Streams
            </span>
            <span className="w-5 h-5 flex items-center justify-center rounded-full bg-surface-container-highest text-primary text-[11px] font-bold">
              {INITIAL_INGEST_STREAMS.length}
            </span>
          </div>
          <button
            onClick={() => setActiveLogsModal(true)}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>View Sync Logs</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {INITIAL_INGEST_STREAMS.map((stream) => (
            <div
              key={stream.id}
              className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container/60 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-11 h-11 rounded-xl ${stream.iconBg} ${stream.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
                >
                  <span className="material-symbols-outlined text-2xl">{stream.icon}</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-on-surface truncate">
                      {stream.name}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${stream.badgeColor} text-[10px] font-semibold`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-tertiary mr-1" />
                      {stream.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant truncate mt-0.5">
                    {stream.details}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStreamManageItem(stream.name)}
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors shrink-0 active:scale-95"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            className="w-full h-11 pl-11 pr-9 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-outline text-xs sm:text-sm shadow-xs border border-surface-container/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search 40+ supported data connectors..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          {[
            { id: 'all', label: 'All' },
            { id: 'databases', label: 'Databases' },
            { id: 'warehouses', label: 'Cloud Warehouses' },
            { id: 'files', label: 'Files' },
            { id: 'saas', label: 'SaaS APIs' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-surface-container/60 font-medium'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available Connectors Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase text-on-surface-variant font-bold tracking-wider">
            Available Connectors
          </span>
          <span className="text-xs text-on-surface-variant font-medium">
            {filteredConnectors.length} connector{filteredConnectors.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {filteredConnectors.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl bg-surface-container-lowest p-4 shadow-xs border border-surface-container/60 flex flex-col gap-3 transition-transform hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0 shadow-xs`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{c.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-on-surface truncate">{c.name}</h3>
                      <span
                        className={`px-2 py-0.2 rounded-full ${
                          c.tagColor || 'bg-surface-container text-on-surface-variant'
                        } text-[10px] font-bold flex items-center gap-1`}
                      >
                        {c.connected && (
                          <span className="material-symbols-outlined text-[12px]">check</span>
                        )}
                        {c.tag}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                {c.connected ? (
                  <button
                    onClick={() => handleOpenDrawer(c)}
                    className="px-3 py-1.5 rounded-lg bg-surface-container-high text-primary text-xs font-semibold hover:bg-surface-container-highest active:scale-95 transition-all shrink-0"
                  >
                    Settings
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenDrawer(c)}
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer"
                  >
                    Connect
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-surface-container/60 text-xs">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-tertiary">
                    verified_user
                  </span>
                  <span>{c.badgeText}</span>
                </span>
                <span className="text-secondary font-semibold">{c.extraFeature}</span>
              </div>
            </div>
          ))}

          {/* Empty search state */}
          {filteredConnectors.length === 0 && (
            <div className="rounded-2xl bg-surface-container-lowest p-8 text-center flex flex-col items-center justify-center gap-2 border border-surface-container/60 shadow-xs my-2">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-2xl">search_off</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">No data connectors found</h4>
              <p className="text-xs text-on-surface-variant max-w-xs leading-relaxed">
                We couldn't find connectors matching your search. Try searching for “SQL”, “Cloud”, or browse category filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-2 px-3.5 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-semibold"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Security & Trust Micro-Banner */}
      <div className="rounded-2xl p-4 bg-surface-container-low border border-surface-container/60 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[28px] shrink-0">lock</span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-on-surface">
            SOC2 Type II & HIPAA Certified Storage
          </span>
          <span className="text-[11px] text-on-surface-variant leading-normal">
            Credentials are encrypted with AES-256 in dedicated KMS envelopes.
          </span>
        </div>
      </div>

      {/* SLIDING DRAWER / MODAL WORKFLOW: QUICK CONNECT */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm transition-opacity"
            onClick={handleCloseDrawer}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-surface-container-lowest shadow-2xl border-t border-surface-container flex flex-col pb-safe animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-surface-container-lowest/95 backdrop-blur-md pt-3 pb-3 px-4 border-b border-surface-container/60 z-10 flex flex-col gap-2">
              <div className="w-12 h-1.5 rounded-full bg-surface-container-highest self-center" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-primary-fixed/40 flex items-center justify-center shrink-0 text-primary">
                    <span className="material-symbols-outlined text-[20px]">database</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h2 className="text-sm font-bold text-on-surface truncate">
                      Quick Connect: {selectedDrawerConnector?.name || 'Database'}
                    </h2>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      Step 1 of 2: Credential verification & table discovery
                    </span>
                  </div>
                </div>
                <button
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface shrink-0"
                  onClick={handleCloseDrawer}
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  Network & Credentials
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface">Host Address</label>
                    <input
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xs border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      type="text"
                      value={host}
                      onChange={(e) => setHost(e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface">Port</label>
                    <input
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xs border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      type="text"
                      value={port}
                      onChange={(e) => setPort(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">Default Database Name</label>
                  <div className="relative">
                    <input
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xs border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      type="text"
                      value={dbName}
                      onChange={(e) => setDbName(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[18px]">
                      lock_clock
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface">Username</label>
                    <input
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xs border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-on-surface">Password</label>
                    <input
                      className="w-full h-10 px-3 rounded-xl bg-surface-container-low text-on-surface font-mono text-xs border border-surface-container/80 focus:outline-none focus:ring-2 focus:ring-primary/20 tracking-wider"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* SSL Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-surface-container/60 mt-0.5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">shield</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-on-surface">Enforce TLS / SSL Encryption</span>
                      <span className="text-[11px] text-on-surface-variant">Recommended for remote connections</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enforceSSL}
                      onChange={() => setEnforceSSL(!enforceSSL)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>

              {/* Test Connection Button & Verification */}
              <div className="flex items-center justify-between">
                <button
                  className="px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-container-highest transition-colors active:scale-95"
                  onClick={runConnectionTest}
                  disabled={isTestingPing}
                >
                  <span
                    className={`material-symbols-outlined text-[18px] text-primary ${
                      isTestingPing ? 'animate-spin' : ''
                    }`}
                  >
                    {isTestingPing ? 'progress_activity' : 'network_check'}
                  </span>
                  <span>{isTestingPing ? 'Testing latency...' : 'Test Connection'}</span>
                </button>

                {isTestVerified && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-tertiary-container/15 text-tertiary text-xs font-bold animate-in fade-in">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                    <span>✓ Verified (18ms)</span>
                  </div>
                )}
              </div>

              {/* Discovered / Selected Tables */}
              <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-surface-container-low border border-surface-container/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                      Selected Tables For AI Ingest
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">
                      {selectedTables.length} selected
                    </span>
                  </div>
                  <button
                    onClick={resetAllTables}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Select All
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  InsightAI will construct autonomous joins between foreign keys in these tables:
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedTables.map((t) => (
                    <div
                      key={t.name}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest text-on-surface shadow-xs border border-surface-container/70"
                    >
                      <span className="material-symbols-outlined text-primary text-[14px]">
                        {t.icon}
                      </span>
                      <span className="font-mono text-xs font-semibold">{t.name}</span>
                      <span className="text-[10px] text-on-surface-variant font-normal">({t.rows})</span>
                      <button
                        onClick={() => removeTable(t.name)}
                        className="text-on-surface-variant hover:text-error ml-0.5"
                      >
                        <span className="material-symbols-outlined text-[14px]">cancel</span>
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => showToast('Custom SQL WHERE clause builder enabled.')}
                  className="mt-1 self-start flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Add Custom SQL View / WHERE filter</span>
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  className="w-full h-12 rounded-xl bg-primary text-on-primary text-sm font-semibold flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-[0.98] transition-all cursor-pointer"
                  onClick={commitConnection}
                >
                  <span>Continue with Selected Data ({selectedTables.length} Tables)</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <button
                  className="w-full h-10 rounded-xl bg-transparent text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors"
                  onClick={handleCloseDrawer}
                >
                  Cancel & Return to Hub
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Sync Logs Modal */}
      {activeLogsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
              <h3 className="text-sm font-bold text-on-surface">Data Ingestion Sync Logs</h3>
              <button
                onClick={() => setActiveLogsModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto font-mono text-[11px] p-2 bg-surface-container-low rounded-xl">
              <div>[10:40:12] PostgreSQL ingest: 5 tables indexed (240K rows OK)</div>
              <div>[10:35:48] Snowflake stream: PROD_FINANCE_WH CDC heartbeat (OK)</div>
              <div>[10:30:00] Schema inference: Auto-joined orders.customer_id -&gt; customers.id</div>
              <div>[10:15:22] PII scan completed: 0 sensitive tokens exposed in analytics tables</div>
            </div>
            <button
              onClick={() => setActiveLogsModal(false)}
              className="w-full h-10 rounded-xl bg-surface-container text-on-surface font-semibold text-xs mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Stream Manage Modal */}
      {streamManageItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
              <h3 className="text-sm font-bold text-on-surface">Manage {streamManageItem}</h3>
              <button
                onClick={() => setStreamManageItem(null)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Pipeline status is healthy. Background synchronization runs every 15 minutes.
            </p>
            <div className="flex flex-col gap-2 text-xs pt-1">
              <button
                onClick={() => {
                  setStreamManageItem(null);
                  showToast('Incremental sync triggered successfully!');
                }}
                className="w-full h-10 rounded-xl bg-primary text-on-primary font-semibold"
              >
                Trigger Immediate Sync
              </button>
              <button
                onClick={() => {
                  setStreamManageItem(null);
                  showToast('Schema metadata refreshed.');
                }}
                className="w-full h-10 rounded-xl bg-surface-container text-on-surface font-semibold"
              >
                Refresh Table Schema
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">
            sync_saved_locally
          </span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
