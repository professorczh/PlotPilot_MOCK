import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Key, Globe, Shield, Save, AlertCircle, Link as LinkIcon, ChevronDown, Plus, Zap, Type, Image as ImageIcon } from 'lucide-react';

type TabType = 'text' | 'image';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMockLoadingEnabled: boolean;
  setIsMockLoadingEnabled: (enabled: boolean) => void;
}

interface ApiConfig {
  provider: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  protocol: 'openai' | 'gemini' | 'anthropic' | 'mj' | 'sd';
  enabled: boolean;
}

const DEFAULT_CONFIGS: ApiConfig[] = [
  { provider: 'Gemini', apiKey: '', baseUrl: 'https://generativelanguage.googleapis.com', model: 'gemini-1.5-pro', protocol: 'gemini', enabled: true },
  { provider: 'OpenAI', apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o', protocol: 'openai', enabled: false },
  { provider: 'Anthropic', apiKey: '', baseUrl: 'https://api.anthropic.com/v1', model: 'claude-3-5-sonnet', protocol: 'anthropic', enabled: false },
  { provider: 'DeepSeek', apiKey: '', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat', protocol: 'openai', enabled: false },
];

const DEFAULT_IMAGE_CONFIGS: ApiConfig[] = [
  { provider: 'Gemini Nano Banana', apiKey: '', baseUrl: 'https://banana.api.google', model: 'v1-fruit-pro', protocol: 'gemini', enabled: true },
  { provider: 'DALL-E 3', apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'dall-e-3', protocol: 'openai', enabled: false },
  { provider: 'Midjourney', apiKey: '', baseUrl: 'https://api.midjourney.proxy', model: 'standard', protocol: 'mj', enabled: false }
];

export default function SettingsModal({ 
  isOpen, 
  onClose,
  isMockLoadingEnabled,
  setIsMockLoadingEnabled
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [configs, setConfigs] = useState<ApiConfig[]>(DEFAULT_CONFIGS);
  const [imageConfigs, setImageConfigs] = useState<ApiConfig[]>(DEFAULT_IMAGE_CONFIGS);
  const [selectedTextIndex, setSelectedTextIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Text Add State
  const [addStage, setAddStage] = useState<'idle' | 'input' | 'preview'>('idle');
  const [newApiKey, setNewApiKey] = useState('');
  const [previewConfig, setPreviewConfig] = useState<ApiConfig | null>(null);

  // Image Add State
  const [imageAddStage, setImageAddStage] = useState<'idle' | 'input' | 'preview'>('idle');
  const [newImageApiKey, setNewImageApiKey] = useState('');
  const [previewImageConfig, setPreviewImageConfig] = useState<ApiConfig | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('plot-pilot-api-configs');
    const savedImg = localStorage.getItem('plot-pilot-image-configs');
    if (saved) {
      try {
        setConfigs(JSON.parse(saved));
      } catch (e) { console.error('Failed to parse saved configs', e); }
    }
    if (savedImg) {
      try {
        setImageConfigs(JSON.parse(savedImg));
      } catch (e) { console.error('Failed to parse saved image configs', e); }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('plot-pilot-api-configs', JSON.stringify(configs));
    localStorage.setItem('plot-pilot-image-configs', JSON.stringify(imageConfigs));
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, isMockLoadingEnabled ? 800 : 0);
  };

  const updateConfig = (index: number, updates: Partial<ApiConfig>, isImage = false) => {
    const targetConfigs = isImage ? imageConfigs : configs;
    const setter = isImage ? setImageConfigs : setConfigs;

    const newConfigs = targetConfigs.map((config, i) => {
      if (i === index) {
        return { ...config, ...updates };
      }
      if (updates.enabled === true) {
        return { ...config, enabled: false };
      }
      return config;
    });
    setter(newConfigs);
  };

  const deleteConfig = (index: number, isImage = false) => {
    if (isImage) {
      const newConfigs = imageConfigs.filter((_, i) => i !== index);
      setImageConfigs(newConfigs);
      if (selectedImageIndex >= newConfigs.length) setSelectedImageIndex(Math.max(0, newConfigs.length - 1));
    } else {
      const newConfigs = configs.filter((_, i) => i !== index);
      setConfigs(newConfigs);
      if (selectedTextIndex >= newConfigs.length) setSelectedTextIndex(Math.max(0, newConfigs.length - 1));
    }
  };

  const handleIdentify = () => {
    if (!newApiKey.trim()) return;

    let provider = 'Custom Node';
    let protocol: ApiConfig['protocol'] = 'openai';
    let baseUrl = 'https://api.openai.com/v1';
    let model = 'custom-model';

    if (newApiKey.startsWith('sk-ant')) {
      provider = 'Anthropic Node';
      protocol = 'anthropic';
      baseUrl = 'https://api.anthropic.com/v1';
      model = 'claude-3-5-sonnet';
    } else if (newApiKey.startsWith('AIza')) {
      provider = 'Gemini Node';
      protocol = 'gemini';
      baseUrl = 'https://generativelanguage.googleapis.com';
      model = 'gemini-1.5-pro';
    } else if (newApiKey.startsWith('sk-')) {
      provider = 'OpenAI Node';
      protocol = 'openai';
      baseUrl = 'https://api.openai.com/v1';
      model = 'gpt-4o';
    }

    setPreviewConfig({
      provider: `${provider}_${Math.floor(Math.random() * 1000)}`,
      apiKey: newApiKey,
      baseUrl,
      model,
      protocol,
      enabled: true
    });
    setAddStage('preview');
  };

  const handleImageIdentify = () => {
    if (!newImageApiKey.trim()) return;

    let provider = 'Image Custom';
    let protocol: ApiConfig['protocol'] = 'openai';
    let baseUrl = 'https://api.openai.com/v1';
    let model = 'dall-e-3';

    if (newImageApiKey.startsWith('mj-')) {
      provider = 'Midjourney Node';
      protocol = 'mj';
      baseUrl = 'https://api.midjourney.proxy';
      model = 'standard';
    } else if (newImageApiKey.startsWith('bn-') || newImageApiKey.includes('banana')) {
      provider = 'Gemini Nano Banana Node';
      protocol = 'gemini';
      baseUrl = 'https://banana.api.google';
      model = 'v1-fruit-ultra';
    } else if (newImageApiKey.startsWith('sd-')) {
      provider = 'Stable Diffusion Node';
      protocol = 'sd';
      baseUrl = 'http://localhost:7860/sdapi/v1';
      model = 'sdxl-v1.0';
    } else if (newImageApiKey.startsWith('sk-')) {
      provider = 'DALL-E Node';
      protocol = 'openai';
      baseUrl = 'https://api.openai.com/v1';
      model = 'dall-e-3';
    }

    setPreviewImageConfig({
      provider: `${provider}_${Math.floor(Math.random() * 1000)}`,
      apiKey: newImageApiKey,
      baseUrl,
      model,
      protocol,
      enabled: true
    });
    setImageAddStage('preview');
  };

  const handleFinalConfirm = () => {
    if (!previewConfig) return;
    const updated = [previewConfig, ...configs.map(c => ({ ...c, enabled: false }))];
    setConfigs(updated);
    setNewApiKey('');
    setPreviewConfig(null);
    setAddStage('idle');
    setSelectedTextIndex(0);
  };

  const handleImageFinalConfirm = () => {
    if (!previewImageConfig) return;
    const updated = [previewImageConfig, ...imageConfigs.map(c => ({ ...c, enabled: false }))];
    setImageConfigs(updated);
    setNewImageApiKey('');
    setPreviewImageConfig(null);
    setImageAddStage('idle');
    setSelectedImageIndex(0);
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
            className="relative w-full max-w-4xl bg-panel-bg border border-hud-border rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[85vh]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-hud-border flex items-center justify-between bg-app-bg/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-red/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h2 className="text-xl font-sans font-bold tracking-[0.2em] text-text-main uppercase">API 配置面板</h2>
                  <p className="text-xs font-mono text-muted-text uppercase tracking-wider">API Configuration</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-hud-border/20 rounded-full transition-colors text-muted-text hover:text-text-main"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content Container (Header + Tabs + Body) */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Custom Tabs */}
              <div className="px-8 bg-app-bg/30 border-b border-hud-border">
                <div className="flex items-center gap-8 relative">
                  <button 
                    onClick={() => setActiveTab('text')}
                    className={`py-4 text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 relative ${activeTab === 'text' ? 'text-text-main' : 'text-muted-text hover:text-text-main/70'}`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>文本模型 (TEXT)</span>
                    {activeTab === 'text' && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                      />
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('image')}
                    className={`py-4 text-xs font-sans font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 relative ${activeTab === 'image' ? 'text-text-main' : 'text-muted-text hover:text-text-main/70'}`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>生图模型 (IMAGE)</span>
                    {activeTab === 'image' && (
                      <motion.div 
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                      />
                    )}
                  </button>
                </div>
              </div>

              {/* Sidebar + Detail View */}
              <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {activeTab === 'text' ? (
                    <motion.div
                      key="text-tab"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex h-full"
                    >
                      {/* Sidebar */}
                      <div className="w-64 border-r border-hud-border bg-app-bg/10 flex flex-col">
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                          {configs.map((config, idx) => (
                            <button
                              key={`${config.provider}-${idx}`}
                              onClick={() => { setSelectedTextIndex(idx); setAddStage('idle'); }}
                              className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${
                                selectedTextIndex === idx && addStage === 'idle'
                                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                  : 'text-muted-text hover:bg-white/5 hover:text-text-main'
                              }`}
                            >
                              <span className="font-sans font-bold tracking-widest text-[11px] uppercase truncate">{config.provider}</span>
                              {config.enabled && (
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedTextIndex === idx && addStage === 'idle' ? 'bg-white' : 'bg-brand-red'}`} />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="p-4 border-t border-hud-border">
                          <button 
                            onClick={() => setAddStage('input')}
                            className={`w-full py-3 rounded-xl border-2 border-dashed border-hud-border/40 hover:border-brand-red/50 text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${addStage !== 'idle' ? 'text-brand-red border-brand-red/30' : 'text-muted-text'}`}
                          >
                            <Plus className="w-3 h-3" />
                            新接入模型
                          </button>
                        </div>
                      </div>

                      {/* Detail Panel */}
                      <div className="flex-1 overflow-y-auto bg-detail-grid bg-[size:40px_40px] px-10 py-8">
                        <AnimatePresence mode="wait">
                          {addStage === 'input' ? (
                            <motion.div 
                              key="text-add-input"
                              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                              className="max-w-2xl"
                            >
                              <div className="space-y-6">
                                <div className="flex items-center gap-3 text-brand-red mb-8">
                                  <Zap className="w-5 h-5" />
                                  <h3 className="font-sans font-bold text-lg tracking-widest uppercase">智能识别接入 (Smart Connect)</h3>
                                </div>
                                <div className="p-8 rounded-2xl bg-panel-bg border border-hud-border shadow-xl space-y-6">
                                  <div className="space-y-2">
                                    <label className="text-xs font-mono text-muted-text uppercase tracking-widest">请输入您的 API 密钥 (Key)</label>
                                    <input 
                                      autoFocus
                                      type="password"
                                      value={newApiKey}
                                      onChange={(e) => setNewApiKey(e.target.value)}
                                      placeholder="sk-..."
                                      className="w-full bg-app-bg border border-hud-border rounded-xl px-6 py-4 text-text-main font-mono focus:border-brand-red/50 transition-all outline-none"
                                    />
                                  </div>
                                  <div className="flex gap-4 pt-4">
                                    <button onClick={() => setAddStage('idle')} className="flex-1 py-3 rounded-xl border border-hud-border font-sans font-bold text-muted-text hover:text-text-main transition-all uppercase tracking-widest">放弃</button>
                                    <button onClick={handleIdentify} disabled={!newApiKey.trim()} className="flex-[2] py-3 rounded-xl bg-brand-red text-white font-sans font-bold shadow-lg shadow-brand-red/20 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-30">解析并发现</button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : addStage === 'preview' && previewConfig ? (
                            <motion.div key="text-add-preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                              <div className="max-w-2xl space-y-8">
                                <div className="flex items-center gap-3 text-emerald-400">
                                  <Shield className="w-5 h-5" />
                                  <h3 className="font-sans font-bold text-lg tracking-widest uppercase">模型预览与确认 (Review Configuration)</h3>
                                </div>
                                <div className="p-8 rounded-2xl bg-panel-bg border-2 border-emerald-500/30 space-y-6 relative overflow-hidden">
                                  <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-mono text-muted-text uppercase">提供商</p>
                                      <p className="font-sans font-bold text-xl uppercase text-text-main">{previewConfig.provider}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-mono text-muted-text uppercase">协议类型</p>
                                      <p className="font-mono text-sm font-bold text-emerald-400 uppercase">{previewConfig.protocol}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <p className="text-[10px] font-mono text-muted-text uppercase">默认模型</p>
                                      <p className="font-mono text-sm text-text-main bg-app-bg px-4 py-2 rounded-lg border border-hud-border/30">{previewConfig.model}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-4 pt-8">
                                    <button onClick={() => setAddStage('input')} className="flex-1 py-3 rounded-xl border border-hud-border font-sans font-bold text-muted-text hover:text-text-main transition-all uppercase tracking-widest">返回重调</button>
                                    <button onClick={handleFinalConfirm} className="flex-[2] py-3 rounded-xl bg-emerald-600 text-white font-sans font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all uppercase tracking-widest">保存模型并激活</button>
                                  </div>
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse" />
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="text-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
                              {configs[selectedTextIndex] && (
                                <div className="space-y-10">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                      <h2 className="font-sans font-bold text-3xl tracking-[0.2em] text-text-main uppercase">{configs[selectedTextIndex].provider}</h2>
                                      <p className="text-xs font-mono text-muted-text uppercase tracking-widest">Text Model Configuration</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          className="sr-only peer"
                                          checked={configs[selectedTextIndex].enabled}
                                          onChange={(e) => updateConfig(selectedTextIndex, { enabled: e.target.checked })}
                                        />
                                        <div className={`w-12 h-6 bg-hud-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-red after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                                      </label>
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-main">
                                        {configs[selectedTextIndex].enabled ? 'Active' : 'Disabled'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest flex justify-between">
                                        <span>API Endpoint (Base URL)</span>
                                        <LinkIcon className="w-3 h-3" />
                                      </label>
                                      <input 
                                        type="text" 
                                        value={configs[selectedTextIndex].baseUrl}
                                        onChange={(e) => updateConfig(selectedTextIndex, { baseUrl: e.target.value })}
                                        className="w-full bg-panel-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono focus:border-brand-red/30 outline-none transition-all"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest">Target Model ID</label>
                                        <input 
                                          type="text" 
                                          value={configs[selectedTextIndex].model}
                                          onChange={(e) => updateConfig(selectedTextIndex, { model: e.target.value })}
                                          className="w-full bg-panel-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono focus:border-brand-red/30 outline-none transition-all"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest">Protocol Type</label>
                                        <div className="w-full bg-app-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono opacity-60">
                                          {configs[selectedTextIndex].protocol.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest">Secret API Key</label>
                                      <div className="relative">
                                        <input 
                                          type="password" 
                                          value={configs[selectedTextIndex].apiKey}
                                          onChange={(e) => updateConfig(selectedTextIndex, { apiKey: e.target.value })}
                                          className="w-full bg-panel-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono focus:border-brand-red/30 outline-none transition-all"
                                          placeholder="Enter key to update..."
                                        />
                                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-8 border-t border-hud-border flex justify-between items-center">
                                    <button 
                                      onClick={() => deleteConfig(selectedTextIndex)}
                                      className="px-6 py-2.5 rounded-xl border border-hud-border/50 text-xs font-sans font-medium text-muted-text hover:text-red-400 hover:border-red-400/30 transition-all uppercase tracking-widest flex items-center gap-2"
                                    >
                                      <X className="w-3 h-3" />
                                      删除该模型配置
                                    </button>
                                    <div className="flex items-center gap-2 text-muted-text font-mono text-[10px] italic">
                                      * 所有配置将自动同步至 LocalStorage
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="image-tab"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex h-full"
                    >
                      {/* Sidebar */}
                      <div className="w-64 border-r border-hud-border bg-app-bg/10 flex flex-col">
                        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                          {imageConfigs.map((config, idx) => (
                            <button
                              key={`${config.provider}-${idx}`}
                              onClick={() => { setSelectedImageIndex(idx); setImageAddStage('idle'); }}
                              className={`w-full px-4 py-3 rounded-xl flex items-center justify-between transition-all group ${
                                selectedImageIndex === idx && imageAddStage === 'idle'
                                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                                  : 'text-muted-text hover:bg-white/5 hover:text-text-main'
                              }`}
                            >
                              <span className="font-sans font-bold tracking-widest text-[11px] uppercase truncate">{config.provider}</span>
                              {config.enabled && (
                                <div className={`w-1.5 h-1.5 rounded-full ${selectedImageIndex === idx && imageAddStage === 'idle' ? 'bg-white' : 'bg-purple-400'}`} />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="p-4 border-t border-hud-border">
                          <button 
                            onClick={() => setImageAddStage('input')}
                            className={`w-full py-3 rounded-xl border-2 border-dashed border-hud-border/40 hover:border-purple-500/50 text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${imageAddStage !== 'idle' ? 'text-purple-400 border-purple-500/30' : 'text-muted-text'}`}
                          >
                            <Plus className="w-3 h-3" />
                            新接入引擎
                          </button>
                        </div>
                      </div>

                      {/* Detail Panel */}
                      <div className="flex-1 overflow-y-auto bg-detail-grid bg-[size:40px_40px] px-10 py-8">
                        <AnimatePresence mode="wait">
                          {imageAddStage === 'input' ? (
                            <motion.div 
                              key="image-add-input"
                              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                              className="max-w-2xl"
                            >
                              <div className="space-y-6">
                                <div className="flex items-center gap-3 text-purple-400 mb-8">
                                  <Zap className="w-5 h-5" />
                                  <h3 className="font-sans font-bold text-lg tracking-widest uppercase">生图引擎解析 (AI Image Connect)</h3>
                                </div>
                                <div className="p-8 rounded-2xl bg-panel-bg border border-hud-border shadow-xl space-y-6">
                                  <div className="space-y-2">
                                    <label className="text-xs font-mono text-muted-text uppercase tracking-widest">请输入 生图 API 密钥 (Image Key)</label>
                                    <input 
                                      autoFocus
                                      type="password"
                                      value={newImageApiKey}
                                      onChange={(e) => setNewImageApiKey(e.target.value)}
                                      placeholder="mj-... | sk-... | bn-..."
                                      className="w-full bg-app-bg border border-hud-border rounded-xl px-6 py-4 text-text-main font-mono focus:border-purple-500/50 transition-all outline-none"
                                    />
                                  </div>
                                  <div className="flex gap-4 pt-4">
                                    <button onClick={() => setImageAddStage('idle')} className="flex-1 py-3 rounded-xl border border-hud-border font-sans font-bold text-muted-text hover:text-text-main transition-all uppercase tracking-widest">放弃</button>
                                    <button onClick={handleImageIdentify} disabled={!newImageApiKey.trim()} className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-sans font-bold shadow-lg shadow-purple-600/20 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-30">解析节点</button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : imageAddStage === 'preview' && previewImageConfig ? (
                            <motion.div key="image-add-preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                              <div className="max-w-2xl space-y-8">
                                <div className="flex items-center gap-3 text-purple-400">
                                  <Shield className="w-5 h-5" />
                                  <h3 className="font-sans font-bold text-lg tracking-widest uppercase">生图节点配置确认 (Review Engine)</h3>
                                </div>
                                <div className="p-8 rounded-2xl bg-panel-bg border-2 border-purple-500/30 space-y-6 relative overflow-hidden">
                                  <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-mono text-muted-text uppercase">识别引擎</p>
                                      <p className="font-sans font-bold text-xl uppercase text-text-main">{previewImageConfig.provider}</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[10px] font-mono text-muted-text uppercase">协议接口</p>
                                      <p className="font-mono text-sm font-bold text-purple-400 uppercase">{previewImageConfig.protocol}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                      <p className="text-[10px] font-mono text-muted-text uppercase">默认生成模型</p>
                                      <p className="font-mono text-sm text-text-main bg-app-bg px-4 py-2 rounded-lg border border-hud-border/30">{previewImageConfig.model}</p>
                                    </div>
                                  </div>
                                  <div className="flex gap-4 pt-8">
                                    <button onClick={() => setImageAddStage('input')} className="flex-1 py-3 rounded-xl border border-hud-border font-sans font-bold text-muted-text hover:text-text-main transition-all uppercase tracking-widest">返回修改</button>
                                    <button onClick={handleImageFinalConfirm} className="flex-[2] py-3 rounded-xl bg-purple-600 text-white font-sans font-bold shadow-lg shadow-purple-600/20 active:scale-95 transition-all uppercase tracking-widest">确认接入并激活</button>
                                  </div>
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div key="image-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
                              {imageConfigs[selectedImageIndex] && (
                                <div className="space-y-10">
                                  <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                      <h2 className={`font-sans font-bold text-3xl tracking-[0.2em] uppercase ${imageConfigs[selectedImageIndex].provider.includes('Banana') ? 'text-yellow-400' : 'text-text-main'}`}>
                                        {imageConfigs[selectedImageIndex].provider}
                                      </h2>
                                      <p className="text-xs font-mono text-muted-text uppercase tracking-widest">Image Engine Configuration</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                          type="checkbox" 
                                          className="sr-only peer"
                                          checked={imageConfigs[selectedImageIndex].enabled}
                                          onChange={(e) => updateConfig(selectedImageIndex, { enabled: e.target.checked }, true)}
                                        />
                                        <div className={`w-12 h-6 bg-hud-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full ${imageConfigs[selectedImageIndex].provider.includes('Banana') ? 'peer-checked:bg-yellow-400' : 'peer-checked:bg-purple-600'} after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all`}></div>
                                      </label>
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-main">
                                        {imageConfigs[selectedImageIndex].enabled ? 'RIPE / READY' : 'IDLE'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 gap-8">
                                    <div className="space-y-2">
                                      <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest flex justify-between">
                                        <span>{imageConfigs[selectedImageIndex].provider.includes('Banana') ? '⚠️ Potassium Level' : 'Engine Base URL'}</span>
                                        <LinkIcon className="w-3 h-3" />
                                      </label>
                                      <input 
                                        type="text" 
                                        value={imageConfigs[selectedImageIndex].provider.includes('Banana') ? 'STABLE - 42.0 mg/v1' : imageConfigs[selectedImageIndex].baseUrl}
                                        onChange={(e) => updateConfig(selectedImageIndex, { baseUrl: e.target.value }, true)}
                                        disabled={imageConfigs[selectedImageIndex].provider.includes('Banana')}
                                        className="w-full bg-panel-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono focus:border-purple-500/30 outline-none transition-all disabled:opacity-40"
                                      />
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest">Engine Model Name</label>
                                        <input 
                                          type="text" 
                                          value={imageConfigs[selectedImageIndex].model}
                                          onChange={(e) => updateConfig(selectedImageIndex, { model: e.target.value }, true)}
                                          className="w-full bg-panel-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono focus:border-purple-500/30 outline-none transition-all"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest">Internal Protocol</label>
                                        <div className="w-full bg-app-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono opacity-60">
                                          {imageConfigs[selectedImageIndex].protocol.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-[10px] font-mono text-muted-text uppercase tracking-widest">API Secret Key</label>
                                      <div className="relative">
                                        <input 
                                          type="password" 
                                          value={imageConfigs[selectedImageIndex].apiKey}
                                          onChange={(e) => updateConfig(selectedImageIndex, { apiKey: e.target.value }, true)}
                                          className="w-full bg-panel-bg border border-hud-border rounded-xl px-4 py-3 text-sm text-text-main font-mono focus:border-purple-500/30 outline-none transition-all"
                                          placeholder="Update engine key..."
                                        />
                                        <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-text" />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-8 border-t border-hud-border flex justify-between items-center">
                                    <button 
                                      onClick={() => deleteConfig(selectedImageIndex, true)}
                                      className="px-6 py-2.5 rounded-xl border border-hud-border/50 text-xs font-sans font-medium text-muted-text hover:text-red-400 hover:border-red-400/30 transition-all uppercase tracking-widest flex items-center gap-2"
                                    >
                                      <X className="w-3 h-3" />
                                      驱逐此生成引擎
                                    </button>
                                    <div className="flex items-center gap-2 text-muted-text font-mono text-[10px] italic">
                                      * 数据已存储于本地域 (LocalStorage)
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-hud-border bg-app-bg/30 flex justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-sans font-bold text-text-main uppercase tracking-widest">模拟加载 (Mock Loading)</span>
                  <span className="text-[9px] font-mono text-muted-text uppercase tracking-tighter">Toggle simulation delays</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={isMockLoadingEnabled}
                    onChange={(e) => setIsMockLoadingEnabled(e.target.checked)}
                  />
                  <div className={`w-11 h-5 bg-hud-border rounded-full peer peer-checked:bg-brand-red/30 transition-all border border-hud-border/50 group-hover:border-brand-red/30 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-muted-text peer-checked:after:bg-brand-red after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-6 shadow-inner`}></div>
                </label>
              </div>

              <div className="flex gap-4">
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
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
  );
}
