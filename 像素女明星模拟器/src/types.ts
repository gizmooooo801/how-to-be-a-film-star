export interface PlayerStats {
  name: string;
  fans: number;          // 粉絲數
  wealth: number;        // 資金 (以萬元為單位)
  concentration: number; // 專注力 (0-100)
  health: number;        // 健康 (0-100)
  positiveRep: number;   // 正向聲譽
  negativeRep: number;   // 負面聲譽
  beauty: number;        // 美貌 (0-100)
  skill: number;         // 個人業務能力 (0-100)
  decisionPower: number; // 當前決策力
  maxDecisionPower: number; // 最大決策力 (5)
}

export interface TimeState {
  year: number;
  month: number;
  cycle: '上旬' | '中旬' | '下旬';
  round: number; // 1-5 回合
}

export interface NPC {
  id: string;
  name: string;
  gender: 'M' | 'F';
  appearance: string;
  personality: string;
  tag: string;           // 标签，例如：金牌编剧、顶流男星、温柔导演、护短经纪人
  status: '不熟' | '暧昧' | '恋人' | '官宣';
  affection: number;     // 好感度 (0-200)
  height?: number;       // 身高 (cm)
  age?: number;          // 年龄
  resume?: string;       // 履历背景
}

export interface HistoryItem {
  id: string;
  speaker: string;
  title?: string;
  text: string;
  role: 'npc' | 'player' | 'narrator';
}

export interface FanMessage {
  id: string;
  sender: string;
  roleType: 'career' | 'beauty' | 'mom' | 'gf' | 'passerby' | 'hater'; // 粉絲種類
  message: string;
  time: string;
}

export interface SocialComment {
  id: string;
  sender: string;
  roleType: 'fan' | 'hater' | 'passerby';
  text: string;
  likes: number;
}

export interface SocialPost {
  id: string;
  content: string;
  date: string;
  likes: number;
  comments: SocialComment[];
}

export interface GameScript {
  id: string;
  title: string;
  type: 'drama' | 'variety' | 'album';
  description: string;
  reward?: string;
}

export interface CurrentActivity {
  type: 'idle' | 'filming' | 'variety' | 'class';
  title: string;
  totalCycles: number;
  remainingCycles: number;
}

export interface GameState {
  stats: PlayerStats;
  time: TimeState;
  npcs: NPC[];
  currentActivity: CurrentActivity;
  history: HistoryItem[];
  currentScene: 'bedroom' | 'office' | 'set' | 'red_carpet';
  currentSpeaker: {
    name: string;
    title: string;
  };
  options: string[];
  fansGroupChat: FanMessage[];
  socialPosts: SocialPost[];
  scripts: GameScript[];
}

export interface GameActionResponse {
  storyText: string;
  speakerName: string;
  speakerTitle: string;
  currentScene: 'bedroom' | 'office' | 'set' | 'red_carpet';
  options: string[];
  statsChanges?: Partial<PlayerStats>;
  timeChanges?: Partial<TimeState>;
  newNPCs?: NPC[];
  newFansMessages?: FanMessage[];
  newSocialPost?: SocialPost;
}
