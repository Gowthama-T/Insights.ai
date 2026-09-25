import React, { useState } from 'react';
import { INITIAL_METRICS, INITIAL_INSIGHTS } from '../data/mockData';
import { AiInsight } from '../types';

interface OverviewScreenProps {
  onAskCopilot: (promptText: string) => void;
  onOpenDeckModal: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onAskCopilot,
  onOpenDeckModal,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState<'Q3' | 'Q2' | 'Q1'>('Q3');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Regions');
  const [selectedTier, setSelectedTier] = useState<string>('Enterprise Tier');
  const [isSortedAsc, setIsSortedAsc] = useState<boolean>(false);
  const [investigatingInsight, setInvestigatingInsight] = useState<AiInsight | null>(null);
  const [showQuarterMenu, setShowQuarterMenu] = useState(false);
  const [showRegionMenu, setShowRegionMenu] = useState(false);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<string | null>(null);

  // Regional data with sorting
  const regionalData = [
    { name: 'South Region', value: '₹4.5 Cr', share: '35%', width: 82, color: 'bg-primary', raw: 4.5, trend: '+28% YoY' },
    { name: 'North Region', value: '₹3.8 Cr', share: '30%', width: 70, color: 'bg-primary-container', raw: 3.8, trend: '+12% YoY' },
    { name: 'West Region', value: '₹2.4 Cr', share: '19%', width: 44, color: 'bg-primary-fixed-dim', raw: 2.4, trend: '+5% YoY' },
    { name: 'East Region', value: '₹2.1 Cr', share: '16% ↓', width: 38, color: 'bg-error-container', raw: 2.1, trend: '-7.8% YoY', alert: true },
  ];

  const sortedRegions = [...regionalData].sort((a, b) =>
    isSortedAsc ? a.raw - b.raw : b.raw - a.raw
  );

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 gap-4 pb-28 pt-2 animate-in fade-in duration-200">
      {/* Top Executive Context Header */}
      <div className="flex flex-col gap-1 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-primary font-bold tracking-wider uppercase">
            Strategic Oversight
          </span>
          <div className="flex items-center gap-1.5 bg-surface-container px-2.5 py-0.5 rounded-full text-on-surface-variant text-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="font-medium text-[11px]">Live Sync Active</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">
          Sales Performance
        </h1>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          AI-generated analysis based on your connected enterprise sales data.
        </p>
      </div>

