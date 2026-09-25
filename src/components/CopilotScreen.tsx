import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';
import { ChatMessage } from '../types';
import { useAuth } from '../context/AuthContext';
import { saveUserChatMessage } from '../services/firebase';

interface CopilotScreenProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const CopilotScreen: React.FC<CopilotScreenProps> = ({
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [selectedModel, setSelectedModel] = useState<'GPT-4o Ops' | 'Claude 3.5 Sonnet' | 'Gemini 2.5 Pro'>('GPT-4o Ops');
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [hasAttachedDataset, setHasAttachedDataset] = useState(true);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [sessionId] = useState(`session-${Date.now()}`);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-fill prompt if routed from Overview or AI Builder
  useEffect(() => {
    if (initialPrompt) {
      setInputValue(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 150);
    }
  }, [initialPrompt, onClearInitialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    if (currentUser) {
      saveUserChatMessage(currentUser.uid, sessionId, {
        sender: 'user',
        text: userMsg.text || '',
        timestamp: userMsg.timestamp,
      });
    }

    // Generate intelligent contextual response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiResponse: ChatMessage;

      if (lower.includes('south') || lower.includes('growth') || lower.includes('expand')) {
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnostic: {
            confidence: '99.1%',
            summary:
              'South region expanded +28% YoY (₹4.5 Cr) driven by enterprise multi-year logistics agreements and 92% retention rate. Here is the operational breakdown:',
            factors: [
              {
                title: 'High-Volume Enterprise Renewals',
                description: 'Key accounts in Hyderabad & Bengaluru renewed with 22% expanded seat licenses.',
                icon: 'trending_up',
                color: 'bg-tertiary-fixed text-on-tertiary-fixed',
              },
              {
                title: 'Cross-Sell Velocity Surge',
                description: 'Fulfillment services attach rate reached 44% vs company baseline of 31%.',
                icon: 'shopping_bag',
                color: 'bg-primary-fixed text-primary',
              },
            ],
            chartData: {
              title: 'South Region Category Expansion (Q3)',
              subtitle: 'YoY Growth Rate',
              bars: [
                { label: 'Enterprise Software', value: '+34.2% (+₹1.8 Cr)', percentage: 86, color: 'bg-tertiary' },
                { label: 'Managed Fulfillment', value: '+26.5% (+₹1.4 Cr)', percentage: 68, color: 'bg-tertiary' },
                { label: 'Hardware Solutions', value: '+14.1% (+₹0.8 Cr)', percentage: 42, color: 'bg-primary' },
              ],
            },
            nextSteps: [
              {
                label: 'Deploy 2 additional enterprise account pods to Bangalore hub',
                actionPrompt: 'Draft hiring and resource plan for Bangalore sales pod',
              },
              {
                label: 'Bundle fulfillment SLAs into upcoming Q4 renewal contracts',
                actionPrompt: 'Calculate expected margin impact of fulfillment bundling',
              },
            ],
            followUps: [
              'Compare South vs North margin contributions',
              'Forecast Q4 pipeline based on current run-rate',
              'What accounts are due for contract renewal in November?',
            ],
            generatedTime: '1.2s',
          },
        };
      } else if (lower.includes('risk') || lower.includes('margin') || lower.includes('cogs')) {
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnostic: {
            confidence: '97.5%',
            summary:
              'Gross margin analysis flagged 2 critical margin compressions in wholesale distribution channels totaling ₹1.1 Cr in unbudgeted discounts:',
            factors: [
              {
                title: 'Distributor Rebate Overruns',
                description: 'Uncapped tier-3 volume incentives exceeded modeled ceilings by 180 basis points.',
                icon: 'warning',
                color: 'bg-error-container text-on-error-container',
              },
              {
                title: 'Airfreight Expedited Surcharges',
                description: 'Component transit delays forced air freight reallocation costing ₹38 Lakhs.',
                icon: 'local_shipping',
                color: 'bg-surface-container-highest text-on-surface',
              },
            ],
            chartData: {
              title: 'Margin Leakage Breakdown by Root Factor',
              subtitle: 'Variance to FY Target',
              bars: [
                { label: 'Uncapped Rebates', value: '-1.8% (-₹68L)', percentage: 80, color: 'bg-error' },
                { label: 'Freight Surcharges', value: '-0.9% (-₹38L)', percentage: 46, color: 'bg-error/70' },
                { label: 'FX Currency Drag', value: '-0.2% (-₹8L)', percentage: 14, color: 'bg-outline' },
              ],
            },
            nextSteps: [
              {
                label: 'Implement hard cap authorization rule on distributor discounts > 12%',
                actionPrompt: 'Draft approval workflow policy for distributor discounts',
              },
              {
                label: 'Switch secondary transit from air to regional bonded rail lines',
                actionPrompt: 'Model freight cost savings with regional rail transit',
              },
            ],
            followUps: [
              'Simulate impact of 2% rebate cap',
              'Which distributors triggered overages?',
              'Audit vendor price hikes in Q2',
            ],
            generatedTime: '1.5s',
          },
        };
      } else {
        aiResponse = {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnostic: {
            confidence: '98.8%',
            summary: `Automated diagnostic for: "${text}". Evaluated across 2.4M rows of sales & transactional records:`,
            factors: [
              {
                title: 'Core Volume Correlation',
                description: 'Primary variation stems from mid-market purchasing velocity (+14.2% QoQ).',
                icon: 'insights',
                color: 'bg-primary-fixed text-primary',
              },
              {
                title: 'Seasonal Demand Realignment',
                description: 'Back-to-school promotional campaign lifted enterprise apparel & supplies by 18%.',
                icon: 'campaign',
                color: 'bg-secondary-fixed text-secondary',
              },
            ],
            chartData: {
              title: 'Segment Variance Impact on Operational Revenue',
              subtitle: 'Confidence Interval ±1.2%',
              bars: [
                { label: 'Enterprise Accounts', value: '+14.6% (+₹1.6 Cr)', percentage: 76, color: 'bg-tertiary' },
                { label: 'Mid-Market Hubs', value: '+8.2% (+₹0.9 Cr)', percentage: 44, color: 'bg-tertiary' },
                { label: 'Wholesale Direct', value: '-3.1% (-₹0.3 Cr)', percentage: 22, color: 'bg-error' },
              ],
            },
            nextSteps: [
              {
                label: 'Prioritize top 20 customer accounts for early annual renewals',
                actionPrompt: 'Generate renewal account prioritization list',
              },
              {
                label: 'Sync updated elasticity models to regional pricing desk',
                actionPrompt: 'Export pricing elasticity recommendations',
              },
            ],
            followUps: [
              'Break down by customer tier',
              'Compare East vs South pricing',
              'Simulate 5% discount recovery',
            ],
            generatedTime: '1.3s',
          },
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);

      if (currentUser) {
        saveUserChatMessage(currentUser.uid, sessionId, {
          sender: 'assistant',
          text: aiResponse.diagnostic?.summary || aiResponse.text || '',
          timestamp: aiResponse.timestamp,
        });
      }
    }, 1200);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopyFeedback('Copied analysis to clipboard!');
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const clearChat = () => {
    setMessages([]);
  };

  const exportChat = () => {
    const text = messages
      .map((m) =>
        m.sender === 'user'
          ? `[User - ${m.timestamp}]: ${m.text}`
          : `[Copilot - ${m.timestamp}]: ${m.diagnostic?.summary || m.text}`
      )
      .join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `InsightAI-Copilot-Session-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col w-full max-w-xl mx-auto px-4 pb-28 pt-2 animate-in fade-in duration-200">
      {/* Assistant Context Header Card */}
      <div className="pt-2 pb-2">
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container/60 shadow-xs p-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-on-surface truncate">
                  InsightAI Copilot
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">
                  {selectedModel}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                <span className="text-[11px] text-tertiary font-semibold truncate">
                  Online • Connected to Enterprise Sales Data
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0 relative">
            <button
              onClick={() => setShowModelPicker(!showModelPicker)}
              aria-label="Switch Model"
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
              title="Switch Model"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>

            {showModelPicker && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setShowModelPicker(false)} />
                <div className="absolute top-full right-0 mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container p-1 z-30">
                  <div className="px-2 py-1 text-[10px] uppercase font-bold text-outline">
                    Analytical Reasoning Model
                  </div>
                  {(['GPT-4o Ops', 'Claude 3.5 Sonnet', 'Gemini 2.5 Pro'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelPicker(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        selectedModel === m ? 'bg-primary-fixed text-primary font-bold' : 'hover:bg-surface-container'
                      }`}
                    >
                      <span>{m}</span>
                      {selectedModel === m && (
                        <span className="material-symbols-outlined text-[14px]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              onClick={exportChat}
              aria-label="Export Conversation"
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors"
              title="Export Conversation"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
            </button>

            <button
              onClick={clearChat}
              aria-label="Clear Chat"
              className="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-error flex items-center justify-center transition-colors"
              title="Clear Chat"
            >
              <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Context Prompt Pills */}
      <div className="w-full overflow-x-auto py-1 -mx-4 px-4 no-scrollbar">
        <div className="flex items-center gap-1.5 whitespace-nowrap min-w-max">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">psychology</span>
            Suggested
          </div>
          {[
            'Why did revenue change?',
            'What are my biggest business risks?',
            'Which products should management investigate?',
            'Explain the Customer Retention KPI',
          ].map((promptText) => (
            <button
              key={promptText}
              onClick={() => handleSendMessage(promptText)}
              className="px-3 py-1 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-primary-fixed hover:text-on-primary-fixed shadow-xs border border-surface-container/60 transition-all active:scale-95 cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Copy notification toast */}
      {copyFeedback && (
        <div className="my-1 py-1 px-3 bg-inverse-surface text-inverse-on-surface text-xs rounded-full self-center animate-in fade-in zoom-in-95">
          {copyFeedback}
        </div>
      )}

      {/* Chat Log Conversation Area */}
      <div className="flex flex-col gap-4 py-2">
        {messages.map((msg) => (
          <React.Fragment key={msg.id}>
            {msg.sender === 'user' ? (
              /* Dialogue: User Prompt Bubble */
              <div className="flex justify-end items-end gap-2 pl-8">
                <div className="flex flex-col items-end gap-1 max-w-full">
                  <div className="bg-primary text-on-primary px-4 py-2.5 rounded-2xl rounded-br-xs shadow-xs text-xs sm:text-sm leading-relaxed">
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant text-[11px] pr-1">
                    <span>{msg.timestamp}</span>
                    <span className="material-symbols-outlined text-[13px] text-tertiary">done_all</span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold shrink-0 shadow-xs overflow-hidden">
                  {currentUser?.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-full h-full object-cover" />
                  ) : (
                    <span>{currentUser?.displayName ? currentUser.displayName.slice(0, 2).toUpperCase() : 'JD'}</span>
                  )}
                </div>
              </div>
            ) : (
              /* Dialogue: InsightAI Copilot Rich Response Card */
              <div className="flex items-start gap-2 max-w-full">
                <div className="w-8 h-8 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <span className="material-symbols-outlined text-[18px]">chat_spark</span>
                </div>
                <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                  {/* AI Diagnostic Structured Box */}
                  <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container/60 flex flex-col gap-3">
                    {/* Summary Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-bold tracking-wide uppercase">
                          Diagnostic Analysis
                        </span>
                        <span className="font-mono text-xs text-on-surface-variant font-semibold">
                          Conf. {msg.diagnostic?.confidence || '98.4%'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => copyToClipboard(msg.diagnostic?.summary || msg.text || '')}
                          className="w-7 h-7 rounded-lg hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
                          title="Copy Analysis"
                        >
                          <span className="material-symbols-outlined text-[15px]">content_copy</span>
                        </button>
                        <button
                          onClick={() => toggleBookmark(msg.id)}
                          className={`w-7 h-7 rounded-lg hover:bg-surface-container flex items-center justify-center transition-colors ${
                            bookmarkedIds.includes(msg.id) ? 'text-primary' : 'text-on-surface-variant'
                          }`}
                          title="Bookmark"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            {bookmarkedIds.includes(msg.id) ? 'bookmark_added' : 'bookmark'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Summary Statement */}
                    <p className="text-xs sm:text-sm text-on-surface leading-relaxed">
                      {msg.diagnostic?.summary}
                    </p>

                    {/* Key Diagnostic Factors */}
                    {msg.diagnostic?.factors && (
                      <div className="flex flex-col gap-2">
                        {msg.diagnostic.factors.map((factor, fIdx) => (
                          <div
                            key={fIdx}
                            className="bg-surface-container-low rounded-xl p-3 flex items-start gap-2.5 border border-surface-container/40"
                          >
                            <div
                              className={`w-6 h-6 rounded-lg ${factor.color} flex items-center justify-center shrink-0 mt-0.5`}
                            >
                              <span className="material-symbols-outlined text-[15px]">
                                {factor.icon}
                              </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs text-on-surface font-bold">
                                {factor.title}
                              </span>
                              <span className="text-[11px] text-on-surface-variant mt-0.5 leading-relaxed">
                                {factor.description}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Embedded Mini SVG Chart Card */}
                    {msg.diagnostic?.chartData && (
                      <div className="bg-surface-container rounded-xl p-3 flex flex-col gap-2 border border-surface-container-high">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-primary text-[16px]">
                              bar_chart
                            </span>
                            <span className="text-xs font-bold text-on-surface">
                              {msg.diagnostic.chartData.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant font-medium">
                            {msg.diagnostic.chartData.subtitle}
                          </span>
                        </div>

                        {/* Category Bars */}
                        <div className="flex flex-col gap-2 pt-1">
                          {msg.diagnostic.chartData.bars.map((bar, bIdx) => (
                            <div key={bIdx} className="flex flex-col gap-1">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-on-surface">{bar.label}</span>
                                <span className="font-bold text-on-surface font-mono">{bar.value}</span>
                              </div>
                              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
                                <div
                                  className={`${bar.color} h-full rounded-full transition-all duration-500`}
                                  style={{ width: `${bar.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended Next Steps */}
                    {msg.diagnostic?.nextSteps && (
                      <div className="flex flex-col gap-1.5 pt-0.5">
                        <div className="flex items-center gap-1 text-on-surface">
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            task_alt
                          </span>
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Recommended Next Steps
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {msg.diagnostic.nextSteps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              onClick={() => handleSendMessage(step.actionPrompt)}
                              className="flex items-center justify-between bg-surface-container-low hover:bg-surface-container-high p-2.5 rounded-xl transition-colors cursor-pointer group border border-surface-container/50"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                <span className="text-xs text-on-surface font-medium truncate group-hover:text-primary transition-colors">
                                  {step.label}
                                </span>
                              </div>
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                                arrow_forward
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback and generation latency */}
                    <div className="flex items-center justify-between pt-1 border-t border-surface-container/60 text-on-surface-variant text-xs">
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-[15px]">thumb_up</span>
                          <span>Helpful</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-on-surface transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-[15px]">thumb_down</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-outline">
                        Generated in {msg.diagnostic?.generatedTime || '1.4s'}
                      </span>
                    </div>
                  </div>

                  {/* Suggested follow-up prompt pills */}
                  {msg.diagnostic?.followUps && (
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1 text-on-surface-variant text-[11px] px-1 font-medium">
                        <span className="material-symbols-outlined text-[13px] text-secondary">
                          tips_and_updates
                        </span>
                        <span>Suggested follow-ups</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.diagnostic.followUps.map((fu, fuIdx) => (
                          <button
                            key={fuIdx}
                            onClick={() => handleSendMessage(fu)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-secondary-fixed text-on-surface hover:text-on-secondary-fixed shadow-xs border border-surface-container/60 transition-all text-xs font-medium active:scale-95 text-left cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-secondary text-[14px]">
                              {fuIdx === 0 ? 'pie_chart' : fuIdx === 1 ? 'compare_arrows' : 'tune'}
                            </span>
                            <span>{fu}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-on-surface-variant italic p-2">
            <div className="w-2 h-2 rounded-full bg-secondary animate-ping" />
            <span>InsightAI Copilot is reasoning through 2.4M rows...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Bottom Conversational Input Console Card */}
      <div className="sticky bottom-16 pt-2">
        <div className="bg-surface-container-lowest rounded-2xl shadow-lg border border-surface-container/80 p-2.5 flex flex-col gap-2">
          {/* Attached Data Badge Pill */}
          {hasAttachedDataset && (
            <div className="flex items-center justify-between bg-surface-container px-2.5 py-1 rounded-xl">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="material-symbols-outlined text-[15px] text-primary">database</span>
                <span className="text-xs text-on-surface font-bold truncate">
                  Dataset: East_Q2_Sales_Aggregate.parquet
                </span>
                <span className="font-mono text-[10px] text-on-surface-variant font-semibold">
                  (2.4M rows)
                </span>
              </div>
              <button
                onClick={() => setHasAttachedDataset(false)}
                className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center p-0.5"
                title="Detach dataset"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}

          {!hasAttachedDataset && (
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] text-outline">No dataset attached</span>
              <button
                onClick={() => setHasAttachedDataset(true)}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                + Re-attach Parquet Dataset
              </button>
            </div>
          )}

          {/* Textarea and Control Action Row */}
          <div className="flex items-end gap-1.5">
            <div className="flex items-center gap-0.5 shrink-0 pb-1">
              <button
                onClick={() => {
                  setInputValue((prev) => prev + ' [Attached: orders_fact_table]');
                }}
                aria-label="Attach Data Table"
                className="w-9 h-9 rounded-xl hover:bg-surface-container text-on-surface-variant flex items-center justify-center transition-colors"
                title="Attach table"
              >
                <span className="material-symbols-outlined text-[20px]">table_chart</span>
              </button>

              <button
                onClick={() => {
                  setIsVoiceRecording(!isVoiceRecording);
                  if (!isVoiceRecording) {
                    setTimeout(() => {
                      setInputValue('Why did retail volume fall in electronics category during August?');
                      setIsVoiceRecording(false);
                    }, 2000);
                  }
                }}
                aria-label="Voice Input"
                className={`w-9 h-9 rounded-xl hover:bg-surface-container flex items-center justify-center transition-colors ${
                  isVoiceRecording ? 'text-error animate-pulse bg-error-container' : 'text-on-surface-variant'
                }`}
                title="Voice memo"
              >
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent resize-none text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none py-2 px-1 max-h-24 leading-relaxed"
                placeholder="Ask anything about your metrics, anomalies, or forecasts..."
                rows={1}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              aria-label="Send query"
              className="w-10 h-10 rounded-xl bg-secondary text-on-secondary shadow-[0_2px_10px_rgba(107,56,212,0.35)] hover:bg-secondary-container active:scale-95 flex items-center justify-center transition-all shrink-0 disabled:opacity-40 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
