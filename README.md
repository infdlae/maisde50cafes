# 50+ Maneiras de Fazer Café — Landing Page

Landing page estática, mobile-first e pronta para GitHub Pages. Não usa backend, banco de dados, framework ou Node.js em produção.

## Estrutura

```text
/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── icons/
│   │   └── coffee-bean.svg
│   └── images/
│       ├── book-deliverable.webp
│       ├── coffee-beans.webp
│       ├── coffee-pattern.webp
│       ├── coffee-sack.webp
│       ├── latte-cup.webp
│       └── og-image.jpg
└── favicon/
    └── favicon.svg
```

## O que foi otimizado nesta versão

- hierarquia visual e espaçamento refeitos com foco em conversão;
- header flutuante responsivo com menu à esquerda, marca central e checkout à direita;
- CTAs unificados em acabamento marrom metálico com profundidade por sombra, sem bordas pesadas;
- sticky CTA menos intrusivo: aparece somente depois que o visitante avança na página e some perto dos CTAs principais;
- Hero reorganizado para funcionar bem em 360, 375, 390 e 430 px;
- contraste reforçado nas seções claras e em “Café pelo mundo”;
- textura de café integrada de forma sutil para não competir com o conteúdo;
- carrossel “Do grão à xícara” com scroll-snap, toque, setas e teclado;
- imagens do saco e da xícara tratadas para eliminar o fundo quadriculado visual;
- imagens principais convertidas para WebP, reduzindo vários megabytes de transferência para menos de 600 KB somados;
- Open Graph definitivo em JPG 1200 × 630;
- efeitos de entrada e digitação respeitam `prefers-reduced-motion`;
- nenhum framework ou biblioteca externa.

## Configuração central

Edite o objeto `CONFIG` no topo de `js/main.js`:

```js
const CONFIG = {
  PRODUCT_NAME: "50+ Maneiras de Fazer Café",
  PRICE_FROM: "R$ 99,90",
  PRICE_CURRENT: "R$ 24,99",
  CHECKOUT_URL: "#",
  OFFER_END_DATE: "",
  SUPPORT_EMAIL: "",
  SITE_URL: "https://SEU-DOMINIO-AQUI/",
  PRIVACY_URL: "#",
  TERMS_URL: "#",
  SUPPORT_URL: "#"
};
```

### Obrigatório antes de vender

Troque pelo menos:

- `CHECKOUT_URL` — URL real do checkout;
- `SITE_URL` — URL final da landing page;
- `PRIVACY_URL` — Política de Privacidade;
- `TERMS_URL` — Termos de Uso;
- `SUPPORT_URL` ou `SUPPORT_EMAIL` — canal real de suporte.

Os preços podem ser alterados somente em `PRICE_FROM` e `PRICE_CURRENT`; todos os pontos da página são sincronizados automaticamente.

## Checkout e UTMs

Todos os CTAs usam `CHECKOUT_URL`. A página preserva, quando presentes:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`

Parâmetros que já existirem no checkout não são sobrescritos.

## Oferta e cronômetro

O texto de tempo limitado e o countdown só aparecem quando `OFFER_END_DATE` contém uma data futura real:

```js
OFFER_END_DATE: "2026-12-31T23:59:59-03:00"
```

Se estiver vazio, inválido ou vencido, não há mensagem de escassez.

## Meta Pixel / tracking

No `<head>` de `index.html` existe a área:

```html
<!-- META PIXEL / TRACKING -->
```

Cole ali o snippet oficial quando houver um Pixel ID real.

`js/main.js` já está preparado para:

- `PageView`
- `ViewContent`
- `InitiateCheckout`

`Purchase` não é disparado pela landing page; deve ser medido no checkout ou na página de confirmação.

## Imagens

Os arquivos usados em produção ficam em `assets/images/`.

- `book-deliverable.webp` — mockup do produto digital no Hero e seção de entregável;
- `coffee-beans.webp` — grãos realistas no Hero e carrossel;
- `coffee-pattern.webp` — textura editorial de fundo;
- `coffee-sack.webp` — imagem tratada, com transparência;
- `latte-cup.webp` — imagem tratada, com transparência;
- `og-image.jpg` — compartilhamento social, 1200 × 630.

Para substituir bandeiras por PNGs transparentes, troque o conteúdo de cada `.country-flag-media` no `index.html` por uma tag `<img>` com `alt` apropriado.

A faixa de marcas é propositalmente editorial. Caso use logos reais de terceiros, garanta que o uso seja permitido e mantenha a comunicação sem sugerir parceria quando não houver.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie o conteúdo desta pasta para a raiz.
3. Vá em **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha `main` e `/ (root)`.
6. Salve.

Todos os caminhos são relativos, então a página funciona em:

`https://usuario.github.io/repositorio/`

## Domínio próprio

Depois de apontar o domínio em **Settings → Pages → Custom domain**:

1. ajuste `SITE_URL` em `js/main.js`;
2. atualize o `href` do `<link rel="canonical">` em `index.html`;
3. atualize `og:url` em `index.html`.

## Acessibilidade

Incluído:

- HTML semântico;
- skip link;
- foco visível;
- FAQ com botões e `aria-expanded`;
- textos alternativos;
- carrossel navegável por teclado;
- menu acessível por teclado e tecla Esc;
- respeito a `prefers-reduced-motion`;
- contraste reforçado para textos e CTAs.

## Performance

- CSS e JavaScript locais;
- imagens principais em WebP;
- `loading="lazy"` fora da primeira dobra;
- dimensões declaradas nas imagens;
- sem Google Fonts;
- sem vídeo/autoplay;
- sem bibliotecas externas;
- `IntersectionObserver` para reveals.

## Revisão pré-publicação

Antes de liberar tráfego pago, confirme:

- [ ] checkout real configurado;
- [ ] política e termos publicados;
- [ ] suporte real configurado;
- [ ] `SITE_URL`, canonical e `og:url` corretos;
- [ ] Pixel/analytics instalados, se forem usados;
- [ ] `OFFER_END_DATE` preenchido somente quando houver prazo promocional verdadeiro;
- [ ] condições de pagamento e entrega do checkout conferidas;
- [ ] teste do fluxo em iPhone/Android e desktop;
- [ ] teste do checkout com UTMs.

## Desenvolvimento local

É possível abrir `index.html` diretamente. Para simular hospedagem HTTP:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.
