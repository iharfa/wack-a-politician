"use client";
import { clearEntries } from "@/lib/leaderboard";
import type { Settings } from "@/lib/types";

const CLEAR_PASSWORD = "MuizzuIsDaBest";

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onClose: () => void;
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex w-full items-center justify-between py-2.5" role="switch" aria-checked={value}>
      <span className="font-bold">{label}</span>
      <span
        className={`h-7 w-12 border-2 border-[var(--color-ink)] p-0.5 transition-colors ${
          value ? "bg-[var(--color-accent)]" : "bg-[var(--color-paper-3)]"
        }`}
      >
        <span
          className={`block h-full w-5 border-2 border-[var(--color-ink)] bg-[var(--color-paper)] transition-transform ${
            value ? "translate-x-[1.15rem]" : ""
          }`}
        />
      </span>
    </button>
  );
}

export default function SettingsModal({ settings, onChange, onClose }: Props) {
  const toggle = (key: keyof Settings) => onChange({ ...settings, [key]: !settings[key] });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-ink)]/70 p-4">
      <div className="w-full max-w-sm border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 shadow-[6px_6px_0_var(--color-ink)]">
        <h2 className="display text-center text-3xl text-[var(--color-accent-2)]">Settings.</h2>
        <div className="ornament my-2 text-center" aria-hidden>
          ✱ ✱ ✱ ✱
        </div>
        <div className="divide-y-2 divide-[var(--color-paper-3)]">
          <Toggle label="Sound" value={settings.sound} onToggle={() => toggle("sound")} />
          <Toggle label="Vibration" value={settings.vibration} onToggle={() => toggle("vibration")} />
          <Toggle label="Reduced motion" value={settings.reducedMotion} onToggle={() => toggle("reducedMotion")} />
          <Toggle label="Keyboard hints" value={settings.keyboardHints} onToggle={() => toggle("keyboardHints")} />
        </div>
        <button
          onClick={() => {
            const pw = prompt("Enter the admin password to clear the leaderboard:");
            if (pw === null) return;
            if (pw !== CLEAR_PASSWORD) {
              alert("Wrong password. The leaderboard stays.");
              return;
            }
            if (confirm("Password accepted. Clear the local leaderboard? This cannot be undone.")) clearEntries();
          }}
          className="btn mt-4 w-full bg-[var(--color-accent)] py-3 text-sm text-[var(--color-accent-ink)]"
        >
          Clear leaderboard
        </button>
        <button onClick={onClose} className="btn mt-2.5 w-full bg-[var(--color-paper)] py-3">
          Close
        </button>
      </div>
    </div>
  );
}
