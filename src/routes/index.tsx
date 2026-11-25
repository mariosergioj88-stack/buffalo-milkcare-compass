import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Droplets, Package, ShieldCheck } from "lucide-react";
import hero from "@/assets/bufalas-pasto.jpg";
import higiene from "@/assets/higiene-ordenha.jpg";
import posOrdenha from "@/assets/pos-ordenha.jpg";
import racao from "@/assets/racao-armazenada.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Búfalas Leiteiras — Guia de Criação" },
      { name: "description", content: "Manejo, alimentação, ordenha, sanidade, leite e dejetos na criação de búfalas leiteiras." },
      { property: "og:title", content: "Búfalas Leiteiras — Guia de Criação" },
      { property: "og:description", content: "Boas práticas na criação de búfalas para produção de leite." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const destaques = [
  { id: "higiene", icon: Droplets, img: higiene, titulo: "Higiene antes da ordenha", texto: "Mãos e equipamentos limpos, descarte dos primeiros jatos, pré-dipping e secagem dos tetos com papel toalha." },
  { id: "pos", icon: ShieldCheck, img: posOrdenha, titulo: "Cuidados depois da ordenha", texto: "Pós-dipping nos tetos e alimento fresco no cocho, para a búfala ficar em pé enquanto o canal do teto se fecha." },
  { id: "racao", icon: Package, img: racao, titulo: "Armazenamento da ração", texto: "Sacos sobre estrados, longe das paredes, em local seco, ventilado e protegido de roedores e umidade." },
];

const temas = [
  ["Manejo das búfalas", "Rotina tranquila, sem gritos ou agressões. Lotes por categoria, sombra, água à vontade e acesso a áreas alagadas ou aspersores para conforto térmico."],
  ["Cuidados com os bezerros", "Colostro nas primeiras 6 horas, cura do umbigo com iodo, abrigo limpo e seco, e desmame gradual com acompanhamento do peso."],
  ["Alimentação", "Pastagem de qualidade como base, suplementação com volumoso e concentrado conforme a produção, sal mineral e água limpa sempre disponível."],
  ["Higiene na ordenha", "Mãos e equipamentos limpos, descarte dos primeiros jatos, pré-dipping, secagem com papel toalha e pós-dipping após a ordenha."],
  ["Prevenção da mastite", "Teste da caneca de fundo preto diário e CMT periódico. Ordenhar por último os animais doentes e tratar só com orientação veterinária."],
  ["Vacinação e sanidade", "Seguir o calendário oficial (febre aftosa, brucelose, raiva), controlar vermes e carrapatos e registrar todos os tratamentos."],
  ["Leite: armazenar, resfriar, transportar", "Resfriar a até 4 °C em até 3 horas, em tanque limpo e fechado. Transporte em caminhão isotérmico, respeitando a carência de medicamentos."],
  ["Descarte dos dejetos", "Recolher o esterco em esterqueira ou biodigestor, longe de rios e poços. Depois de curtido, usar como adubo nas pastagens."],
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#inicio" className="flex items-center gap-3 font-medium">
            <img src="/favicon.svg" alt="" className="h-9 w-9" />
            Búfalas Leiteiras
          </a>
          <div className="hidden gap-8 text-[15px] md:flex">
            <a href="#destaques" className="hover:opacity-70">Ordenha</a>
            <a href="#guia" className="hover:opacity-70">Guia completo</a>
          </div>
          <a href="#guia" className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">Ver guia</a>
        </div>
      </nav>

      <header id="inicio" className="mx-auto max-w-6xl px-5 pt-16 md:pt-24">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Bubalinocultura leiteira</p>
        <h1 className="display-title mt-5 max-w-4xl text-5xl md:text-7xl">Manejo responsável, do pasto ao tanque de leite.</h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Boas práticas para criar búfalas saudáveis e produzir um leite seguro e de qualidade.</p>
          <a href="#destaques" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground hover:opacity-90">
            Começar <ArrowRight className="h-5 w-5" strokeWidth={1.5} />
          </a>
        </div>
        <img src={hero} alt="Búfalas pastando ao amanhecer" width={1600} height={1008} className="mt-14 aspect-[16/9] w-full rounded-2xl object-cover" />
      </header>

      <section id="destaques" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 md:py-32">
        <h2 className="display-title max-w-2xl text-4xl md:text-5xl">Três cuidados essenciais na rotina de ordenha.</h2>
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {destaques.map(({ id, icon: Icon, img, titulo, texto }, i) => (
            <article key={id}>
              <img src={img} alt={titulo} loading="lazy" width={1200} height={912} className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="h-5 w-5" strokeWidth={1.5} /> {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">{titulo}</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">{texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="guia" className="scroll-mt-16 bg-forest text-forest-foreground">
        <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-lime">Guia completo</p>
          <h2 className="display-title mt-5 max-w-3xl text-4xl md:text-6xl">Tudo o que a criação precisa, em oito temas.</h2>
          <ol className="mt-16 divide-y divide-forest-foreground/15 border-y border-forest-foreground/15">
            {temas.map(([t, d], i) => (
              <li key={t} className="grid gap-3 py-8 md:grid-cols-[80px_1fr_1.4fr] md:gap-8">
                <span className="text-lime">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-2xl font-normal tracking-tight">{t}</h3>
                <p className="text-[17px] leading-relaxed opacity-85">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted-foreground md:flex-row md:justify-between">
        <span>Búfalas Leiteiras</span>
        <span>Trabalho sobre bubalinocultura leiteira</span>
      </footer>
    </div>
  );
}
