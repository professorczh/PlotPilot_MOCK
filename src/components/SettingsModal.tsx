import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Key, Globe, Shield, Save, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ApiConfig {
  provider: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  enabled: boolean;
}

const DEFAULT_CONFIGS: ApiConfig[] = [
  { provider: 'Gemini', apiKey: '', baseUrl: 'https://generativelanguage.googleapis.com', model: 'gemini-1.5-pro', enabled: true },
  { provider: 'OpenAI', apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', enabled: false },
  { provider: 'Anthropic', apiKey: '', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet', enabled: false },
  { provider: 'DeepSeek', apiKey: '', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat', enabled: false },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [configs, setConfigs] = useState<ApiConfig[]>(DEFAULT_CONFIGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('plot-pilot-api-configs');
    if (saved) {
      try {
        setConfigs(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved configs', e);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('plot-pilot-api-configs', JSON.stringify(configs));
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 800);
  };

  const updateConfig = (index: number, updates: Partial<ApiConfig>) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], ...updates };
    setConfigs(newConfigs);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-panel-bg border border-hud-border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-hud-border flex items-center justify-between bg-app-bg/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold tracking-[0.2em] text-text-main uppercase">多 API 配置面板</h2>
                  <p className="text-xs font-mono text-muted-text uppercase tracking-wider">Multi-API Configuration</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-hud-border/20 rounded-full transition-colors text-muted-text hover:text-text-main"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
              <div className="flex items-start gap-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-text leading-relaxed">
                  配置多个 AI 模型提供商。您可以根据需要切换不同的模型来生成情节、角色或进行世界观推演。API 密钥将安全地存储在您的浏览器本地。
                </p>
              </div>

              <div className="space-y-6">
                {configs.map((config, index) => (
                  <div 
                    key={config.provider}
                    className={`p-6 rounded-2xl border transition-all duration-300 ${config.enabled ? 'bg-panel-bg border-brand-red/30 shadow-[0_0_20px_rgba(220,38,38,0.05)]' : 'bg-app-bg/30 border-hud-border/50 opacity-60'}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.enabled ? 'bg-brand-red/20 text-brand-red' : 'bg-hud-border/20 text-muted-text'}`}>
                          <Globe className="w-4 h-4" />
                        </div>
                        <span className="font-display font-bold tracking-widest text-text-main uppercase">{config.provider}</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={config.enabled}
                          onChange={(e) => updateConfig(index, { enabled: e.target.checked })}
                        />
                        <div className="w-11 h-6 bg-hud-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest flex items-center gap-2">
                          <Key className="w-3 h-3" /> API Key
                        </label>
                        <input 
                          type="password"
                          value={config.apiKey}
                          onChange={(e) => updateConfig(index, { apiKey: e.target.value })}
                          placeholder="sk-..."
                          className="w-full bg-app-bg border border-hud-border rounded-lg px-4 py-2 text-sm text-text-main focus:border-brand-red/50 focus:outline-none transition-all font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest flex items-center gap-2">
                          <Shield className="w-3 h-3" /> Model ID
                        </label>
                        <input 
                          type="text"
                          value={config.model}
                          onChange={(e) => updateConfig(index, { model: e.target.value })}
                          className="w-full bg-app-bg border border-hud-border rounded-lg px-4 py-2 text-sm text-text-main focus:border-brand-red/50 focus:outline-none transition-all font-mono"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest flex items-center gap-2">
                          <Globe className="w-3 h-3" /> Base URL
                        </label>
                        <input 
                          type="text"
                          value={config.baseUrl}
                          onChange={(e) => updateConfig(index, { baseUrl: e.target.value })}
                          className="w-full bg-app-bg border border-hud-border rounded-lg px-4 py-2 text-sm text-text-main focus:border-brand-red/50 focus:outline-none transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-hud-border bg-app-bg/30 flex justify-end gap-4">
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-sm font-medium text-muted-text hover:text-text-main transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-2 bg-brand-red hover:bg-red-700 text-white rounded-xl text-sm font-bold tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Save className="w-4 h-4" />
                    </motion.div>
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    保存配置
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
