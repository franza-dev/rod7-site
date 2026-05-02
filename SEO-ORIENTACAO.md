# Orientação SEO — Site Rodney Silva (ROD7)

> Guia para o Claude Code aplicar no projeto. **Premissa:** manter a estética elegante intacta. Palavras‑chave entram **invisíveis** (no `<head>`, em atributos `alt`, em `aria-label`, em texto `sr-only`, em JSON‑LD). Nada muda no que aparece na tela.

---

## 1. Estratégia em uma frase

A página tem títulos curtos e elegantes (*Concept*, *Histórias*, *Mural*, *Abstrato*, *Taki*). O Google não entende o que isso significa. A gente resolve isso colocando as palavras que o cliente realmente digita no Google em quatro lugares **invisíveis**: `<title>`, `<meta description>`, atributos `alt`/`aria-label` das imagens e seções, e um bloco JSON‑LD no final do `<body>`.

---

## 2. Palavras‑chave por seção

Use estas como referência quando preencher `alt`, `aria-label`, `meta` e o `sr-only`. **Não force**: sempre que ficar artificial, prefira a versão mais natural.

### Genéricas (servem pra página inteira)
`artista visual` · `artista plástico` · `artes plásticas` · `arte contemporânea` · `obras de arte originais` · `quadros para sala` · `quadros para escritório` · `quadros decorativos` · `comprar quadro original` · `ROD7` · `Rodney Silva`

### Concept (arte corporativa sustentável)
`arte corporativa` · `quadro com logo da empresa` · `quadro personalizado para empresa` · `arte sustentável` · `quadro com material reciclado` · `quadro de MDF reciclado` · `decoração corporativa` · `arte ESG` · `presente corporativo personalizado` · `decoração de escritório`

### Histórias (retratos narrativos)
`quadro personalizado` · `quadro com história` · `presente personalizado` · `presente de casamento personalizado` · `presente de aniversário diferente` · `quadro autobiográfico` · `obra de arte sob encomenda` · `retrato narrativo` · `arte personalizada por encomenda`

### Mural (paredes e portas)
`muralista` · `pintura mural` · `mural artístico` · `mural decorativo` · `arte em parede` · `pintar parede de empresa` · `mural para escritório` · `arte em fachada` · `street art comercial` · `pintura em porta`

### Abstrato
`quadro abstrato` · `pintura abstrata original` · `arte abstrata contemporânea` · `quadro grande para sala` · `quadro abstrato colorido` · `obra abstrata original`

### Taki pelo Mundo
`Taki` · `personagem Taki` · `arte autoral` · `quadro do Taki` · `coelho Taki` · `obra colecionável`

### Bio
`Rodney Silva artista` · `ROD7 artista` · `artista plástico autodidata` · `artista brasileiro contemporâneo`

---

## 3. Mudanças concretas no arquivo

### 3.1 `<head>` — title e metas (PRIORIDADE MÁXIMA)

**Substituir o `<title>` atual** por algo que carregue as keywords mais fortes:

```html
<title>Rodney Silva (ROD7) — Quadros Personalizados, Murais e Arte Corporativa Sustentável</title>
```

**Adicionar logo abaixo** (não existe hoje):

```html
<meta name="description" content="Artista visual Rodney Silva (ROD7). Quadros personalizados sob encomenda, murais artísticos para empresas e residências, arte corporativa sustentável feita com resíduos de MDF, e obras abstratas originais. Atendimento sob encomenda.">

<meta name="keywords" content="quadro personalizado, arte corporativa, mural artístico, muralista, quadro com logo da empresa, arte sustentável, quadro abstrato, obra de arte original, presente personalizado, ROD7, Rodney Silva, artista plástico">

<meta name="author" content="Rodney Silva">
<meta name="robots" content="index,follow">

<!-- Open Graph (compartilhamento em WhatsApp, Facebook, LinkedIn) -->
<meta property="og:type" content="website">
<meta property="og:title" content="Rodney Silva (ROD7) — Quadros Personalizados e Arte Corporativa Sustentável">
<meta property="og:description" content="Artista visual brasileiro. Quadros sob encomenda, murais artísticos e arte corporativa sustentável com resíduos de MDF.">
<meta property="og:image" content="images/concept/concept-1.jpeg">
<meta property="og:url" content="https://SEU-DOMINIO.com">
<meta property="og:locale" content="pt_BR">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Rodney Silva (ROD7) — Artista Visual">
<meta name="twitter:description" content="Quadros personalizados, murais artísticos e arte corporativa sustentável.">
<meta name="twitter:image" content="images/concept/concept-1.jpeg">

<!-- Canonical (importantíssimo pra evitar conteúdo duplicado) -->
<link rel="canonical" href="https://SEU-DOMINIO.com/">
```

