"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard from "@/components/GameBoard";
import GameOverModal from "@/components/GameOverModal";
import Leaderboard from "@/components/Leaderboard";
import ScorePanel from "@/components/ScorePanel";
import SettingsModal from "@/components/SettingsModal";
import StartScreen from "@/components/StartScreen";
import type { GameMode, Settings } from "@/lib/types";
import { useGame, type FxEvent } from "@/lib/useGame";

const KEYMAP: Record<string, number> = {
  KeyQ: 0, KeyW: 1, KeyE: 2,
  KeyA: 3, KeyS: 4, KeyD: 5,
  KeyZ: 6, KeyX: 7, KeyC: 8,
  Numpad7: 0, Numpad8: 1, Numpad9: 2,
  Numpad4: 3, Numpad5: 4, Numpad6: 5,
  Numpad1: 6, Numpad2: 7, Numpad3: 8,
};

const DEFAULT_SETTINGS: Settings = { sound: true, vibration: true, reducedMotion: false, keyboardHints: true };

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

export default function Home() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<GameMode>("classic");
  const [showLB, setShowLB] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [fx, setFx] = useState<(FxEvent & { id: number })[]>([]);
  const fxId = useRef(0);
  const [promoted, setPromoted] = useState(false);
  const [installEvt, setInstallEvt] = useState<InstallPromptEvent | null>(null);

  const addFx = useCallback((f: FxEvent) => {
    const id = ++fxId.current;
    setFx((cur) => [...cur.slice(-8), { ...f, id }]);
    setTimeout(() => setFx((cur) => cur.filter((x) => x.id !== id)), 700);
  }, []);

  const { state, start, whack, quit, pause, resume } = useGame(settings, addFx);
  const [quitConfirm, setQuitConfirm] = useState<{ target: number; options: number[] } | null>(null);

  const openQuitConfirm = () => {
    const nums = new Set<number>();
    while (nums.size < 3) nums.add(1 + Math.floor(Math.random() * 9));
    const options = [...nums].sort(() => Math.random() - 0.5);
    setQuitConfirm({ target: options[Math.floor(Math.random() * options.length)], options });
    pause();
  };

  const answerQuit = (n: number) => {
    const target = quitConfirm?.target;
    setQuitConfirm(null);
    if (n === target) quit();
    else resume();
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("wap-settings");
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      setPromoted(localStorage.getItem("wap-promoted") === "1");
    } catch {}
  }, []);

  const updatePromoted = (v: boolean) => {
    setPromoted(v);
    localStorage.setItem("wap-promoted", v ? "1" : "0");
  };

  const updateSettings = (s: Settings) => {
    setSettings(s);
    localStorage.setItem("wap-settings", JSON.stringify(s));
  };

  // PWA: service worker + install prompt
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as InstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  // Keyboard controls, attached only while playing
  useEffect(() => {
    if (state.status !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      const hole = KEYMAP[e.code];
      if (hole === undefined || e.repeat) return;
      e.preventDefault();
      whack(hole);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [state.status, whack]);

  const inRound = state.status !== "idle";

  return (
    <main
      className={`fixed inset-0 select-none overflow-hidden bg-[var(--color-paper)] text-[var(--color-ink)] ${
        settings.reducedMotion ? "reduce-motion" : ""
      }`}
    >
      {!inRound ? (
        <StartScreen
          mode={mode}
          setMode={setMode}
          onStart={() => start(mode)}
          onLeaderboard={() => setShowLB(true)}
          onSettings={() => setShowSettings(true)}
          canInstall={!!installEvt}
          onInstall={() => {
            installEvt?.prompt();
            setInstallEvt(null);
          }}
          promoted={promoted}
          onSetPromoted={updatePromoted}
        />
      ) : (
        <div className="flex h-full touch-none flex-col justify-center gap-3 p-3 pb-[env(safe-area-inset-bottom)]">
          <ScorePanel state={state} />
          <GameBoard entities={state.entities} fx={fx} showHints={settings.keyboardHints} skin={promoted} onWhack={whack} />
          <button
            onClick={openQuitConfirm}
            className="mx-auto mt-4 text-sm font-bold text-[var(--color-muted)] underline underline-offset-4"
          >
            ✕ Quit round
          </button>
        </div>
      )}

      {quitConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[var(--color-ink)]/70 p-4">
          <div className="w-full max-w-sm border-2 border-[var(--color-ink)] bg-[var(--color-paper)] p-6 text-center shadow-[6px_6px_0_var(--color-ink)]">
            <h2 className="display text-2xl text-[var(--color-accent)]">Quit the round?</h2>
            <p className="mt-2 text-sm font-bold text-[var(--color-ink-2)]">
              Tap <span className="display text-2xl text-[var(--color-accent-2)]">{quitConfirm.target}</span> to quit —
              anything else keeps playing.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              {quitConfirm.options.map((n) => (
                <button key={n} onClick={() => answerQuit(n)} className="btn display h-16 w-16 bg-[var(--color-paper)] text-2xl">
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => answerQuit(-1)}
              className="btn mt-4 w-full bg-[var(--color-accent-2)] py-3 text-[var(--color-paper)]"
            >
              Keep playing
            </button>
          </div>
        </div>
      )}
      {state.status === "over" && <GameOverModal state={state} onPlayAgain={() => start(state.mode)} onHome={quit} />}
      {showLB && <Leaderboard onClose={() => setShowLB(false)} initialMode={mode} />}
      {showSettings && (
        <SettingsModal settings={settings} onChange={updateSettings} onClose={() => setShowSettings(false)} />
      )}
    </main>
  );
}
