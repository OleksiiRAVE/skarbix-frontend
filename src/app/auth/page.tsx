import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Hexagon,
  Loader2,
  Lock,
  Mail,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';

type AuthMode = 'login' | 'register' | 'forgot' | 'verify';

function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: { x: number; y: number; vx: number; vy: number; r: number; color: string }[] = [];
    const colors = ['rgba(139,92,246,0.3)', 'rgba(236,72,153,0.2)', 'rgba(59,130,246,0.2)', 'rgba(16,185,129,0.2)'];

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.1 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ background: '#0F0F0F' }}
    />
  );
}

function getAuthErrorMessage(message: string) {
  if (message.toLowerCase().includes('invalid login')) return 'Email or password is incorrect.';
  if (message.toLowerCase().includes('already registered')) return 'This email is already registered.';
  if (message.toLowerCase().includes('token')) return 'The code is invalid or expired.';
  return message;
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = typeof location.state === 'object' && location.state && 'from' in location.state
    ? String(location.state.from)
    : '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        toast.success('Welcome back');
        navigate(redirectTo, { replace: true });
        return;
      }

      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth`,
          },
        });
        if (error) throw error;

        if (data.user && (data.user.identities?.length ?? 0) === 0) {
          toast.error('This email is already registered. Sign in instead.');
          setMode('login');
          return;
        }

        if (data.session) {
          toast.success('Account created');
          navigate('/dashboard', { replace: true });
          return;
        }

        setMode('verify');
        setOtp('');
        toast.success('Verification code sent');
        return;
      }

      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;

        toast.success('Recovery email sent');
        setMode('login');
        return;
      }

      if (mode === 'verify') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'signup',
        });
        if (error) throw error;

        toast.success('Email confirmed');
        navigate('/dashboard', { replace: true });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      toast.error(getAuthErrorMessage(message));
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setResending(true);

    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      toast.success('New code sent');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not resend code.';
      toast.error(getAuthErrorMessage(message));
    } finally {
      setResending(false);
    }
  };

  const titles = {
    login: { title: 'Welcome to Skarbix', subtitle: 'Financial intelligence, automated.' },
    register: { title: 'Create Account', subtitle: 'Start your financial journey.' },
    forgot: { title: 'Reset Password', subtitle: "We'll send you a recovery link." },
    verify: { title: 'Check your email', subtitle: `Enter the 6-digit code sent to ${email || 'your inbox'}.` },
  };

  const current = titles[mode];
  const canSubmitVerify = mode !== 'verify' || otp.length === 6;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-4">
      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-[380px] sm:max-w-[400px] bg-[var(--sk-card)] rounded-[20px] sm:rounded-[24px] shadow-2xl p-6 sm:p-8 md:p-10"
      >
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
            <Hexagon className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg sm:text-xl font-bold text-[#8B5CF6] tracking-tight">Skarbix</span>
        </div>

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--sk-text)] tracking-tight">{current.title}</h1>
          <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mt-1.5 leading-relaxed">{current.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {mode === 'verify' ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6]/10">
                <CheckCircle2 className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="justify-center">
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-11 w-10 rounded-xl border border-[var(--sk-border)] text-base font-semibold"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 sm:h-12 pl-10 rounded-xl border-[var(--sk-border)] focus-visible:ring-[#8B5CF6] text-sm"
                    required
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-[var(--sk-text-secondary)]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={8}
                      className="h-11 sm:h-12 pl-10 pr-10 rounded-xl border-[var(--sk-border)] focus-visible:ring-[#8B5CF6] text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[var(--sk-text-secondary)]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            disabled={loading || !canSubmitVerify}
            className="w-full h-11 sm:h-12 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : mode === 'login' ? (
              <>Sign In <ArrowRight className="w-4 h-4 ml-1.5" /></>
            ) : mode === 'register' ? (
              <>Create Account <ArrowRight className="w-4 h-4 ml-1.5" /></>
            ) : mode === 'verify' ? (
              <>Confirm Email <ArrowRight className="w-4 h-4 ml-1.5" /></>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>

        <div className="mt-5 sm:mt-6 text-center space-y-1.5 sm:space-y-2">
          {mode === 'login' && (
            <>
              <button onClick={() => setMode('forgot')} className="text-xs sm:text-sm text-[#8B5CF6] hover:underline font-medium">
                Forgot Password?
              </button>
              <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">
                Don&apos;t have an account?{' '}
                <button onClick={() => setMode('register')} className="text-[#8B5CF6] hover:underline font-medium">
                  Create one
                </button>
              </p>
            </>
          )}
          {mode === 'register' && (
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-[#8B5CF6] hover:underline font-medium">
                Sign in
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button onClick={() => setMode('login')} className="text-xs sm:text-sm text-[#8B5CF6] hover:underline font-medium">
              Back to Sign In
            </button>
          )}
          {mode === 'verify' && (
            <div className="space-y-2">
              <button
                onClick={handleResendCode}
                disabled={resending}
                className="text-xs sm:text-sm text-[#8B5CF6] hover:underline font-medium disabled:opacity-60"
              >
                {resending ? 'Sending...' : 'Resend code'}
              </button>
              <button
                onClick={() => setMode('register')}
                className="mx-auto flex items-center justify-center gap-1 text-xs sm:text-sm text-[var(--sk-text-secondary)] hover:text-[#8B5CF6] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
