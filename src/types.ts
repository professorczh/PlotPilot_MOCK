export interface Chapter {
  id: string;
  title: string;
  content: string;
  wordCount: number;
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
