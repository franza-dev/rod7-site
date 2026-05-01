# RODNEY SILVA · ROD7 — Site Institucional

Site institucional para o artista visual Rodney Silva (ROD7), em página única com âncoras navegáveis.

## Estrutura

```
site/
├── index.html          # Página única com todas as seções
├── css/style.css       # Design system — Bodoni Moda + Jost, paleta ink/bone/rust
├── js/main.js          # Preloader, nav fixa, drawer mobile, scroll-spy, lightbox
└── images/
    ├── bio/            # Retrato do artista
    ├── concept/        # 8 obras Concept (arte corporativa sustentável)
    ├── historias/      # 6 obras Histórias (retratos narrativos)
    ├── mural/          # 9 obras Mural (arte em paredes e portas)
    ├── abstrato/       # 6 obras Abstrato
    └── taki/           # 3 obras Taki pelo Mundo
```

## Seções

1. **Hero** — Apresentação com tipografia Bodoni em destaque
2. **Statement** — Parágrafo de abertura sobre a trajetória
3. **Bio** (01) — Biografia completa + retrato + marcos da carreira
4. **Concept** (02) — Arte corporativa sustentável com resíduos de MDF
5. **Histórias** (03) — Retratos narrativos personalizados
6. **Mural** (04) — Arquitetura como tela
7. **Abstrato** (05) — Gesto livre
8. **Taki pelo Mundo** (06) — Manifesto do personagem-símbolo
9. **Contato** (07) — Encomendas, exposições, redes sociais

## Tecnologia

- **HTML/CSS/JS puros**, sem dependências de build
- **Google Fonts** carregadas via CDN: Bodoni Moda, Jost, JetBrains Mono
- **Responsivo**: desktop, tablet e mobile (drawer dedicado)
- **Acessível**: navegação por teclado, ARIA labels, contraste, `prefers-reduced-motion`
- **Performance**: lazy-loading nas imagens, IntersectionObserver para reveals

## Como hospedar

Por ser totalmente estático, qualquer hospedagem serve:

- **GitHub Pages** — empurrar o conteúdo da pasta `site/` para um repo
- **Netlify / Vercel** — arrastar a pasta no painel ou conectar ao Git
- **Cloudflare Pages** — mesmo fluxo
- **Hospedagem tradicional** — subir os arquivos via FTP

Não há build step. Basta colocar a pasta no servidor.

## Personalização

- **Cores**: editar as variáveis em `:root` no topo de `css/style.css`
- **E-mail e redes**: trocar os links na seção `#contato` em `index.html`
- **Imagens novas**: colocar em `images/<seção>/` e referenciar no HTML

## Notas

- A paleta foi montada a partir do laranja queimado característico da série Concept de Rod7 (#c4623a), combinado com preto profundo (#0a0807) e creme bone (#ede4d3) para um clima editorial-luxo no estilo Tom Ford.
- A tipografia segue a referência do site Tom Ford: serifa Bodoni de alto contraste para os títulos, sans geométrica para o corpo.
- O texto de "Taki pelo Mundo" foi transcrito da imagem de referência fornecida pelo cliente.
