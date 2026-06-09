import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BarChart3,
  CalendarDays,
  ChevronRight,
  ClipboardCopy,
  ExternalLink,
  Film,
  Gauge,
  Hammer,
  Lightbulb,
  LineChart,
  PackageSearch,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import "./styles.css";

const STORAGE_KEY = "car-diy-affiliate-ops-v1";

const toolCategories = [
  { key: "must", label: "まず買うべき工具" },
  { key: "cheap", label: "安くてもいい工具" },
  { key: "danger", label: "ケチると危ない工具" },
  { key: "safety", label: "安全用品" },
  { key: "nice", label: "あると便利な工具" },
];

const scriptTypes = ["警告型", "比較型", "順番型", "失敗談型"];
const statuses = ["未作成", "動画生成中", "確認待ち", "投稿済み"];
const channels = ["YouTube Shorts", "TikTok", "Instagram Reels"];

const pages = [
  { key: "dashboard", label: "ダッシュボード", icon: Gauge },
  { key: "research", label: "リサーチ", icon: Search },
  { key: "products", label: "商品管理", icon: Wrench },
  { key: "ideas", label: "ネタ管理", icon: Lightbulb },
  { key: "script", label: "台本生成", icon: Film },
  { key: "higgsfield", label: "Higgsfield", icon: Sparkles },
  { key: "calendar", label: "投稿カレンダー", icon: CalendarDays },
  { key: "metrics", label: "成果記録", icon: BarChart3 },
  { key: "analysis", label: "改善分析", icon: LineChart },
  { key: "lp", label: "公開LP", icon: PackageSearch },
];

const initialTools = [
  ["ratchet-handle", "ラチェットハンドル", "must", 5, "2,000〜6,000円", "安物でも可", "差込角を間違えるとソケットが合わない。まずは9.5sqが扱いやすい。", "タイヤ周りやエンジンルームで出番が多く、作業時間を短くできます。", "ソケットを付け替えてボルトやナットを素早く回す。"],
  ["socket-set", "ソケットセット", "must", 5, "3,000〜10,000円", "ちゃんと買うべき", "よく使うサイズが抜けた安いセットを選びがち。", "ラチェットとセットで使う基本装備。最初の満足度が高い工具です。", "サイズ違いのボルト・ナットを外す。"],
  ["box-wrench", "メガネレンチ", "must", 4, "2,000〜8,000円", "ちゃんと買うべき", "オープンレンチで固いボルトを回すと角を傷めやすい。", "固いボルトに安心して力をかけられます。", "固いボルトをなめにくく回す。"],
  ["screwdriver-set", "ドライバーセット", "cheap", 4, "1,500〜5,000円", "安物でも可", "サイズ違いを使うとネジ山をつぶしやすい。", "内装、電装、小物作業の入口として使いやすいです。", "内装パネルや電装品のネジを外す。"],
  ["trim-remover", "内張り剥がし", "cheap", 5, "1,000〜3,000円", "安物でも可", "金属工具でこじると内装に傷が残る。", "ドラレコやスピーカー交換で初心者ほど助かります。", "ドア内張りやクリップを傷つけにくく外す。"],
  ["torque-wrench", "トルクレンチ", "danger", 5, "5,000〜20,000円", "ちゃんと買うべき", "締めすぎも締め不足も危険。保管時は設定値を戻す。", "タイヤ交換をするなら安全のために必須級です。", "指定トルクでナットを締める。"],
  ["jack", "ジャッキ", "danger", 4, "5,000〜25,000円", "ちゃんと買うべき", "対応重量と最低地上高を見ずに買うと使えない。", "作業範囲は広がるが、安全確認が最優先です。", "車体を持ち上げる。"],
  ["jack-stand", "ジャッキスタンド", "safety", 5, "3,000〜12,000円", "ちゃんと買うべき", "ジャッキだけで車体下に入るのは危険。", "下回り作業の安全性を大きく上げます。", "持ち上げた車体を支える。"],
  ["led-work-light", "LED作業灯", "nice", 4, "1,500〜6,000円", "安物でも可", "明るさだけで選ぶと固定しにくい。", "暗くて見えない失敗を減らせます。", "作業場所を照らす。"],
  ["parts-cleaner", "パーツクリーナー", "nice", 4, "300〜1,000円", "安物でも可", "樹脂や塗装面に強くかけると傷めることがある。", "汚れを落としてから作業すると状態確認しやすいです。", "油汚れを落とす。"],
  ["nitrile-gloves", "ニトリル手袋", "nice", 4, "800〜2,500円", "安物でも可", "薄すぎる手袋は破れやすい。", "片付けが楽になり、作業への抵抗感も下がります。", "油汚れやケガから手を守る。"],
  ["magnetic-tray", "磁石トレー", "nice", 4, "700〜2,000円", "安物でも可", "磁石につかない樹脂クリップは別管理が必要。", "小さな部品を探す時間を減らせます。", "外したボルトをなくさず置く。"],
  ["tire-gauge", "タイヤゲージ", "must", 4, "1,000〜4,000円", "安物でも可", "測定だけのタイプと減圧できるタイプがある。", "空気圧点検を自分ででき、安全と燃費に効きます。", "タイヤ空気圧を測る。"],
  ["obd2-scanner", "OBD2スキャナー", "nice", 3, "3,000〜15,000円", "ちゃんと買うべき", "車種やアプリ対応に差がある。コード消去だけで直ったとは限らない。", "不調の入口確認には便利ですが、読み方も重要です。", "車両診断コードを読む。"],
].map(([id, name, category, rating, priceRange, buyPolicy, pitfall, reason, useCase]) => ({
  id,
  name,
  category,
  rating,
  priceRange,
  buyPolicy,
  pitfall,
  reason,
  useCase,
  amazonUrl: `https://example.com/amazon/${id}`,
  rakutenUrl: `https://example.com/rakuten/${id}`,
  yahooUrl: `https://example.com/yahoo/${id}`,
  customLinks: [{ label: "その他で見る", url: `https://example.com/affiliate/${id}` }],
  pr: true,
  imageUrl: "",
}));

