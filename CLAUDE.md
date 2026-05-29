# Site Cecília Fonseca Advogados

Landing page profissional para o escritório de advocacia da Dra. Cecília Fonseca, baseado em Goiânia/GO com atuação nacional.

---

## Como rodar

```bash
python3 /home/jpfm2912/projetos/claude/cecilia-fonseca-advogados/server.py
```

Acesse: **http://localhost:8000**

> Usar sempre o `server.py` customizado (não `python3 -m http.server`). Ele envia `Cache-Control: no-store` em todas as respostas, evitando problemas de cache do browser.

Para verificar se está rodando:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html
```

---

## Stack

- **HTML** puro — `index.html`
- **CSS** puro — `styles.css` (com `?v=N` para cache-bust)
- **JavaScript** puro — `script.js`
- Sem frameworks, sem build step, sem dependências npm

---

## Estrutura de arquivos

```
cecilia-fonseca-advogados/
├── index.html
├── styles.css
├── script.js
├── server.py          ← servidor local com no-cache headers
├── CLAUDE.md          ← este arquivo
└── assets/
    └── fotos/
        ├── IMG_1491.PNG  → hero card (Cecília, braços cruzados, escritório)
        ├── IMG_1492.PNG  → contact section bg (retrato vertical)
        ├── IMG_1493.PNG  → proof section bg (Cecília sorrindo)
        ├── IMG_1494.PNG  → about section bg (pose pensativa)
        ├── IMG_1495.PNG  → practice section bg (corpo inteiro, branco)
        ├── IMG_1497.PNG  → process section bg (braços cruzados, outra pose)
        ├── IMG_1499.PNG  → membership section bg (corpo inteiro, standing)
        ├── IMG_1500.PNG  → faq section bg (similar 1499)
        ├── IMG_1501.PNG  → (Torre Eiffel P&B — não usada ativamente)
        ├── IMG_1502.PNG  → hero background (Torre Eiffel P&B com Cecília)
        ├── Logo CF - Branca.PNG  → logo fundo claro (nav + footer)
        └── Logo CF - Preta.PNG   → logo versão escura (não usada atualmente)
```

---

## GitHub

- **Repositório:** `https://github.com/Fonseca-06/cecilia-fonseca-advogados`
- **GitHub Pages:** `https://fonseca-06.github.io/cecilia-fonseca-advogados/`
- Branch: `main`

Git no projeto:
```bash
git -C /home/jpfm2912/projetos/claude/cecilia-fonseca-advogados add -A
git -C /home/jpfm2912/projetos/claude/cecilia-fonseca-advogados commit -m "mensagem"
git -C /home/jpfm2912/projetos/claude/cecilia-fonseca-advogados push
```

---

## Arquitetura de design atual

### Layout geral
- **Scroll-snap full-screen** — cada seção ocupa 100vh, o scroll trava entre seções
- `body { scroll-snap-type: y mandatory; height: 100vh; overflow-y: scroll; }`
- Cada seção: `scroll-snap-align: start; scroll-snap-stop: always;`

### Fotos laterais
- Fotos posicionadas como `background: url(...) right top/auto 100% no-repeat` no `::before`
- `auto 100%` mostra corpo inteiro sem corte vertical
- `right top` = foto no lado direito, alinhada ao topo
- Para seções Sobre e Contato: `left top` = foto no lado esquerdo

### Gradiente lateral
- Gradiente cobre apenas o lado do texto, fade para transparente onde a foto está
- Exemplo: `linear-gradient(to right, rgba(cor,0.99) 0%, rgba(cor,0.96) 42%, rgba(cor,0.35) 65%, rgba(cor,0) 85%)`
- Seções com foto à esquerda usam `linear-gradient(to left, ...)`

### Animação de transição
- `::before` inicia com `transform: scale(1.08); opacity: 0.82`
- Ao entrar na seção (`is-active`): `transform: scale(1.0); opacity: 1`
- Transição de 1100ms com `cubic-bezier(0.16, 1, 0.3, 1)`
- `initSectionTransitions()` no JS usa IntersectionObserver com `threshold: 0.45`

### Posicionamento do conteúdo
- Seções com foto à direita: `margin-left: clamp(28px, 5vw, 80px); max-width: min(700px, 52vw)`
- Seções com foto à esquerda: `margin-left: auto; margin-right: clamp(28px, 5vw, 80px)`

---

## Paleta de cores (guia visual da Cecília)

```css
--black: #141414;       /* carvão — seções escuras */
--ink: #141414;         /* texto principal claro */
--paper: #f4efe8;       /* creme quente — seções claras */
--red: #a01228;         /* vermelho escuro — hover, bordas */
--red-bright: #c41530;  /* vermelho primário — botões, CTAs */
--gold: #b8963c;        /* dourado — section kickers, logo */
--muted: #6e6e74;       /* cinza médio — texto secundário */
```

---

## Seções do site

| Seção | Classe | Foto de fundo | Cor base | Posição foto |
|---|---|---|---|---|
| Hero | `.hero-section` | IMG_1502 (Torre Eiffel) | Escuro | Full bg |
| Como atendemos | `.proof-section` | IMG_1493 | Creme | Direita |
| Áreas de atuação | `.practice-section` | IMG_1495 | Branco | Direita |
| Como funciona | `.process-section` | IMG_1497 | Escuro | Direita |
| O atendimento inclui | `.membership-section` | IMG_1499 | Escuro | Direita |
| Sobre | `.about-section` | IMG_1494 | Creme | Direita |
| FAQ | `.faq-section` | IMG_1500 | Branco | Direita |
| Contato | `.contact-section` | IMG_1492 | Creme | Esquerda |

---

## Contatos da Cecília no site

- **WhatsApp:** 62 9 8300-2101
- **Email:** ceciliafonsecaadvogada@gmail.com

---

## Pendente / próximos passos

- [ ] Ajustar cores de fundo das seções (mencionado pelo usuário como próximo passo)
- [ ] Adicionar depoimentos de clientes
- [ ] Adicionar número OAB
- [ ] Meta tags Open Graph para compartilhamento social
- [ ] Favicon com a logo CF
- [ ] Otimizar tamanho das imagens PNG (são muito pesadas — 2MB+ cada)