      {/* Interactive Filter Controls */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {/* Quarter Filter */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowQuarterMenu(!showQuarterMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            <span>This Quarter ({selectedQuarter})</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          {showQuarterMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowQuarterMenu(false)} />
              <div className="absolute top-full left-0 mt-1 w-36 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container p-1 z-30">
                {(['Q3', 'Q2', 'Q1'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setSelectedQuarter(q);
                      setShowQuarterMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedQuarter === q ? 'bg-primary-fixed text-primary font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    Fiscal {q} 2026
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Region Filter */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowRegionMenu(!showRegionMenu)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest transition-colors"
          >
            <span>{selectedRegion}</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
          </button>
          {showRegionMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowRegionMenu(false)} />
              <div className="absolute top-full left-0 mt-1 w-40 bg-surface-container-lowest rounded-xl shadow-lg border border-surface-container p-1 z-30">
                {['All Regions', 'South Region', 'North Region', 'West Region', 'East Region'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setSelectedRegion(r);
                      setShowRegionMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedRegion === r ? 'bg-primary-fixed text-primary font-bold' : 'hover:bg-surface-container'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Tier Filter */}
        <button
          onClick={() => {
            const tiers = ['Enterprise Tier', 'Mid-Market Tier', 'All Tiers'];
            const next = tiers[(tiers.indexOf(selectedTier) + 1) % tiers.length];
            setSelectedTier(next);
          }}
          className="flex items-center shrink-0 px-3 py-1.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest transition-colors active:scale-95"
        >
          <span>{selectedTier}</span>
        </button>

        {/* Ask AI shortcut */}
        <button
          onClick={() => onAskCopilot('Explain the key drivers behind our Q3 revenue variance and forecasts.')}
          className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold shadow-sm hover:brightness-105 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[15px] text-secondary">auto_awesome</span>
          <span>Ask AI</span>
        </button>
      </div>

      {/* Section 1: Executive Decision Summary Banner */}
      <div className="flex flex-col bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container/60 gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-xs">
              <span className="material-symbols-outlined text-[18px]">psychology</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">Executive Brief</h2>
              <p className="text-[11px] text-on-surface-variant">What should leadership focus on now?</p>
            </div>
          </div>
          <span className="text-[11px] text-secondary font-semibold bg-secondary-fixed/50 px-2 py-0.5 rounded-full">
            AI Synthesis
          </span>
        </div>

        {/* 3 Structured Micro-Cards */}
        <div className="grid grid-cols-1 gap-2 pt-1">
          {/* What Happened */}
          <div className="flex gap-3 bg-surface-container-low p-3 rounded-xl border border-surface-container/40">
            <div className="w-6 h-6 rounded-lg bg-primary-fixed flex items-center justify-center text-primary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[15px]">show_chart</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                What happened?
              </span>
              <p className="text-xs text-on-surface mt-0.5 leading-relaxed">
                Revenue reached <strong className="text-on-surface font-bold">₹12.8 Cr</strong>{' '}
                <span className="text-tertiary font-semibold bg-tertiary-fixed/60 px-1 py-0.2 rounded text-[11px]">
                  (+14.6% vs target)
                </span>.
              </p>
            </div>
          </div>

          {/* Why Did It Happen */}
          <div className="flex gap-3 bg-surface-container-low p-3 rounded-xl border border-surface-container/40">
            <div className="w-6 h-6 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[15px]">insights</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-secondary">
                Why did it happen?
              </span>
              <p className="text-xs text-on-surface mt-0.5 leading-relaxed">
                South region surged <strong className="text-on-surface font-bold">+28%</strong> in volume coupled with high contract renewal rates.
              </p>
            </div>
          </div>

          {/* What Should We Do */}
          <div className="flex gap-3 bg-surface-container-low p-3 rounded-xl border border-surface-container/40">
            <div className="w-6 h-6 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[15px]">forward_to_inbox</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-tertiary">
                Recommended Action
              </span>
              <p className="text-xs text-on-surface mt-0.5 leading-relaxed">
                Address East electronics slowdown <span className="text-error font-semibold">(-7.8%)</span> and reallocate high-margin inventory to South hub.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: High-Density Executive KPI Cards (2-Column Grid) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
            Key Core Metrics
          </h3>
          <span className="text-[11px] text-on-surface-variant">Real-time normalized</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {INITIAL_METRICS.map((kpi, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-surface-container-lowest p-3 rounded-2xl shadow-xs border border-surface-container/60 justify-between min-h-[114px] hover:border-primary/30 transition-all cursor-pointer group"
              onClick={() => onAskCopilot(`Provide a detailed diagnostic breakdown for ${kpi.title} (${kpi.value}).`)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant font-medium group-hover:text-primary transition-colors">
                  {kpi.title}
                </span>
                {kpi.badge ? (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      kpi.badgeType === 'tertiary'
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    {kpi.badge}
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[14px] text-outline-variant group-hover:text-primary transition-colors">
                    info
                  </span>
                )}
              </div>

              <div className="my-1">
                <div className="text-xl font-bold text-on-surface tracking-tight">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span
                    className={`text-xs font-semibold flex items-center ${
                      kpi.changeType === 'down' ? 'text-error' : 'text-tertiary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px] mr-0.5">
                      {kpi.changeType === 'down' ? 'trending_down' : 'trending_up'}
                    </span>
                    {kpi.change}
                  </span>
                  <span className="text-[11px] text-outline">{kpi.subtitle}</span>
                </div>
              </div>

              {/* Sparkline or progress bar */}
              {kpi.sparklineType === 'area' && (
                <svg className="w-full h-5 text-tertiary" fill="none" viewBox="0 0 100 20">
                  <path
                    d="M0 16 Q 15 14, 25 10 T 50 12 T 75 5 T 100 2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
              {kpi.sparklineType === 'line' && (
                <svg className="w-full h-5 text-primary" fill="none" viewBox="0 0 100 20">
                  <path
                    d="M0 15 L 20 12 L 40 14 L 60 8 L 80 11 L 100 4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
              )}
              {kpi.barProgress && (
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`${kpi.title.includes('Gross') ? 'bg-tertiary' : 'bg-primary'} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${kpi.barProgress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Visual Data Analytics (SVG Charts) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-on-surface-variant font-bold">
            Analytical Breakdown
          </h3>
          <button
            onClick={onOpenDeckModal}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Export Deck</span>
            <span className="material-symbols-outlined text-[14px]">file_download</span>
          </button>
        </div>

        {/* Chart 1: Revenue Trend Line Chart */}
        <div className="flex flex-col bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container/60 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface">Revenue Trend</h4>
              <p className="text-[11px] text-on-surface-variant">Current Year (CY) vs Previous Year (PY)</p>
            </div>
            <button
              onClick={() => onAskCopilot('Analyze the Revenue Trend divergence between CY (₹12.8 Cr) and PY (₹11.1 Cr).')}
              className="flex items-center gap-1 bg-secondary-fixed/60 text-secondary px-2.5 py-1 rounded-full text-xs font-semibold hover:bg-secondary-fixed transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              <span>Ask AI</span>
            </button>
          </div>

          {/* Interactive SVG Chart */}
          <div className="relative w-full h-44 pt-2">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 320 130">
              <defs>
                <linearGradient id="gradRevenueCY" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#004ac6" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#004ac6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line stroke="#dae2fd" strokeDasharray="2 3" strokeWidth="1" x1="10" x2="310" y1="20" y2="20" />
              <line stroke="#dae2fd" strokeDasharray="2 3" strokeWidth="1" x1="10" x2="310" y1="55" y2="55" />
              <line stroke="#dae2fd" strokeDasharray="2 3" strokeWidth="1" x1="10" x2="310" y1="90" y2="90" />

              {/* Previous Year (Dashed Gray) */}
              <path
                d="M 20 85 C 60 78, 100 80, 140 68 C 180 62, 220 55, 260 50 L 300 48"
                fill="none"
                stroke="#737686"
                strokeDasharray="3 3"
                strokeWidth="1.8"
              />

              {/* Current Year Area & Line (Solid Primary Blue) */}
              <path
                d="M 20 75 C 60 60, 100 65, 140 45 C 180 30, 220 25, 260 18 L 300 12 L 300 110 L 20 110 Z"
                fill="url(#gradRevenueCY)"
              />
              <path
                d="M 20 75 C 60 60, 100 65, 140 45 C 180 30, 220 25, 260 18 L 300 12"
                fill="none"
                stroke="#004ac6"
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* Interactive Highlight Points */}
              <circle
                cx="140"
                cy="45"
                fill="#ffffff"
                r="4.5"
                stroke="#004ac6"
                strokeWidth="2.5"
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={() => setHoveredDataPoint('Jul: ₹10.4 Cr (Target Met)')}
                onMouseLeave={() => setHoveredDataPoint(null)}
              />
              <circle
                cx="300"
                cy="12"
                fill="#004ac6"
                r="5"
                stroke="#ffffff"
                strokeWidth="2.5"
                className="cursor-pointer transition-transform hover:scale-125 animate-pulse"
                onMouseEnter={() => setHoveredDataPoint('Oct: ₹12.8 Cr (+14.6% vs prev)')}
                onMouseLeave={() => setHoveredDataPoint(null)}
              />
            </svg>

            {/* Hover Tooltip display */}
            {hoveredDataPoint && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[11px] px-2.5 py-1 rounded-lg shadow-md font-semibold z-10 pointer-events-none">
                {hoveredDataPoint}
              </div>
            )}

            {/* X Axis labels */}
            <div className="flex justify-between text-on-surface-variant text-xs pt-1 px-2 font-medium">
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-1 border-t border-surface-container/60">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-primary rounded-full" />
              <span className="text-xs text-on-surface font-semibold">CY: ₹12.8 Cr</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-outline rounded-full" />
              <span className="text-xs text-on-surface-variant font-medium">PY: ₹11.1 Cr</span>
            </div>
          </div>
        </div>

        {/* Chart 2: Regional Contribution (Horizontal Bar Chart) */}
        <div className="flex flex-col bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container/60 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface">Regional Contribution</h4>
              <p className="text-[11px] text-on-surface-variant">Breakdown across territory pods</p>
            </div>
            <button
              onClick={() => setIsSortedAsc(!isSortedAsc)}
              className="flex items-center gap-1 bg-surface-container-high text-on-surface px-2.5 py-1 rounded-md text-xs font-semibold hover:bg-surface-container-highest active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">swap_vert</span>
              <span>{isSortedAsc ? 'Ascending' : 'Sorted'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-2.5 pt-1">
            {sortedRegions.map((region) => (
              <div
                key={region.name}
                className="flex flex-col gap-1 cursor-pointer group"
                onClick={() => onAskCopilot(`Explain performance factors and anomalies for ${region.name}.`)}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-on-surface group-hover:text-primary transition-colors">
                    {region.name}
                  </span>
                  <span className="font-bold text-on-surface">
                    {region.value}{' '}
                    <span
                      className={`text-xs font-semibold ${
                        region.alert ? 'text-error' : 'text-tertiary'
                      }`}
                    >
                      ({region.share})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${region.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${region.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Customer Segments Donut Chart */}
        <div className="flex flex-col bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container/60 gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-on-surface">Customer Segments</h4>
              <p className="text-[11px] text-on-surface-variant">Volume Share Distribution</p>
            </div>
            <span className="text-xs text-on-surface-variant font-medium">Q3 Cohort</span>
          </div>

          <div className="flex items-center gap-4 pt-1">
            {/* Donut SVG */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" fill="transparent" r="14" stroke="#eaedff" strokeWidth="4.5" />
                {/* Enterprise 42% */}
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#004ac6"
                  strokeDasharray="37 100"
                  strokeDashoffset="0"
                  strokeWidth="4.5"
                />
                {/* Mid-Market 28% */}
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#6b38d4"
                  strokeDasharray="24.6 100"
                  strokeDashoffset="-37"
                  strokeWidth="4.5"
                />
                {/* SMB 20% */}
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#007d55"
                  strokeDasharray="17.6 100"
                  strokeDashoffset="-61.6"
                  strokeWidth="4.5"
                />
                {/* New Inbounds 10% */}
                <circle
                  cx="18"
                  cy="18"
                  fill="transparent"
                  r="14"
                  stroke="#dbe1ff"
                  strokeDasharray="8.8 100"
                  strokeDashoffset="-79.2"
                  strokeWidth="4.5"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-on-surface leading-none">42%</span>
                <span className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">Top Tier</span>
              </div>
            </div>

            {/* Legend Table */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="truncate text-on-surface font-medium">Enterprise</span>
                </span>
                <span className="font-bold text-on-surface">42%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                  <span className="truncate text-on-surface font-medium">Mid-Market</span>
                </span>
                <span className="font-bold text-on-surface">28%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-tertiary-container shrink-0" />
                  <span className="truncate text-on-surface font-medium">SMB</span>
                </span>
                <span className="font-bold text-on-surface">20%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full bg-primary-fixed shrink-0" />
                  <span className="truncate text-on-surface font-medium">New Inbounds</span>
                </span>
                <span className="font-bold text-on-surface">10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 4: Sales Conversion Funnel */}
        <div className="flex flex-col bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container/60 gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-on-surface">Sales Conversion Funnel</h4>
            <span className="text-xs text-tertiary font-bold bg-tertiary-fixed px-2 py-0.5 rounded-full">
              6.0% Overall Conv.
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            {[
              { stage: '1. Leads', count: '120,000', pct: '100%', fill: 'w-full bg-primary/20' },
              { stage: '2. Qualified', count: '48,000', pct: '40%', fill: 'w-[40%] bg-primary/35' },
              { stage: '3. Opportunities', count: '18,000', pct: '15%', fill: 'w-[15%] bg-primary/55' },
              { stage: '4. Orders', count: '8,400', pct: '7%', fill: 'w-[8%] bg-primary/75' },
              { stage: '5. Closed Deals', count: '7,200', pct: '6.0%', fill: 'w-[6%] bg-primary', bold: true },
            ].map((f, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-xs">
                <span className={`w-28 text-on-surface-variant shrink-0 truncate ${f.bold ? 'font-bold text-on-surface' : ''}`}>
                  {f.stage}
                </span>
                <div className="flex-1 bg-surface-container-high h-6 rounded-lg overflow-hidden relative flex items-center px-2">
                  <div className={`absolute left-0 top-0 bottom-0 ${f.fill} rounded-lg`} />
                  <span className="relative text-xs font-bold text-on-surface">{f.count}</span>
                </div>
                <span className={`w-10 text-right ${f.bold ? 'text-primary font-bold' : 'text-outline font-medium'}`}>
                  {f.pct}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: AI Business Insights */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
            <h3 className="text-base font-bold text-on-surface">AI Business Insights</h3>
          </div>
          <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Generated 4 mins ago
          </span>
        </div>

        {INITIAL_INSIGHTS.map((insight) => (
          <div
            key={insight.id}
            className="flex flex-col bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-surface-container/60 gap-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    insight.type === 'growth'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : 'bg-error-container text-on-error-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {insight.type === 'growth' ? 'trending_up' : 'warning'}
                  </span>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{insight.title}</h4>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide ${
                      insight.type === 'growth' ? 'text-tertiary' : 'text-error'
                    }`}
                  >
                    {insight.tag}
                  </span>
                </div>
              </div>
              <span className={`${insight.badgeColor} px-2 py-0.5 rounded-md text-xs font-bold`}>
                {insight.badge}
              </span>
            </div>

            <p className="text-xs text-on-surface leading-relaxed">{insight.description}</p>

            <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded-xl text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface-variant uppercase">{insight.supportingMetricLabel}</span>
                <span className="font-bold text-on-surface">{insight.supportingMetricValue}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-on-surface-variant uppercase">{insight.actionLabel}</span>
                <span className="font-bold text-primary">{insight.actionTarget}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-surface-container/50">
              <button
                onClick={() => setInvestigatingInsight(insight)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors active:scale-95"
              >
                Investigate
              </button>
              <button
                onClick={() => onAskCopilot(insight.copilotPrompt)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-secondary text-on-secondary text-xs font-semibold hover:bg-secondary-container transition-colors shadow-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[15px]">chat_spark</span>
                <span>Ask AI</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investigation Modal / Drawer */}
      {investigatingInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">manage_search</span>
                <h3 className="text-base font-bold text-on-surface">Deep Forensic Investigation</h3>
              </div>
              <button
                onClick={() => setInvestigatingInsight(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs uppercase tracking-wider text-outline font-bold">Investigation Target</span>
                <h4 className="text-sm font-bold text-on-surface mt-0.5">{investigatingInsight.title}</h4>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low text-xs leading-relaxed text-on-surface-variant">
                {investigatingInsight.description}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-outline">Root Cause Correlation</span>
                  <span className="font-bold text-on-surface">94.2% Confidence</span>
                  <span className="text-[11px] text-tertiary">3 primary variables identified</span>
                </div>
                <div className="p-2.5 rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-outline">Action Urgency</span>
                  <span className="font-bold text-error">Within 72 Hours</span>
                  <span className="text-[11px] text-outline">Executive sign-off required</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  const prompt = investigatingInsight.copilotPrompt;
                  setInvestigatingInsight(null);
                  onAskCopilot(prompt);
                }}
                className="flex-1 h-11 rounded-xl bg-primary text-on-primary text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">chat_spark</span>
                <span>Open in Copilot</span>
              </button>
              <button
                onClick={() => setInvestigatingInsight(null)}
                className="px-4 h-11 rounded-xl bg-surface-container text-on-surface-variant text-xs font-semibold hover:bg-surface-container-high transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
