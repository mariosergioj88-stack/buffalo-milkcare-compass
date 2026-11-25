import { createFileRoute } from "@tanstack/react-router";

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
    <main className="min-h-screen font-sans">
      <header className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <img src="/favicon.svg" alt="" className="mb-6 h-16 w-16" />
          <p className="uppercase tracking-widest text-sm opacity-80">Guia prático</p>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mt-2">Criação de búfalas para produção de leite</h1>
          <p className="mt-5 max-w-2xl text-lg opacity-90">Boas práticas do manejo à destinação dos dejetos, para um leite de qualidade e animais saudáveis.</p>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-6 py-16 grid gap-6 md:grid-cols-2">
        {temas.map(([t, d], i) => (
          <article key={t} className="rounded-xl border bg-card p-7">
            <span className="font-display text-3xl font-extrabold text-accent">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="font-display text-2xl font-semibold mt-2">{t}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{d}</p>
          </article>
        ))}
      </section>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">Trabalho sobre bubalinocultura leiteira</footer>
    </main>
  );
}
