import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Trash2, Settings, User, Calendar, Moon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const SETTINGS_KEY = "app_settings";
const defaultSettings = { dateFormat: "dd-mm-yyyy" };

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export default function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState(loadSettings);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [confirmId, setConfirmId] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const onDateFormatChange = (e) => {
    setSettings((prev) => ({ ...prev, dateFormat: e.target.value }));
    setSaveStatus("saved");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaveStatus("idle"), 2000);
  };

  const handleAction = (fn, msg) => {
    fn();
    toast.success(msg);
    navigate("/login", { replace: true });
  };

  const handleConfirm = (id, action) => {
    if (confirmId === id) {
      action();
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-10 px-4">
      {/* Header & Profile */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-slate-500">Manage your account and preferences.</p>
        </div>
      </header>

      <div className="grid gap-6">
        {/* Preferences Card */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <Settings className="w-4 h-4" /> General Preferences
            </div>
            {saveStatus === "saved" && <span className="text-xs font-medium text-emerald-600 animate-pulse">Changes saved!</span>}
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Moon className="w-4 h-4" /> Dark Mode
                </div>
                <p className="text-xs text-slate-500">Coming soon to this interface.</p>
              </div>
              <button className="h-6 w-11 cursor-pointer rounded-full bg-slate-200 transition-colors" disabled>
                <span className="ml-1 block h-4 w-4 rounded-full bg-white shadow-sm" />
              </button>
            </div>

            <div className="space-y-2">
              <label htmlFor="dateFormat" className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4" /> Date Format
              </label>
              <select
                id="dateFormat"
                value={settings.dateFormat}
                onChange={onDateFormatChange}
                className="w-auto cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="dd-mm-yyyy">DD-MM-YYYY (Default)</option>
                <option value="mm-dd-yyyy">MM-DD-YYYY</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Session</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {/* Sign Out - Neutral but defined */}
            <button
              onClick={() => handleConfirm("logout", () => handleAction(logout, "Logged out"))}
              className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all border ${
                confirmId === "logout"
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <LogOut className={`w-4 h-4 ${confirmId === "logout" ? "text-amber-600" : "text-slate-500"}`} />
              {confirmId === "logout" ? "Confirm Sign Out?" : "Sign Out"}
            </button>

            {/* Reset Local Data - Primary Danger Action */}
            <button
              onClick={() =>
                handleConfirm("reset", () =>
                  handleAction(() => {
                    localStorage.clear();
                  }, "Session cleared"),
                )
              }
              className={`flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-all ${
                confirmId === "reset" ? "bg-red-800 text-white shadow-inner" : "bg-red-600 text-white hover:bg-red-700 shadow-sm"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              {confirmId === "reset" ? "Click again to wipe all data" : "Reset Local Data"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
