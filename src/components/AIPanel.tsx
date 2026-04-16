import { Sparkles, Brain, Network, Zap, ChevronDown, Plus, ListTree } from 'lucide-react';
import RelationshipGraph from './RelationshipGraph';

export default function AIPanel() {
  return (
    <div className="w-full bg-panel-bg/50 backdrop-blur-sm flex flex-col h-full overflow-hidden">
      {/* Creation Order / Outline */}
      <div className="h-1/3 border-b border-hud-border flex flex-col overflow-hidden">
        <div className="p-3 border-b border-hud-border flex items-center justify-between bg-app-bg/30">
          <div className="flex items-center gap-2 text-emerald-400">
            <ListTree className="w-4 h-4" />
            <span className="text-xs font-display font-bold uppercase tracking-widest">Logic Stream</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-text" />
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          <div className="relative pl-4 border-l border-hud-border space-y-4">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-panel-bg shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div className="text-xs font-mono text-muted-text mb-1 uppercase">Phase 01 - Conflict</div>
              <div className="text-sm text-text-main bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                Lin Mo discovers the array on the rooftop, tension with Zhang Lei escalates.
              </div>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-hud-border border-2 border-panel-bg" />
              <div className="text-xs font-mono text-muted-text mb-1 uppercase">Phase 02 - Discovery</div>
              <div className="text-sm text-muted-text p-2">
                Enters the other world, meets the mysterious elder.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-hud-border flex items-center justify-between bg-app-bg/30">
          <div className="flex items-center gap-2 text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-display font-bold uppercase tracking-widest">AI Co-Pilot</span>
          </div>
          <button className="p-1 text-muted-text hover:text-brand-red transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
          <div className="bg-panel-bg/50 border border-hud-border rounded-lg p-3 space-y-3 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-blue-500/30" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-text">VARIANT_01</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">Recommended</span>
            </div>
            <p className="text-sm text-muted-text leading-relaxed">
              The secret base isn't just a hideout; it's a gateway. As he steps in, time fractures...
            </p>
            <div className="flex gap-2">
              <button className="flex-1 py-1 rounded bg-brand-red text-xs font-mono uppercase text-white hover:bg-red-700 transition-colors shadow-[0_0_10px_rgba(220,38,38,0.2)]">Apply</button>
              <button className="flex-1 py-1 rounded bg-hud-border text-xs font-mono uppercase text-muted-text hover:text-text-main transition-colors">Diff</button>
            </div>
          </div>

          <div className="bg-panel-bg/50 border border-hud-border rounded-lg p-3 space-y-3 opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-text">VARIANT_02</span>
            </div>
            <p className="text-sm text-muted-text leading-relaxed">
              Zhang Lei's provocation was a test from the "Shadow" organization...
            </p>
          </div>
        </div>
      </div>

      {/* Relationship Graph Section */}
      <div className="h-64 border-t border-hud-border flex flex-col bg-panel-bg/80">
        <div className="p-3 border-b border-hud-border flex items-center justify-between bg-app-bg/30">
          <div className="flex items-center gap-2 text-purple-400">
            <Network className="w-4 h-4" />
            <span className="text-xs font-display font-bold uppercase tracking-widest">Entity Map</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-text" />
        </div>
        <div className="flex-1 relative overflow-hidden">
          <RelationshipGraph />
          {/* HUD Overlay */}
          <div className="absolute inset-0 pointer-events-none border border-brand-red/5 m-2 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