> **Importante:** trocar `SEU-DOMINIO.com` pelo domínio real assim que ele estiver definido.

---

### 3.2 Adicionar a classe utilitária `.sr-only` no CSS

Esta classe esconde texto da tela mas **mantém ele visível para o Google e para leitores de tela**. É o truque central pra manter a estética intacta.

Adicionar em `css/style.css`, no topo (depois do reset):

```css
/* visualmente oculto, mas lido por crawlers e screen readers */
.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}
```

---

### 3.3 H1 do hero — expandir semanticamente sem mudar o visual

**Atual:**
```html
<h1 class="hero__title">
  <span class="line line-1">Rodney</span>
  <span class="line line-2">Silva</span>
</h1>
```

**Trocar por:**
```html
<h1 class="hero__title">
  <span class="line line-1" aria-hidden="true">Rodney</span>
  <span class="line line-2" aria-hidden="true">Silva</span>
  <span class="sr-only">Rodney Silva (ROD7) — Artista Visual: quadros personalizados, murais artísticos e arte corporativa sustentável.</span>
</h1>
```

> O `aria-hidden="true"` nos spans visuais evita o leitor de tela ler "Rodney Silva Rodney Silva (ROD7)…" duplicado. O Google vê a versão completa, o usuário vê só o que sempre viu.

---

### 3.4 H2 das seções — mesmo princípio

Para **cada** `section__title`, aplicar o mesmo padrão. Exemplo no Concept:

**Atual:**
```html
<h2 class="section__title">Concept</h2>
```

**Trocar por:**
```html
<h2 class="section__title">
  <span aria-hidden="true">Concept</span>
  <span class="sr-only">Concept — Arte Corporativa Sustentável: quadros personalizados com logo da empresa feitos com resíduos de MDF.</span>
</h2>
```

**Repetir o padrão para todas as seções**, com estes textos no `sr-only`:

| Seção | Texto `sr-only` sugerido |
|---|---|
| Biografia | `Biografia do artista visual Rodney Silva — ROD7, artista plástico brasileiro autodidata.` |
| Concept | `Concept — Arte Corporativa Sustentável: quadros personalizados com logo da empresa feitos com resíduos de MDF.` |
| Histórias | `Histórias — Quadros personalizados sob encomenda que retratam a história do cliente. Presente exclusivo e original.` |
| Mural | `Mural — Pintura mural artística em paredes, fachadas e portas. Muralista para empresas e residências.` |
| Abstrato | `Abstrato — Quadros abstratos originais e pinturas abstratas contemporâneas para sala e escritório.` |
| Taki pelo Mundo | `Taki pelo Mundo — personagem autoral de Rod7. Quadros colecionáveis da série Taki.` |
| Contato | `Contato para encomendas, comissões artísticas, exposições e parcerias com galerias.` |

---

### 3.5 Atributos `alt` das imagens — reescrever todos

**Esse é o segundo trabalho mais importante depois do `<title>`.** Hoje os alts são `"Concept 1"`, `"Mural 2"`, etc — invisíveis pro Google. Cada imagem precisa de um alt **descritivo e único**.

**Princípio:** descrever o que está na imagem usando palavras‑chave naturalmente, sem stuffing.

#### Bio
```html
<img src="images/bio/rod-4.jpeg" alt="Retrato em preto e branco do artista visual Rodney Silva (ROD7) em seu estúdio">
```

#### Concept (8 imagens)
```html
<img src="images/concept/concept-1.jpeg" alt="Quadro corporativo sustentável com letras e símbolos de MDF reciclado e respingos laranjas — obra Concept de Rodney Silva">
<img src="images/concept/concept-2.jpeg" alt="Arte corporativa personalizada com logo de empresa em quadro sustentável de MDF — Concept ROD7">
<img src="images/concept/concept-3.jpeg" alt="Quadro com logotipo Verccelli Engenharia integrado a composição de cidade em MDF reciclado">
<img src="images/concept/concept-4.jpeg" alt="Quadro decorativo corporativo com logo Pousada Cabore — arte sustentável Rod7">
<img src="images/concept/concept-5.jpeg" alt="Quadro corporativo personalizado com logo Casa em fundo de MDF branco e detalhes dourados">
<img src="images/concept/concept-6.jpeg" alt="Obra Concept com logo Simone Bassetto integrado a paisagem urbana sustentável de MDF">
<img src="images/concept/concept-7.jpeg" alt="Quadro corporativo sustentável com logotipo de empresa — série Concept">
<img src="images/concept/concept-8.jpeg" alt="Arte corporativa personalizada com resíduos de MDF — obra Concept de Rodney Silva">
```

