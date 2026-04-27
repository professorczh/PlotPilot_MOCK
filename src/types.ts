export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  status: 'draft' | 'completed';
}

export interface PlotStage {
  id: string;
  title: string;
  description?: string;
  chapters: Chapter[];
}

export interface Volume {
  id: string;
  title: string;
  stages: PlotStage[];
}

export interface NovelBook {
  id: string;
  title: string;
  volumes: Volume[];
}

export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface Relationship {
  source: string;
  target: string;
  type: string;
}

export interface TensionPoint {
  chapter: number;
  rhythm: number;
  suspense: number;
  conflict: number;
}

export type AgentStatus = 'idle' | 'panel_open' | 'starting' | 'running' | 'paused' | 'completed' | 'error';

export type SidebarTab = 'chapters' | 'search' | 'world' | 'branch' | 'settings' | 'characters' | 'ai-chat' | 'ai-deduce' | 'ai-suggest' | 'ai-polish';

export interface TraceStep {
  id: string;
  label: string;
  status: 'pending' | 'thinking' | 'completed';
  type: 'search' | 'logic' | 'check' | 'evolve' | 'aggregate';
  details?: string;
}

export interface AISuggestion {
  id: string;
  title: string;
  content: string;
  isRecommended?: boolean;
  type?: 'plot' | 'character' | 'world' | 'other';
}

export interface AgentMessage {
  id?: string;
  role: 'ai' | 'user';
  text?: string;
  content?: string;
  timestamp?: string;
  trace?: TraceStep[];
  isThinking?: boolean;
  suggestions?: AISuggestion[];
}

export type ThemeMode = 'ink' | 'paper' | 'classic';
