import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ClipboardCheck, Clock3, Droplets, Headphones, History, Package, Plus, ShieldCheck, Trash2 } from "lucide-react";
import hero from "@/assets/bufalas-pasto.jpg";
import higiene from "@/assets/higiene-ordenha.jpg";
import posOrdenha from "@/assets/pos-ordenha.jpg";
import racao from "@/assets/racao-armazenada.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Manejo em Dia — Cuidados na propriedade" },
      { name: "description", content: "Orientações práticas e registro da rotina de manejo de búfalas leiteiras." },
      { property: "og:title", content: "Manejo em Dia — Cuidados na propriedade" },
      { property: "og:description", content: "Boas práticas na rotina de criação e produção de leite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type ModuleId = "pos-ordenha" | "racao" | "pre-ordenha";
type Activity = {
  id: string;
  module: string;
  date: string;
  time: string;
  completed: string[];
  problem: string;
  pending: string;
};

const modules: {
  id: ModuleId;
  number: string;
  title: string;
  summary: string;
  problem: string;
  objective: string;
  image: string;
  imageAlt: string;
  icon: typeof Droplets;
  steps: string[];
  tip: string;
}[] = [
  {
    id: "pos-ordenha",
    number: "01",
    title: "Pós-ordenha e amamentação",
    summary: "Organize o momento depois da ordenha e acompanhe a amamentação dos bezerros.",
    problem: "Quando búfalas e bezerros são soltos todos juntos, pode ser difícil observar se cada bezerro mamou na própria mãe.",
    objective: "Separar os animais em grupos, acompanhar a mamada por cerca de 20 a 30 minutos e só depois fazer a liberação geral.",
    image: posOrdenha,
    imageAlt: "Cuidados com búfalas após a ordenha",
    icon: ShieldCheck,
    steps: [
      "Fazer o pós-dipping nos tetos após a ordenha.",
      "Conduzir as búfalas com calma para a área de alimentação.",
      "Permitir que os bezerros mamem em dois piquetes.",
      "Manter os animais nos piquetes por cerca de 20 a 30 minutos.",
      "Conferir se há animais com dificuldade ou sinais de desconforto.",
    ],
    tip: "O período de 20 a 30 minutos nos piquetes ajuda a organizar a amamentação. Observe os animais e siga a rotina definida com a orientação técnica da propriedade.",
  },
  {
    id: "racao",
    number: "02",
    title: "Armazenamento de ração e farelos",
    summary: "Proteja os alimentos contra umidade, sujeira, pragas e contato direto com o chão.",
    problem: "Sacos apoiados diretamente no piso ou encostados nas paredes podem absorver umidade e facilitar a contaminação por pragas.",
    objective: "Usar paletes, manter espaço para circulação de ar e guardar a ração em um depósito seco, limpo e protegido.",
    image: racao,
    imageAlt: "Ração armazenada de forma organizada",
    icon: Package,
    steps: [
      "Colocar os sacos sobre paletes ou estrados.",
      "Manter os alimentos afastados do chão.",
      "Deixar espaço entre os sacos e as paredes.",
      "Guardar em local seco, limpo e ventilado.",
      "Manter o depósito protegido contra roedores e insetos.",
      "Conferir validade, embalagens e sinais de umidade.",
    ],
    tip: "Não deixe sacos diretamente no piso ou encostados nas paredes. Separe produtos úmidos, mofados ou com embalagem danificada.",
  },
  {
    id: "pre-ordenha",
    number: "03",
    title: "Higiene antes da ordenha",
    summary: "Prepare os tetos, os equipamentos e o local para uma ordenha mais segura.",
    problem: "Sujeira nos tetos, nas mãos ou nos equipamentos pode comprometer a higiene durante a ordenha e a qualidade do leite.",
    objective: "Seguir a sequência de limpeza, pré-dipping e secagem individual dos tetos, respeitando o produto utilizado.",
    image: higiene,
    imageAlt: "Higienização antes da ordenha",
    icon: Droplets,
    steps: [
      "Lavar e higienizar as mãos antes de começar.",
      "Conferir se o local e os equipamentos estão limpos.",
      "Observar os primeiros jatos de leite e verificar alterações.",
      "Aplicar o pré-dipping conforme o produto e o tempo indicados.",
      "Secar cada teto com papel-toalha individual.",
      "Começar a ordenha somente com os tetos limpos e secos.",
    ],
    tip: "Use uma folha de papel-toalha para cada animal ou teto, conforme o procedimento adotado. Não use o mesmo papel em vários animais.",
  },
];

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

function Index() {
  const [checked, setChecked] = useState<Record<ModuleId, string[]>>({
    "pos-ordenha": [], racao: [], "pre-ordenha": [],
  });
  const [notes, setNotes] = useState<Record<ModuleId, { problem: string; pending: string }>>({
    "pos-ordenha": { problem: "", pending: "" },
    racao: { problem: "", pending: "" },
    "pre-ordenha": { problem: "", pending: "" },
  });
  const [history, setHistory] = useState<Activity[]>([]);
  const [activeModule, setActiveModule] = useState<ModuleId>("pos-ordenha");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("buffalo-milkcare-activities");
      if (stored) setHistory(JSON.parse(stored) as Activity[]);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("buffalo-milkcare-activities", JSON.stringify(history));
    } catch {
      // The guide remains usable if browser storage is unavailable.
    }
  }, [history]);

  const active = useMemo(() => modules.find((item) => item.id === activeModule) ?? modules[0], [activeModule]);

  function toggleStep(moduleId: ModuleId, step: string) {
    setChecked((current) => ({
      ...current,
      [moduleId]: current[moduleId].includes(step)
        ? current[moduleId].filter((item) => item !== step)
        : [...current[moduleId], step],
    }));
  }

  function saveActivity() {
    const now = new Date();
    const activity: Activity = {
      id: `${now.getTime()}`,
      module: active.title,
      date: now.toLocaleDateString("pt-BR"),
      time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      completed: checked[activeModule],
      problem: notes[activeModule].problem.trim(),
      pending: notes[activeModule].pending.trim(),
    };
    setHistory((current) => [activity, ...current]);
    setSavedMessage("Registro salvo neste aparelho.");
    window.setTimeout(() => setSavedMessage(""), 3500);
  }

  function clearHistory() {
    if (window.confirm("Deseja apagar todo o histórico salvo neste aparelho?")) setHistory([]);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <a href="#inicio" className="flex items-center gap-3 font-semibold">
            <img src="/favicon.png" alt="" className="h-10 w-10 object-contain" />
            <span>Manejo em Dia</span>
          </a>
          <div className="hidden items-center gap-7 text-sm md:flex">
            <a href="#rotina" className="hover:opacity-70">Rotina prática</a>
            <a href="#historico" className="hover:opacity-70">Histórico</a>
          </div>
          <a href="#rotina" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Começar</a>
        </div>
      </nav>

      <header id="inicio" className="mx-auto max-w-6xl px-5 pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Orientação prática para o dia a dia</p>
            <h1 className="display-title mt-5 text-4xl md:text-6xl">MANEJO EM DIA</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Um guia prático para transformar recomendações da cartilha em ações na propriedade. Entenda o que precisa ser melhorado, siga as etapas de manejo e registre o que foi realizado.</p>
            <a href="#rotina" className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground hover:opacity-90">
              Escolher uma atividade <ArrowRight className="h-5 w-5" />
            </a>
          </div>
          <img src={hero} alt="Búfalas em área de pastagem" width={1600} height={1008} className="aspect-[5/4] w-full rounded-3xl object-cover" />
        </div>
      </header>

      <section id="rotina" className="scroll-mt-20 bg-surface py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Aprender e registrar</p>
            <h2 className="display-title mt-4 text-3xl md:text-5xl">Três atividades importantes do dia a dia.</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Os módulos foram organizados a partir de três pontos de melhoria identificados na rotina da propriedade. Em cada um, você encontra o problema observado, a melhoria proposta e uma lista para acompanhar a execução.</p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon;
              const selected = activeModule === item.id;
              return (
                <button key={item.id} onClick={() => setActiveModule(item.id)} className={`rounded-2xl border p-5 text-left transition ${selected ? "border-primary bg-background shadow-md" : "border-border bg-background hover:border-primary/50"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary">{item.number}</span>
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  <div className="mt-4 border-t border-border pt-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">O que este módulo busca melhorar</p>
                    <p className="mt-1 text-sm leading-relaxed">{item.objective}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">{selected ? "Atividade selecionada" : "Abrir atividade"} <ArrowRight className="h-4 w-4" /></span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-background">
            <div className="grid md:grid-cols-[0.8fr_1.2fr]">
              <img src={active.image} alt={active.imageAlt} className="h-full min-h-64 w-full object-cover" />
              <div className="p-6 md:p-9">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wider text-primary">Atividade {active.number}</p>
                    <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{active.title}</h3>
                  </div>
                  <button onClick={() => speak(`${active.title}. ${active.summary}. ${active.steps.join(". ")}. Dica: ${active.tip}`)} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-surface" aria-label="Ouvir orientações">
                    <Headphones className="h-4 w-4" /> Ouvir
                  </button>
                </div>
                <p className="mt-3 leading-relaxed text-muted-foreground">{active.summary}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Problema identificado</p>
                    <p className="mt-2 text-sm leading-relaxed">{active.problem}</p>
                  </div>
                  <div className="rounded-2xl bg-surface p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">Melhoria proposta</p>
                    <p className="mt-2 text-sm leading-relaxed">{active.objective}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <h4 className="font-semibold">Lista de verificação</h4>
                  <span className="text-sm text-muted-foreground">{checked[activeModule].length} de {active.steps.length} concluídas</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(checked[activeModule].length / active.steps.length) * 100}%` }} />
                </div>
                <ul className="mt-4 space-y-3">
                  {active.steps.map((step) => (
                    <li key={step}>
                      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 hover:bg-surface">
                        <input type="checkbox" checked={checked[activeModule].includes(step)} onChange={() => toggleStep(activeModule, step)} className="mt-1 h-5 w-5 accent-[var(--primary)]" />
                        <span className="leading-relaxed">{step}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-2xl bg-surface p-4">
                  <p className="font-semibold">Dica importante</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{active.tip}</p>
                  <button onClick={() => speak(active.tip)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"><Headphones className="h-4 w-4" /> Ouvir dica</button>
                </div>
                <div className="mt-6 grid gap-4">
                  <label className="text-sm font-semibold">Problemas encontrados
                    <textarea value={notes[activeModule].problem} onChange={(e) => setNotes((current) => ({ ...current, [activeModule]: { ...current[activeModule], problem: e.target.value } }))} placeholder="Ex.: saco de ração úmido, teto machucado..." rows={2} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-base font-normal outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                  <label className="text-sm font-semibold">Pendências para resolver
                    <textarea value={notes[activeModule].pending} onChange={(e) => setNotes((current) => ({ ...current, [activeModule]: { ...current[activeModule], pending: e.target.value } }))} placeholder="Ex.: comprar papel-toalha, limpar o depósito..." rows={2} className="mt-2 w-full rounded-xl border border-input bg-background p-3 text-base font-normal outline-none focus:ring-2 focus:ring-ring" />
                  </label>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button onClick={saveActivity} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground hover:opacity-90"><Plus className="h-5 w-5" /> Salvar registro</button>
                  {savedMessage && <span role="status" className="text-sm font-medium text-primary">{savedMessage}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="historico" className="scroll-mt-20 mx-auto max-w-6xl px-5 py-16 md:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Acompanhamento</p>
            <h2 className="display-title mt-3 text-3xl md:text-5xl">Histórico de atividades.</h2>
            <p className="mt-3 text-muted-foreground">Os registros ficam salvos neste aparelho e neste navegador.</p>
          </div>
          {history.length > 0 && <button onClick={clearHistory} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-surface"><Trash2 className="h-4 w-4" /> Apagar histórico</button>}
        </div>
        {history.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
            <ClipboardCheck className="mx-auto h-9 w-9 text-primary" />
            <p className="mt-3 font-semibold">Nenhuma atividade registrada ainda.</p>
            <p className="mt-1 text-sm text-muted-foreground">Quando salvar uma atividade, ela aparecerá aqui.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {history.map((entry) => (
              <article key={entry.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{entry.module}</h3>
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock3 className="h-4 w-4" /> {entry.date} às {entry.time}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{entry.completed.length} etapa(s) marcada(s) como concluída(s).</p>
                {entry.problem && <p className="mt-3 text-sm"><strong>Problemas:</strong> {entry.problem}</p>}
                {entry.pending && <p className="mt-2 text-sm"><strong>Pendências:</strong> {entry.pending}</p>}
              </article>
            ))}
          </div>
        )}
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-surface p-4 text-sm leading-relaxed text-muted-foreground">
          <History className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p>Este histórico é local: ele não é enviado para a internet nem compartilhado automaticamente com outras pessoas. Para usar em outro aparelho, será necessário registrar as informações novamente.</p>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground md:flex-row md:justify-between">
          <span className="font-semibold text-foreground">Manejo em Dia</span>
          <span>Guia prático de manejo e rotina de trabalho</span>
        </div>
      </footer>
    </div>
  );
}
