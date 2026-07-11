import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Users,
  Coins,
  Clapperboard,
  Tv,
  BookOpen,
  Send,
  RefreshCw,
  Award,
  Smartphone,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Heart,
  Volume2,
  PenLine
} from "lucide-react";
import { GameState, HistoryItem, FanMessage, SocialPost, PlayerStats, TimeState, NPC, CurrentActivity } from "./types";

// Dynamic Pixel Scene Mapping
const SCENE_IMAGES = {
  bedroom: "/src/assets/images/luxury_bedroom_pixel_1783780168933.jpg",
  office: "/src/assets/images/agent_office_pixel_1783780183854.jpg",
  set: "/src/assets/images/movie_set_pixel_1783780196953.jpg",
  red_carpet: "/src/assets/images/red_carpet_pixel_1783780210941.jpg",
};

// Initial Backup Data for Graceful Failover
const INITIAL_STATS: PlayerStats = {
  name: "苏映雪",
  fans: 850000,
  wealth: 500, // 500万元
  concentration: 80,
  health: 100,
  positiveRep: 50,
  negativeRep: 0,
  beauty: 90,
  skill: 78,
  decisionPower: 5,
  maxDecisionPower: 5
};

const INITIAL_TIME: TimeState = {
  year: 1,
  month: 1,
  cycle: '上旬',
  round: 1
};

const INITIAL_NPCS: NPC[] = [
  { 
    id: "npc-1", 
    name: "沈墨", 
    gender: "M", 
    appearance: "深邃凤眼，五官俊挺，188公分完美九头身，神情总是带着淡淡的疏离感", 
    personality: "工作极其严苛专注、外冷内热，实则是个纯情温柔、不善表达的白纸男神", 
    tag: "顶流影帝", 
    status: "不熟", 
    affection: 20,
    height: 188,
    age: 26,
    resume: "三届影帝，电影圈神话。出身书香世家，专注纯粹的表演。在红毯及试镜中被你绝美的高挑仪态与扎实演技折服，从此默默为你提供专业演技指点。"
  },
  { 
    id: "npc-2", 
    name: "唐薇", 
    gender: "F", 
    appearance: "一头干练深灰短发，剪裁精细的高档羊绒西装，脚踩八公分细高跟，气场全开", 
    personality: "雷厉风行、杀伐果断，对自家艺人极其护短宠溺，处事周全妥帖", 
    tag: "金牌经纪人", 
    status: "不熟", 
    affection: 40,
    height: 172,
    age: 30,
    resume: "圈内叱咤风云的王牌推手。待你如至亲长姐，誓要用尽工作室所有顶级人脉与公关公帑，将你打造成无可替代的璀璨巨星。"
  },
  { 
    id: "npc-3", 
    name: "顾青", 
    gender: "F", 
    appearance: "常戴一副黑框眼镜，身穿舒适随性的卡其色工装服，知性且带有文艺艺术气质", 
    personality: "追求极致镜头美学，毒舌犀利，眼光极高，但对女性创作者与演员极其体贴温柔", 
    tag: "新锐女导演", 
    status: "不熟", 
    affection: 15,
    height: 168,
    age: 28,
    resume: "戛纳电影节最佳新人导演，镜头美学天才。在看完《凤冠》大鼓舞后瞬间将你视为唯一的灵感缪斯，力邀你出演多部高奖项女主。"
  },
  { 
    id: "npc-4", 
    name: "陆淮", 
    gender: "M", 
    appearance: "修长十指戴着黑曜石徽章戒指，笑意温润舒缓，常身穿淡蓝色名牌衬衫，气质矜贵", 
    personality: "优雅绅士、风度翩翩，极富财阀钞能力，说话永远保持令人舒适的分寸感", 
    tag: "豪门世家继承人", 
    status: "不熟", 
    affection: 10,
    height: 185,
    age: 25,
    resume: "顶级陆氏财阀第三代掌门接班人。高学历精英。在私人马会聚会中被你落落大方的千金气质吸引，经常豪掷千金赞助你的影视综艺，只求红颜一笑。"
  },
  { 
    id: "npc-5", 
    name: "林知夏", 
    gender: "F", 
    appearance: "笑起来有一对甜美的小梨涡，圆脸大眼睛，胶原蛋白满满的邻家女孩纯甜感", 
    personality: "好胜心强但磊落坦荡，极其爱分享八卦吐槽，大大咧咧毫无心机", 
    tag: "同期竞争小花", 
    status: "不熟", 
    affection: 15,
    height: 165,
    age: 22,
    resume: "童星出道的人气小花，也是你的大学班长。虽然资源经常重叠竞争，却由衷钦佩你的实力，总是私下里给你通风报信对家的黑料，是可爱的欢喜冤家。"
  },
  { 
    id: "npc-6", 
    name: "周子谦", 
    gender: "M", 
    appearance: "一头微卷淡金短发，穿着前卫朋克风短夹克，戴着标志性单边曜黑耳钉", 
    personality: "阳光傲娇、肆意张扬，音乐才华极其狂放，私下说话直球可爱易害羞", 
    tag: "新潮唱作歌手", 
    status: "不熟", 
    affection: 20,
    height: 180,
    age: 21,
    resume: "现象级摇滚乐团主唱，天才词曲制作人。对你的音乐天赋赞不绝口，极其偏爱并强烈期待为你量身定制首张百万级白金唱片。"
  },
  { 
    id: "npc-7", 
    name: "叶澜", 
    gender: "F", 
    appearance: "神情冷艳傲视群芳，经典纯黑定制高奢礼服，腕间戴着限量版百达翡丽钻表", 
    personality: "眼光极其挑剔、追求极致商业与艺术利益，举手投足尽是名门名媛风范", 
    tag: "高奢亚太公关总监", 
    status: "不熟", 
    affection: 10,
    height: 170,
    age: 31,
    resume: "时尚界真正的权力女魔头，各大蓝血、红血奢牌中国区的公关总监。在红毯上一眼被你的高挑体态与神仙骨相惊艳，直接跳过考察期双手为你奉上全球代言。"
  },
  { 
    id: "npc-8", 
    name: "楚然", 
    gender: "M", 
    appearance: "身形清瘦修长，戴一副金丝边框眼镜，常捧着白瓷温热茶杯，神情温和而忧郁", 
    personality: "温润如玉、心细如发、观察力极强、是个重度内敛的清冷文青", 
    tag: "实力派金牌编剧", 
    status: "不熟", 
    affection: 15,
    height: 182,
    age: 27,
    resume: "内娱最年轻的白玉兰金牌编剧。极其排斥资本塞人，唯独在见到你之后，惊叹你就是他笔下崔温言等灵魂角色的完美现世化身，视你为精神支柱。"
  },
  {
    id: "npc-9",
    name: "纪宸",
    gender: "M",
    appearance: "剑眉星目，轮廓深邃冷峻，常穿一身剪裁凌冽的纯黑定制三件套西服，190公分极具压迫感的完美身材",
    personality: "冷漠矜贵、掌控欲极强，实则对你深沉偏执，醋意横飞却极克制守礼",
    tag: "神秘奢品财阀掌门人",
    status: "不熟",
    affection: 15,
    height: 190,
    age: 28,
    resume: "掌控半个时尚圈与奢品供应链的超级巨鳄，纪氏跨国集团掌门人。曾暗中动用庞大力量为你保驾护航，解决无数黑粉阴谋，只为了在暗处默默守护你。"
  }
];

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: "init-0",
    speaker: "旁白",
    text: "在一间铺着温软藕粉色长绒地毯、散发着淡淡乌木玫瑰香气的欧式复古卧室里，身段高挑修长的你正倚在落地窗前的金色藤椅上。你穿着一袭舒适服帖的丝绸睡袍，刚洗过吹干的长发随意地披散在精致削瘦的双肩上，176公分的高挑体态在晨光里显得极有星相。",
    role: "narrator"
  },
  {
    id: "init-1",
    speaker: "唐姐",
    title: "金牌经纪人",
    text: "“映雪，醒了？真不愧是我们工作室的门面，这素颜状态，哪怕是高清原相机抓拍也挑不出半点瑕疵。”唐姐今天穿着一身干练的灰色羊绒西装，踩着细高跟走进来，神情里满是宠溺与自豪。她极其熟稔地伸出温暖的指尖，帮你理顺了耳侧的一缕乌发，随后将怀里抱着了几份沉甸甸的精美文件夹平铺在你的红木梳妆台上。",
    role: "npc"
  },
  {
    id: "init-2",
    speaker: "唐姐",
    title: "金牌经纪人",
    text: "“看看这三个邀约，我专门在业内给你物色、严厉把关留下来的最顶级资源。一个是古装大型大作《韶华歌》的反派女二‘崔温言’，腹黑贵女，绝世心机，极其能激发你的演技反差；一个是都市奇幻《双面迷踪》，一人分饰两角需要极强的肢体才艺；还有一个是爆款智力综艺《心跳现场》常驻。宝贝，你来看看哪个最对你的胃口，唐姐马上去给你敲定合约。”",
    role: "npc"
  }
];

const INITIAL_FANS_CHAT: FanMessage[] = [
  { id: "fc-1", sender: "映雪守护星", roleType: "career", message: "大家今天给《凤冠》少时鲁朝歌的红毯直拍控评了吗！数据组需要支援！", time: "09:30" },
  { id: "fc-2", sender: "大小姐的蕾丝边", roleType: "gf", message: "呜呜呜老婆那176的大长腿和神仙仪态，我直接在红毯边疯狂尖叫！", time: "09:32" },
  { id: "fc-3", sender: "雪宝多吃肉", roleType: "mom", message: "听说雪宝最近天天连轴转试镜，一定要多吃点有营养的，别累坏了，妈妈心疼！", time: "09:35" },
  { id: "fc-4", sender: "朝歌一舞倾城", roleType: "beauty", message: "今天在机场路透看到雪宝素颜了，皮肤亮得发光，仪态管理真是内娱独一份，大小姐气场太强了。", time: "09:41" },
  { id: "fc-5", sender: "数据猛虎冲冲冲", roleType: "career", message: "大家注意！听说雪宝手上有新剧本了！咱们事业粉一定要随时待命，官宣一出立刻占领高地！", time: "09:45" }
];

