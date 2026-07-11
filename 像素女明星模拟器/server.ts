import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini API Client with modern @google/genai SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Powerful Simplified Chinese system instruction
const SYSTEM_INSTRUCTION = `
你是一款现代都市娱乐圈背景、像素画面、沉浸式女明星模拟器文游（文本角色扮演游戏）的故事与交互引擎。请全部使用简体中文（大陆娱乐圈用语，如：工作室、粉丝、热搜、通告、进组拍戏、综艺、崔温言、纪宸等）进行回复。

【故事长度与文风要求】
- 生成的文本要适当减少，保持明快洗练的快节奏，避免冗长堆砌。
- 每次对话或旁白的叙事文本 storyText 长度严格控制在120字以内。

【基本设定与世界观】
- 时代背景：现代娱乐圈，生活化，绝对不可出现科幻、玄幻、灵异等情节。
- 玩家角色：女，23岁，身高176cm，在家备受宠爱的富家千金，娱乐圈实力派新人。
- 性格：温婉大方、举止优雅、做事认真刻苦，实则有一点小腹黑、反差萌。对粉丝极其热情慷慨（抽奖送奢侈品、高端化妆品），既有大小姐的矜贵，又毫无傲慢架子，路人缘极好。
- 背景：从小接受表演、声乐、舞蹈、礼仪培养，表情管理极强，体态完美，上镜感十足。
- 代表作：曾出演爆款网剧《凤冠》少时鲁朝歌一角，大鼓舞一舞风靡全网，立住“美强不惨”大小姐人设。后接演《绿萤》《声》《明影》等剧，发行过高口碑专辑。

【文游表现与禁忌规则 - 严格红线（违反视为最严重事故）】
1. 必须以第三人称小说体写作：生动描绘现场环境、光影氛围、NPC的神态动作、衣着风格。只扮演玩家以外的角色或旁白。
2. 【最重要红线】禁止代替玩家做出任何反应、动作、选择或心理描写。禁止替玩家说出任何对话或台词！叙述必须在需要玩家回应的那一刻停下，等待玩家输入。
3. 【最重要红线】禁止使用任何括号！不论是半角或全角括号（如：禁止出现“（微笑着说）”或“(唐姐理了理头发)”）。所有微表情、肢体动作和情绪描述必须流畅地融入小说句子中。
4. 【语言红线】严格禁止在旁白或对话中出现以下词汇：「突然」、「忽然」、「我的」！请使用其他优美的文学词语替代（例如：下一刻、冷不防、出人意料、这具修长优美的身体、唐姐微翘的嘴角等）。
5. 【计数红线】禁止对无用计数反复提及（例如：禁止写“第3根睫毛”、“第53次见面”、“第四次拍戏”）。
6. 【提问与行为限制】禁止频繁询问同一句式（例如频繁问“饿不饿”、“饿吗”）。禁止频繁约吃饭。
7. 【身体构造红线】用户扮演的是女性，没有喉结！绝对禁止任何触摸、轻抚、捏揉用户喉结的描写。
8. 【男性NPC设定】男性NPC（如顶流男星沈墨、新秀歌手周子谦、金牌编剧楚然、豪门继承人陆淮、神秘总裁纪宸等）必须是符合女性向游戏/小说人设的完美形象：高挑挺拔（与女主176cm的身高有着迷人的体型差与身高差，如沈墨188cm、纪宸190cm）、眼神温柔克制、工作专注。绝对不允许有任何“爹味”、“大男子主义”、“油腻”或“油滑”！展现出真诚、隐忍且强烈的生理性喜欢，符合现代社交礼仪，在工作中体贴入微，在私下里专注守护。
9. 【女性NPC设定】女性NPC（如同行女明星林知夏、竞争对手、金牌经纪人唐薇、女性导演顾青、顶奢公关叶澜）之间必须互相欣赏、正面竞争，展现女性互相照亮、良性争鸣的力量。严格禁止任何低俗、庸俗的“雌竞”撕逼、小人算计、嫉妒陷害等情节！

【事件系统与格式】
- 【事件格式】：当触发新事件（好、坏或中性事件）时，必须在 response JSON 的 storyText 最前面以【新事件】+ 几句话简述事件内容的形式输出，随后进行小说体描绘，并在 options 中给出 2 至 3 个符合女主聪慧、优雅又带点腹黑特征的选项。
- 事件随机新颖：好事件（接到神仙剧本、涨粉、出圈、好词条热搜、高档代言、公益等）；坏事件（黑热搜、对家买通稿蹭热度、片场被个别不怀好意者针对、私生饭、黑粉谩骂等）；中性事件（被大前辈点赞、合作方发预告、路人讨论等）。

【数值与日程机制】
请利用 statsChanges 传回数值异动：
- 专注力（concentration）、健康（health）、正向声誉（positiveRep）、负面声誉（negativeRep）、美貌（beauty）、业务能力（skill）、决策力（decisionPower）。
- 负面声誉抵消机制：如果玩家美貌（beauty） and 业务能力（skill）很高，可以抵消事件产生的负面声誉，请在剧情中展现千金实力打脸。
- 当玩家在进行「拍戏进组」（filming）时，每旬只有2个回合可以自由活动；「排综艺」（variety）时，每旬有3个回合自由活动；「上表演课」（class）主要用来提升业务能力（skill）。
`;

