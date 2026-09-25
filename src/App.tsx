import { useState } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OverviewScreen } from './components/OverviewScreen';
import { AiBuilderScreen } from './components/AiBuilderScreen';
import { CopilotScreen } from './components/CopilotScreen';
import { DataScreen } from './components/DataScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [tenant, setTenant] = useState('Global Retail Corp');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');
  const [deckExportModalOpen, setDeckExportModalOpen] = useState(false);
  const [exportingDeck, setExportingDeck] = useState(false);

  const handleAskCopilot = (promptText: string) => {
    setCopilotInitialPrompt(promptText);
    setActiveTab('copilot');
  };

  const handleGenerateAnalyticsFromBuilder = (promptText: string) => {
    // When generated from AI Builder, route to Copilot or Overview with insight
    setCopilotInitialPrompt(promptText);
    setActiveTab('copilot');
  };

  const handleExportDeck = (format: 'pdf' | 'pptx') => {
    setExportingDeck(true);
    setTimeout(() => {
      setExportingDeck(false);
      setDeckExportModalOpen(false);
      const content = `InsightAI Executive Presentation Deck\nQuarter: Fiscal Q3 2026\nFormat: ${format.toUpperCase()}\nGenerated at: ${new Date().toISOString()}\nOrganization: ${tenant}\nMetrics:\n- Revenue: ₹12.8 Cr (+14.6% vs target)\n- South Region Share: 35% (Surged +28% YoY)\n- East Region Deficit: -₹82L (Action plan required)`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `InsightAI_Sales_Deck_${tenant.replace(/\s+/g, '_')}.${format === 'pdf' ? 'pdf.txt' : 'pptx.txt'}`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Top Header */}
      <Header
        tenant={tenant}
        onTenantChange={setTenant}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={2}
        viewMode={viewMode}
        onToggleViewMode={() =>
          setViewMode(viewMode === 'mobile' ? 'responsive' : 'mobile')
        }
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col w-full pt-16 transition-all duration-300 ${
          viewMode === 'mobile'
            ? 'max-w-[430px] mx-auto min-h-screen border-x border-surface-container/60 shadow-xl bg-surface'
            : 'max-w-4xl mx-auto w-full'
        }`}
      >
        {activeTab === 'overview' && (
          <OverviewScreen
            onAskCopilot={handleAskCopilot}
            onOpenDeckModal={() => setDeckExportModalOpen(true)}
          />
        )}

        {activeTab === 'ai-builder' && (
          <AiBuilderScreen onGenerateAnalytics={handleGenerateAnalyticsFromBuilder} />
        )}

        {activeTab === 'copilot' && (
          <CopilotScreen
            initialPrompt={copilotInitialPrompt}
            onClearInitialPrompt={() => setCopilotInitialPrompt('')}
          />
        )}

        {activeTab === 'data' && <DataScreen />}

        {activeTab === 'reports' && <ReportsScreen />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onAskCopilotQuick={() => {
          setCopilotInitialPrompt('');
          setActiveTab('copilot');
        }}
      />

      {/* Authentication Modal / Screen */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode="signin"
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToInsight={() => {
          setActiveTab('overview');
        }}
      />

      {/* Export Deck Modal */}
      {deckExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  slideshow
                </span>
                <h3 className="text-sm font-bold text-on-surface">Export Executive Deck</h3>
              </div>
              <button
                onClick={() => setDeckExportModalOpen(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Export high-resolution analytical graphs, executive briefs, and regional attribution tables for Board presentation:
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => handleExportDeck('pptx')}
                disabled={exportingDeck}
                className="w-full h-11 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-xs hover:bg-primary-container active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">co_present</span>
                <span>
                  {exportingDeck ? 'Generating Slides...' : 'Export PowerPoint (.pptx)'}
                </span>
              </button>

              <button
                onClick={() => handleExportDeck('pdf')}
                disabled={exportingDeck}
                className="w-full h-11 rounded-xl bg-surface-container text-on-surface text-xs font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                <span>Export Executive Brief (.pdf)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
