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

  const { state, start, whack, quit } = useGame(settings, addFx);

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
      className={`fixed inset-0 select-none overflow-hidden bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-950 text-white ${
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
          <button onClick={quit} className="mx-auto text-sm text-indigo-300">
            ✕ Quit round
          </button>
        </div>
      )}

      {state.status === "over" && <GameOverModal state={state} onPlayAgain={() => start(state.mode)} onHome={quit} />}
      {showLB && <Leaderboard onClose={() => setShowLB(false)} />}
      {showSettings && (
        <SettingsModal settings={settings} onChange={updateSettings} onClose={() => setShowSettings(false)} />
      )}
    </main>
  );
}
