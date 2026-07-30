# mural.rod7.com.br — Onepage ROD7

Landing page institucional do ROD7, servida no subdomínio `mural.rod7.com.br`.
Site estático, sem build step e sem dependência externa (nem Google Fonts CDN).

## Estrutura

```
mural/
├── index.html          # página única, âncoras: #sobre #problema #metodo #frentes #murais #contato
├── css/
│   ├── fonts.css       # @font-face locais (subsets latin e latin-ext)
│   └── style.css       # design system + bloco responsivo no final
├── js/app.js           # nav fixa, drawer mobile, scroll-reveal, carrossel, lightbox
├── fonts/              # Newsreader, Inter Tight, JetBrains Mono (woff2)
├── images/             # cada foto em .jpg + .webp nas larguras 640 / 1024 / original
│   └── logos/          # marcas parceiras
├── .htaccess           # cache, gzip/brotli, headers de segurança, redirect HTTPS
├── robots.txt
└── sitemap.xml
```

## Deploy

Automático: push na `main` dispara `.github/workflows/deploy.yml`, que sincroniza
a pasta inteira do repositório via FTP para o `public_html` da Hostinger. Esta
pasta chega em `public_html/mural`.

**Pré-requisito no hPanel:** o document root do subdomínio `mural.rod7.com.br`
precisa apontar para `public_html/mural`. Esse é o padrão da Hostinger ao criar
um subdomínio, mas vale conferir em *Domínios → Subdomínios*. Enquanto não
apontar, o mesmo conteúdo responde em `rod7.com.br/mural/`.

## Imagens

As variantes `.webp` são geradas a partir do `.jpg` de origem com ffmpeg:

```
ffmpeg -y -i images/NOME.jpg -vf "scale='min(640,iw)':-2:flags=lanczos" \
  -c:v libwebp -quality 80 -compression_level 6 -preset photo images/NOME-640.webp
```

Ao trocar uma foto, regere as três larguras (640 / 1024 / original) e atualize o
`srcset` e os atributos `width`/`height` da tag correspondente no `index.html`.

> Atenção: os atributos `width`/`height` do `<img>` viram *presentational hints*
> de CSS. Se uma regra definir só `width`, é preciso definir `height:auto`
> junto — senão a altura trava no valor natural e a imagem estica.

## Responsivo

O bloco mobile fica no fim de `css/style.css`. Pontos de corte: 900px (degradês
sobre foto), 860px (mural split empilha), 820px (timeline vira lista), 640px
(tipografia, grids e lightbox) e 560px (frentes em coluna única). O bloco
`@media (hover: none)` cobre o comportamento em touch — sem hover preso e com as
legendas do carrossel sempre visíveis.