#### Histórias (6 imagens)
```html
<img src="images/historias/historias-1.jpeg" alt="Quadro personalizado azul com a história do cliente — série Histórias de Rodney Silva">
<img src="images/historias/historias-2.jpeg" alt="Quadro narrativo personalizado com simbologia da vida do cliente — Histórias ROD7">
<img src="images/historias/historias-3.jpeg" alt="Obra personalizada sob encomenda contando a trajetória do cliente — série Histórias">
<img src="images/historias/historias-4.jpeg" alt="Quadro autobiográfico personalizado com elementos da história pessoal do cliente">
<img src="images/historias/historias-5.jpeg" alt="Pintura personalizada sob encomenda — quadro narrativo da série Histórias de Rod7">
<img src="images/historias/historias-6.jpeg" alt="Quadro personalizado com história de família — obra Histórias de Rodney Silva">
```

#### Mural (9 imagens)
```html
<img src="images/mural/mural-1.jpeg" alt="Mural artístico em arco-íris pintado em muro residencial — muralista Rodney Silva">
<img src="images/mural/mural-2.jpeg" alt="Mural decorativo colorido com elementos florais e geométricos para fachada">
<img src="images/mural/mural-3.jpeg" alt="Mural artístico para empresa com personagens autorais — pintura mural ROD7">
<img src="images/mural/mural-4.jpeg" alt="Mural decorativo em ambiente comercial — pintura mural artística de Rod7">
<img src="images/mural/mural-5.jpeg" alt="Pintura mural personalizada para escritório — muralista Rodney Silva">
<img src="images/mural/mural-6.jpeg" alt="Mural artístico em parede externa — arte em fachada por Rod7">
<img src="images/mural/mural-7.jpeg" alt="Mural colorido em estabelecimento comercial — pintura mural artística">
<img src="images/mural/mural-8.jpeg" alt="Pintura mural em porta de garagem — arte urbana personalizada Rod7">
<img src="images/mural/mural.jpeg" alt="Mural artístico em parede de ambiente comercial — muralista ROD7">
```

#### Abstrato (6 imagens)
```html
<img src="images/abstrato/abstrato.jpeg" alt="Quadro abstrato grande contemporâneo com panda e elementos coloridos — obra original de Rodney Silva">
<img src="images/abstrato/abstrato-1.jpeg" alt="Pintura abstrata original em tons azuis e amarelos — obra abstrata ROD7">
<img src="images/abstrato/abstrato-2.jpeg" alt="Quadro abstrato contemporâneo com camadas de cor — arte abstrata original Rod7">
<img src="images/abstrato/abstrato-3.jpeg" alt="Obra abstrata original em telas verticais — pintura contemporânea Rodney Silva">
<img src="images/abstrato/abstrato-4.jpeg" alt="Quadro abstrato grande para sala — arte abstrata contemporânea de Rod7">
<img src="images/abstrato/abstrato-5.jpeg" alt="Pintura abstrata colorida original — obra contemporânea de Rodney Silva">
```

#### Taki (3 imagens)
```html
<img src="images/taki/taki-1.jpeg" alt="Quadro do personagem Taki em ambiente de sala de estar — obra autoral de Rod7">
<img src="images/taki/taki-2.jpeg" alt="Pintura do Taki, personagem autoral coelho — série Taki pelo Mundo de Rodney Silva">
<img src="images/taki/taki-4.jpeg" alt="Obra colecionável da série Taki pelo Mundo — personagem autoral ROD7">
```

---

### 3.6 JSON‑LD do artista (Schema.org)

