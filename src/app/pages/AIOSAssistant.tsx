import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Bot,
  Heart,
  MapPin,
  Menu,
  Mic,
  Search,
  Send,
  Sparkles,
  Wallet,
  X,
} from 'lucide-react';
import { useAiosApp } from '../state/AiosAppContext';
import type { AssistantCard } from '../types/aios';
import { formatCurrency } from '../lib/formatters';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timeLabel: string;
  cards?: AssistantCard[];
};

const quickPrompts = [
  "Order me a healthy dinner under $15",
  'Plan my day',
  'How is my health today?',
  'Show my budget risk',
  'I feel tired',
];

const recentTopics = [
  'Dinner and movie plan',
  'Weekly health summary',
  'April budget check',
  'Morning routine reset',
];

function getTimeLabel() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AIOSAssistant() {
  const navigate = useNavigate();
  const {
    executeAssistantAction,
    healthScore,
    monthlyIncomeTotal,
    mood,
    profile,
    queryAssistant,
    savings,
    totalExpenses,
  } = useAiosApp();
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'assistant-intro',
      role: 'assistant',
      text: `Hi ${profile.firstName}. I can place nearby orders, manage your routine, review health, and keep your spending in view. Tell me what you want done.`,
      timeLabel: '09:00 AM',
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const pushAssistantReply = async (text: string) => {
    const reply = await queryAssistant(text);
    setMessages((current) => [
      ...current,
      {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply.text,
        timeLabel: getTimeLabel(),
        cards: reply.cards,
      },
    ]);
  };

  const submitPrompt = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
        timeLabel: getTimeLabel(),
      },
    ]);
    setInput('');
    setIsThinking(true);

    window.setTimeout(() => {
      void pushAssistantReply(trimmed).finally(() => {
        setIsThinking(false);
      });
    }, 500);
  };

  const handleCardAction = (card: AssistantCard, action: AssistantCard['action']) => {
    if (!action) {
      return;
    }
    const result = executeAssistantAction(action);
    setMessages((current) => [
      ...current,
      {
        id: `assistant-action-${Date.now()}`,
        role: 'assistant',
        text: result.text,
        timeLabel: getTimeLabel(),
      },
    ]);
    if (result.navigateTo) {
      navigate(result.navigateTo);
    }
  };

  return (
    <div className="flex h-full bg-[#EEF3F8]" style={{ height: 'calc(100vh - 61px)' }}>
      <div
        className={`
          fixed inset-y-0 left-0 z-30 flex w-72 shrink-0 flex-col border-r border-[#14B8A6]/20 bg-white transition-transform duration-300 lg:relative lg:z-auto
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between border-b border-[#14B8A6]/20 p-4">
          <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">
            Conversations
          </h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="rounded-lg p-1.5 transition-colors hover:bg-[#E0F7F3] lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() =>
              setMessages([
                {
                  id: 'assistant-intro-reset',
                  role: 'assistant',
                  text: `Fresh thread started. Tell me what you want to order, plan, or improve today.`,
                  timeLabel: getTimeLabel(),
                },
              ])
            }
            className="flex w-full items-center gap-3 rounded-xl border border-[#14B8A6]/30 bg-[#E0F7F3] p-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#14B8A6]">
              <Sparkles size={14} className="text-[#17202E]" />
            </div>
            <div className="text-left">
              <p style={{ fontSize: '12px', fontWeight: 600 }} className="text-[#17202E]">
                New conversation
              </p>
              <p style={{ fontSize: '10px' }} className="text-[#888]">
                Clear the thread and start fresh
              </p>
            </div>
          </button>
        </div>

        <div className="px-3 pb-3">
          <div className="rounded-2xl bg-[#17202E] p-4 text-white">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-[#14B8A6]" />
              <p style={{ fontSize: '12px', fontWeight: 700 }} className="text-white">
                AIOS Pro
              </p>
            </div>
            <p style={{ fontSize: '11px' }} className="text-white/60">
              Lives across ordering, routine, health, and finance.
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <p style={{ fontSize: '11px' }} className="mb-2 px-1 uppercase tracking-wide text-[#aaa]">
            Recent topics
          </p>
          <div className="space-y-2">
            {recentTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => submitPrompt(topic)}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-[#EEF3F8]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EEF3F8]">
                  <Bot size={14} className="text-[#888]" />
                </div>
                <span style={{ fontSize: '12px' }} className="text-[#444]">
                  {topic}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {showSidebar && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 border-b border-[#14B8A6]/20 bg-white px-4 py-3">
          <button
            onClick={() => setShowSidebar(true)}
            className="rounded-lg p-1.5 transition-colors hover:bg-[#E0F7F3] lg:hidden"
          >
            <Menu size={18} className="text-[#666]" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#17202E]">
            <Sparkles size={16} className="text-[#14B8A6]" />
          </div>
          <div>
            <h2 style={{ fontSize: '15px', fontWeight: 700 }} className="text-[#17202E]">
              AIOS Assistant
            </h2>
            <p style={{ fontSize: '11px' }} className="text-[#888]">
              Personalized across your whole life stack
            </p>
          </div>
          <div className="ml-auto hidden items-center gap-2 rounded-lg bg-[#E0F7F3] px-3 py-1.5 sm:flex">
            <Search size={12} className="text-[#0F766E]" />
            <span style={{ fontSize: '11px', fontWeight: 600 }} className="text-[#0F766E]">
              Live context enabled
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[#14B8A6]/20 bg-white px-4 py-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-[#14B8A6]/20 bg-[#EEF3F8] px-2.5 py-1">
            <MapPin size={11} className="text-[#0F766E]" />
            <span style={{ fontSize: '11px' }} className="text-[#666]">
              {profile.city}, {profile.state}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[#14B8A6]/20 bg-[#EEF3F8] px-2.5 py-1">
            <Heart size={11} className="text-[#F97316]" />
            <span style={{ fontSize: '11px' }} className="text-[#666]">
              Health {healthScore.toFixed(0)}/100
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[#14B8A6]/20 bg-[#EEF3F8] px-2.5 py-1">
            <Wallet size={11} className="text-[#2563EB]" />
            <span style={{ fontSize: '11px' }} className="text-[#666]">
              Saved {formatCurrency(savings)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[#14B8A6]/20 bg-[#EEF3F8] px-2.5 py-1">
            <Sparkles size={11} className="text-[#C77DFF]" />
            <span style={{ fontSize: '11px' }} className="text-[#666]">
              Mood {mood}
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-[#14B8A6]/20 bg-[#EEF3F8] px-2.5 py-1">
            <Wallet size={11} className="text-[#0F766E]" />
            <span style={{ fontSize: '11px' }} className="text-[#666]">
              Income {formatCurrency(monthlyIncomeTotal)} • Expenses {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  message.role === 'assistant' ? 'bg-[#17202E]' : 'bg-[#14B8A6]'
                }`}
              >
                {message.role === 'assistant' ? (
                  <Sparkles size={15} className="text-[#14B8A6]" />
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 700 }} className="text-[#17202E]">
                    {profile.firstName.charAt(0)}
                  </span>
                )}
              </div>

              <div className="max-w-[80%] space-y-2">
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'rounded-tr-sm bg-[#17202E] text-white'
                      : 'rounded-tl-sm border border-[#14B8A6]/20 bg-white text-[#333]'
                  }`}
                >
                  <p style={{ fontSize: '14px', lineHeight: '1.6' }}>{message.text}</p>
                  <p
                    style={{ fontSize: '10px' }}
                    className={`mt-1 ${
                      message.role === 'user' ? 'text-white/40' : 'text-[#bbb]'
                    }`}
                  >
                    {message.timeLabel}
                  </p>
                </div>

                {message.cards?.map((card) => (
                  <div
                    key={card.id}
                    className="rounded-2xl border border-[#14B8A6]/20 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 700 }} className="text-[#17202E]">
                          {card.title}
                        </p>
                        <p style={{ fontSize: '11px' }} className="mt-1 text-[#666]">
                          {card.subtitle}
                        </p>
                      </div>
                      <span
                        style={{ fontSize: '10px', fontWeight: 600 }}
                        className="rounded-full bg-[#EEF3F8] px-2 py-1 text-[#666]"
                      >
                        {card.meta}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {card.action ? (
                        <button
                          onClick={() => handleCardAction(card, card.action)}
                          className="rounded-lg bg-[#17202E] px-3 py-2 text-white transition-colors hover:bg-[#243244]"
                          style={{ fontSize: '12px', fontWeight: 600 }}
                        >
                          {card.action.label}
                        </button>
                      ) : null}
                      {card.secondaryAction ? (
                        <button
                          onClick={() => handleCardAction(card, card.secondaryAction)}
                          className="rounded-lg border border-[#14B8A6]/30 bg-[#EEF3F8] px-3 py-2 text-[#555] transition-colors hover:bg-[#E0F7F3]"
                          style={{ fontSize: '12px', fontWeight: 600 }}
                        >
                          {card.secondaryAction.label}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {isThinking ? (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17202E]">
                <Sparkles size={15} className="text-[#14B8A6]" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-[#14B8A6]/20 bg-white px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-2 w-2 animate-bounce rounded-full bg-[#14B8A6]"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-[#14B8A6]/20 bg-white px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => submitPrompt(prompt)}
                className="whitespace-nowrap rounded-full border border-[#14B8A6]/30 bg-[#EEF3F8] px-3 py-1.5 transition-all hover:border-[#14B8A6] hover:bg-[#E0F7F3]"
                style={{ fontSize: '12px', fontWeight: 500 }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-[#14B8A6]/20 bg-white p-4">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt(input);
            }}
            className="flex items-center gap-3"
          >
            <button
              type="button"
              className="rounded-xl border border-[#14B8A6]/30 bg-[#EEF3F8] p-2.5 text-[#888] transition-colors hover:bg-[#E0F7F3]"
            >
              <Mic size={18} />
            </button>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask AIOS to order, plan, summarize, or optimize..."
              className="flex-1 rounded-xl border border-[#14B8A6]/30 bg-[#EEF3F8] px-4 py-2.5 text-[#17202E] outline-none transition-colors placeholder:text-[#bbb] focus:border-[#14B8A6]"
              style={{ fontSize: '14px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isThinking}
              className="rounded-xl bg-[#17202E] p-2.5 text-[#14B8A6] transition-all hover:bg-[#243244] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
