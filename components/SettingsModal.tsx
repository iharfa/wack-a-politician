"use client";
import { clearEntries } from "@/lib/leaderboard";
import type { Settings } from "@/lib/types";

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onClose: () => void;
}

function Toggle({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex w-full items-center justify-between py-2.5" role="switch" aria-checked={value}>
      <span className="font-semibold">{label}</span>
      <span className={`h-7 w-12 rounded-full p-1 transition-colors ${value ? "bg-emerald-500" : "bg-slate-600"}`}>
        <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

export default function SettingsModal({ settings, onChange, onClose }: Props) {
  const toggle = (key: keyof Settings) => onChange({ ...settings, [key]: !settings[key] });

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-indigo-950 p-6 ring-4 ring-indigo-700">
        <h2 className="mb-3 text-center text-2xl font-black text-amber-400">⚙️ SETTINGS</h2>
        <div className="divide-y divide-indigo-800">
          <Toggle label="🔊 Sound" value={settings.sound} onToggle={() => toggle("sound")} />
          <Toggle label="📳 Vibration" value={settings.vibration} onToggle={() => toggle("vibration")} />
          <Toggle label="🌊 Reduced motion" value={settings.reducedMotion} onToggle={() => toggle("reducedMotion")} />
          <Toggle label="⌨️ Keyboard hints" value={settings.keyboardHints} onToggle={() => toggle("keyboardHints")} />
        </div>
        <button
          onClick={() => {
            if (confirm("Clear the local leaderboard? This cannot be undone.")) clearEntries();
          }}
          className="mt-4 w-full rounded-xl bg-rose-900/80 py-3 font-bold text-rose-200"
        >
          🗑️ Clear leaderboard
        </button>
        <button onClick={onClose} className="mt-2 w-full rounded-xl bg-indigo-800 py-3 font-bold">
          Close
        </button>
      </div>
    </div>
  );
}
