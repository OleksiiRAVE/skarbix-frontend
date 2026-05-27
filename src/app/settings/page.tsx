import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router';
import {
  User, Shield, CreditCard, Bell, Palette, Database, Trash2,
  Moon, Sun, Monitor, Lock, Key, Eye, EyeOff, ExternalLink, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppStore } from '@/store';
import { Switch } from '@/components/ui/switch';
import {
  connectMonobank,
  disconnectMonobank,
  fetchMonobankStatus,
  syncMonobank,
} from '@/lib/mock-api/api';
import { formatDate } from '@/lib/utils/format';
import type { MonobankConnection } from '@/types';

const sidebarItems = [
  { id: 'profile', label: 'Profile', shortLabel: 'Profile', icon: User },
  { id: 'security', label: 'Security', shortLabel: 'Security', icon: Shield },
  { id: 'banks', label: 'Connected Banks', shortLabel: 'Banks', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', shortLabel: 'Notif.', icon: Bell },
  { id: 'appearance', label: 'Appearance', shortLabel: 'Theme', icon: Palette },
  { id: 'data', label: 'Data Export', shortLabel: 'Export', icon: Database },
];

const sectionIds = new Set(sidebarItems.map((item) => item.id));

export default function SettingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedSection = searchParams.get('section');
  const [activeSection, setActiveSection] = useState(
    requestedSection && sectionIds.has(requestedSection) ? requestedSection : 'profile',
  );
  const [deleteModal, setDeleteModal] = useState(false);
  const [monobankToken, setMonobankToken] = useState('');
  const [monobankStatus, setMonobankStatus] = useState<MonobankConnection | null>(null);
  const [monobankLoading, setMonobankLoading] = useState(false);
  const [monobankError, setMonobankError] = useState('');
  const [monobankMessage, setMonobankMessage] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const user = useAppStore((s) => s.user);
  const displayName = user?.name || 'Skarbix User';
  const displayEmail = user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (requestedSection && sectionIds.has(requestedSection)) {
      setActiveSection(requestedSection);
    }
  }, [requestedSection]);

  useEffect(() => {
    let mounted = true;
    void fetchMonobankStatus()
      .then((status) => {
        if (mounted) setMonobankStatus(status);
      })
      .catch(() => {
        if (mounted) setMonobankStatus({ connected: false, webhookEnabled: false, importedTransactions: 0 });
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleConnectMonobank = async () => {
    setMonobankError('');
    setMonobankMessage('');
    setMonobankLoading(true);
    try {
      const status = await connectMonobank(monobankToken);
      setMonobankStatus(status);
      setMonobankToken('');
      setMonobankMessage(`Connected. Imported ${status.importedTransactions} transactions.`);
    } catch (error) {
      setMonobankError(error instanceof Error ? error.message : 'Could not connect Monobank');
    } finally {
      setMonobankLoading(false);
    }
  };

  const handleSyncMonobank = async () => {
    setMonobankError('');
    setMonobankMessage('');
    setMonobankLoading(true);
    try {
      const result = await syncMonobank();
      const status = await fetchMonobankStatus();
      setMonobankStatus(status);
      setMonobankMessage(`Synced. Imported ${result.imported} new transactions.`);
    } catch (error) {
      setMonobankError(error instanceof Error ? error.message : 'Could not sync Monobank');
    } finally {
      setMonobankLoading(false);
    }
  };

  const handleDisconnectMonobank = async () => {
    setMonobankError('');
    setMonobankMessage('');
    setMonobankLoading(true);
    try {
      const status = await disconnectMonobank();
      setMonobankStatus(status);
      setMonobankMessage('Monobank disconnected. Imported data stays in Skarbix.');
    } catch (error) {
      setMonobankError(error instanceof Error ? error.message : 'Could not disconnect Monobank');
    } finally {
      setMonobankLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--sk-text)] tracking-tight">Settings</h1>
        <p className="text-[var(--sk-text-secondary)] mt-1 text-sm sm:text-base">Manage your account preferences</p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Sidebar - horizontal scroll on mobile, sticky on desktop */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-60 flex-shrink-0"
        >
          <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] border border-[var(--sk-border)] shadow-sm p-1.5 sm:p-2 lg:sticky lg:top-24 overflow-x-auto lg:overflow-visible scrollbar-hide">
            <div className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSearchParams({ section: item.id });
                  }}
                  className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap lg:whitespace-normal ${
                    activeSection === item.id
                      ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                      : 'text-[var(--sk-text-secondary)] hover:bg-[var(--sk-border-light)] hover:text-[var(--sk-text)]'
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 space-y-4 sm:space-y-6"
        >
          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-[var(--sk-border)] shadow-sm space-y-5 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Profile</h3>
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
                  {initial}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-medium text-[var(--sk-text)]">{displayName}</p>
                  <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">{displayEmail}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">Full Name</Label>
                  <Input value={displayName} readOnly className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">Email</Label>
                  <Input value={displayEmail} readOnly className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[var(--sk-text-secondary)]">Default Currency</Label>
                <div className="h-10 sm:h-11 rounded-xl border border-[var(--sk-border)] flex items-center px-3.5 text-sm text-[var(--sk-text)] bg-[var(--sk-border-light)]">
                  UAH (₴) — Ukrainian Hryvnia
                </div>
              </div>
              <Button disabled className="h-9 sm:h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-4 sm:px-6 text-xs sm:text-sm disabled:opacity-60">
                Synced from your account
              </Button>
            </div>
          )}

          {/* Security */}
          {activeSection === 'security' && (
            <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-[var(--sk-border)] shadow-sm space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Security</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">Current Password</Label>
                  <div className="relative">
                    <Input type={showPwd ? 'text' : 'password'} placeholder="••••••••" className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] pr-10 text-sm" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)]">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">New Password</Label>
                  <Input type="password" placeholder="••••••••" className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] text-sm" />
                </div>
                <div className="flex items-center justify-between py-3 border-t border-[var(--sk-border-light)]">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                      <Key className="w-4 h-4 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--sk-text)]">Two-Factor Authentication</p>
                      <p className="text-xs text-[var(--sk-text-secondary)]">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
              <Button className="h-9 sm:h-10 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-4 sm:px-6 text-xs sm:text-sm">
                Update Password
              </Button>
            </div>
          )}

          {/* Connected Banks */}
          {activeSection === 'banks' && (
            <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-[var(--sk-border)] shadow-sm space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Connected Banks</h3>

              <div className="bg-[var(--sk-border-light)] rounded-xl sm:rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black flex items-center justify-center text-white text-xs font-bold">
                      M
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-[var(--sk-text)]">Monobank</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${monobankStatus?.connected ? 'bg-green-500/100' : 'bg-[var(--sk-text-secondary)]/50'}`} />
                        <span className="text-xs text-[var(--sk-text-secondary)]">
                          {monobankStatus?.connected ? 'Connected' : 'Not connected'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-[var(--sk-text-secondary)]">{monobankStatus?.accountName || 'Personal API'}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 text-xs sm:text-sm">
                  <div className="bg-[var(--sk-card)] rounded-xl p-2.5 sm:p-3">
                    <p className="text-[var(--sk-text-secondary)] mb-0.5 text-xs">Last Sync</p>
                    <p className="font-medium text-[var(--sk-text)] text-xs sm:text-sm">
                      {monobankStatus?.lastSync ? formatDate(monobankStatus.lastSync) : 'Never'}
                    </p>
                  </div>
                  <div className="bg-[var(--sk-card)] rounded-xl p-2.5 sm:p-3">
                    <p className="text-[var(--sk-text-secondary)] mb-0.5 text-xs">Transactions</p>
                    <p className="font-medium text-[var(--sk-text)] text-xs sm:text-sm">{monobankStatus?.importedTransactions ?? 0} imported</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    disabled={!monobankStatus?.connected || monobankLoading}
                    onClick={handleSyncMonobank}
                    className="h-8 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full text-xs px-3 sm:px-4"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${monobankLoading ? 'animate-spin' : ''}`} />
                    Sync Now
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!monobankStatus?.connected || monobankLoading}
                    onClick={handleDisconnectMonobank}
                    className="h-8 rounded-full text-xs border-[var(--sk-border)] text-red-500 hover:bg-red-500/10 px-3 sm:px-4"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>

              <div className="bg-[var(--sk-border-light)] rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[var(--sk-border)]">
                <p className="text-xs text-[var(--sk-text-secondary)] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8B5CF6] flex-shrink-0" />
                  Your token is sent over HTTPS, encrypted on the backend, and never stored in the browser.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Label className="text-xs text-[var(--sk-text-secondary)]">Monobank API Token</Label>
                  <a
                    href="https://api.monobank.ua/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#8B5CF6] hover:text-[#7C3AED]"
                  >
                    Get token via QR
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="password"
                    placeholder="Enter your Monobank token"
                    value={monobankToken}
                    onChange={(e) => setMonobankToken(e.target.value)}
                    className="h-10 sm:h-11 rounded-xl border-[var(--sk-border)] flex-1 text-sm"
                  />
                  <Button
                    disabled={!monobankToken.trim() || monobankLoading}
                    onClick={handleConnectMonobank}
                    className="h-10 sm:h-11 bg-black hover:bg-black/90 text-white rounded-full px-3 sm:px-5 text-xs sm:text-sm"
                  >
                    {monobankStatus?.connected ? 'Reconnect' : 'Connect'}
                  </Button>
                </div>
                <p className="text-xs text-[var(--sk-text-secondary)]">
                  Open the Monobank API page, scan the QR in the Mono app, copy the personal token, and paste it here.
                </p>
                {monobankError && <p className="text-xs font-medium text-red-500">{monobankError}</p>}
                {monobankMessage && <p className="text-xs font-medium text-green-600">{monobankMessage}</p>}
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-[var(--sk-border)] shadow-sm space-y-1">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)] mb-3 sm:mb-4">Notifications</h3>
              {[
                { label: 'Budget Alerts', desc: 'Get notified when approaching budget limits', checked: true },
                { label: 'Transaction Notifications', desc: 'New transactions from connected banks', checked: true },
                { label: 'Debt Reminders', desc: 'Reminders for upcoming due dates', checked: true },
                { label: 'AI Insights', desc: 'Weekly spending insights and tips', checked: false },
                { label: 'Marketing Emails', desc: 'Product updates and offers', checked: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-[var(--sk-border-light)] last:border-0">
                  <div className="min-w-0 pr-3">
                    <p className="text-sm font-medium text-[var(--sk-text)]">{item.label}</p>
                    <p className="text-xs text-[var(--sk-text-secondary)]">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.checked} />
                </div>
              ))}
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-[var(--sk-border)] shadow-sm space-y-5 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Appearance</h3>

              <div>
                <Label className="text-xs text-[var(--sk-text-secondary)] mb-2 sm:mb-3 block">Theme</Label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value as 'light' | 'dark')}
                      className={`flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border transition-all ${
                        (t.value === 'light' && theme === 'light') || (t.value === 'dark' && theme === 'dark')
                          ? 'border-[#8B5CF6] bg-[#8B5CF6]/10'
                          : 'border-[var(--sk-border)] hover:border-[var(--sk-text-secondary)]'
                      }`}
                    >
                      <t.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        (t.value === 'light' && theme === 'light') || (t.value === 'dark' && theme === 'dark')
                          ? 'text-[#8B5CF6]'
                          : 'text-[var(--sk-text-secondary)]'
                      }`} />
                      <span className="text-[11px] sm:text-xs font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Data Export */}
          {activeSection === 'data' && (
            <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-[var(--sk-border)] shadow-sm space-y-4 sm:space-y-6">
              <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)]">Data Export</h3>
              <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)]">Download your data in various formats.</p>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { label: 'Export All Transactions', format: 'CSV', desc: 'Full transaction history' },
                  { label: 'Export Analytics Report', format: 'PDF', desc: 'Monthly summary and charts' },
                  { label: 'Export Budget Data', format: 'CSV', desc: 'Budget allocations and progress' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 sm:p-4 bg-[var(--sk-border-light)] rounded-xl gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--sk-text)] truncate">{item.label}</p>
                      <p className="text-xs text-[var(--sk-text-secondary)]">{item.desc}</p>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 rounded-full border-[var(--sk-border)] text-xs flex-shrink-0">
                      Download {item.format}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delete Account */}
          <div className="bg-[var(--sk-card)] rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border border-red-500/20 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold text-red-500 mb-1.5 sm:mb-2">Danger Zone</h3>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-3 sm:mb-4">
              Once you delete your account, there is no going back. All your data will be permanently removed.
            </p>
            <Button
              variant="outline"
              onClick={() => setDeleteModal(true)}
              className="h-9 sm:h-10 border-red-200 text-red-500 hover:bg-red-500/10 rounded-full px-4 sm:px-5 text-xs sm:text-sm"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              Delete Account
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirm Modal */}
      <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
        <DialogContent className="sm:max-w-[360px] rounded-[20px] sm:rounded-[24px] p-0 overflow-hidden border-0 max-w-[calc(100%-16px)]">
          <div className="p-5 sm:p-6 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-[var(--sk-text)] mb-1">Delete Account?</h3>
            <p className="text-xs sm:text-sm text-[var(--sk-text-secondary)] mb-5 sm:mb-6">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setDeleteModal(false)} className="flex-1 h-10 sm:h-11 rounded-full border-[var(--sk-border)] text-xs sm:text-sm">
                Cancel
              </Button>
              <Button className="flex-1 h-10 sm:h-11 bg-red-500/100 hover:bg-red-600 text-white rounded-full text-xs sm:text-sm">
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