const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "sp-1",
    content: "今天在剧组完成了《凤冠》的最后一次宣传拍摄，感谢大家对鲁朝歌的喜爱。工作室今晚在评论区抽20位雪球送出高奢限定礼盒，么么哒！[图片]",
    date: "2026-07-10",
    likes: 342000,
    comments: [
      { id: "sc-1", sender: "雪宝老婆贴贴", roleType: "fan", text: "啊啊啊大小姐又开始撒钱式宠粉了！高奢礼盒！中奖绝缘体疯狂求中！", likes: 12000 },
      { id: "sc-2", sender: "柠檬不吃醋", roleType: "hater", text: "这就是富二代女星的钞能力吗？除了营销有钱还能营销什么？", likes: 800 },
      { id: "sc-3", sender: "正义路人甲", roleType: "passerby", text: "楼上的酸什么啊，人家演技和仪态在《凤冠》里有目共睹，跳舞热搜是真材实料，大小姐真金白银抽奖还踩？", likes: 4500 },
      { id: "sc-4", sender: "事业粉阿强", roleType: "fan", text: "美强但不惨！期待大小姐接下来的新剧本，我们雪球永远是你最坚固的后盾！", likes: 3200 }
    ]
  }
];

export default function App() {
  // Game primary states
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem("actress_sim_stats_v2");
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [time, setTime] = useState<TimeState>(() => {
    const saved = localStorage.getItem("actress_sim_time_v2");
    return saved ? JSON.parse(saved) : INITIAL_TIME;
  });

  const [npcs, setNpcs] = useState<NPC[]>(() => {
    const saved = localStorage.getItem("actress_sim_npcs_v2");
    return saved ? JSON.parse(saved) : INITIAL_NPCS;
  });

  const [currentActivity, setCurrentActivity] = useState<CurrentActivity>(() => {
    const saved = localStorage.getItem("actress_sim_activity_v2");
    return saved ? JSON.parse(saved) : { type: 'idle', title: '閒置中', totalCycles: 0, remainingCycles: 0 };
  });

  const [dramaCompletedCount, setDramaCompletedCount] = useState<number>(() => {
    return Number(localStorage.getItem("actress_sim_drama_count") || "1");
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem("actress_sim_history_v2");
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  const [currentScene, setCurrentScene] = useState<'bedroom' | 'office' | 'set' | 'red_carpet'>(() => {
    const saved = localStorage.getItem("actress_sim_scene_v2");
    if (saved) {
      if (saved === 'bedroom' || saved === 'office' || saved === 'set' || saved === 'red_carpet') {
        return saved;
      }
      try {
        const parsed = JSON.parse(saved);
        if (parsed === 'bedroom' || parsed === 'office' || parsed === 'set' || parsed === 'red_carpet') {
          return parsed;
        }
      } catch (e) {
        // Safe fallback
      }
    }
    return 'bedroom';
  });

  const [currentSpeaker, setCurrentSpeaker] = useState<{ name: string; title: string }>({ name: "唐姐", title: "金牌經紀人" });

  const [options, setOptions] = useState<string[]>([
    "仔細翻閱古裝劇本《韶華歌》，和唐姐探討反派‘崔溫言’的角色張力",
    "閱讀奇幻劇本《雙面迷蹤》，思考如何詮釋雙胞胎的極端人格差",
    "仔細看綜藝《心跳現場》大綱，向唐姐詢問其他常駐嘉賓陣容"
  ]);

  const [fansGroupChat, setFansGroupChat] = useState<FanMessage[]>(INITIAL_FANS_CHAT);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(INITIAL_SOCIAL_POSTS);

  // UI tabs & states
  const [activeTab, setActiveTab] = useState<'story' | 'npcs' | 'fans' | 'social' | 'memo'>('story');
  const [selectedNpc, setSelectedNpc] = useState<NPC | null>(null);
  const [chatMessageInput, setChatMessageInput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [renameInput, setRenameInput] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);
  const [postDraft, setPostDraft] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Save & Load States
  const [isSaveLoadOpen, setIsSaveLoadOpen] = useState(false);
  const [savesMetadata, setSavesMetadata] = useState<any[]>([]);

  // References
  const logEndRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (activeTab === 'story') {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (activeTab === 'fans') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, fansGroupChat, activeTab]);

  // Persist states to local storage
  useEffect(() => {
    localStorage.setItem("actress_sim_stats_v2", JSON.stringify(stats));
    localStorage.setItem("actress_sim_time_v2", JSON.stringify(time));
    localStorage.setItem("actress_sim_npcs_v2", JSON.stringify(npcs));
    localStorage.setItem("actress_sim_activity_v2", JSON.stringify(currentActivity));
    localStorage.setItem("actress_sim_drama_count", String(dramaCompletedCount));
    localStorage.setItem("actress_sim_history_v2", JSON.stringify(history));
    localStorage.setItem("actress_sim_scene_v2", currentScene);
  }, [stats, time, npcs, currentActivity, dramaCompletedCount, history, currentScene]);

  // Sound generator
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "square";
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      console.warn(e);
    }
  };

  // Toast Notifier
  const triggerAlert = (type: 'success' | 'info' | 'error', message: string) => {
    setCurrentAlert({ type, message });
    setTimeout(() => {
      setCurrentAlert(null);
    }, 4500);
  };

  // Offset Negative Reputation via Beauty and Skill (Rule 7)
  const calculateNegativeOffset = (rawNegative: number): { netValue: number; offsetAmt: number } => {
    if (rawNegative <= 0) return { netValue: 0, offsetAmt: 0 };
    // Offset up to 80% depending on Beauty and Skill
    const totalPotential = stats.beauty + stats.skill;
    const offsetFactor = Math.min(0.8, totalPotential / 220); // max 80%
    const offsetAmt = Math.round(rawNegative * offsetFactor);
    const netValue = Math.max(0, rawNegative - offsetAmt);
    return { netValue, offsetAmt };
  };

  // Progress stats and trigger alert
  const applyStatsChanges = (changes?: Partial<PlayerStats>) => {
    if (!changes) return;
    setStats(prev => {
      const updated = { ...prev };
      let logs: string[] = [];

      if (changes.fans !== undefined && changes.fans !== 0) {
        updated.fans = Math.max(0, updated.fans + changes.fans);
        logs.push(`粉絲 ${changes.fans > 0 ? '+' : ''}${changes.fans.toLocaleString()}`);
      }
      if (changes.wealth !== undefined && changes.wealth !== 0) {
        updated.wealth = Math.max(0, updated.wealth + changes.wealth);
        logs.push(`資金 ${changes.wealth > 0 ? '+' : ''}${changes.wealth}萬`);
      }
      if (changes.concentration !== undefined && changes.concentration !== 0) {
        updated.concentration = Math.min(100, Math.max(0, updated.concentration + changes.concentration));
        logs.push(`專注力 ${changes.concentration > 0 ? '+' : ''}${changes.concentration}%`);
      }
      if (changes.health !== undefined && changes.health !== 0) {
        updated.health = Math.min(100, Math.max(0, updated.health + changes.health));
        logs.push(`健康 ${changes.health > 0 ? '+' : ''}${changes.health}%`);
      }
      if (changes.beauty !== undefined && changes.beauty !== 0) {
        updated.beauty = Math.min(100, Math.max(0, updated.beauty + changes.beauty));
        logs.push(`美貌 ${changes.beauty > 0 ? '+' : ''}${changes.beauty}%`);
      }
      if (changes.skill !== undefined && changes.skill !== 0) {
        updated.skill = Math.min(100, Math.max(0, updated.skill + changes.skill));
        logs.push(`業務能力 ${changes.skill > 0 ? '+' : ''}${changes.skill}%`);
      }
      if (changes.positiveRep !== undefined && changes.positiveRep !== 0) {
        updated.positiveRep = Math.max(0, updated.positiveRep + changes.positiveRep);
        logs.push(`正向聲譽 ${changes.positiveRep > 0 ? '+' : ''}${changes.positiveRep}`);
      }
      if (changes.negativeRep !== undefined && changes.negativeRep !== 0) {
        const { netValue, offsetAmt } = calculateNegativeOffset(changes.negativeRep);
        updated.negativeRep = Math.max(0, updated.negativeRep + netValue);
        if (offsetAmt > 0) {
          logs.push(`負面聲譽 +${netValue} (憑神顏與實力已抵消 ${offsetAmt} 點！ )`);
        } else {
          logs.push(`負面聲譽 +${netValue}`);
        }
      }

      if (logs.length > 0) {
        triggerAlert('success', `✨ 屬性異動: ${logs.join(" | ")}`);
      }
      return updated;
    });
  };

  // Turn Progression Mechanics (Rule 5)
  const advanceTurn = () => {
    setTime(prev => {
      let r = prev.round + 1;
      let c = prev.cycle;
      let m = prev.month;
      let y = prev.year;

      if (r > 5) {
        r = 1;
        if (c === '上旬') {
          c = '中旬';
        } else if (c === '中旬') {
          c = '下旬';
        } else {
          c = '上旬';
          m += 1;
          if (m > 12) {
            m = 1;
            y += 1;
          }
          
          // Shifting activity cycles
          if (currentActivity.type !== 'idle') {
            setCurrentActivity(act => {
              const rem = act.remainingCycles - 1;
              if (rem <= 0) {
                // Done activity!
                setTimeout(() => {
                  triggerAlert('success', `🎉 恭喜！你順利完成了通告『${act.title}』！`);
                  if (act.type === 'filming') {
                    setDramaCompletedCount(d => d + 1);
                  }
                }, 1000);
                return { type: 'idle', title: '閒置中', totalCycles: 0, remainingCycles: 0 };
              }
              return { ...act, remainingCycles: rem };
            });
          }
        }
      }

      // Check Wanhua Awards (六月萬花獎) at Month 6 下旬 Turn 5 (Rule 9)
      if (m === 6 && c === '下旬' && r === 5) {
        setTimeout(() => {
          evaluateWanhuaAwards();
        }, 1500);
      }

      return { year: y, month: m, cycle: c, round: r };
    });
  };

  // Annual Wanhua Awards evaluation
  const evaluateWanhuaAwards = () => {
    const wins = stats.skill >= 80 && stats.beauty >= 80 && dramaCompletedCount >= 2;
    if (wins) {
      applyStatsChanges({ positiveRep: 100, fans: 500000 });
      setHistory(prev => [
        ...prev,
        {
          id: `wanhua-${Date.now()}`,
          speaker: "萬花獎組委會",
          title: "評估大典",
          text: `【六月萬花獎璀璨現場】
在萬眾矚目的六月萬花獎盛典紅毯上，你身穿高定高貴晚禮服、以176公分的完美神仙儀態傲視群雄。由於年度業務能力突破80，且手握至少兩部高口碑影視作品，組委會正式宣告：

「本屆最佳女主角得主為——蘇映雪！」

台下雷鳴般的掌聲響起，沈墨等頂流巨星在第一排對你致以最專注克制的讚許與生理性心動眼神。
年度評語：你是內娛罕見集豪門貴氣、腹黑智慧與頂級演技於一體的實力派天之驕子，實至名歸的頂流女帝。`,
          role: "narrator"
        }
      ]);
      setCurrentScene('red_carpet');
      triggerAlert('success', "🏆 榮獲萬花大獎最佳女主角！粉絲暴漲50萬！");
    } else {
      setHistory(prev => [
        ...prev,
        {
          id: `wanhua-fail-${Date.now()}`,
          speaker: "萬花獎組委會",
          title: "年度評估",
          text: `【六月萬花獎結算】
評委會對你的演藝表現進行了評選。你目前完成了 ${dramaCompletedCount} 部作品，業務能力為 ${stats.skill}。
很遺憾本次未能斬獲最佳女主角。
年度評語：大小姐氣質極佳，但仍需多接拍影視作品（需至少完成2部）並持續磨礪個人業務能力與美貌，期待明年在萬花獎一飛沖天！`,
          role: "narrator"
        }
      ]);
      triggerAlert('info', "💡 繼續加油，明年此時一定抱回萬花獎！");
    }
  };

  // Rest action logic (Rule 5)
  const handleRest = () => {
    playBeep();
    // Restore health, restore decision power, advance turn
    setStats(prev => ({
      ...prev,
      health: Math.min(100, prev.health + 25),
      decisionPower: prev.maxDecisionPower
    }));
    advanceTurn();
    
    setHistory(prev => [
      ...prev,
      {
        id: `rest-${Date.now()}`,
        speaker: "旁白",
        text: "你在鋪著柔軟真絲床單的奢華大床上美美地睡了一覺。房間裡縈繞著幽暗舒緩的烏木玫瑰冷香。清晨醒來時，只覺得渾身緊繃的疲憊一掃而空，氣色紅潤，神顏依舊。你那高挑挺拔的完美身軀重新注入了滿滿的活力與靈感。",
        role: "narrator"
      }
    ]);
    triggerAlert('success', "🛌 深度睡眠結束！健康度大增，決策力已恢復至滿值！");
  };

  // Determine current active scheduling round rules
  const getRoundType = (): 'free' | 'class_auto' | 'filming_auto' | 'variety_auto' => {
    if (currentActivity.type === 'class') return 'class_auto';
    
    if (currentActivity.type === 'filming') {
      // filiming allows only 2 free turns per cycle (turns 1, 2 are free, 3, 4, 5 are auto-filming)
      return time.round <= 2 ? 'free' : 'filming_auto';
    }
    
    if (currentActivity.type === 'variety') {
      // variety allows 3 free turns per cycle (turns 1, 2, 3 are free, 4, 5 are auto-variety)
      return time.round <= 3 ? 'free' : 'variety_auto';
    }
    
    return 'free';
  };

  // Handle active class learning click
  const handleAutoClassAction = () => {
    playBeep();
    applyStatsChanges({ skill: 3, concentration: 2, health: -5 });
    advanceTurn();
    setHistory(prev => [
      ...prev,
      {
        id: `class-${Date.now()}`,
        speaker: "老師",
        text: "“很好，映雪！你的表情管理和爆發力簡直無懈可擊，不愧是豪門自小培養出的身段儀態！”私人表演導師對你讚不絕口。在寬敞明亮的排練室裡，你一邊擦汗，一邊反思角色內心，業務實力正持續上漲。",
        role: "npc"
      }
    ]);
  };

  // Handle auto filming round click
  const handleAutoFilmingAction = () => {
    playBeep();
    applyStatsChanges({ skill: 2, fans: 3000, health: -6, concentration: -5 });
    advanceTurn();
    
    const randomClip = [
      "片場的聚光燈明晃晃地打在你高挑優美的身上。你神色自若地對著影帝沈墨冷酷地說完台詞，他俊眉微挑，眼神裡滿是藏不住的生理性讚許與寵溺。",
      "在漫天人造飛雪的宮廷片場中，你一襲大紅刺繡崔溫言戲服、神情狠辣而又透著絕色淒美。導演顧青在監視器後看得目不轉睛，拍案叫絕。",
      "今天拍攝高強度的台詞博弈。你完美的體態與精湛、有些許腹黑的反差台詞爆發力，讓現場圍觀的同期小花林知夏忍不住連連鼓掌。"
    ];
    const text = randomClip[Math.floor(Math.random() * randomClip.length)];

    setHistory(prev => [
      ...prev,
      {
        id: `filming-${Date.now()}`,
        speaker: "旁白",
        text,
        role: "narrator"
      }
    ]);
    setCurrentScene('set');
  };

  // Handle auto variety round click
  const handleAutoVarietyAction = () => {
    playBeep();
    applyStatsChanges({ beauty: 1, fans: 6000, health: -5, concentration: -4 });
    advanceTurn();

    const randomClip = [
      "密室綜藝錄製現場，你高挑的身軀優雅穿梭在迷宮裡，一邊優雅解鎖一邊小腹黑地捉弄對手，逗得現場導演和導播哈哈大笑，話題度爆棚！",
      "在智力競賽關卡，你以驚人的推理速度連破三關，隨手拂過耳畔長髮的優雅抓拍瞬間引爆微博，無數顏粉和事業粉紛紛被撩倒！"
    ];
    const text = randomClip[Math.floor(Math.random() * randomClip.length)];

    setHistory(prev => [
      ...prev,
      {
        id: `variety-${Date.now()}`,
        speaker: "旁白",
        text,
        role: "narrator"
      }
    ]);
    setCurrentScene('set');
  };

  // Sign contract from memo
  const handleSignContract = (type: 'class' | 'filming' | 'variety') => {
    playBeep();
    if (currentActivity.type !== 'idle') {
      triggerAlert('error', "當前已有合約通告在身，請先完成手中的通告！");
      return;
    }

    if (type === 'class') {
      if (stats.wealth < 20) {
        triggerAlert('error', "工作室資金不足20萬，無法支付高階表演培訓費！");
        return;
      }
      applyStatsChanges({ wealth: -20 });
      setCurrentActivity({
        type: 'class',
        title: '高階大師演技課',
        totalCycles: 1,
        remainingCycles: 1
      });
      triggerAlert('success', "📚 成功簽署演技大師特訓！預計消耗 1 旬時間。");
    } else if (type === 'filming') {
      applyStatsChanges({ wealth: 150 });
      setCurrentActivity({
        type: 'filming',
        title: '古裝巨作《韶華歌》(崔溫言)',
        totalCycles: 9,
        remainingCycles: 9
      });
      triggerAlert('success', "🎬 成功签约進組《韶華歌》劇組！獲得預付款 +150萬元。預計需要 9 旬。");
      setCurrentScene('set');
    } else if (type === 'variety') {
      applyStatsChanges({ wealth: 80 });
      setCurrentActivity({
        type: 'variety',
        title: '智力爆款綜藝《心跳現場》常駐',
        totalCycles: 5,
        remainingCycles: 5
      });
      triggerAlert('success', "🎥 成功簽約綜藝《心跳現場》錄製！獲得酬勞 +80萬元。預計需要 5 旬。");
    }
  };

  // Main game action (decisions)
  const handleGameAction = async (actionType: 'init' | 'choice' | 'custom' | 'fans' | 'post' | 'chat', actionValue: string) => {
    playBeep();
    setLoading(true);
    setCustomInput("");

    // Calculate decision cost (Rule 4)
    const cost = stats.health < 50 ? 2 : 1;
    
    if (actionType === 'choice' || actionType === 'custom') {
      if (stats.decisionPower < cost) {
        setLoading(false);
        triggerAlert('error', `🚫 當前疲憊值過高！剩餘決策力不足 ${cost} 點，請點擊「🛌 休息恢復」休整一日！`);
        return;
      }
    }

    // Temporary history log
    let newHistory = [...history];
    if (actionType === 'choice' || actionType === 'custom') {
      newHistory.push({
        id: `turn-${Date.now()}-p`,
        speaker: stats.name,
        text: actionValue,
        role: 'player'
      });
      setHistory(newHistory);
    } else if (actionType === 'chat') {
      newHistory.push({
        id: `turn-${Date.now()}-p-chat`,
        speaker: stats.name,
        text: `【手機聊天中】發送訊息給${actionValue}: "${chatMessageInput || "探討演藝心得"}"`,
        role: 'player'
      });
      setHistory(newHistory);
    }

    try {
      const response = await fetch("/api/game/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stats,
          time,
          npcs,
          currentActivity,
          history: newHistory,
          actionType,
          actionValue: actionType === 'chat' ? chatMessageInput || "與你探討一下這次的劇本設計" : actionValue
        })
      });

      if (!response.ok) throw new Error("故事引擎與AI連接有微弱波動");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      // Apply changes
      if (data.currentScene) setCurrentScene(data.currentScene);
      if (data.speakerName) {
        setCurrentSpeaker({
          name: data.speakerName,
          title: data.speakerTitle || ""
        });
      }

      // Add storytelling narration
      if (data.storyText) {
        setHistory(prev => [
          ...prev,
          {
            id: `turn-${Date.now()}-npc`,
            speaker: data.speakerName,
            title: data.speakerTitle,
            text: data.storyText,
            role: data.speakerName === '旁白' ? 'narrator' : 'npc'
          }
        ]);
      }

      if (data.options && data.options.length > 0) {
        setOptions(data.options);
      }

      // Deduct Decision Power on choices (Rule 4)
      let calculatedStatsChanges = { ...data.statsChanges };
      if (actionType === 'choice' || actionType === 'custom') {
        calculatedStatsChanges.decisionPower = -cost;
        calculatedStatsChanges.health = (calculatedStatsChanges.health || 0) - 3; // base decision exhaustion
        advanceTurn();
      }

      if (calculatedStatsChanges) {
        applyStatsChanges(calculatedStatsChanges);
      }

      // Update NPC Affections & lists (Rule 3)
      if (data.newNPCs) {
        setNpcs(data.newNPCs);
        // Find if selected NPC got updated
        if (selectedNpc) {
          const updatedSelected = data.newNPCs.find((n: any) => n.id === selectedNpc.id);
          if (updatedSelected) {
            setSelectedNpc(updatedSelected);
          }
        }
      } else if (actionType === 'chat') {
        // Fallback update NPC affection slightly
        setNpcs(prev => prev.map(n => {
          if (n.name === actionValue) {
            const newAff = Math.min(200, n.affection + 10);
            let newStatus = n.status;
            if (newAff >= 150) newStatus = '官宣';
            else if (newAff >= 100) newStatus = '戀人';
            else if (newAff >= 80) newStatus = '曖昧';
            return { ...n, affection: newAff, status: newStatus };
          }
          return n;
        }));
        setChatMessageInput("");
      }

      // Fan chat handling
      if (data.newFansMessages) {
        setFansGroupChat(prev => [...prev, ...data.newFansMessages].slice(-30));
        if (actionType === 'fans') {
          setActiveTab('fans');
          triggerAlert('info', "💬 粉絲群消息刷新成功！");
        }
      }

      // Social posting comments
      if (data.newSocialPost) {
        setSocialPosts(prev => [data.newSocialPost, ...prev]);
        if (actionType === 'post') {
          setActiveTab('social');
          setPostDraft("");
          triggerAlert('success', "📱 成功發送營業推文！活人評論區瞬間點讚破萬！");
        }
      }

    } catch (err: any) {
      console.error(err);
      triggerAlert('error', err.message || "由於靈感星光微弱，故事發生了超時。");
      
      // Standalone graceful recovery
      if (actionType === 'choice' || actionType === 'custom') {
        setTimeout(() => {
          setHistory(prev => [
            ...prev,
            {
              id: `fallback-${Date.now()}`,
              speaker: "唐姐",
              title: "金牌經紀人",
              text: `“寶貝，你的想法真是太有膽識和大小姐的豪氣張力了。咱們就這麼辦，工作室用一等一的頂高資金給你做行公關配合。”唐姐拍手讚揚。她的細高跟在紅木地板上發出好聽的脆響，美目裡閃爍著百分之百的安全感。`,
              role: "npc"
            }
          ]);
          setStats(prev => ({ ...prev, decisionPower: Math.max(0, prev.decisionPower - cost) }));
          advanceTurn();
          setLoading(false);
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadSavesMetadata = () => {
    const metadataList = [];
    for (let i = 1; i <= 5; i++) {
      const dataStr = localStorage.getItem(`actress_sim_save_slot_${i}`);
      if (dataStr) {
        try {
          const fullData = JSON.parse(dataStr);
          metadataList.push({
            slot: i,
            hasData: true,
            name: fullData.stats?.name || "未知艺名",
            fans: fullData.stats?.fans || 0,
            time: `第${fullData.time?.year}年${fullData.time?.month}月`,
            date: fullData.saveDate || "未知时间"
          });
        } catch (e) {
          metadataList.push({ slot: i, hasData: false });
        }
      } else {
        metadataList.push({ slot: i, hasData: false });
      }
    }
    setSavesMetadata(metadataList);
  };

  const handleSaveToSlot = (slot: number) => {
    playBeep();
    const saveDate = new Date().toLocaleString("zh-CN", { hour12: false });
    const fullState = {
      stats,
      time,
      npcs,
      currentActivity,
      dramaCompletedCount,
      history,
      currentScene,
      options,
      fansGroupChat,
      socialPosts,
      saveDate
    };
    try {
      localStorage.setItem(`actress_sim_save_slot_${slot}`, JSON.stringify(fullState));
      triggerAlert('success', `💾 成功保存至档位 SLOT ${slot}！`);
      loadSavesMetadata();
    } catch (e) {
      triggerAlert('error', `❌ 存档失败：${(e as Error).message}`);
    }
  };

  const handleLoadFromSlot = (slot: number) => {
    playBeep();
    const dataStr = localStorage.getItem(`actress_sim_save_slot_${slot}`);
    if (!dataStr) {
      triggerAlert('error', `❌ 该档位 SLOT ${slot} 没有数据！`);
      return;
    }
    try {
      const fullState = JSON.parse(dataStr);
      if (fullState.stats) setStats(fullState.stats);
      if (fullState.time) setTime(fullState.time);
      if (fullState.npcs) setNpcs(fullState.npcs);
      if (fullState.currentActivity) setCurrentActivity(fullState.currentActivity);
      if (typeof fullState.dramaCompletedCount === 'number') setDramaCompletedCount(fullState.dramaCompletedCount);
      if (fullState.history) setHistory(fullState.history);
      if (fullState.currentScene) setCurrentScene(fullState.currentScene);
      if (fullState.options) setOptions(fullState.options);
      if (fullState.fansGroupChat) setFansGroupChat(fullState.fansGroupChat);
      if (fullState.socialPosts) setSocialPosts(fullState.socialPosts);

      triggerAlert('success', `📂 成功从档位 SLOT ${slot} 载入游戏！`);
      setIsSaveLoadOpen(false);
    } catch (e) {
      triggerAlert('error', `❌ 读档失败：损坏的存档文件`);
    }
  };

  // Reset Game entirely
  const handleResetGame = () => {
    if (window.confirm("确定要重置你的女明星生涯，重新展开全新随机生成局吗？")) {
      playBeep();
      setStats(INITIAL_STATS);
      setTime(INITIAL_TIME);
      setNpcs(INITIAL_NPCS);
      setCurrentActivity({ type: 'idle', title: '闲置中', totalCycles: 0, remainingCycles: 0 });
      setDramaCompletedCount(1);
      setHistory(INITIAL_HISTORY);
      setCurrentScene('bedroom');
      setOptions([
        "仔细翻阅古装剧本《韶华歌》，和唐姐探讨反派‘崔温言’的角色张力",
        "阅读奇幻剧本《双面迷踪》，思考如何诠释双胞胎的极端人格差",
        "仔细看综艺《心跳现场》大纲，向唐姐询问其他常驻嘉宾阵容"
      ]);
      setFansGroupChat(INITIAL_FANS_CHAT);
      setSocialPosts(INITIAL_SOCIAL_POSTS);
      setActiveTab('story');
      setSelectedNpc(null);
      triggerAlert('info', "🆕 全新娱乐圈女明星生涯已重新随机生成！");
    }
  };

  // Change celebrity stage name
  const handleRename = () => {
    if (!renameInput.trim()) return;
    playBeep();
    setStats(prev => ({ ...prev, name: renameInput.trim() }));
    setIsRenaming(false);
    triggerAlert('success', `👑 艺名已优雅变更为: ${renameInput.trim()}`);
  };

  const roundType = getRoundType();

  return (
    <div className="min-h-screen bg-[#0d0706] p-3 md:p-6 font-sans text-[#f4f1ea] flex flex-col justify-between max-w-7xl mx-auto selection:bg-[#fca5a5] selection:text-[#1c1311]">
      
      {/* RETRO PIXEL STATS BAR */}
      <header className="pixel-border-chunky bg-[#1a0f0e] p-4 mb-4 relative overflow-hidden flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Glow neon banner strip */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#fca5a5] to-transparent animate-pulse" />
        
        {/* Profile Card */}
        <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
          <div className="w-14 h-14 bg-[#341d1a] border-2 border-[#a27b6f] flex items-center justify-center pixel-corners shrink-0 relative">
            <Sparkles className="w-8 h-8 text-[#fca5a5] animate-pulse" />
            <span className="absolute bottom-0 right-0 bg-[#fca5a5] text-[#1c1311] font-pixel text-[8px] px-1 font-bold">23岁</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isRenaming ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={renameInput}
                    onChange={(e) => setRenameInput(e.target.value)}
                    placeholder={stats.name}
                    className="bg-[#241312] border border-[#a27b6f] px-2 py-0.5 font-sans text-xs focus:outline-none w-28 text-[#fca5a5]"
                    maxLength={10}
                  />
                  <button onClick={handleRename} className="bg-[#a27b6f] text-[#1c1311] px-2 py-0.5 text-[10px] font-pixel rounded cursor-pointer">
                    确认
                  </button>
                  <button onClick={() => setIsRenaming(false)} className="text-[#a27b6f] text-[10px] underline hover:text-[#fca5a5] cursor-pointer">
                    取消
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-chinese-pixel text-[#fca5a5] tracking-wide">{stats.name}</h1>
                  <button onClick={() => { setRenameInput(stats.name); setIsRenaming(true); playBeep(); }} className="text-[#a27b6f] hover:text-[#fca5a5] p-1 cursor-pointer" title="更改艺名">
                    <PenLine className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-[10px] md:text-xs text-[#a27b6f] font-mono mt-0.5">
              176cm | 富家千金转型实力新人 | 温婉腹黑
            </p>
          </div>
        </div>

        {/* Dynamic Month Time Monitor */}
        <div className="bg-[#241312] px-4 py-2 border border-[#3c201d] rounded flex items-center gap-3 shrink-0 lg:w-44 text-center justify-center">
          <div>
            <div className="text-[9px] text-[#a27b6f] font-pixel">TIME MONITOR</div>
            <div className="font-chinese-pixel text-xs text-[#fed7aa] font-bold">
              第 {time.year} 年 {time.month} 月 {time.cycle}
            </div>
            <div className="text-[10px] text-[#a27b6f] font-mono">
              本旬回合 {time.round} / 5
            </div>
          </div>
        </div>

        {/* Resources Indicator */}
        <div className="grid grid-cols-2 gap-3 w-full lg:w-auto lg:min-w-[280px]">
          {/* Fans */}
          <div className="bg-[#241312] border border-[#3c201d] p-2 pixel-corners flex items-center gap-2">
            <Users className="w-4 h-4 text-[#fed7aa]" />
            <div>
              <div className="text-[8px] text-[#a27b6f] font-pixel">FANS (粉丝数)</div>
              <div className="font-mono text-xs font-bold text-[#fed7aa]">{stats.fans.toLocaleString()}</div>
            </div>
          </div>
          {/* Wealth */}
          <div className="bg-[#241312] border border-[#3c201d] p-2 pixel-corners flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#fde047]" />
            <div>
              <div className="text-[8px] text-[#a27b6f] font-pixel">WEALTH (资金)</div>
              <div className="font-mono text-xs font-bold text-[#fde047]">{stats.wealth} 万元</div>
            </div>
          </div>
        </div>

        {/* Status Bars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-1 lg:flex lg:flex-col gap-2.5 w-full lg:w-[190px] text-[10px]">
          {/* Concentration */}
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-[#a7f3d0]">🎯 专注度 {stats.concentration}%</span>
            </div>
            <div className="h-1.5 bg-[#241312] border border-[#3c201d] rounded-sm overflow-hidden">
              <div className="h-full bg-[#34d399] transition-all duration-300" style={{ width: `${stats.concentration}%` }} />
            </div>
          </div>
          {/* Health */}
          <div>
            <div className="flex justify-between mb-0.5">
              <span className={stats.health < 50 ? "text-red-400 font-bold animate-pulse" : "text-[#fca5a5]"}>
                ❤️ 健康度 {stats.health}% {stats.health < 50 && "(压力加倍!)"}
              </span>
            </div>
            <div className="h-1.5 bg-[#241312] border border-[#3c201d] rounded-sm overflow-hidden">
              <div className="h-full bg-[#f87171] transition-all duration-300" style={{ width: `${stats.health}%` }} />
            </div>
          </div>
          {/* Beauty */}
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-[#fce7f3]">🌸 美貌指数 {stats.beauty}%</span>
            </div>
            <div className="h-1.5 bg-[#241312] border border-[#3c201d] rounded-sm overflow-hidden">
              <div className="h-full bg-[#f472b6] transition-all duration-300" style={{ width: `${stats.beauty}%` }} />
            </div>
          </div>
          {/* Skill */}
          <div>
            <div className="flex justify-between mb-0.5">
              <span className="text-[#e2e8f0]">🎭 业务能力 {stats.skill}%</span>
            </div>
            <div className="h-1.5 bg-[#241312] border border-[#3c201d] rounded-sm overflow-hidden">
              <div className="h-full bg-[#94a3b8] transition-all duration-300" style={{ width: `${stats.skill}%` }} />
            </div>
          </div>
        </div>

        {/* Decision Power Tracker (Rule 4) */}
        <div className="flex flex-col items-center justify-center shrink-0 w-full lg:w-28 bg-[#341210] p-2 border border-red-950 pixel-corners">
          <div className="text-[8px] text-[#fca5a5] font-pixel">DECISION POWER</div>
          <div className="font-mono text-lg font-bold text-red-400 mt-0.5">
            {stats.decisionPower} / {stats.maxDecisionPower}
          </div>
          <div className="text-[8px] text-[#a27b6f] font-mono text-center">
            {stats.health < 50 ? "低健康：消耗x2" : "正常：消耗x1"}
          </div>
        </div>

        {/* Sound controls */}
        <button
          onClick={() => { setSoundEnabled(!soundEnabled); playBeep(); }}
          className={`absolute bottom-2 right-2 p-1 text-[10px] flex items-center gap-1 ${soundEnabled ? 'text-[#fca5a5]' : 'text-gray-600'} cursor-pointer`}
          title={soundEnabled ? "靜音" : "開啟音效"}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span className="font-pixel text-[8px]">{soundEnabled ? "ON" : "OFF"}</span>
        </button>
      </header>

      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {currentAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`pixel-border-chunky p-3 mb-4 flex items-center gap-2.5 z-50 text-xs ${
              currentAlert.type === 'success' ? 'bg-[#0f2d1e] text-[#86efac] border-[#22c55e]' :
              currentAlert.type === 'error' ? 'bg-[#4c0505] text-[#fca5a5] border-[#ef4444]' :
              'bg-[#1e1b4b] text-[#c7d2fe] border-[#6366f1]'
            }`}
          >
            {currentAlert.type === 'success' && <CheckCircle className="w-4 h-4 shrink-0" />}
            {currentAlert.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {currentAlert.type === 'info' && <HelpCircle className="w-4 h-4 shrink-0" />}
            <span className="font-medium tracking-wide">{currentAlert.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE SCHEDULE OVERLAY BANNER */}
      {currentActivity.type !== 'idle' && (
        <div className="mb-4 bg-[#21110f] border-2 border-dashed border-[#a27b6f] p-3 flex justify-between items-center text-xs text-[#fed7aa] pixel-corners">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-[#fca5a5] animate-spin" />
            <span>
              當前通告排程：<strong>【{currentActivity.title}】</strong>
            </span>
          </div>
          <div>
            進組剩餘：<strong className="text-[#fca5a5]">{currentActivity.remainingCycles}</strong> 旬
            {currentActivity.type === 'filming' && " (本旬自由活動時間：2回合)"}
            {currentActivity.type === 'variety' && " (本旬自由活動時間：3回合)"}
          </div>
        </div>
      )}

      {/* CENTRAL PLAY BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 mb-4 items-stretch min-h-[460px]">
        
        {/* LEFT COLUMN: Visual Viewport & Dialogue Card */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-[#1a0f0e] pixel-border-chunky p-3 relative">
          
          {/* Location Viewport */}
          <div className="relative aspect-[16/9] w-full bg-[#0c0807] overflow-hidden pixel-corners border-2 border-[#3c201d]">
            <img
              src={SCENE_IMAGES[currentScene] || SCENE_IMAGES.bedroom}
              alt="Pixel Scene"
              className="w-full h-full object-cover select-none filter brightness-[0.82] contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />
            
            {/* Stage Tag */}
            <span className="absolute top-3 left-3 bg-[#1a0f0e]/95 text-[#fca5a5] font-chinese-pixel text-xs px-2.5 py-1 border border-[#a27b6f] pixel-corners tracking-wider">
              📍 {currentScene === 'bedroom' ? '豪华奢品闺房' : currentScene === 'office' ? '明星千金工作室' : currentScene === 'set' ? '影视剧组片场' : '万花盛典红毯'}
            </span>

            {/* AI Loading state */}
            {loading && (
              <div className="absolute inset-0 bg-[#0c0807]/80 flex flex-col items-center justify-center gap-3 z-30">
                <RefreshCw className="w-10 h-10 text-[#fca5a5] animate-spin" />
                <span className="font-chinese-pixel text-sm text-[#fca5a5] tracking-widest animate-pulse">
                  灵感星光点亮，故事推进中...
                </span>
              </div>
            )}
          </div>

          {/* ACTIVE SPEAKER BLOCK */}
          <div className="mt-4 bg-[#241312] border border-[#3c201d] p-3 rounded-sm relative">
            <div className="absolute -top-3 left-3 bg-[#a27b6f] text-[#1c1311] px-3 py-0.5 text-xs font-chinese-pixel font-semibold border border-[#1a0f0e] rounded-sm">
              {currentSpeaker.name} {currentSpeaker.title && <span className="text-[10px] opacity-90">({currentSpeaker.title})</span>}
            </div>
            
            <div className="text-sm md:text-base tracking-wide leading-relaxed mt-2 text-[#fcf9f2] min-h-[50px] whitespace-pre-wrap font-sans">
              {history[history.length - 1]?.text || "等待故事开启..."}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Smartphone Console */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#1a0f0e] pixel-border-chunky p-3">
          
          {/* Tab buttons */}
          <div className="flex border-b border-[#3c201d] pb-2 gap-1 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('story'); playBeep(); }}
              className={`px-2.5 py-1.5 text-xs font-chinese-pixel whitespace-nowrap border rounded-t-md transition-all cursor-pointer ${
                activeTab === 'story'
                  ? 'bg-[#241312] text-[#fca5a5] border-[#a27b6f] border-b-transparent font-bold'
                  : 'bg-[#1a0f0e] text-[#a27b6f] border-transparent hover:text-[#fca5a5]'
              }`}
            >
              📖 剧本小说
            </button>
            <button
              onClick={() => { setActiveTab('npcs'); playBeep(); }}
              className={`px-2.5 py-1.5 text-xs font-chinese-pixel whitespace-nowrap border rounded-t-md transition-all cursor-pointer ${
                activeTab === 'npcs'
                  ? 'bg-[#241312] text-[#fca5a5] border-[#a27b6f] border-b-transparent font-bold'
                  : 'bg-[#1a0f0e] text-[#a27b6f] border-transparent hover:text-[#fca5a5]'
              }`}
            >
              📱 联系人手机
            </button>
            <button
              onClick={() => { setActiveTab('fans'); playBeep(); }}
              className={`px-2.5 py-1.5 text-xs font-chinese-pixel whitespace-nowrap border rounded-t-md transition-all cursor-pointer ${
                activeTab === 'fans'
                  ? 'bg-[#241312] text-[#fca5a5] border-[#a27b6f] border-b-transparent font-bold'
                  : 'bg-[#1a0f0e] text-[#a27b6f] border-transparent hover:text-[#fca5a5]'
              }`}
            >
              💬 粉丝群聊
            </button>
            <button
              onClick={() => { setActiveTab('social'); playBeep(); }}
              className={`px-2.5 py-1.5 text-xs font-chinese-pixel whitespace-nowrap border rounded-t-md transition-all cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-[#241312] text-[#fca5a5] border-[#a27b6f] border-b-transparent font-bold'
                  : 'bg-[#1a0f0e] text-[#a27b6f] border-transparent hover:text-[#fca5a5]'
              }`}
            >
              📱 新浪微博
            </button>
            <button
              onClick={() => { setActiveTab('memo'); playBeep(); }}
              className={`px-2.5 py-1.5 text-xs font-chinese-pixel whitespace-nowrap border rounded-t-md transition-all cursor-pointer ${
                activeTab === 'memo'
                  ? 'bg-[#241312] text-[#fca5a5] border-[#a27b6f] border-b-transparent font-bold'
                  : 'bg-[#1a0f0e] text-[#a27b6f] border-transparent hover:text-[#fca5a5]'
              }`}
            >
              🎒 备忘通告
            </button>
          </div>

          {/* TAB CONTENTS SCROLLABLE */}
          <div className="flex-1 bg-[#241312] border border-[#3c201d] p-3 my-3 overflow-y-auto max-h-[380px] min-h-[310px] relative">
            
            {/* TAB 1: STORY LOGS */}
            {activeTab === 'story' && (
              <div className="space-y-4 pr-1 text-sm md:text-base">
                {history.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`border-l-2 pl-3 py-1 transition-all ${
                      item.role === 'player'
                        ? 'border-[#fca5a5] bg-[#341d1a]/30'
                        : item.role === 'narrator'
                        ? 'border-gray-700 border-dashed text-gray-400 italic'
                        : 'border-[#a27b6f]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-[#a27b6f] font-mono mb-1">
                      <span>{item.role === 'player' ? '👑' : '✨'}</span>
                      <span className="font-semibold">{item.speaker}</span>
                      {item.title && <span>({item.title})</span>}
                    </div>
                    <p className="leading-relaxed text-[#f4f1ea] whitespace-pre-wrap">{item.text}</p>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            )}

            {/* TAB 2: NPC INTERACTIVE CHAT (Rule 3) */}
            {activeTab === 'npcs' && (
              <div className="space-y-4 pr-1 text-xs">
                {selectedNpc ? (
                  /* PRIVATE NPC CHAT ROOM */
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-[#3c201d] pb-2 sticky top-0 bg-[#241312] z-10">
                      <button
                        onClick={() => { setSelectedNpc(null); playBeep(); }}
                        className="text-[#fca5a5] hover:underline font-chinese-pixel text-[11px]"
                      >
                        ◀ 返回聯絡人
                      </button>
                      <span className="font-chinese-pixel text-[#fed7aa] font-bold">
                        💬 {selectedNpc.name} ({selectedNpc.tag})
                      </span>
                    </div>

                    {/* NPC Profile Metadata */}
                    <div className="bg-[#1a0f0e] p-2.5 rounded border border-[#3c201d] mb-2 space-y-1">
                      <p className="text-[10px] text-gray-400">
                        <strong>外貌：</strong>{selectedNpc.appearance}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        <strong>性格：</strong>{selectedNpc.personality}
                      </p>
                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-[#3c201d]/50">
                        <span className="text-pink-400 font-bold">
                          ❤️ 好感度：{selectedNpc.affection} / 200
                        </span>
                        <span className="bg-[#341210] px-1.5 rounded scale-90 text-[#fca5a5] border border-red-950">
                          關係：{selectedNpc.status}
                        </span>
                      </div>
                    </div>

                    {/* Quick Predefined Topics */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[#a27b6f] block">🎯 選擇聊天話題：</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setChatMessageInput("最近收到了新劇本，想請教你對崔溫言這個角色的表演建議！");
                            playBeep();
                          }}
                          className="bg-[#1a0f0e] border border-[#3c201d] p-1.5 rounded text-left hover:border-[#fca5a5] text-[10px] text-gray-300 hover:text-white truncate"
                        >
                          🎭 探討劇本崔溫言
                        </button>
                        <button
                          onClick={() => {
                            setChatMessageInput("劇組拍戲辛苦啦，聽說你最近愛聽古箏曲？我剛好帶了一張珍藏琴譜送你！");
                            playBeep();
                          }}
                          className="bg-[#1a0f0e] border border-[#3c201d] p-1.5 rounded text-left hover:border-[#fca5a5] text-[10px] text-gray-300 hover:text-white truncate"
                        >
                          🎁 贈送驚喜小禮
                        </button>
                        <button
                          onClick={() => {
                            setChatMessageInput("今天天氣不錯，我們拍完戲後，要不要一起去你常說的那家露天咖啡廳喝一杯？");
                            playBeep();
                          }}
                          className="bg-[#1a0f0e] border border-[#3c201d] p-1.5 rounded text-left hover:border-[#fca5a5] text-[10px] text-gray-300 hover:text-white truncate"
                        >
                          ☕ 邀約浪漫下午茶
                        </button>
                        <button
                          onClick={() => {
                            setChatMessageInput("聽說你在劇組片場最近有些感冒？一定要多加衣服保重身體呀，雪球關心你。");
                            playBeep();
                          }}
                          className="bg-[#1a0f0e] border border-[#3c201d] p-1.5 rounded text-left hover:border-[#fca5a5] text-[10px] text-gray-300 hover:text-white truncate"
                        >
                          ❤️ 溫情體貼問候
                        </button>
                      </div>
                    </div>

                    {/* Chat Text Input */}
                    <div className="flex gap-2 pt-2 border-t border-[#3c201d]">
                      <input
                        type="text"
                        value={chatMessageInput}
                        onChange={(e) => setChatMessageInput(e.target.value)}
                        placeholder="輸入簡訊內容..."
                        className="flex-1 bg-[#1a0f0e] border border-[#3c201d] p-2 focus:outline-none focus:border-[#a27b6f] rounded text-xs text-[#f4f1ea]"
                        maxLength={100}
                      />
                      <button
                        onClick={() => {
                          if (!chatMessageInput.trim()) return;
                          handleGameAction('chat', selectedNpc.name);
                        }}
                        disabled={loading || !chatMessageInput.trim()}
                        className="bg-[#fca5a5] text-[#1c1311] px-4 rounded font-chinese-pixel font-bold text-xs disabled:opacity-50"
                      >
                        傳送
                      </button>
                    </div>

                    <div className="text-[10px] text-gray-500 text-center italic">
                      （提示：好感度達80可曖昧約會，100為戀人，150可官宣公開關係）
                    </div>
                  </div>
                ) : (
                  /* CONTACTS LIST (up to 8) */
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-[#3c201d] pb-2">
                      <span className="font-chinese-pixel text-xs text-[#fca5a5] font-bold">
                        📱 手機社交聯絡人 (共{npcs.length}個)
                      </span>
                      <span className="text-[9px] bg-[#1a0f0e] px-1 text-gray-500 font-mono">
                        每個認識的NPC皆永久儲存
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {npcs.map((npc) => (
                        <div
                          key={npc.id}
                          className="bg-[#1a0f0e] p-2.5 rounded border border-[#3c201d] flex justify-between items-center hover:border-[#a27b6f] transition-all"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={npc.gender === 'M' ? 'text-blue-400' : 'text-pink-400'}>
                                {npc.gender === 'M' ? '♂' : '♀'}
                              </span>
                              <span className="font-chinese-pixel text-xs text-white font-bold">
                                {npc.name}
                              </span>
                              <span className="bg-[#241312] text-[#fed7aa] text-[9px] px-1.5 py-0.2 border border-red-950 scale-90 rounded">
                                {npc.tag}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 line-clamp-1">{npc.personality}</p>
                          </div>

                          <div className="text-right flex flex-col items-end gap-1 shrink-0 ml-3">
                            <span className="text-[9px] text-pink-400 font-bold">
                              ❤️ 好感：{npc.affection}
                            </span>
                            <button
                              onClick={() => { setSelectedNpc(npc); playBeep(); }}
                              className="bg-[#341d1a] hover:bg-[#a27b6f] border border-[#a27b6f] text-[#fca5a5] hover:text-[#1c1311] px-2 py-0.5 text-[10px] font-chinese-pixel rounded transition-all cursor-pointer"
                            >
                              聊天
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: FANS WECHAT CHAT */}
            {activeTab === 'fans' && (
              <div className="space-y-3.5 pr-1 text-xs">
                <div className="sticky top-0 bg-[#241312] border-b border-[#3c201d] pb-2 mb-2 z-10 flex items-center justify-between">
                  <div className="text-[11px] text-[#fca5a5] font-chinese-pixel">
                    💬 「雪球大小姐官方純粉總群 (498人)」
                  </div>
                </div>
                
                {fansGroupChat.map((msg, idx) => (
                  <div key={msg.id || idx} className="flex flex-col items-start bg-[#1a0f0e]/50 p-2 rounded border border-[#3c201d]/60 hover:bg-[#1a0f0e] transition-all">
                    <div className="flex items-center gap-2 mb-1 text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded font-chinese-pixel text-[8px] ${
                        msg.roleType === 'career' ? 'bg-[#fee2e2] text-[#ef4444]' :
                        msg.roleType === 'mom' ? 'bg-[#ffedd5] text-[#f97316]' :
                        msg.roleType === 'gf' ? 'bg-[#fce7f3] text-[#ec4899]' :
                        msg.roleType === 'beauty' ? 'bg-[#e0f2fe] text-[#0ea5e9]' :
                        'bg-gray-800 text-gray-400'
                      }`}>
                        {msg.roleType === 'career' ? '事業粉' :
                         msg.roleType === 'mom' ? '親媽粉' :
                         msg.roleType === 'gf' ? '女友粉' :
                         msg.roleType === 'beauty' ? '神顏粉' : '路人'}
                      </span>
                      <span className="font-chinese-pixel text-[#fed7aa] font-bold">{msg.sender}</span>
                      <span className="text-[9px] text-[#a27b6f] font-mono">{msg.time}</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed pl-1">{msg.message}</p>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}

            {/* TAB 4: WEIBO SOCIAL FORUM */}
            {activeTab === 'social' && (
              <div className="space-y-5 pr-1 text-xs">
                
                {/* Compose draft form */}
                <div className="bg-[#1a0f0e] p-3 border border-[#3c201d] pixel-corners mb-3">
                  <span className="text-[11px] font-chinese-pixel text-[#fca5a5] block mb-1.5">
                    📱 親自發表新浪微博 (大方抽獎千金文風)
                  </span>
                  <textarea
                    value={postDraft}
                    onChange={(e) => setPostDraft(e.target.value)}
                    placeholder="今天心情好，隨機在評論區抽10位雪球送高奢限定彩妝禮盒，配一張今天的絕美片場照..."
                    className="w-full bg-[#241312] border border-[#3c201d] p-2 text-xs focus:outline-none focus:border-[#a27b6f] text-[#f4f1ea] rounded resize-none"
                    rows={3}
                    maxLength={150}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[8px] text-gray-500 font-mono">
                      {postDraft.length}/150 字 | 高級名媛大方人設
                    </span>
                    <button
                      onClick={() => {
                        if (!postDraft.trim()) return;
                        handleGameAction('post', postDraft);
                      }}
                      disabled={loading || !postDraft.trim()}
                      className="bg-[#fca5a5] text-[#1c1311] px-3 py-1 font-chinese-pixel font-bold text-xs rounded hover:bg-[#f87171] disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" /> 發表
                    </button>
                  </div>
                </div>

                {socialPosts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">暫無微博推文</div>
                ) : (
                  socialPosts.map((post, idx) => (
                    <div key={post.id || idx} className="border-b border-[#3c201d]/50 pb-5 last:border-0">
                      
                      <div className="bg-[#1a0f0e]/70 p-3 rounded border border-[#3c201d]/40">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-[#fca5a5] text-[#1c1311] rounded-full flex items-center justify-center font-bold font-pixel text-[10px]">
                            {stats.name[0]}
                          </div>
                          <div>
                            <span className="font-chinese-pixel text-xs text-[#fca5a5] block">{stats.name}</span>
                            <span className="text-[8px] text-[#a27b6f] font-mono">{post.date}</span>
                          </div>
                        </div>
                        <p className="text-[#fcf9f2] leading-relaxed whitespace-pre-wrap">{post.content}</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px] text-[#a27b6f] font-mono border-t border-[#3c201d]/40 pt-2">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-[#fca5a5]" /> {post.likes.toLocaleString()}
                          </span>
                          <span>💬 評論 ({post.comments.length})</span>
                        </div>
                      </div>

                      {/* Comments feed */}
                      <div className="mt-2.5 pl-4 space-y-2 border-l-2 border-[#3c201d]">
                        {post.comments.map((comment, cIdx) => (
                          <div key={comment.id || cIdx} className="bg-[#1a0f0e]/30 p-2 rounded">
                            <div className="flex items-center justify-between mb-1 text-[10px]">
                              <div className="flex items-center gap-1.5">
                                <span className="font-chinese-pixel text-[#fed7aa] font-bold">{comment.sender}</span>
                                <span className={`text-[8px] scale-90 px-1.5 ${
                                  comment.roleType === 'fan' ? 'bg-[#fee2e2] text-[#ef4444]' :
                                  comment.roleType === 'hater' ? 'bg-gray-800 text-gray-400' :
                                  'bg-blue-950 text-blue-300'
                                } rounded`}>
                                  {comment.roleType === 'fan' ? '雪粉' : comment.roleType === 'hater' ? '路過黑' : '路人'}
                                </span>
                              </div>
                              <span className="text-[9px] text-[#a27b6f] font-mono">👍 {comment.likes}</span>
                            </div>
                            <p className="text-gray-300 pl-1">{comment.text}</p>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 5: SCRIPTS & MEMORANDUM (Rule 8) */}
            {activeTab === 'memo' && (
              <div className="space-y-4 pr-1 text-xs">
                
                {/* Schedule contract sign */}
                <div className="bg-[#1a0f0e] p-3 border border-[#3c201d] rounded space-y-2.5">
                  <span className="text-xs font-chinese-pixel text-[#fca5a5] block font-bold">
                    📝 簽署通告排程 (當前：{currentActivity.type === 'idle' ? '閒置中' : '進行中'})
                  </span>
                  
                  <div className="space-y-2">
                    {/* Class contract */}
                    <div className="p-2 bg-[#241312] border border-[#3c201d] rounded flex justify-between items-center">
                      <div>
                        <span className="font-chinese-pixel text-xs text-white block">📚 高階表演大師特訓</span>
                        <span className="text-[9px] text-gray-400 block">耗時 1 旬 | 提升大量演技與業務實力</span>
                      </div>
                      <button
                        onClick={() => handleSignContract('class')}
                        className="bg-[#3c201d] hover:bg-[#a27b6f] text-[#fca5a5] hover:text-[#1c1311] text-[10px] px-2.5 py-1 font-chinese-pixel rounded cursor-pointer border border-[#a27b6f]"
                      >
                        學費 20萬
                      </button>
                    </div>

                    {/* Film contract */}
                    <div className="p-2 bg-[#241312] border border-[#3c201d] rounded flex justify-between items-center">
                      <div>
                        <span className="font-chinese-pixel text-xs text-white block">🎬 進組古裝劇《韶華歌》</span>
                        <span className="text-[9px] text-gray-400 block">耗時 9 旬 | 產出萬花獎參評作品 | 僅2回合自由活動</span>
                      </div>
                      <button
                        onClick={() => handleSignContract('filming')}
                        className="bg-[#3c201d] hover:bg-[#a27b6f] text-[#fca5a5] hover:text-[#1c1311] text-[10px] px-2.5 py-1 font-chinese-pixel rounded cursor-pointer border border-[#a27b6f]"
                      >
                        簽約 +150萬
                      </button>
                    </div>

                    {/* Variety contract */}
                    <div className="p-2 bg-[#241312] border border-[#3c201d] rounded flex justify-between items-center">
                      <div>
                        <span className="font-chinese-pixel text-xs text-white block">🎥 爆款綜藝《心跳現場》</span>
                        <span className="text-[9px] text-gray-400 block">耗時 5 旬 | 提升大量知名度與粉絲 | 3回合自由活動</span>
                      </div>
                      <button
                        onClick={() => handleSignContract('variety')}
                        className="bg-[#3c201d] hover:bg-[#a27b6f] text-[#fca5a5] hover:text-[#1c1311] text-[10px] px-2.5 py-1 font-chinese-pixel rounded cursor-pointer border border-[#a27b6f]"
                      >
                        簽約 +80萬
                      </button>
                    </div>
                  </div>
                </div>

                {/* Star Portfolio Details */}
                <div>
                  <h3 className="text-xs font-chinese-pixel text-[#fca5a5] border-b border-[#3c201d] pb-1 mb-2">
                    🏆 璀璨榮譽與星途印記
                  </h3>
                  <ul className="space-y-2 text-[10px] text-gray-400">
                    <li className="flex items-start gap-1">
                      <span className="text-[#fca5a5] shrink-0">★</span>
                      <span>已拍完優秀大作數：<strong>{dramaCompletedCount}</strong> 部。 (萬花獎參評需至少2部拍完作品)</span>
                    </li>
                    <li className="flex items-start gap-1">
                      <span className="text-[#fca5a5] shrink-0">★</span>
                      <span><strong>《鳳冠》大鼓舞</strong>一舞動京城，全網至今累計點擊量突破一億。</span>
                    </li>
                  </ul>
                </div>

              </div>
            )}

          </div>

          {/* LOWER ACTIONS BUTTONS */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => { handleGameAction('fans', ''); playBeep(); }}
              disabled={loading}
              className="bg-[#341d1a] hover:bg-[#a27b6f] text-[#f4f1ea] hover:text-[#1c1311] p-2 text-[10px] font-chinese-pixel border border-[#a27b6f] pixel-corners text-center cursor-pointer transition-all disabled:opacity-50"
            >
              💬 刷粉丝群
            </button>
            <button
              onClick={() => { setActiveTab('social'); playBeep(); triggerAlert('info', '请在上方新浪微博面板中起草帖子发布！'); }}
              className="bg-[#341d1a] hover:bg-[#a27b6f] text-[#f4f1ea] hover:text-[#1c1311] p-2 text-[10px] font-chinese-pixel border border-[#a27b6f] pixel-corners text-center cursor-pointer transition-all"
            >
              📱 发博营业
            </button>
            <button
              onClick={() => { setIsSaveLoadOpen(true); playBeep(); loadSavesMetadata(); }}
              className="bg-[#341d1a] hover:bg-[#a27b6f] text-[#f4f1ea] hover:text-[#1c1311] p-2 text-[10px] font-chinese-pixel border border-[#a27b6f] pixel-corners text-center cursor-pointer transition-all"
            >
              💾 存档读档
            </button>
            <button
              onClick={handleResetGame}
              className="bg-[#341d1a] hover:bg-red-950 text-[#f4f1ea] p-2 text-[10px] font-chinese-pixel border border-red-950 pixel-corners text-center cursor-pointer transition-all"
            >
              🚨 重开演艺
            </button>
          </div>

        </div>
      </div>

      {/* FOOTER CONTROLS BAR */}
      <footer className="pixel-border-chunky bg-[#1a0f0e] p-4 flex flex-col gap-4">
        
        {/* GAME OPTIONS BUTTONS LIST */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs md:text-sm font-chinese-pixel text-[#a27b6f] font-bold tracking-wider">
              👉 唐姐抱着文件夹正温柔地等待你的优雅决定：
            </span>
            
            {/* Active sleeping rest button */}
            <button
              onClick={handleRest}
              disabled={loading}
              className="bg-[#341210] hover:bg-red-900 border border-red-950 text-red-300 px-3 py-1 text-xs font-chinese-pixel rounded pixel-corners flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
            >
              🛌 休息恢复一晚 (+25健康 / 满值决策力)
            </button>
          </div>

          {/* ACTIVE STATE OVERLAYS */}
          {roundType === 'class_auto' && (
            <div className="bg-[#1f2937]/50 border border-gray-700 p-4 rounded text-center space-y-2.5">
              <span className="text-sm md:text-base text-[#fed7aa] font-chinese-pixel block animate-pulse">📚 当前排程：你正在大师班专注修读表演特训中！</span>
              <button
                onClick={handleAutoClassAction}
                className="bg-[#fca5a5] text-[#1c1311] px-6 py-3 text-xs md:text-sm font-chinese-pixel font-bold rounded cursor-pointer animate-bounce hover:bg-white"
              >
                📚 专注听课，吸收表演理论心得 (进入下个回合)
              </button>
            </div>
          )}

          {roundType === 'filming_auto' && (
            <div className="bg-[#1e1b4b]/50 border border-indigo-950 p-4 rounded text-center space-y-2.5">
              <span className="text-sm md:text-base text-[#fca5a5] font-chinese-pixel block animate-pulse">🎬 当前排程：崔温言大戏拍摄中！(本旬后半段自动拍戏)</span>
              <button
                onClick={handleAutoFilmingAction}
                className="bg-[#fca5a5] text-[#1c1311] px-6 py-3 text-xs md:text-sm font-chinese-pixel font-bold rounded cursor-pointer animate-bounce hover:bg-white"
              >
                🎬 全神贯注与影帝对戏、拍哭戏 (进入下个回合)
              </button>
            </div>
          )}

          {roundType === 'variety_auto' && (
            <div className="bg-[#312e81]/40 border border-indigo-900 p-4 rounded text-center space-y-2.5">
              <span className="text-sm md:text-base text-[#fed7aa] font-chinese-pixel block animate-pulse">🎥 当前排程：心跳现场综艺后半旬录制中！</span>
              <button
                onClick={handleAutoVarietyAction}
                className="bg-[#fed7aa] text-[#1c1311] px-6 py-3 text-xs md:text-sm font-chinese-pixel font-bold rounded cursor-pointer animate-bounce hover:bg-white"
              >
                🎥 录制密室逃脱、大展高情商智囊团 (进入下个回合)
              </button>
            </div>
          )}

          {/* Standard Free selection options */}
          {roundType === 'free' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGameAction('choice', opt)}
                  disabled={loading}
                  className="pixel-corners bg-[#241312] hover:bg-[#a27b6f] border-2 border-[#3c201d] hover:border-[#fca5a5] p-4 text-sm md:text-base text-left leading-relaxed text-[#fcf9f2] hover:text-[#1c1311] transition-all cursor-pointer font-sans shadow-md disabled:opacity-50 hover:scale-[1.01] duration-150 relative"
                >
                  <div className="text-[10px] text-[#fca5a5] font-pixel mb-1 font-bold flex justify-between">
                    <span>决定选项 {idx + 1}</span>
                    <span className="text-red-300 font-mono">
                      (⚡ 消耗 {stats.health < 50 ? "2" : "1"} 决策力)
                    </span>
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CUSTOM STRATEGY FORM INPUT */}
        {roundType === 'free' && (
          <div className="border-t border-[#3c201d] pt-3 mt-1">
            <span className="text-xs md:text-sm font-chinese-pixel text-[#a27b6f] block mb-2 font-bold tracking-wider">
              ✍️ 发挥你的千金腹黑性格，在此自主起草应对方针（享受超高自由度 AI 推演）：
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customInput.trim()) return;
                handleGameAction('custom', customInput);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="例如：我狡黠地对唐姐眨了眨眼，说既然对家买通稿，那我就干脆拉高调门，自费开一场高奢公益直播..."
                className="flex-1 bg-[#241312] border-2 border-[#3c201d] p-3 text-xs md:text-sm focus:outline-none focus:border-[#a27b6f] text-[#f4f1ea] rounded-sm placeholder-gray-600"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !customInput.trim()}
                className="bg-[#fca5a5] text-[#1c1311] px-5 py-3 font-chinese-pixel font-bold text-xs md:text-sm rounded-sm hover:bg-[#f87171] transition-all flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> 执行策略
              </button>
            </form>
          </div>
        )}

      </footer>

      {/* SAVE/LOAD MODAL DIALOG */}
      <AnimatePresence>
        {isSaveLoadOpen && (
          <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#1a0f0e] border-4 border-[#a27b6f] p-5 w-full max-w-md pixel-corners relative shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => { setIsSaveLoadOpen(false); playBeep(); }}
                className="absolute top-2 right-3 text-[#a27b6f] hover:text-[#fca5a5] font-bold text-lg font-mono cursor-pointer"
              >
                ✕
              </button>

              <h2 className="text-sm md:text-base font-chinese-pixel text-[#fca5a5] border-b border-[#3c201d] pb-2 mb-4 text-center font-bold">
                💾 存档与读档管理器 (5个独立档位)
              </h2>

              <div className="space-y-3">
                {savesMetadata.map((slotInfo) => (
                  <div
                    key={slotInfo.slot}
                    className="bg-[#241312] border-2 border-[#3c201d] p-3 flex justify-between items-center pixel-corners"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-[#3c201d] text-[#fed7aa] px-1.5 py-0.5 rounded font-pixel font-bold">
                          档位 {slotInfo.slot}
                        </span>
                        {slotInfo.hasData ? (
                          <span className="text-xs text-[#fca5a5] font-bold">{slotInfo.name}</span>
                        ) : (
                          <span className="text-xs text-gray-500 italic">空存档位</span>
                        )}
                      </div>
                      {slotInfo.hasData && (
                        <div className="text-[10px] text-gray-400 space-y-0.5">
                          <p>粉丝：{slotInfo.fans.toLocaleString()} | 时间：{slotInfo.time}</p>
                          <p className="text-[8px] text-[#a27b6f] font-mono">备份时间：{slotInfo.date}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleSaveToSlot(slotInfo.slot)}
                        className="bg-[#3c201d] hover:bg-[#a27b6f] text-[#fca5a5] hover:text-[#1c1311] text-[10px] font-chinese-pixel px-2 py-1 border border-[#a27b6f] rounded cursor-pointer transition-all"
                      >
                        覆盖存档
                      </button>
                      {slotInfo.hasData && (
                        <button
                          onClick={() => handleLoadFromSlot(slotInfo.slot)}
                          className="bg-[#22c55e]/10 hover:bg-[#22c55e] text-[#22c55e] hover:text-[#1c1311] text-[10px] font-chinese-pixel px-2 py-1 border border-[#22c55e] rounded cursor-pointer transition-all"
                        >
                          加载读档
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[9px] text-[#a27b6f] text-center mt-4">
                * 存档数据将安全存储于您的浏览器本地，清除浏览器缓存可能会导致存档丢失。
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
