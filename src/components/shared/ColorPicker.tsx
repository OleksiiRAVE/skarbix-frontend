import { HexColorPicker } from 'react-colorful';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const hex = value.startsWith('#') ? value : `#${value}`;

  return (
    <div className="space-y-3">
      <HexColorPicker
        color={hex}
        onChange={onChange}
        style={{ width: '100%', height: '140px', borderRadius: '16px' }}
      />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[var(--sk-text-secondary)]">#</span>
        <Input
          value={hex.replace('#', '').toUpperCase()}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
            onChange('#' + raw);
          }}
          className="h-10 rounded-xl border-[var(--sk-border)] bg-[var(--sk-border-light)] text-[var(--sk-text)] uppercase font-mono text-sm tracking-wide"
          maxLength={6}
        />
        <div
          className="w-10 h-10 rounded-xl border border-[var(--sk-border)] flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
      </div>
    </div>
  );
}