const initialResearch = [
  { id: "r1", pain: "タイヤ交換でナットを締めすぎていないか不安", toolId: "torque-wrench", painScore: 5, buyerScore: 5, videoScore: 5, mechanicScore: 4 },
  { id: "r2", pain: "内装を外したいけど傷をつけそうで怖い", toolId: "trim-remover", painScore: 5, buyerScore: 4, videoScore: 5, mechanicScore: 4 },
  { id: "r3", pain: "最初にどの工具から買えばいいかわからない", toolId: "socket-set", painScore: 4, buyerScore: 5, videoScore: 4, mechanicScore: 3 },
];

const todayIso = new Date().toISOString().slice(0, 10);

const initialIdeas = [
  { id: "i1", title: "タイヤ交換初心者がトルクレンチなしでやりがちな失敗", toolId: "torque-wrench", researchId: "r1", scriptType: "警告型", status: "未作成", channel: "YouTube Shorts", scheduledDate: todayIso, causeMemo: "" },
  { id: "i2", title: "内装を傷つける人が最初に買うべき工具", toolId: "trim-remover", researchId: "r2", scriptType: "失敗談型", status: "動画生成中", channel: "TikTok", scheduledDate: todayIso, causeMemo: "" },
  { id: "i3", title: "車DIY初心者が工具を買う順番", toolId: "socket-set", researchId: "r3", scriptType: "順番型", status: "確認待ち", channel: "Instagram Reels", scheduledDate: todayIso, causeMemo: "" },
];

const initialMetrics = [
  { id: "m1", ideaId: "i1", date: todayIso, views: 1280, likes: 54, saves: 18, comments: 5, profileClicks: 22, lpClicks: 16, productClicks: 9, sales: 1, reward: 180 },
  { id: "m2", ideaId: "i2", date: todayIso, views: 2140, likes: 91, saves: 34, comments: 8, profileClicks: 38, lpClicks: 24, productClicks: 14, sales: 2, reward: 420 },
  { id: "m3", ideaId: "i3", date: todayIso, views: 980, likes: 31, saves: 11, comments: 2, profileClicks: 12, lpClicks: 7, productClicks: 3, sales: 0, reward: 0 },
];

const defaultData = {
  tools: initialTools,
  research: initialResearch,
  ideas: initialIdeas,
  metrics: initialMetrics,
};

const emptyTool = {
  name: "",
  category: "must",
  priceRange: "",
  amazonUrl: "",
  rakutenUrl: "",
  yahooUrl: "",
  customLinks: [{ label: "A8などで見る", url: "" }],
  rating: 4,
  buyPolicy: "安物でも可",
  pitfall: "",
  reason: "",
  useCase: "",
  pr: true,
  imageUrl: "",
};

const emptyResearch = {
  pain: "",
  toolId: "ratchet-handle",
  painScore: 3,
  buyerScore: 3,
  videoScore: 3,
  mechanicScore: 3,
};

const emptyIdea = {
  title: "",
  toolId: "ratchet-handle",
  researchId: "r1",
  scriptType: "警告型",
  status: "未作成",
  channel: "YouTube Shorts",
  scheduledDate: todayIso,
  causeMemo: "",
};

const emptyMetric = {
  ideaId: "i1",
  date: todayIso,
  views: 0,
  likes: 0,
  saves: 0,
  comments: 0,
  profileClicks: 0,
  lpClicks: 0,
  productClicks: 0,
  sales: 0,
  reward: 0,
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.tools && saved?.research && saved?.ideas && saved?.metrics) {
      return { ...saved, tools: saved.tools.map(normalizeTool) };
    }

    const oldTools = JSON.parse(localStorage.getItem("car-diy-tool-navi-tools") || "null");
    if (Array.isArray(oldTools)) return { ...defaultData, tools: oldTools.map(normalizeTool) };
  } catch {
    return defaultData;
  }
  return defaultData;
}