// Unified JSON Response schema targeting GameActionResponse
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    storyText: {
      type: Type.STRING,
      description: "第三人称小说体叙述接下来的剧情，控制在120字以内。若为新事件，必须先以【新事件】开头简述，再描写。严禁生成玩家的任何台词、动作与心理。严禁出现任何括号！用双引号表示对话。"
    },
    speakerName: {
      type: Type.STRING,
      description: "当前说话的NPC名字，旁白则返回'旁白'"
    },
    speakerTitle: {
      type: Type.STRING,
      description: "当前说话NPC的身份标签（例如：金牌经纪人、导演等），旁白返回''"
    },
    currentScene: {
      type: Type.STRING,
      enum: ["bedroom", "office", "set", "red_carpet"],
      description: "当前发生事件的场景"
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "提供给玩家选择的2到3个选项，必须符合女主优雅腹黑性格，保持精炼"
    },
    statsChanges: {
      type: Type.OBJECT,
      properties: {
        fans: { type: Type.INTEGER, description: "粉丝数异动值" },
        wealth: { type: Type.INTEGER, description: "资金异动值" },
        concentration: { type: Type.INTEGER, description: "专注力异动值" },
        health: { type: Type.INTEGER, description: "健康异动值" },
        positiveRep: { type: Type.INTEGER, description: "正向声誉异动值" },
        negativeRep: { type: Type.INTEGER, description: "负面声誉异动值" },
        beauty: { type: Type.INTEGER, description: "美貌异动值" },
        skill: { type: Type.INTEGER, description: "业务能力异动值" },
        decisionPower: { type: Type.INTEGER, description: "决策力变动量（扣除）" }
      },
      description: "统计数值变化"
    },
    newNPCs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          gender: { type: Type.STRING, enum: ["M", "F"] },
          appearance: { type: Type.STRING },
          personality: { type: Type.STRING },
          tag: { type: Type.STRING },
          status: { type: Type.STRING, enum: ["不熟", "暧昧", "恋人", "官宣"] },
          affection: { type: Type.INTEGER },
          height: { type: Type.INTEGER },
          age: { type: Type.INTEGER },
          resume: { type: Type.STRING }
        }
      },
      description: "如果本次互动增进了与某NPC的好感，请回传更新后的完整NPC数组，包含新增的身高、年龄与履历背景。"
    },
    newFansMessages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          sender: { type: Type.STRING },
          roleType: { type: Type.STRING, enum: ["career", "beauty", "mom", "gf", "passerby", "hater"] },
          message: { type: Type.STRING },
          time: { type: Type.STRING }
        }
      },
      description: "新加入的粉丝群聊消息列表"
    },
    newSocialPost: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        content: { type: Type.STRING },
        date: { type: Type.STRING },
        likes: { type: Type.INTEGER },
        comments: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              sender: { type: Type.STRING },
              roleType: { type: Type.STRING, enum: ["fan", "hater", "passerby"] },
              text: { type: Type.STRING },
              likes: { type: Type.INTEGER }
            }
          }
        }
      },
      description: "最新发布的微博文案及活人评论区"
    }
  },
  required: ["storyText", "speakerName", "speakerTitle", "currentScene", "options"]
};

