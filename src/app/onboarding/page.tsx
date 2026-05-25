import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
  Hexagon, ChevronRight, ChevronLeft, Wallet, CreditCard,
  PiggyBank, Check, Globe, SkipForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const currencies = [
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', flag: '🇺🇦' },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
];

const steps = [
  { id: 'welcome', title: 'Welcome to Skarbix' },
  { id: 'currency', title: 'Choose Currency' },
  { id: 'monobank', title: 'Connect Monobank' },
  { id: 'budget', title: 'Set First Budget' },
  { id: 'done', title: 'All Set!' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [currency, setCurrency] = useState('UAH');
  const [monobankToken, setMonobankToken] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const navigate = useNavigate();

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigate('/');
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-[440px]"
        >
          {/* Progress */}
          <div className="flex gap-2 mb-8 justify-center">
            {steps.map((s, i) => (
              <div
                key={s.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'w-8 bg-[#8B5CF6]' : 'w-4 bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="bg-[var(--sk-card)] rounded-[24px] p-8 shadow-2xl">
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6] flex items-center justify-center mx-auto">
                  <Hexagon className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--sk-text)]">Welcome to Skarbix</h2>
                  <p className="text-[var(--sk-text-secondary)] mt-2 text-[15px] leading-relaxed">
                    Your AI-powered personal finance assistant. Track expenses, manage budgets, and gain financial insights automatically.
                  </p>
                </div>
                <div className="bg-[#8B5CF6]/10 rounded-2xl p-5 text-left space-y-3">
                  {[
                    { icon: Wallet, text: 'Track expenses automatically via Monobank' },
                    { icon: CreditCard, text: 'AI understands natural language inputs' },
                    { icon: PiggyBank, text: 'Smart budgets with intelligent alerts' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/15 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-[#8B5CF6]" />
                      </div>
                      <p className="text-sm text-[var(--sk-text-secondary)]">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Currency */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--sk-text)]">Choose Your Currency</h2>
                  <p className="text-sm text-[var(--sk-text-secondary)] mt-1">Select your primary currency for transactions</p>
                </div>
                <div className="space-y-2">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => setCurrency(c.code)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                        currency === c.code
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'border-[var(--sk-border)] hover:border-[var(--sk-border)] hover:bg-[var(--sk-border-light)]'
                      }`}
                    >
                      <span className="text-2xl">{c.flag}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--sk-text)]">{c.name}</p>
                        <p className="text-xs text-[var(--sk-text-secondary)]">{c.code}</p>
                      </div>
                      {currency === c.code && (
                        <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Monobank */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-bold">M</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--sk-text)]">Connect Monobank</h2>
                  <p className="text-sm text-[var(--sk-text-secondary)] mt-1">Sync your transactions automatically</p>
                </div>

                <div className="bg-[var(--sk-border-light)] rounded-2xl p-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--sk-text-secondary)]">Monobank API Token</label>
                    <Input
                      type="password"
                      placeholder="Enter your token"
                      value={monobankToken}
                      onChange={(e) => setMonobankToken(e.target.value)}
                      className="h-11 rounded-xl border-[var(--sk-border)]"
                    />
                  </div>
                  <p className="text-[11px] text-[var(--sk-text-secondary)] flex items-start gap-1.5">
                    <span className="text-[#8B5CF6] mt-0.5">•</span>
                    Your token is encrypted and never exposed in the browser
                  </p>
                </div>

                <button
                  onClick={goNext}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip for now
                </button>
              </div>
            )}

            {/* Step 3: Budget */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
                    <PiggyBank className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <h2 className="text-xl font-bold text-[var(--sk-text)]">Set Your First Budget</h2>
                  <p className="text-sm text-[var(--sk-text-secondary)] mt-1">Start with a monthly food budget</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[var(--sk-border-light)] rounded-2xl p-5 text-center">
                    <p className="text-xs text-[var(--sk-text-secondary)] mb-2">Monthly Food Budget</p>
                    <div className="relative inline-block">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl text-[var(--sk-text-secondary)]">₴</span>
                      <Input
                        type="number"
                        placeholder="10,000"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        className="h-14 text-3xl font-bold text-center text-[var(--sk-text)] border-0 bg-transparent focus-visible:ring-0 w-40 inline-block pl-6"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {['5000', '8000', '10000', '15000', '20000'].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setBudgetAmount(amt)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          budgetAmount === amt
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[var(--sk-border-light)] text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border)]'
                        }`}
                      >
                        ₴{parseInt(amt).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Done */}
            {step === 4 && (
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto"
                >
                  <Check className="w-10 h-10 text-green-500" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-[var(--sk-text)]">You're All Set!</h2>
                  <p className="text-[var(--sk-text-secondary)] mt-2 text-[15px] leading-relaxed">
                    Skarbix is ready to help you manage your finances. Your dashboard awaits!
                  </p>
                </div>
                <div className="bg-[#8B5CF6]/10 rounded-2xl p-4">
                  <p className="text-sm text-[#8B5CF6] font-medium">Try saying to AI:</p>
                  <p className="text-xs text-[var(--sk-text-secondary)] mt-1 italic">"I spent 450 UAH on taxi today"</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-3 mt-8">
              {step > 0 && !isLast && (
                <Button
                  variant="outline"
                  onClick={goBack}
                  className="h-11 w-11 p-0 rounded-full border-[var(--sk-border)]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
              <Button
                onClick={goNext}
                className={`h-11 rounded-full transition-all active:scale-[0.98] ${
                  isLast
                    ? 'flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white'
                    : 'flex-1 bg-black hover:bg-black/90 text-white'
                }`}
              >
                {isLast ? (
                  <>Go to Dashboard <Check className="w-4 h-4 ml-1.5" /></>
                ) : step === 2 && monobankToken ? (
                  <>Connect <ChevronRight className="w-4 h-4 ml-1.5" /></>
                ) : (
                  <>Continue <ChevronRight className="w-4 h-4 ml-1.5" /></>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