function normalizeTool(tool) {
  const migratedCustomLinks = Array.isArray(tool.customLinks)
    ? tool.customLinks
    : [
        {
          label: tool.freeUrlLabel || "A8などで見る",
          url: tool.freeUrl || tool.affiliateUrl || "",
        },
      ];

  return {
    ...emptyTool,
    ...tool,
    category: tool.category === "caution" ? "danger" : tool.category,
    buyPolicy: tool.buyPolicy || "安物でも可",
    customLinks: migratedCustomLinks.filter((link) => link && (link.label || link.url)),
  };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sumResearch(item) {
  return Number(item.painScore) + Number(item.buyerScore) + Number(item.videoScore) + Number(item.mechanicScore);
}

function yen(value) {
  return `${Number(value || 0).toLocaleString()}円`;
}

function ratingStars(rating) {
  return "★★★★★".slice(0, Number(rating)) + "☆☆☆☆☆".slice(0, 5 - Number(rating));
}

function getTool(tools, id) {
  return tools.find((tool) => tool.id === id) || tools[0] || emptyTool;
}

function getResearch(research, id) {
  return research.find((item) => item.id === id) || research[0] || emptyResearch;
}

function getIdea(ideas, id) {
  return ideas.find((idea) => idea.id === id) || ideas[0] || emptyIdea;
}

function categoryLabel(key) {
  return toolCategories.find((category) => category.key === key)?.label || key;
}

function buildScript(idea, tool, research) {
  const hookMap = {
    警告型: `1秒目：車DIY初心者、${tool.name}を適当に選ぶと普通に失敗します。`,
    比較型: `1秒目：安い${tool.name}でいい人と、ちゃんと買うべき人の違い。`,
    順番型: `1秒目：車DIY初心者が${tool.name}を買うタイミングはここです。`,
    失敗談型: `1秒目：僕なら最初から${tool.name}を用意します。理由はこれです。`,
  };

  return [
    hookMap[idea.scriptType] || hookMap.警告型,
    `2〜10秒：悩みは「${research.pain}」。${tool.useCase} ${tool.reason} ただし、${tool.pitfall}`,
    `11〜15秒：PRです。買う順番で迷う人は、プロフィールリンクの「車DIY工具ナビ」に初心者向けリストをまとめています。`,
    `ループ終わり：次は、${tool.name}を買う前に見るポイントから話します。`,
  ].join("\n");
}

function buildHiggsfieldPrompt(idea, tool) {
  return [
    "Vertical 9:16 seamless loop short video, faceless realistic Japanese home garage, beginner car DIY scene, rugged black white gray automotive mood.",
    `Feature hands only naturally using ${tool.name} around a compact car and workbench, practical affiliate landing page advertisement style, trustworthy and not flashy.`,
    "No text inside the video, no subtitles burned in, Japanese subtitles will be added later.",
    "Shot sequence: quick hook close-up of tool, beginner checking the car, simple workbench explanation angle, final cut returns visually to the first tool close-up for a seamless loop.",
    `Theme: ${idea.scriptType}, beginner friendly, garage tools, car maintenance, safe handling, no brand logos.`,
  ].join(" ");
}

function buildPostText(idea, tool) {
  const base = `PR ${tool.name}は、車DIY初心者が失敗を減らすために見ておきたい工具です。Amazon・楽天・Yahooのリンクはプロフィールの工具リストへ。`;
  return [
    `YouTube Shortsタイトル：${idea.title}`,
    `TikTokキャプション：${base}`,
    `Instagram Reelsキャプション：${base}`,
    "ハッシュタグ：#車DIY #工具紹介 #車いじり初心者 #ガレージ作業 #DIY初心者 #PR",
    `説明文：この投稿には広告・アフィリエイトリンクを含みます。紹介工具：${tool.name}。商品を見るリンクはプロフィール内の工具リストにあります。`,
  ].join("\n");
}

function getInitialPage() {
  const hash = window.location.hash;
  const path = window.location.pathname;
  if (hash.startsWith("#/admin") || path.endsWith("/admin") || path.includes("/admin/")) {
    return "products";
  }
  return "lp";
}

function App() {
  const [data, setData] = useState(loadData);
  const [page, setPage] = useState(getInitialPage);
  const [selectedIdeaId, setSelectedIdeaId] = useState(data.ideas[0]?.id || "");

  useEffect(() => {
    function syncRoute() {
      setPage((current) => {
        const next = getInitialPage();
        if (next === "products" && current !== "lp") return current;
        return next;
      });
    }

    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  function navigate(nextPage) {
    setPage(nextPage);
    if (nextPage === "lp") {
      window.location.hash = "/";
    } else if (!window.location.hash.startsWith("#/admin")) {
      window.location.hash = "/admin";
    }
  }

  function persist(next) {
    setData(next);
    saveData(next);
  }

  function upsert(collection, item, editingId) {
    const nextItem = { ...item, id: editingId || uid(collection[0]) };
    persist({
      ...data,
      [collection]: editingId
        ? data[collection].map((entry) => (entry.id === editingId ? nextItem : entry))
        : [nextItem, ...data[collection]],
    });
    return nextItem;
  }

  function remove(collection, id) {
    persist({ ...data, [collection]: data[collection].filter((entry) => entry.id !== id) });
  }

  const selectedIdea = getIdea(data.ideas, selectedIdeaId);
  const selectedTool = getTool(data.tools, selectedIdea.toolId);
  const selectedResearch = getResearch(data.research, selectedIdea.researchId);

  if (page === "lp") {
    return (
      <div className="app">
        <LandingPage tools={data.tools} onAdmin={() => navigate("products")} />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="kicker">Short Affiliate Ops</p>
          <h1>車DIY工具ナビ 運用PWA</h1>
        </div>
        <button className="ghost" onClick={() => persist(defaultData)}>
          <RefreshCw size={16} />
          初期化
        </button>
      </header>

      <nav className="nav" aria-label="ページ">
        {pages.map(({ key, label, icon: Icon }) => (
          <button key={key} className={page === key ? "active" : ""} onClick={() => navigate(key)}>
            <Icon size={17} />
            {label}
          </button>
        ))}
      </nav>

      <main>
        {page === "dashboard" && <Dashboard data={data} setPage={navigate} />}
        {page === "research" && <ResearchPage data={data} upsert={upsert} remove={remove} />}
        {page === "products" && <ProductsPage data={data} upsert={upsert} remove={remove} />}
        {page === "ideas" && <IdeasPage data={data} upsert={upsert} remove={remove} setSelectedIdeaId={setSelectedIdeaId} setPage={navigate} />}
        {page === "script" && <GeneratorPage title="台本生成" data={data} selectedIdeaId={selectedIdeaId} setSelectedIdeaId={setSelectedIdeaId} build={(idea, tool, research) => buildScript(idea, tool, research)} />}
        {page === "higgsfield" && <GeneratorPage title="Higgsfieldプロンプト生成" data={data} selectedIdeaId={selectedIdeaId} setSelectedIdeaId={setSelectedIdeaId} build={(idea, tool) => buildHiggsfieldPrompt(idea, tool)} extra={(idea, tool) => buildPostText(idea, tool)} />}
        {page === "calendar" && <CalendarPage data={data} persist={persist} />}
        {page === "metrics" && <MetricsPage data={data} upsert={upsert} remove={remove} />}
        {page === "analysis" && <AnalysisPage data={data} upsert={upsert} />}
        {page === "lp" && <LandingPage tools={data.tools} onAdmin={() => navigate("products")} />}
      </main>

      <footer className="app-footer">localStorage保存。完全自動投稿なし、人間が確認してから投稿する運用前提です。</footer>
    </div>
  );
}

function Dashboard({ data, setPage }) {
  const totals = totalMetrics(data.metrics);
  const statusCounts = statuses.map((status) => ({
    status,
    count: data.ideas.filter((idea) => idea.status === status).length,
  }));
  const todayQueue = data.ideas
    .filter((idea) => idea.status !== "投稿済み")
    .slice(0, 3);
  const winningType = bestScriptType(data);

  return (
    <section className="stack">
      <div className="panel hero-panel">
        <p className="kicker">今日の制作</p>
        <h2>3本作って、確認して、投稿する</h2>
        <button className="primary" onClick={() => setPage("ideas")}>
          ネタを追加する
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="metric-grid">
        {statusCounts.map((item) => (
          <Stat key={item.status} label={item.status} value={`${item.count}件`} />
        ))}
      </div>

      <div className="panel">
        <SectionTitle title="今日作る動画3本" sub="未投稿の上位3件" />
        <div className="card-list">
          {todayQueue.map((idea) => (
            <IdeaMini key={idea.id} idea={idea} tool={getTool(data.tools, idea.toolId)} />
          ))}
        </div>
      </div>

      <div className="metric-grid">
        <Stat label="直近7日 再生数" value={totals.views.toLocaleString()} />
        <Stat label="直近7日 クリック数" value={totals.productClicks.toLocaleString()} />
        <Stat label="直近7日 報酬" value={yen(totals.reward)} />
      </div>

      <div className="panel">
        <SectionTitle title="伸びているネタ型" sub="成果記録から自動集計" />
        <p className="big-result">{winningType || "まだデータ不足"}</p>
      </div>
    </section>
  );
}

function ResearchPage({ data, upsert, remove }) {
  const [form, setForm] = useState({ ...emptyResearch, toolId: data.tools[0]?.id || "" });
  const [editingId, setEditingId] = useState("");
  const sorted = [...data.research].sort((a, b) => sumResearch(b) - sumResearch(a));

  function submit(event) {
    event.preventDefault();
    upsert("research", numberize(form, ["painScore", "buyerScore", "videoScore", "mechanicScore"]), editingId);
    setForm({ ...emptyResearch, toolId: data.tools[0]?.id || "" });
    setEditingId("");
  }

  return (
    <section className="split">
      <form className="panel" onSubmit={submit}>
        <SectionTitle title={editingId ? "悩みを編集" : "悩みを登録"} sub="スコアが高いほど優先" />
        <Field label="初心者の悩み"><textarea value={form.pain} onChange={(e) => setForm({ ...form, pain: e.target.value })} required /></Field>
        <ToolSelect tools={data.tools} value={form.toolId} onChange={(toolId) => setForm({ ...form, toolId })} />
        <ScoreFields form={form} setForm={setForm} />
        <Submit editing={editingId} onCancel={() => { setEditingId(""); setForm(emptyResearch); }} />
      </form>
      <div className="stack">
        {sorted.map((item) => (
          <DataCard key={item.id} title={item.pain} meta={`${getTool(data.tools, item.toolId).name} / 合計 ${sumResearch(item)}点`}>
            <MiniGrid items={[["悩み", item.painScore], ["購入近さ", item.buyerScore], ["動画化", item.videoScore], ["経験", item.mechanicScore]]} />
            <RowActions onEdit={() => { setEditingId(item.id); setForm(item); }} onDelete={() => remove("research", item.id)} />
          </DataCard>
        ))}
      </div>
    </section>
  );
}

function ProductsPage({ data, upsert, remove }) {
  const [form, setForm] = useState(emptyTool);
  const [editingId, setEditingId] = useState("");

  function submit(event) {
    event.preventDefault();
    upsert("tools", normalizeTool({ ...form, rating: Number(form.rating), pr: Boolean(form.pr) }), editingId);
    setForm(emptyTool);
    setEditingId("");
  }

  const customLink = form.customLinks?.[0] || { label: "A8などで見る", url: "" };
  function updateCustomLink(patch) {
    setForm({ ...form, customLinks: [{ ...customLink, ...patch }] });
  }

  return (
    <section className="split">
      <form className="panel" onSubmit={submit}>
        <SectionTitle title={editingId ? "商品を編集" : "商品を追加"} sub="LPと生成機能に反映" />
        <Field label="商品名"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
        <Field label="カテゴリ"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{toolCategories.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}</select></Field>
        <Field label="価格帯"><input value={form.priceRange} onChange={(e) => setForm({ ...form, priceRange: e.target.value })} /></Field>
        <Field label="Amazonリンク欄"><input value={form.amazonUrl} onChange={(e) => setForm({ ...form, amazonUrl: e.target.value })} placeholder="https://www.amazon.co.jp/..." /></Field>
        <Field label="楽天リンク欄"><input value={form.rakutenUrl} onChange={(e) => setForm({ ...form, rakutenUrl: e.target.value })} placeholder="https://hb.afl.rakuten.co.jp/..." /></Field>
        <Field label="Yahooリンク欄"><input value={form.yahooUrl} onChange={(e) => setForm({ ...form, yahooUrl: e.target.value })} placeholder="https://shopping.yahoo.co.jp/..." /></Field>
        <Field label="A8など自由リンク欄"><input value={customLink.url} onChange={(e) => updateCustomLink({ url: e.target.value })} placeholder="https://..." /></Field>
        <Field label="自由リンクのボタン名"><input value={customLink.label} onChange={(e) => updateCustomLink({ label: e.target.value })} placeholder="A8などで見る" /></Field>
        <Field label="おすすめ度"><input type="range" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /><span>{ratingStars(form.rating)}</span></Field>
        <Field label="安物でいいか/ちゃんと買うべきか"><select value={form.buyPolicy} onChange={(e) => setForm({ ...form, buyPolicy: e.target.value })}><option>安物でも可</option><option>ちゃんと買うべき</option></select></Field>
        <Field label="何に使うか"><textarea value={form.useCase} onChange={(e) => setForm({ ...form, useCase: e.target.value })} /></Field>
        <Field label="初心者の失敗ポイント"><textarea value={form.pitfall} onChange={(e) => setForm({ ...form, pitfall: e.target.value })} /></Field>
        <Field label="おすすめ理由"><textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} /></Field>
        <Field label="商品画像URL欄"><input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></Field>
        <label className="check"><input type="checkbox" checked={form.pr} onChange={(e) => setForm({ ...form, pr: e.target.checked })} /> PR表記</label>
        <Submit editing={editingId} onCancel={() => { setEditingId(""); setForm(emptyTool); }} />
      </form>
      <div className="stack">
        {data.tools.map((tool) => (
          <DataCard key={tool.id} title={tool.name} meta={`${categoryLabel(tool.category)} / ${tool.priceRange}`}>
            <p>{tool.reason}</p>
            <MiniGrid items={[["おすすめ", ratingStars(tool.rating)], ["方針", tool.buyPolicy], ["PR", tool.pr ? "あり" : "なし"], ["リンク", linkCount(tool) + "件"]]} />
            <RowActions onEdit={() => { setEditingId(tool.id); setForm(normalizeTool(tool)); }} onDelete={() => remove("tools", tool.id)} />
          </DataCard>
        ))}
      </div>
    </section>
  );
}

function IdeasPage({ data, upsert, remove, setSelectedIdeaId, setPage }) {
  const [form, setForm] = useState({ ...emptyIdea, toolId: data.tools[0]?.id || "", researchId: data.research[0]?.id || "" });
  const [editingId, setEditingId] = useState("");

  function submit(event) {
    event.preventDefault();
    const saved = upsert("ideas", form, editingId);
    setSelectedIdeaId(saved.id);
    setForm({ ...emptyIdea, toolId: data.tools[0]?.id || "", researchId: data.research[0]?.id || "" });
    setEditingId("");
  }

  return (
    <section className="split">
      <form className="panel" onSubmit={submit}>
        <SectionTitle title={editingId ? "ネタを編集" : "ネタを追加"} sub="動画制作の作業単位" />
        <Field label="動画タイトル"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
        <ToolSelect tools={data.tools} value={form.toolId} onChange={(toolId) => setForm({ ...form, toolId })} />
        <Field label="悩み"><select value={form.researchId} onChange={(e) => setForm({ ...form, researchId: e.target.value })}>{data.research.map((r) => <option key={r.id} value={r.id}>{r.pain}</option>)}</select></Field>
        <Field label="台本型"><select value={form.scriptType} onChange={(e) => setForm({ ...form, scriptType: e.target.value })}>{scriptTypes.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="ステータス"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{statuses.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="投稿先"><select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}>{channels.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="投稿予定日"><input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} /></Field>
        <Field label="伸びなかった原因メモ"><textarea value={form.causeMemo} onChange={(e) => setForm({ ...form, causeMemo: e.target.value })} /></Field>
        <Submit editing={editingId} onCancel={() => { setEditingId(""); setForm(emptyIdea); }} />
      </form>
      <div className="stack">
        {data.ideas.map((idea) => (
          <DataCard key={idea.id} title={idea.title} meta={`${getTool(data.tools, idea.toolId).name} / ${idea.scriptType} / ${idea.status}`}>
            <MiniGrid items={[["投稿先", idea.channel], ["予定日", idea.scheduledDate], ["悩み", getResearch(data.research, idea.researchId).pain]]} />
            <div className="inline-actions">
              <button className="primary" onClick={() => { setSelectedIdeaId(idea.id); setPage("script"); }}>生成へ</button>
              <RowActions onEdit={() => { setEditingId(idea.id); setForm(idea); }} onDelete={() => remove("ideas", idea.id)} />
            </div>
          </DataCard>
        ))}
      </div>
    </section>
  );
}

function GeneratorPage({ title, data, selectedIdeaId, setSelectedIdeaId, build, extra }) {
  const idea = getIdea(data.ideas, selectedIdeaId);
  const tool = getTool(data.tools, idea.toolId);
  const research = getResearch(data.research, idea.researchId);

  return (
    <section className="stack">
      <div className="panel">
        <SectionTitle title={title} sub="選んだネタから自動生成" />
        <Field label="ネタ"><select value={idea.id} onChange={(e) => setSelectedIdeaId(e.target.value)}>{data.ideas.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
      </div>
      <OutputBlock title={title} value={build(idea, tool, research)} />
      {extra && <OutputBlock title="投稿文生成" value={extra(idea, tool, research)} />}
    </section>
  );
}

function CalendarPage({ data, persist }) {
  const days = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date.toISOString().slice(0, 10);
  });

  function updateStatus(id, status) {
    persist({ ...data, ideas: data.ideas.map((idea) => (idea.id === id ? { ...idea, status } : idea)) });
  }

  return (
    <section className="stack">
      <div className="panel">
        <SectionTitle title="7日間投稿カレンダー" sub="1日3本、合計21本の枠" />
      </div>
      <div className="calendar-grid">
        {days.map((day) => {
          const ideas = data.ideas.filter((idea) => idea.scheduledDate === day).slice(0, 3);
          return (
            <div className="panel day" key={day}>
              <h3>{day}</h3>
              {[0, 1, 2].map((slot) => {
                const idea = ideas[slot];
                return idea ? (
                  <div className="slot" key={idea.id}>
                    <strong>{idea.title}</strong>
                    <select value={idea.status} onChange={(e) => updateStatus(idea.id, e.target.value)}>{statuses.map((s) => <option key={s}>{s}</option>)}</select>
                  </div>
                ) : (
                  <div className="slot empty" key={slot}>空き枠</div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="panel">
        <SectionTitle title="未投稿一覧" sub="投稿済み以外" />
        <div className="card-list">{data.ideas.filter((i) => i.status !== "投稿済み").map((idea) => <IdeaMini key={idea.id} idea={idea} tool={getTool(data.tools, idea.toolId)} />)}</div>
      </div>
    </section>
  );
}

function MetricsPage({ data, upsert, remove }) {
  const [form, setForm] = useState({ ...emptyMetric, ideaId: data.ideas[0]?.id || "" });
  const [editingId, setEditingId] = useState("");
  const total = totalMetrics(data.metrics);

  function submit(event) {
    event.preventDefault();
    upsert("metrics", numberize(form, ["views", "likes", "saves", "comments", "profileClicks", "lpClicks", "productClicks", "sales", "reward"]), editingId);
    setForm({ ...emptyMetric, ideaId: data.ideas[0]?.id || "" });
    setEditingId("");
  }

  return (
    <section className="split">
      <form className="panel" onSubmit={submit}>
        <SectionTitle title={editingId ? "成果を編集" : "成果を記録"} sub={`累計報酬 ${yen(total.reward)}`} />
        <Field label="動画ネタ"><select value={form.ideaId} onChange={(e) => setForm({ ...form, ideaId: e.target.value })}>{data.ideas.map((idea) => <option key={idea.id} value={idea.id}>{idea.title}</option>)}</select></Field>
        <Field label="日付"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
        {["views", "likes", "saves", "comments", "profileClicks", "lpClicks", "productClicks", "sales", "reward"].map((key) => (
          <Field key={key} label={metricLabels[key]}><input type="number" min="0" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} /></Field>
        ))}
        <Submit editing={editingId} onCancel={() => { setEditingId(""); setForm(emptyMetric); }} />
      </form>
      <div className="stack">
        <div className="metric-grid">
          <Stat label="再生数" value={total.views.toLocaleString()} />
          <Stat label="商品クリック" value={total.productClicks.toLocaleString()} />
          <Stat label="売上" value={`${total.sales}件`} />
          <Stat label="報酬" value={yen(total.reward)} />
        </div>
        {data.metrics.map((metric) => (
          <DataCard key={metric.id} title={getIdea(data.ideas, metric.ideaId).title} meta={`${metric.date} / ${yen(metric.reward)}`}>
            <MiniGrid items={[["再生", metric.views], ["保存", metric.saves], ["商品クリック", metric.productClicks], ["売上", metric.sales]]} />
            <RowActions onEdit={() => { setEditingId(metric.id); setForm(metric); }} onDelete={() => remove("metrics", metric.id)} />
          </DataCard>
        ))}
      </div>
    </section>
  );
}

const metricLabels = {
  views: "再生数",
  likes: "いいね数",
  saves: "保存数",
  comments: "コメント数",
  profileClicks: "プロフィールクリック数",
  lpClicks: "LPクリック数",
  productClicks: "商品クリック数",
  sales: "売上",
  reward: "報酬",
};

function AnalysisPage({ data, upsert }) {
  const winningType = bestScriptType(data);
  const topMetric = [...data.metrics].sort((a, b) => b.views + b.productClicks * 100 - (a.views + a.productClicks * 100))[0];
  const topIdea = topMetric ? getIdea(data.ideas, topMetric.ideaId) : null;
  const nextIdeas = data.research
    .slice()
    .sort((a, b) => sumResearch(b) - sumResearch(a))
    .slice(0, 3)
    .map((item) => `「${item.pain}」を${getTool(data.tools, item.toolId).name}で解決する${winningType || "警告型"}動画`);

  function cloneWinning() {
    if (!topIdea) return;
    const baseTool = data.tools.find((tool) => tool.id !== topIdea.toolId) || data.tools[0];
    upsert("ideas", {
      ...topIdea,
      id: undefined,
      toolId: baseTool.id,
      status: "未作成",
      title: `${baseTool.name}版：${topIdea.title}`,
      scheduledDate: todayIso,
    });
  }

  return (
    <section className="stack">
      <div className="panel">
        <SectionTitle title="伸びた動画の共通点" sub="再生数と商品クリックから簡易判定" />
        <p className="big-result">{winningType || "まだ判断できる成果記録がありません"}</p>
        {topIdea && <p className="muted">代表動画：{topIdea.title}</p>}
      </div>
      <div className="panel">
        <SectionTitle title="伸びなかった動画の原因メモ" sub="ネタ管理で入力したメモ" />
        <div className="card-list">
          {data.ideas.filter((idea) => idea.causeMemo).map((idea) => <DataCard key={idea.id} title={idea.title} meta={idea.causeMemo} />)}
        </div>
      </div>
      <div className="panel">
        <SectionTitle title="次に作るべき動画案" sub="リサーチスコア順" />
        <ol className="idea-list">{nextIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol>
        <button className="primary" onClick={cloneWinning}>
          <ClipboardCopy size={17} />
          伸びた型を別工具に複製
        </button>
      </div>
    </section>
  );
}

function LandingPage({ tools, onAdmin }) {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? tools : tools.filter((tool) => tool.category === filter);

  return (
    <section className="lp">
      <AffiliateNotice />
      <div className="lp-hero">
        <p className="kicker">TikTok / Shorts / Reelsから来た人向け</p>
        <h2>車DIY工具ナビ</h2>
        <p>車いじり初心者が失敗しない工具リスト</p>
        <a className="primary link-button hero-cta" href="#tool-list">工具リストを見る <ChevronRight size={18} /></a>
      </div>
      <div className="filter-row">
        <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>全部</button>
        {toolCategories.map((category) => <button key={category.key} className={filter === category.key ? "active" : ""} onClick={() => setFilter(category.key)}>{category.label}</button>)}
      </div>
      <div className="tool-list" id="tool-list">
        {visible.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>
      <AffiliateNotice />
      <div className="lp-admin-bar">
        <button className="admin-link" onClick={onAdmin}>
          管理者用
        </button>
      </div>
    </section>
  );
}

function ToolCard({ tool }) {
  return (
    <article className="tool-card">
      <div className="image-slot">{tool.imageUrl ? <img src={tool.imageUrl} alt="" /> : <Hammer size={34} />}</div>
      <div className="card-head">
        <div><span className="tag">{categoryLabel(tool.category)}</span><h3>{tool.name}</h3></div>
        {tool.pr && <span className="pr">PR</span>}
      </div>
      {tool.pr && <p className="card-pr-note">広告・アフィリエイトリンクを含みます</p>}
      <div className="meta"><span>{ratingStars(tool.rating)}</span><span>{tool.priceRange}</span><span>{tool.buyPolicy}</span></div>
      <dl>
        <dt>何に使うか</dt><dd>{tool.useCase}</dd>
        <dt>失敗ポイント</dt><dd>{tool.pitfall}</dd>
        <dt>おすすめ理由</dt><dd>{tool.reason}</dd>
      </dl>
      <div className="shop-buttons">
        <ShopButton label="Amazonで見る" url={tool.amazonUrl} primary />
        <ShopButton label="楽天で見る" url={tool.rakutenUrl} />
        <ShopButton label="Yahooで見る" url={tool.yahooUrl} />
        {(tool.customLinks || []).map((link) => (
          <ShopButton key={`${link.label}-${link.url}`} label={link.label || "リンクを見る"} url={link.url} />
        ))}
      </div>
    </article>
  );
}

function ShopButton({ label, url, primary }) {
  if (!url) return null;
  return (
    <a className={primary ? "primary link-button" : "secondary link-button"} href={url} target="_blank" rel="noreferrer">
      {label}
      <ExternalLink size={17} />
    </a>
  );
}

function totalMetrics(metrics) {
  return metrics.reduce((sum, item) => {
    Object.keys(metricLabels).forEach((key) => {
      sum[key] = (sum[key] || 0) + Number(item[key] || 0);
    });
    return sum;
  }, {});
}

function linkCount(tool) {
  return [tool.amazonUrl, tool.rakutenUrl, tool.yahooUrl, ...(tool.customLinks || []).map((link) => link.url)].filter(Boolean).length;
}

function bestScriptType(data) {
  const scores = {};
  data.metrics.forEach((metric) => {
    const idea = data.ideas.find((item) => item.id === metric.ideaId);
    if (!idea) return;
    scores[idea.scriptType] = (scores[idea.scriptType] || 0) + Number(metric.views || 0) + Number(metric.productClicks || 0) * 100 + Number(metric.reward || 0) * 3;
  });
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
}

function numberize(form, keys) {
  const next = { ...form };
  keys.forEach((key) => {
    next[key] = Number(next[key] || 0);
  });
  return next;
}

function SectionTitle({ title, sub }) {
  return <div className="section-title"><div><h2>{title}</h2>{sub && <p>{sub}</p>}</div></div>;
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

function ToolSelect({ tools, value, onChange }) {
  return <Field label="対象工具"><select value={value} onChange={(e) => onChange(e.target.value)}>{tools.map((tool) => <option key={tool.id} value={tool.id}>{tool.name}</option>)}</select></Field>;
}

function ScoreFields({ form, setForm }) {
  return (
    <>
      {[
        ["painScore", "悩みの強さ"],
        ["buyerScore", "購入までの近さ"],
        ["videoScore", "動画化しやすさ"],
        ["mechanicScore", "整備士経験を入れられる度"],
      ].map(([key, label]) => (
        <Field key={key} label={`${label}: ${form[key]}`}>
          <input type="range" min="1" max="5" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        </Field>
      ))}
    </>
  );
}

function Submit({ editing, onCancel }) {
  return <div className="form-actions"><button className="primary" type="submit"><Plus size={17} />{editing ? "更新する" : "追加する"}</button>{editing && <button className="secondary" type="button" onClick={onCancel}>キャンセル</button>}</div>;
}

function RowActions({ onEdit, onDelete }) {
  return <div className="row-actions"><button className="icon-button" onClick={onEdit} aria-label="編集"><Pencil size={17} /></button><button className="icon-button danger" onClick={onDelete} aria-label="削除"><Trash2 size={17} /></button></div>;
}

function DataCard({ title, meta, children }) {
  return <article className="data-card"><h3>{title}</h3>{meta && <p className="muted">{meta}</p>}{children}</article>;
}

function IdeaMini({ idea, tool }) {
  return <article className="mini-card"><strong>{idea.title}</strong><span>{tool.name} / {idea.channel} / {idea.status}</span></article>;
}

function MiniGrid({ items }) {
  return <div className="mini-grid">{items.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function Stat({ label, value }) {
  return <div className="stat"><span>{label}</span><strong>{value}</strong></div>;
}

function OutputBlock({ title, value }) {
  async function copy() {
    await navigator.clipboard.writeText(value);
  }
  return <div className="panel output"><div className="output-head"><h2>{title}</h2><button className="ghost" onClick={copy}><ClipboardCopy size={16} />コピー</button></div><pre>{value}</pre></div>;
}

function AffiliateNotice() {
  return <div className="notice">このページには広告・アフィリエイトリンクを含みます</div>;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")).render(<App />);