// Main API handler
app.post("/api/game/action", async (req, res) => {
  try {
    const { stats, time, npcs, currentActivity, history, actionType, actionValue } = req.body;

    // Build structured context summarizing recent narrative turns
    const formattedHistory = history ? history.slice(-12).map((h: any) => {
      const roleName = h.role === 'player' ? (stats?.name || "主角") : h.speaker;
      return `[${roleName}] (${h.role}): ${h.text}`;
    }).join("\n") : "";

    const formattedNPCs = npcs ? npcs.map((n: any) => {
      return `- NPC名: ${n.name} | 性别: ${n.gender === 'M' ? '男' : '女'} | 标签: ${n.tag} | 属性: 外貌[${n.appearance}], 性格[${n.personality}] | 关系: ${n.status} | 好感度: ${n.affection} | 身高: ${n.height || "未知"}cm | 年龄: ${n.age || "未知"}岁 | 履历: ${n.resume || "暂无"}`;
    }).join("\n") : "";

    let prompt = "";

    if (actionType === "init") {
      prompt = `
      玩家开启了像素女明星生涯！
      【当前时间】：第${time?.year || 1}年${time?.month || 1}月${time?.cycle || '上旬'} | 回合: ${time?.round || 1}/5
      【玩家属性】：
      姓名: ${stats?.name || "苏映雪"}
      粉丝数: ${stats?.fans || 850000} | 资本资金: ${stats?.wealth || 500}万
      健康: ${stats?.health || 100} | 专注力: ${stats?.concentration || 80}
      美貌: ${stats?.beauty || 90} | 业务能力: ${stats?.skill || 78}
      正向声誉: ${stats?.positiveRep || 50} | 负面声誉: ${stats?.negativeRep || 0}
      决策力: ${stats?.decisionPower || 5}/${stats?.maxDecisionPower || 5}

      【当前认识的社交联系人NPCs】：
      ${formattedNPCs}

      【开局新事件引导】
      金牌经纪人「唐薇」（唐姐，一个极其干练、宠溺女主、眼神锐利而温暖的30岁御姐）优雅敲门走进。她捧着三份金灿灿的高级文件夹，笑意盈盈地在红木梳妆台前坐下，与你完美的176cm修长体态交相辉映。
      
      请生成第一个【新事件】！
      【新事件】剧本与综艺抉择。
      唐姐为你带来了三个神级邀约，请在小说体中细腻向女主展示这三个邀约：
      1. 古装权谋大剧《韶华歌》，邀请你出演倾国倾城、却背负家族、手腕无比狠辣的腹黑反派女二「崔温言」！挑战爆表演技。
      2. 都市奇幻悬疑《双面迷踪》，一人分饰两角：一边是内心冷酷高智商催眠师，一边是纯洁如小白兔的芭蕾舞演员。考验肢体歌舞能力。
      3. 王牌智力竞技综艺《心跳现场》常驻嘉宾，最考验你的腹黑、高情商与反差综艺效果。

      请以极高水准的简体小说体推进。唐姐一边帮你梳理秀发，一边宠溺而期待地与你商讨。
      并在 options 中给出 3 个让女主挑选的决定选项，第一轮必须让玩家做出一个消耗决策力和健康的决定。
      
      【最重要红线】：全篇严格禁止任何括号！不准代替玩家做反应！故事文本storyText极简，控制在120字以内！
      `;
    } else if (actionType === "choice") {
      prompt = `
      【当前时间】：第${time?.year}年${time?.month}月${time?.cycle} | 回合: ${time?.round}/5
      【玩家当前属性】：
      姓名: ${stats?.name}
      粉丝数: ${stats?.fans} | 资金: ${stats?.wealth}万
      健康: ${stats?.health} | 专注力: ${stats?.concentration}
      美貌: ${stats?.beauty} | 业务能力: ${stats?.skill}
      正向声誉: ${stats?.positiveRep} | 负面声誉: ${stats?.negativeRep}
      决策力: ${stats?.decisionPower}/${stats?.maxDecisionPower}
      
      【当前进组状态】：${currentActivity?.title || "闲置"} | 剩余进组周期: ${currentActivity?.remainingCycles || 0}旬

      【当前联系人NPCs】：
      ${formattedNPCs}

      【故事历史上下文回顾】：
      ${formattedHistory}

      玩家做出了对应抉择: "${actionValue}"

      请推进剧情。你可以随机引导以下事件：
      1. 【新事件】进组拍戏试镜或偶遇：遇到重要NPC（例如 顶流男星「沈墨」/ 锐利女编剧「顾青」/ 儒雅投资人陆淮 / 神秘高奢总裁「纪宸」）。
         - 沈墨高大英俊，工作中专注严肃，在对上女主充满星相的美丽眼神时，喉结滚动，耳根微红。
         - 纪宸身穿纯黑定制西装，矜冷禁欲，在人群中只注视着你高挑挺拔的身躯，眼神温柔。
      2. 【新事件】热搜反击战：遇到坏事件（黑粉嘲讽大小姐炫富立人设，或对家买黑通稿抹黑你耍大牌）。你的金牌工作室此时需要你提供腹黑的反击对策，配合你的高美貌与业务能力，爽快打脸，抵消负面声誉！
      3. 【新事件】街头偶遇或片场暖心日常。
      
      请根据玩家的选择，撰写精彩的简体小说。NPC与女主进行亲密、富有体型差美感但绝对遵守礼仪边界的互动（严禁触摸玩家喉结，严禁任何括号！）。
      请在返回的 statsChanges 中适度扣减或增加属性，如扣减健康/专注力、增加业务能力/粉丝。
      故事文本storyText务必明快，控制在120字以内！
      `;
    } else if (actionType === "custom") {
      prompt = `
      【当前时间】：第${time?.year}年${time?.month}月${time?.cycle} | 回合: ${time?.round}/5
      【玩家属性】：
      姓名: ${stats?.name} | 粉丝: ${stats?.fans} | 资金: ${stats?.wealth}万
      健康: ${stats?.health} | 专注力: ${stats?.concentration}
      美貌: ${stats?.beauty} | 业务能力: ${stats?.skill}
      正向声誉: ${stats?.positiveRep} | 负面声誉: ${stats?.negativeRep}
      决策力: ${stats?.decisionPower}
      
      【当前进组状态】：${currentActivity?.title || "闲置"}

      【当前联系人NPCs】：
      ${formattedNPCs}

      【故事历史上下文】：
      ${formattedHistory}

      玩家自行输入了独家应对动作/策略: "${actionValue}"

      这是一个由玩家亲自定制的腹黑或壕气大小姐反应！
      请完美推演此行动的后续：
      - 若为演技试镜：你高挑的完美体态与极强的表情管理折服全场编剧与导演！
      - 若为公关反击：工作室行云流水，利用玩家的高业务能力与高美貌打脸对家，将负面声誉直接转化为正向声誉，粉丝暴涨！
      - 若为与NPC互动（如沈墨、纪宸）：他会被你高冷腹黑或温婉优雅的手段所折服，产生强烈生理性心动（眼神在176cm完美身段上无意识流连，靠近时耳根微红、呼吸微促，极度克制）。
      
      请以第三人称小说体生动撰写，严格禁止使用任何括号！在 options 中给出接下来 2 到 3 个行动。
      故事文本storyText务必明快，控制在120字以内！
      `;
    } else if (actionType === "chat") {
      const npcName = actionValue;
      prompt = `
      【玩家属性】：姓名: ${stats?.name}
      【当前联系人NPCs】：
      ${formattedNPCs}

      玩家发起了与 NPC 「${npcName}」 的手机通讯聊天。
      请模拟一场极度拟真、精彩、带着微微暧昧或知己欣赏的简体手机聊天气氛！
      - 如果是金牌经纪人「唐薇」：她会发发语音或文字，叮嘱你多喝热水、少熬夜、帮你物色顶级私服、并宠溺地说你是她手里最璀璨的珍珠。
      - 如果是顶流男星「沈墨」或总裁「纪宸」等：他会主动分享拍戏或工作时看见的一抹晚霞，或询问你喜欢的琴谱，字里行间克制、真诚，带着对你高挑完美体态与才华的默默沉沦。
      - 如果是同行女性NPC：则是一起分享最新的高奢珠宝秀、或者在戏剧演技上的共鸣探讨，充分体现女性彼此照亮的温柔情谊。

      请在 storyText 中，用小说体描写女主正半躺在豪华大床的真丝枕头上，指尖在莹白屏幕上轻快滑动，看着对方的回信，嘴角掠过一抹狡黠而温柔的腹黑微笑。
      并在 newNPCs 中增加该 NPC 对玩家的好感度（affection +5 到 +15），好感度>=80可约会、>=100可确认关系。
      故事文本storyText务必极简，控制在120字以内！
      `;
    } else if (actionType === "fans") {
      prompt = `
      玩家发起了【查看粉丝群聊】指令。
      【当前最新形势】：${formattedHistory}
      
      请模拟一个极具活人感、用简体中文热烈讨论的微信粉丝群！
      群名：「雪球大小姐官方粉丝应援群」
      请生成 5 到 7 条群聊消息，ID风格要生动俏皮，代表不同成分粉丝：
      - 专业数据事业粉（追问新戏崔温言的官宣、统计凤冠大鼓舞播映数据）
      - 神颜舔屏粉（疯狂刷你176cm天赐神颜与一尘不染的名媛仪态）
      - 妈粉（叮嘱雪宝拍戏辛苦要多补补、不要感冒）
      - 女友粉（高喊老婆娶我、被雪宝的高冷腹黑撩到腿软）
      - 酸柠檬黑粉（发酸话挑衅但瞬间被粉丝们用慈善豪气与实打实的演技温柔打脸）

      粉丝们只会知道公开行程与官宣，绝不知道私密行程。发言字里行间充满对雪宝的崇拜。
      `;
    } else if (actionType === "post") {
      prompt = `
      玩家发表了最新微博帖子: "${actionValue}"
      【当前名声】：正向声誉: ${stats?.positiveRep} | 负面声誉: ${stats?.negativeRep}

      请为这次社媒互动生成一个极其生动的微博评论区：
      1. newSocialPost.content：将玩家发表的原意用大小姐矜贵却温柔的文风进行精修，可以大方附上豪抽奢侈品、高奢限定礼盒的霸气抽奖条款。
      2. comments：生成 6-10 条性格鲜明、点赞数极高的简体活人留言。粉丝们疯狂控评、吹爆彩虹屁，尖叫抢沙发。黑粉若进来质疑，会被路人与真爱粉用“大小姐自掏腰包做慈善宠粉，你行你上”完美怼回，交互感拉满。
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.85,
      },
    });

    const resultText = response.text?.trim() || "{}";
    const resultJson = JSON.parse(resultText);

    res.json(resultJson);
  } catch (error: any) {
    console.error("Gemini Game Engine Error:", error);
    res.status(500).json({
      error: "故事引擎网络连接有些许波动，正在恢复中",
      details: error.message
    });
  }
});

// Configure Vite or production static file serving
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware integrated successfully.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static production assets configured perfectly.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Actress Simulator Express backend successfully running on http://localhost:${PORT}`);
  });
};

startServer();
