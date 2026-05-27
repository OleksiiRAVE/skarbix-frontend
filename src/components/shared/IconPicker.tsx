import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ICONS: Record<string, string[]> = {
  lucide: [
    'lucide:credit-card','lucide:wallet','lucide:banknote','lucide:landmark',
    'lucide:piggy-bank','lucide:trending-up','lucide:dollar-sign','lucide:coins',
    'lucide:receipt','lucide:shopping-bag','lucide:shopping-cart','lucide:car',
    'lucide:home','lucide:plane','lucide:coffee','lucide:smartphone',
    'lucide:laptop','lucide:film','lucide:music','lucide:heart-pulse',
    'lucide:briefcase','lucide:calendar','lucide:mail','lucide:phone',
    'lucide:star','lucide:zap','lucide:sun','lucide:moon',
    'lucide:cloud','lucide:umbrella','lucide:gift','lucide:package',
    'lucide:truck','lucide:percent','lucide:target','lucide:shield',
    'lucide:lock','lucide:key','lucide:user','lucide:users',
    'lucide:bus','lucide:train','lucide:bed','lucide:gamepad-2',
    'lucide:tv','lucide:book-open','lucide:graduation-cap','lucide:rocket',
  ],
  'material-symbols': [
    'material-symbols:credit-card','material-symbols:account-balance-wallet',
    'material-symbols:payments','material-symbols:savings',
    'material-symbols:account-balance','material-symbols:monetization-on',
    'material-symbols:paid','material-symbols:receipt-long',
    'material-symbols:shopping-cart','material-symbols:store',
    'material-symbols:local-offer','material-symbols:directions-car',
    'material-symbols:home','material-symbols:flight',
    'material-symbols:restaurant','material-symbols:smartphone',
    'material-symbols:computer','material-symbols:sports-esports',
    'material-symbols:movie','material-symbols:music-note',
    'material-symbols:favorite','material-symbols:work',
    'material-symbols:school','material-symbols:event',
    'material-symbols:schedule','material-symbols:mail',
    'material-symbols:phone','material-symbols:star',
    'material-symbols:flash-on','material-symbols:wb-sunny',
    'material-symbols:nightlight-round','material-symbols:cloud',
    'material-symbols:umbrella','material-symbols:card-giftcard',
    'material-symbols:inventory-2','material-symbols:percent',
    'material-symbols:track-changes','material-symbols:verified-user',
    'material-symbols:lock','material-symbols:person',
    'material-symbols:directions-bus','material-symbols:train','material-symbols:hotel',
    'material-symbols:sports-esports','material-symbols:live-tv',
    'material-symbols:menu-book','material-symbols:school',
    'material-symbols:rocket-launch',
  ],
  ph: [
    'ph:credit-card','ph:wallet','ph:bank','ph:coin',
    'ph:coins','ph:money','ph:receipt','ph:shopping-bag',
    'ph:shopping-cart','ph:car','ph:house','ph:airplane',
    'ph:coffee','ph:hamburger','ph:device-mobile','ph:laptop',
    'ph:game-controller','ph:film-strip','ph:music-notes',
    'ph:heart','ph:briefcase','ph:backpack','ph:book-open',
    'ph:calendar-blank','ph:clock','ph:envelope','ph:phone',
    'ph:star','ph:lightning','ph:sun','ph:moon',
    'ph:cloud','ph:umbrella','ph:gift','ph:package',
    'ph:truck','ph:percent','ph:target','ph:shield-check',
    'ph:lock-key','ph:user','ph:bus','ph:train',
    'ph:bed','ph:game-controller','ph:television','ph:books',
    'ph:student','ph:rocket',
  ],
};

const COLLECTIONS = [
  { key: 'lucide', label: 'Lucide' },
  { key: 'material-symbols', label: 'Material' },
  { key: 'ph', label: 'Phosphor' },
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [activeTab, setActiveTab] = useState('lucide');
  const [query, setQuery] = useState('');

  const icons = useMemo(() => {
    const list = ICONS[activeTab] || [];
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((icon) => icon.toLowerCase().includes(q));
  }, [activeTab, query]);

  return (
    <div className="space-y-3 w-[min(320px,calc(100vw-64px))] rounded-2xl bg-[var(--sk-card)]">
      {/* Tabs */}
      <div className="flex gap-2">
        {COLLECTIONS.map((c) => (
          <button
            key={c.key}
            onClick={() => { setActiveTab(c.key); setQuery(''); }}
            className={`flex-1 h-8 rounded-full text-[11px] font-medium border transition-all ${
              activeTab === c.key
                ? 'bg-[#8B5CF6] text-white border-[#8B5CF6]'
                : 'bg-transparent text-[var(--sk-text-secondary)] border-[var(--sk-border)] hover:text-[var(--sk-text)]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--sk-text-secondary)]" />
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 pl-8 rounded-full border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] text-sm"
        />
      </div>

      {/* Grid */}
      <div
        className="grid grid-cols-6 gap-1.5 max-h-[200px] overflow-y-auto overscroll-contain rounded-xl bg-[var(--sk-border-light)] p-1.5 pr-2"
        onWheel={(event) => event.stopPropagation()}
      >
        {icons.length === 0 ? (
          <div className="col-span-6 text-center text-xs text-[var(--sk-text-secondary)] py-4">No icons</div>
        ) : (
          icons.map((icon) => (
            <button
              key={icon}
              onClick={() => onChange(icon)}
              className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                value === icon
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#8B5CF6]'
                  : 'border-[var(--sk-border)] bg-[var(--sk-card)] text-[var(--sk-text-secondary)] hover:text-[var(--sk-text)] hover:bg-[var(--sk-card)]'
              }`}
              title={icon}
            >
              <Icon icon={icon} className="w-4 h-4" />
            </button>
          ))
        )}
      </div>
    </div>
  );
}
