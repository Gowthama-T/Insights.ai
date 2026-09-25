import React, { useState } from 'react';
import { SUGGESTED_INQUIRIES } from '../data/mockData';

interface AiBuilderScreenProps {
  onGenerateAnalytics: (prompt: string) => void;
}

export const AiBuilderScreen: React.FC<AiBuilderScreenProps> = ({
  onGenerateAnalytics,
}) => {
  const [prompt, setPrompt] = useState(
    'Show me how our sales are performing this year, which products are growing fastest, which regions are underperforming, and what factors may be affecting revenue.'
  );
  const [activeDataset, setActiveDataset] = useState('Global Sales & Customer DB (PostgreSQL)');
  const [showDatasetModal, setShowDatasetModal] = useState(false);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [showSyntaxGuide, setShowSyntaxGuide] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isFlashEffect, setIsFlashEffect] = useState(false);

  // Dynamic blueprint preview elements based on query content
  const lower = prompt.toLowerCase();
  const inferredMetrics = [
    'Revenue',
    lower.includes('order') || lower.includes('sales') ? 'Orders' : null,
    lower.includes('aov') || lower.includes('basket') || lower.includes('sales') ? 'AOV' : null,
    lower.includes('margin') || lower.includes('profit') || lower.includes('factor') ? 'Gross Profit Margin %' : null,
    lower.includes('churn') || lower.includes('retention') ? 'Customer Retention %' : null,
  ].filter(Boolean) as string[];

  const inferredDimensions = [
    'Time (Monthly)',
    lower.includes('region') || lower.includes('sales') ? 'Geography (Region)' : null,
    lower.includes('product') || lower.includes('sku') || lower.includes('sales') ? 'Product SKU' : null,
    lower.includes('cohort') || lower.includes('customer') ? 'Customer Tier / Segment' : null,
  ].filter(Boolean) as string[];

  const handleSelectInquiry = (inquiry: (typeof SUGGESTED_INQUIRIES)[0]) => {
    setPrompt(inquiry.prompt);
    setIsFlashEffect(true);
    setTimeout(() => setIsFlashEffect(false), 400);
  };

  const handleTriggerGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onGenerateAnalytics(prompt);
    }, 1100);
  };

  const toggleMic = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setPrompt(
          (prev) =>
            prev + ' Also highlight cross-selling affinity and basket size changes for top enterprise accounts.'
        );
        setIsRecording(false);
      }, 2200);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 gap-4 pb-28 pt-2 animate-in fade-in duration-200">
      {/* Screen Title & Subtitle */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed shrink-0">
            <span className="material-symbols-outlined text-[18px]">neurology</span>
          </span>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">
            What do you want to understand?
          </h1>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Describe your business question in plain English. InsightAI will automatically determine the metrics, dimensions, calculations, and visualizations.
        </p>
      </div>

      {/* Active Dataset Indicator Banner */}
      <div className="flex items-center justify-between gap-2 bg-surface-container-low p-3 rounded-2xl border border-surface-container/60 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative flex shrink-0 items-center justify-center w-8 h-8 rounded-xl bg-surface-container-highest text-primary">
            <span className="material-symbols-outlined text-[18px]">database</span>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-tertiary" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-on-surface font-bold truncate max-w-[190px]">
                {activeDataset}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-surface-container-highest text-primary font-bold rounded-full">
                PostgreSQL
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant truncate">
              420K rows • Synced 10m ago
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowDatasetModal(true)}
          className="shrink-0 inline-flex items-center gap-1 text-primary hover:text-primary-container transition-colors px-2 py-1 rounded-lg hover:bg-surface-container-high active:scale-95 text-xs font-semibold"
          type="button"
        >
          <span>Change</span>
          <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
        </button>
      </div>

      {/* Natural Language Prompt Area */}
      <div
        className={`flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border p-4 gap-3 relative transition-all duration-300 ${
          isFlashEffect ? 'border-secondary ring-2 ring-secondary/20 bg-secondary-fixed/10' : 'border-surface-container/60'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px] animate-pulse">
              auto_awesome
            </span>
            <span className="text-xs text-secondary font-bold uppercase tracking-wider">
              Natural Language Intent
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs text-on-surface font-semibold">
              {prompt.length}
            </span>
            <span className="text-xs text-outline">/ 500</span>
          </div>
        </div>

        {/* Textarea */}
        <div className="relative w-full">
          <textarea
            className="w-full bg-surface-container-low rounded-xl p-3 text-xs leading-relaxed text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/40 resize-none transition-all"
            maxLength={500}
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Compare regional revenue trajectories against our operating budget for last quarter..."
          />
        </div>

        {/* Action Toolbar Inside Prompt Box */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1">
            {/* Mic Dictation */}
            <button
              onClick={toggleMic}
              aria-label="Voice dictation"
              className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all ${
                isRecording
                  ? 'bg-error-container text-error animate-pulse'
                  : 'hover:bg-surface-container text-on-surface-variant'
              }`}
              type="button"
              title="Voice memo to query"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
            </button>

            {/* Attach Schema */}
            <button
              onClick={() => {
                setPrompt(
                  (prev) =>
                    prev + ' [Attached schema table: orders.total_amount, customers.region_id]'
                );
              }}
              aria-label="Attach schema column or context"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container text-on-surface-variant transition-colors"
              type="button"
              title="Attach schema column"
            >
              <span className="material-symbols-outlined text-[20px]">table_chart_view</span>
            </button>

            {/* Clear button */}
            <button
              onClick={() => setPrompt('')}
              aria-label="Clear input"
              className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-error transition-colors"
              type="button"
              title="Clear input"
            >
              <span className="material-symbols-outlined text-[20px]">backspace</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-tertiary bg-tertiary-container/10 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
            <span>Parser Ready</span>
          </div>
        </div>

        {/* Primary & Secondary CTA Block */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            onClick={handleTriggerGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-container via-secondary to-secondary-container text-on-primary text-sm font-semibold shadow-md active:scale-[0.98] transition-all hover:brightness-105 disabled:opacity-50 cursor-pointer"
            type="button"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isGenerating ? 'animate-spin' : ''
              }`}
            >
              {isGenerating ? 'progress_activity' : 'spark'}
            </span>
            <span>
              {isGenerating ? 'Synthesizing Analytics Model...' : 'Generate Analytics'}
            </span>
          </button>

          <button
            onClick={() => setShowAdvancedConfig(true)}
            className="w-full h-10 flex items-center justify-center gap-1.5 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high active:scale-[0.99] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Advanced Configuration & Filters</span>
          </button>
        </div>
      </div>

      {/* Real-time AI Blueprint Preview */}
      <div className="flex flex-col bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container/60 p-4 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-md bg-secondary-fixed text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[16px]">account_tree</span>
            </div>
            <span className="text-xs text-on-surface font-bold uppercase tracking-wider">
              AI Blueprint Preview
            </span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary-fixed-dim/30 text-secondary font-semibold">
            Live Parsing
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {/* Inferred Metrics */}
          <div className="flex flex-col bg-surface-container-low p-3 rounded-xl gap-1.5">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Inferred Metrics
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {inferredMetrics.map((m, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-1 rounded-full bg-surface-container-highest text-primary font-semibold shadow-xs"
                >
                  <span>{m}</span>
                  <span className="material-symbols-outlined text-[12px]">done</span>
                </span>
              ))}
            </div>
          </div>

          {/* Inferred Dimensions */}
          <div className="flex flex-col bg-surface-container-low p-3 rounded-xl gap-1.5">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-secondary">category</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Inferred Dimensions
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {inferredDimensions.map((d, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-medium"
                >
                  <span className="material-symbols-outlined text-[14px] text-secondary">
                    {d.includes('Time') ? 'schedule' : d.includes('Geo') ? 'public' : 'inventory_2'}
                  </span>
                  <span>{d}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Visualizations */}
          <div className="flex flex-col bg-surface-container-low p-3 rounded-xl gap-1.5">
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-tertiary">
                dashboard_customize
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Recommended Visualizations
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-lowest text-center gap-1 border border-surface-container/60 shadow-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
                <span className="text-[11px] font-semibold text-on-surface leading-tight">
                  Multi-line Trend
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-lowest text-center gap-1 border border-surface-container/60 shadow-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">bar_chart</span>
                <span className="text-[11px] font-semibold text-on-surface leading-tight">
                  Regional Bars
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container-lowest text-center gap-1 border border-surface-container/60 shadow-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  grid_goldenratio
                </span>
                <span className="text-[11px] font-semibold text-on-surface leading-tight">
                  Risk Matrix
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Inquiries Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            lightbulb
          </span>
          <h2 className="text-sm font-bold text-on-surface">Suggested Inquiries</h2>
        </div>
        <span className="text-[11px] text-on-surface-variant">Tap to populate</span>
      </div>

      {/* Suggested Inquiries List */}
      <div className="grid grid-cols-1 gap-2.5">
        {SUGGESTED_INQUIRIES.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelectInquiry(item)}
            className="w-full text-left p-3 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-high transition-all shadow-xs border border-surface-container/60 active:scale-[0.99] flex items-start gap-3 group cursor-pointer"
            type="button"
          >
            <div
              className={`flex shrink-0 items-center justify-center w-8 h-8 rounded-xl ${item.iconBg} shadow-xs group-hover:scale-105 transition-transform`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-on-surface leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </span>
              <span className="text-[11px] text-on-surface-variant truncate mt-0.5">
                {item.subtitle}
              </span>
            </div>
            <span className="material-symbols-outlined text-outline-variant group-hover:text-primary text-[18px] shrink-0 ml-auto self-center transition-colors">
              north_east
            </span>
          </button>
        ))}
      </div>

      {/* Security & Syntax Guide Footer */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low border border-surface-container/60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            security
          </span>
          <span className="text-[11px] text-on-surface-variant font-medium">
            Read-only schema access • Enterprise SOC2
          </span>
        </div>
        <button
          onClick={() => setShowSyntaxGuide(true)}
          className="text-xs font-semibold text-primary hover:underline"
          type="button"
        >
          Syntax Guide
        </button>
      </div>

      {/* Modal: Change Active Dataset */}
      {showDatasetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">Select Data Source</h3>
              <button
                onClick={() => setShowDatasetModal(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <p className="text-xs text-on-surface-variant">
              Switch the semantic query context across your connected enterprise repositories:
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              {[
                { name: 'Global Sales & Customer DB (PostgreSQL)', rows: '420K rows' },
                { name: 'Snowflake Enterprise Warehouse (PROD_FINANCE)', rows: '840K rows' },
                { name: 'BigQuery Retail Aggregations (GCP-Prod)', rows: '1.2M rows' },
                { name: 'Q3 Financial Actuals.xlsx (Internal Excel)', rows: '18K rows' },
              ].map((ds) => (
                <button
                  key={ds.name}
                  onClick={() => {
                    setActiveDataset(ds.name);
                    setShowDatasetModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between transition-colors ${
                    activeDataset === ds.name
                      ? 'bg-primary-fixed/40 border-primary text-primary font-bold'
                      : 'border-surface-container hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="truncate">{ds.name}</span>
                    <span className="text-[10px] text-on-surface-variant">{ds.rows}</span>
                  </div>
                  {activeDataset === ds.name && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Advanced Configuration & Filters */}
      {showAdvancedConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
              <h3 className="text-sm font-bold text-on-surface">Advanced Model Settings</h3>
              <button
                onClick={() => setShowAdvancedConfig(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Aggregation Time Grain</label>
                <select className="h-9 px-2 rounded-lg bg-surface-container-low text-on-surface border border-surface-container font-medium">
                  <option>Monthly (Default)</option>
                  <option>Weekly (High-Resolution)</option>
                  <option>Quarterly (Executive)</option>
                  <option>Daily Anomaly Scan</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-on-surface">Statistical Outlier Sensitivity</label>
                <input type="range" min="1" max="5" defaultValue="3" className="accent-primary" />
                <div className="flex justify-between text-[10px] text-outline">
                  <span>Conservative (2σ)</span>
                  <span>Balanced (3σ)</span>
                  <span>Sensitive (1.5σ)</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
                <span>Filter Test Accounts & PII</span>
                <input type="checkbox" defaultChecked className="accent-primary" />
              </div>
            </div>
            <button
              onClick={() => setShowAdvancedConfig(false)}
              className="mt-2 w-full h-10 rounded-xl bg-primary text-on-primary font-semibold text-xs active:scale-95"
            >
              Apply Parameters
            </button>
          </div>
        </div>
      )}

      {/* Modal: Syntax Guide */}
      {showSyntaxGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
              <h3 className="text-sm font-bold text-on-surface">Natural Language Query Tips</h3>
              <button
                onClick={() => setShowSyntaxGuide(false)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-2.5 text-xs text-on-surface-variant">
              <div>
                <strong className="text-on-surface block">1. Regional & Temporal Comparison:</strong>
                "Compare Q2 revenue against Q3 across South and East."
              </div>
              <div>
                <strong className="text-on-surface block">2. Anomaly Inquiries:</strong>
                "Find unusual dips in margins for electronics above 10 Lakhs."
              </div>
              <div>
                <strong className="text-on-surface block">3. Cohort & Churn Diagnostics:</strong>
                "Which distributor accounts reduced order frequency by &gt; 15%?"
              </div>
            </div>
            <button
              onClick={() => setShowSyntaxGuide(false)}
              className="w-full h-10 rounded-xl bg-surface-container text-on-surface font-semibold text-xs mt-1"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