**Adicionar antes do `</body>`** — esse bloco faz o Google entender que existe uma pessoa por trás do site e pode renderizar um *card* lateral nas buscas pelo nome do artista.

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Rodney Silva",
  "alternateName": "ROD7",
  "jobTitle": "Artista Visual",
  "description": "Artista visual brasileiro autodidata. Cria quadros personalizados, murais artísticos e arte corporativa sustentável com resíduos de MDF.",
  "image": "https://SEU-DOMINIO.com/images/bio/rod-4.jpeg",
  "url": "https://SEU-DOMINIO.com",
  "sameAs": [
    "https://www.instagram.com/SEU-INSTAGRAM",
    "https://www.behance.net/SEU-BEHANCE",
    "https://www.saatchiart.com/SEU-PERFIL"
  ],
  "knowsAbout": [
    "Pintura",
    "Mural",
    "Arte Sustentável",
    "Arte Corporativa",
    "Quadros Personalizados",
    "Arte Abstrata"
  ],
  "makesOffer": [
    { "@type": "Offer", "name": "Quadros Personalizados (Histórias)" },
    { "@type": "Offer", "name": "Arte Corporativa Sustentável (Concept)" },
    { "@type": "Offer", "name": "Murais Artísticos" },
    { "@type": "Offer", "name": "Quadros Abstratos Originais" }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Rodney Silva — ROD7",
  "url": "https://SEU-DOMINIO.com",
  "inLanguage": "pt-BR",
  "description": "Site institucional do artista visual Rodney Silva (ROD7). Quadros personalizados, murais e arte corporativa sustentável."
}
</script>
```

> Quando o domínio e os links sociais reais estiverem definidos, substituir os placeholders.

---

### 3.7 `aria-label` nas seções (reforço semântico leve)

Em cada `<section>`, adicionar um `aria-label` descritivo. É um sinal extra pro Google e melhora a navegação por leitor de tela.

```html
<section class="section section--dark" id="concept" aria-label="Concept — Arte Corporativa Sustentável com Resíduos de MDF">
<section class="section" id="historias" aria-label="Histórias — Quadros Personalizados sob Encomenda">
<section class="section section--dark" id="mural" aria-label="Mural — Pintura Mural Artística em Paredes e Portas">
<section class="section" id="abstrato" aria-label="Abstrato — Quadros Abstratos Originais">
<section class="section section--taki" id="taki" aria-label="Taki pelo Mundo — Personagem Autoral de Rod7">
<section class="section section--contact" id="contato" aria-label="Contato para encomendas, comissões e exposições">
```

---

### 3.8 Texto‑âncora dos links da nav

Os links da nav hoje são "Bio", "Concept", "Histórias"… O Google usa o texto dentro de `<a>` como sinal. Adicionar `title` atributo dá contexto sem mudar a aparência:

```html
<a href="#concept" title="Concept — Arte Corporativa Sustentável">Concept</a>
<a href="#historias" title="Histórias — Quadros Personalizados">Histórias</a>
<a href="#mural" title="Mural — Pintura Mural Artística">Mural</a>
<a href="#abstrato" title="Abstrato — Quadros Abstratos Originais">Abstrato</a>
<a href="#taki" title="Taki pelo Mundo — Personagem Autoral">Taki</a>
```

---

### 3.9 Criar `sitemap.xml` e `robots.txt` na raiz

**`/robots.txt`:**
```
User-agent: *
Allow: /

Sitemap: https://SEU-DOMINIO.com/sitemap.xml
```

**`/sitemap.xml`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://SEU-DOMINIO.com/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

(Como é página única, basta uma URL. Se um dia virar multi‑página, expande.)

---

## 4. Checklist final pro Claude Code

Quando passar tudo pra ele, é uma boa pedir nessa ordem (cada uma é independente):

- [ ] Trocar `<title>` e adicionar todas as `<meta>` do item 3.1
- [ ] Adicionar a classe `.sr-only` no CSS (item 3.2)
- [ ] Reescrever o `<h1>` do hero com `sr-only` (item 3.3)
- [ ] Reescrever cada `<h2>` com `sr-only` (item 3.4)
- [ ] Reescrever todos os atributos `alt` das imagens (item 3.5)
- [ ] Adicionar os dois blocos JSON‑LD antes de `</body>` (item 3.6)
- [ ] Adicionar `aria-label` em cada `<section>` (item 3.7)
- [ ] Adicionar `title` nos links da nav (item 3.8)
- [ ] Criar `robots.txt` e `sitemap.xml` na raiz (item 3.9)

---

## 5. Depois do site no ar

SEO orgânico não é instantâneo — leva 2 a 8 semanas para o Google indexar e começar a ranquear. Para acelerar:

1. **Google Search Console** — cadastrar o domínio, fazer a verificação, submeter o `sitemap.xml`. É de graça e é o jeito de saber se o Google está indexando.
2. **Pedir backlinks** — se galerias, clientes ou veículos linkarem pro site, sobe ranking. Cada cliente que você atender pode receber um pedido educado pra colocar o link na bio do Instagram ou no site da empresa.
3. **Compartilhar nas redes** — cada post do Instagram com o link no perfil ajuda. O Google nota tráfego direto.
4. **Atualizar com novidades** — sites estáticos sem atualização perdem posição com o tempo. Pode ser uma seção "Novidades" futura, ou apenas trocar imagens da seção quando tiver obra nova.

---

## 6. O que eu deliberadamente NÃO recomendei

Pra você saber por quê:

- **Keyword stuffing** (encher de palavras‑chave repetidas) — Google penaliza, não ajuda mais desde 2012.
- **Texto invisível na cor do fundo** — penalização severa, técnica considerada *black hat*.
- **Comprar backlinks** — também penaliza, e há serviços que parecem legítimos mas o Google detecta.
- **Páginas separadas por serviço agora** — você optou por manter página única, e está certo: páginas separadas pedem manutenção contínua e fazem mais sentido quando você tem volume real de tráfego pra justificar.

Bom trabalho com o Claude Code 👌
