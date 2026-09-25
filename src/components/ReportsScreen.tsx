import React, { useState } from 'react';

export const ReportsScreen: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<{ title: string; date: string; content: string } | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const reports = [
    {
      id: 'rep-1',
      title: 'Q3 Board of Directors Executive Briefing',
      date: 'Published yesterday • 14 slides',
      category: 'Executive Decks',
      format: 'PDF • PPTX',
      summary: 'Consolidated performance overview, regional revenue trajectory, and EBITDA variance analysis.',
      badge: 'Board Ready',
      badgeColor: 'bg-primary-fixed text-primary',
    },
    {
      id: 'rep-2',
      title: 'Weekly Anomaly & Variance Digest #38',
      date: 'Generated Sep 24, 2026 • Automated',
      category: 'Anomaly Audits',
      format: 'PDF',
      summary: 'East region margin compression breakdown, distributor rebate overages, and inventory stockout risks.',
      badge: 'Action Required',
      badgeColor: 'bg-error-container text-on-error-container',
    },
    {
      id: 'rep-3',
      title: 'Customer Retention & Cohort LTV Report',
      date: 'Generated Sep 20, 2026',
      category: 'Customer Intelligence',
      format: 'XLSX • CSV',
      summary: '12-month cohort retention curves across Enterprise, Mid-Market, and Inbound accounts.',
      badge: '92% Ret. Rate',
      badgeColor: 'bg-tertiary-fixed text-on-tertiary-fixed',
    },
    {
      id: 'rep-4',
      title: 'Regional Pacing & Quota Attainment Audit',
      date: 'Generated Sep 18, 2026',
      category: 'Sales Operations',
      format: 'PDF • XLSX',
      summary: 'Rep quota attainment by territory pods (South, North, West, East) and Q4 pacing run-rates.',
      badge: 'Operations',
      badgeColor: 'bg-secondary-fixed text-on-secondary-fixed',
    },
  ];

  const handleDownload = (id: string, title: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      const text = `InsightAI Enterprise Analytics Report\nTitle: ${title}\nGenerated on: ${new Date().toLocaleString()}\nSecurity: SOC-2 Type II Certified Data Envelope\n\nExecutive Summary: Operational revenue reached ₹12.8 Cr (+14.6% vs target) with South territory driving 35% of total volume.`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_')}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  const filteredReports = reports.filter((r) =>
    r.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 gap-4 pb-28 pt-2 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-primary shrink-0">
            <span className="material-symbols-outlined text-[18px]">description</span>
          </span>
          <h1 className="text-xl font-bold text-on-surface tracking-tight">
            Executive Reports & Decks
          </h1>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Autonomous weekly digests, board presentations, and verifiable compliance exports.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative w-full">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
          search
        </span>
        <input
          type="text"
          placeholder="Filter decks by title, cohort, or category..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-surface-container-lowest text-xs text-on-surface placeholder:text-outline border border-surface-container/70 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {/* Scheduled Automation Banner */}
      <div className="p-3.5 rounded-2xl bg-surface-container-low border border-surface-container/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">schedule_send</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Weekly Executive Delivery</span>
            <span className="text-[11px] text-on-surface-variant">Scheduled Mondays at 8:00 AM IST</span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
          Active
        </span>
      </div>

      {/* Report List */}
      <div className="flex flex-col gap-2.5">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container/60 shadow-xs flex flex-col gap-2.5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                    {rep.category}
                  </span>
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${rep.badgeColor}`}>
                    {rep.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-on-surface mt-1 leading-snug">
                  {rep.title}
                </h3>
                <span className="text-[11px] text-on-surface-variant mt-0.5">{rep.date}</span>
              </div>
              <span className="px-2 py-1 rounded-md bg-surface-container text-[10px] font-mono font-semibold text-on-surface shrink-0">
                {rep.format}
              </span>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">{rep.summary}</p>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-surface-container/60">
              <button
                onClick={() =>
                  setPreviewReport({
                    title: rep.title,
                    date: rep.date,
                    content: rep.summary,
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Preview
              </button>
              <button
                onClick={() => handleDownload(rep.id, rep.title)}
                disabled={downloadingId === rep.id}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container active:scale-95 transition-all shadow-xs cursor-pointer"
              >
                <span
                  className={`material-symbols-outlined text-[15px] ${
                    downloadingId === rep.id ? 'animate-spin' : ''
                  }`}
                >
                  {downloadingId === rep.id ? 'progress_activity' : 'download'}
                </span>
                <span>{downloadingId === rep.id ? 'Generating...' : 'Download'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-5 shadow-2xl border border-surface-container flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-surface-container/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
                <h3 className="text-sm font-bold text-on-surface truncate max-w-[240px]">
                  {previewReport.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="w-7 h-7 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="p-3 bg-surface-container-low rounded-xl text-xs leading-relaxed text-on-surface flex flex-col gap-2">
              <span className="text-[10px] uppercase font-bold text-outline">{previewReport.date}</span>
              <p>{previewReport.content}</p>
              <div className="p-2.5 rounded-lg bg-surface-container border border-surface-container-high mt-1 text-[11px]">
                <strong>Key Findings:</strong> South expansion surged +28% YoY while East electronics dropped 7.8%. Inventory rebalancing recommended for next fiscal cycle.
              </div>
            </div>
            <button
              onClick={() => setPreviewReport(null)}
              className="w-full h-10 rounded-xl bg-primary text-on-primary text-xs font-semibold"
            >
              Done Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
