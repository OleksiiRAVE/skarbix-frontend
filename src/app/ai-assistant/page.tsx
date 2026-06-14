import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Mic, Image, Sparkles, Check, X, Pencil, Loader2,
  User, Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils/format';
import { createTransaction, fetchCategories, sendAIMessage } from '@/lib/mock-api/api';
import { toast } from 'sonner';
import type { AIMessage } from '@/types';

const suggestedPrompts = [
  'I spent 250 UAH on coffee',
  'Add debt from Sasha',
  'Analyze this month',
  'Create a food budget',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([{
    id: 'welcome',
    role: 'assistant',
    content: 'Привет! Я помогу разобрать расходы, бюджеты и долги. Изменения подтверждаешь только ты.',
    timestamp: new Date().toISOString(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [typing, setTyping] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(() => new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: AIMessage = {
      id: `um${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);
    setLoading(true);
    try {
      const response = await sendAIMessage(
        userMsg.content,
        messages.filter((message) => message.id !== 'welcome').map(({ role, content }) => ({ role, content })),
      );
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      const fallback: AIMessage = {
        id: `ai${Date.now()}`,
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Не удалось получить ответ. Попробуй еще раз.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setTyping(false);
      setLoading(false);
    }
  };

  const handleConfirmTransaction = async (message: AIMessage) => {
    if (!message.parsedTransaction || confirmingId) return;
    setConfirmingId(message.id);
    try {
      const categories = await fetchCategories();
      const normalizedCategory = message.parsedTransaction.category.trim().toLocaleLowerCase();
      const category = categories.find((item) => (
        item.kind === message.parsedTransaction?.type
        && item.name.trim().toLocaleLowerCase() === normalizedCategory
      ));
      await createTransaction({
        amount: message.parsedTransaction.amount,
        type: message.parsedTransaction.type,
        category: category?.name || 'Uncategorized',
        categoryId: category?.id || 'uncategorized',
        merchant: message.parsedTransaction.merchant,
        date: message.parsedTransaction.date,
        source: 'ai',
      });
      setConfirmedIds((current) => new Set(current).add(message.id));
      toast.success('Транзакция добавлена');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось добавить транзакцию');
    } finally {
      setConfirmingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    textareaRef.current?.focus();
  };

  const toggleRecording = () => {
    setRecording(!recording);
    if (!recording) {
      setTimeout(() => setRecording(false), 4000);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4 sm:mb-6 flex-shrink-0"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B5CF6]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)]">AI Assistant</h1>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500/100 animate-pulse" />
            <span className="text-[11px] sm:text-xs text-[var(--sk-text-secondary)]">Online</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-3 sm:space-y-4 pr-1 -mr-1 min-h-0">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className={`flex gap-2 sm:gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0 mt-1">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6]" />
              </div>
            )}
            <div className={`max-w-[82%] sm:max-w-[75%] ${msg.role === 'user' ? 'order-1' : ''}`}>
              <div
                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#8B5CF6] text-white rounded-[16px] sm:rounded-[20px] rounded-br-md'
                    : 'bg-[var(--sk-card)] text-[var(--sk-text)] rounded-[16px] sm:rounded-[20px] rounded-tl-md border border-[var(--sk-border)] shadow-sm'
                }`}
              >
                {msg.content}
              </div>

              {/* Parsed Transaction Card */}
              {msg.parsedTransaction && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 bg-[var(--sk-card)] rounded-[12px] sm:rounded-[16px] border border-[var(--sk-border)] p-3 sm:p-4 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6]" />
                    <span className="text-[10px] sm:text-xs font-semibold text-[#8B5CF6] uppercase tracking-wide">Detected Transaction</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-[var(--sk-text-secondary)]">Amount</p>
                      <p className="text-xs sm:text-sm font-semibold text-[var(--sk-text)]">{formatCurrency(msg.parsedTransaction.amount)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-[var(--sk-text-secondary)]">Category</p>
                      <p className="text-xs sm:text-sm font-semibold text-[var(--sk-text)]">{msg.parsedTransaction.category}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-[var(--sk-text-secondary)]">Date</p>
                      <p className="text-xs sm:text-sm font-semibold text-[var(--sk-text)]">{msg.parsedTransaction.date}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-[11px] text-[var(--sk-text-secondary)]">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-[var(--sk-border-light)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#8B5CF6] rounded-full"
                            style={{ width: `${msg.parsedTransaction.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs font-medium text-[var(--sk-text-secondary)]">{Math.round(msg.parsedTransaction.confidence * 100)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:gap-2">
                    <Button
                      size="sm"
                      disabled={confirmingId === msg.id || confirmedIds.has(msg.id)}
                      onClick={() => handleConfirmTransaction(msg)}
                      className="h-7 sm:h-8 bg-green-500/100 hover:bg-green-600 text-white rounded-full text-[10px] sm:text-xs px-2 sm:px-3"
                    >
                      {confirmingId === msg.id
                        ? <Loader2 className="w-3 h-3 mr-0.5 sm:mr-1 animate-spin" />
                        : <Check className="w-3 h-3 mr-0.5 sm:mr-1" />}
                      {confirmedIds.has(msg.id) ? 'Added' : 'Confirm'}
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 sm:h-8 rounded-full text-[10px] sm:text-xs px-2 sm:px-3 border-[var(--sk-border)]">
                      <Pencil className="w-3 h-3 mr-0.5 sm:mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 sm:h-8 rounded-full text-[10px] sm:text-xs px-2 text-[var(--sk-text-secondary)]">
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1 order-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-2 sm:gap-3"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8B5CF6]" />
              </div>
              <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] rounded-tl-md border border-[var(--sk-border)] px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8B5CF6]"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8B5CF6]"
                  />
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8B5CF6]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Suggested Prompts */}
      <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4 mb-2 sm:mb-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => handlePromptClick(prompt)}
            className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-[var(--sk-text-secondary)] bg-[var(--sk-card)] border border-[var(--sk-border)] rounded-full hover:border-[#8B5CF6] hover:text-[#8B5CF6] transition-colors whitespace-nowrap"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-2 sm:p-3 flex-shrink-0">
        <div className="flex items-end gap-1.5 sm:gap-2">
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            <button
              onClick={toggleRecording}
              className={`p-2 sm:p-2.5 rounded-xl transition-all ${
                recording
                  ? 'bg-red-500/10 text-red-500 animate-pulse'
                  : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)]'
              }`}
            >
              <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-2 sm:p-2.5 text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)] rounded-xl transition-colors">
              <Image className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Skarbix AI anything..."
            className="flex-1 min-h-[40px] sm:min-h-[44px] max-h-[100px] sm:max-h-[120px] border-0 bg-transparent resize-none focus-visible:ring-0 text-sm px-2 py-2"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-9 w-9 sm:h-10 sm:w-10 p-0 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl transition-all active:scale-[0.95] disabled:opacity-50 flex-shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
