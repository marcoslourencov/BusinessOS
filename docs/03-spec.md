# BusinessOS — Especificação Técnica (Spec)

Este documento define a arquitetura técnica da v1 do BusinessOS: estrutura de
pastas, formato de conteúdo, contrato da camada de dados e design system.
Ele é a referência definitiva para implementação — os contratos de tipos e
funções aqui descritos (seção 4) são assinaturas fechadas, não sugestões.

Para visão de produto, ver `docs/01-briefing.md`. Para requisitos funcionais
e lista de cards por seção, ver `docs/02-prd.md`.

## 1. Estrutura de pastas do repositório

```
BusinessOS-ROBUSTA/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Home / Dashboard ("/")
│   ├── founder/
│   │   └── page.tsx            # "/founder"
│   ├── direcao/
│   │   └── page.tsx            # "/direcao"
│   ├── validacao/
│   │   └── page.tsx            # "/validacao"
│   ├── caixa/
│   │   └── page.tsx            # "/caixa"
│   └── layout.tsx               # Layout raiz (sidebar, fonte Inter, tema)
├── components/
│   ├── ui/                     # Componentes shadcn/ui (button, select, card base, etc.)
│   ├── sidebar/                # Navegação principal
│   ├── content-card/           # Componente de Card de conteúdo (ver seção 5)
│   └── view-toggle/            # Toggle Grid/Lista (Select)
├── content/                    # Fonte da verdade: arquivos Markdown + frontmatter
│   ├── founder/
│   │   ├── objetivo.md
│   │   └── estilo-de-vida.md
│   ├── direcao/
│   │   ├── mapa-do-mercado.md
│   │   ├── mapa-de-problemas.md
│   │   ├── perfil-ideal-de-cliente.md
│   │   ├── tese-de-valor.md
│   │   └── oferta.md           # fonte única, também referenciado por Validação
│   ├── validacao/
│   │   └── primeiros-clientes.md
│   └── caixa/
│       ├── fluxo-de-caixa.md
│       └── erp.md
├── lib/
│   ├── content.ts               # Camada de dados (contrato definido na seção 4)
│   └── types.ts                 # Tipos compartilhados (Section, ContentItem, etc.)
├── docs/
│   ├── 01-briefing.md
│   ├── 02-prd.md
│   └── 03-spec.md
├── .storybook/                  # Configuração do Storybook
└── stories/                     # Stories dos componentes (ou co-localizadas em components/)
```

Observação: `content/validacao/` **não contém** `oferta.md` — o arquivo físico
mora apenas em `content/direcao/oferta.md`. A página de Validação referencia
esse mesmo arquivo (ver seção 3).

## 2. Estrutura de `content/`

Regra geral: **uma subpasta por seção, um arquivo `.md` por item de
conteúdo**, nome do arquivo em kebab-case igual ao `slug` do item.

| Seção (pasta) | Arquivo | Slug |
|---|---|---|
| `content/founder/` | `objetivo.md` | `objetivo` |
| `content/founder/` | `estilo-de-vida.md` | `estilo-de-vida` |
| `content/direcao/` | `mapa-do-mercado.md` | `mapa-do-mercado` |
| `content/direcao/` | `mapa-de-problemas.md` | `mapa-de-problemas` |
| `content/direcao/` | `perfil-ideal-de-cliente.md` | `perfil-ideal-de-cliente` |
| `content/direcao/` | `tese-de-valor.md` | `tese-de-valor` |
| `content/direcao/` | `oferta.md` | `oferta` |
| `content/validacao/` | *(sem arquivo físico — referencia `direcao/oferta.md`)* | `oferta` |
| `content/validacao/` | `primeiros-clientes.md` | `primeiros-clientes` |
| `content/caixa/` | `fluxo-de-caixa.md` | `fluxo-de-caixa` |
| `content/caixa/` | `erp.md` | `erp` |

### 2.1 Regra do card compartilhado "Oferta"

- `content/direcao/oferta.md` é a **única fonte física** do conteúdo da
  oferta.
- A seção `section` no frontmatter desse arquivo é `"direcao"` (a seção
  "dona").
- A página `/validacao` **não lê um arquivo próprio** para "Oferta": ela
  resolve o mesmo arquivo `direcao/oferta.md` através de uma referência
  lógica (ver `getContentBySlug` na seção 4, que deve aceitar a busca por
  slug independentemente da seção solicitante para este caso, ou expor uma
  função dedicada `getOfertaContent()` — a decisão de qual abordagem exata
  fica para a implementação, mas o comportamento observável é obrigatório:
  **uma única leitura/escrita, duas páginas de acesso**).
- Recomenda-se que o frontmatter de `oferta.md` inclua um campo adicional
  `sharedWith: ["validacao"]` (ver schema, seção 3) para tornar essa relação
  explícita e legível tanto por humanos quanto por agentes de IA.

## 3. Schema de frontmatter

Todo arquivo de conteúdo segue um frontmatter padrão, com campos comuns a
todos os tipos e campos opcionais específicos por tipo de card.

### 3.1 Campos comuns (obrigatórios)

| Campo | Tipo | Descrição |
|---|---|---|
| `title` | `string` | Título de exibição do card (ex.: "Mapa do Mercado"). |
| `section` | `"founder" \| "direcao" \| "validacao" \| "caixa"` | Seção dona do conteúdo (case de `oferta.md`: sempre `"direcao"`). |
| `slug` | `string` | Identificador único em kebab-case, igual ao nome do arquivo sem extensão. |
| `status` | `"rascunho" \| "em-andamento" \| "validado"` | Estágio de maturidade do conteúdo. |
| `updatedAt` | `string` (ISO 8601) | Data/hora da última atualização. |
| `tags` | `string[]` | Palavras-chave livres para categorização e busca. |

### 3.2 Campo para IA (opcional, recomendado)

| Campo | Tipo | Descrição |
|---|---|---|
| `aiContext` | `string \| undefined` | Instrução curta, em linguagem natural, orientando agentes de IA sobre como interpretar ou usar aquele documento (ex.: "Use este documento para avaliar se uma nova oferta está alinhada à tese de valor already validada."). |

### 3.3 Campos específicos por tipo (opcionais)

| Campo | Tipo | Aplica-se a | Descrição |
|---|---|---|---|
| `sharedWith` | `string[]` | `oferta` | Lista de seções adicionais que também exibem este conteúdo (ex.: `["validacao"]`). |
| `validationStage` | `"nao-testada" \| "em-teste" \| "validada" \| "invalidada"` | `oferta`, `primeiros-clientes` | Status específico de validação, complementar ao `status` genérico. |
| `relatedSlugs` | `string[]` | qualquer | Slugs de outros cards relacionados, para navegação cruzada (ex.: `tese-de-valor` referenciando `perfil-ideal-de-cliente`). |
| `period` | `string` | `fluxo-de-caixa` | Período de referência dos dados financeiros (ex.: `"2026-07"`). |

### 3.4 Justificativa do schema

- **`title`/`section`/`slug`** dão identidade única e legível ao documento,
  necessária tanto para roteamento na UI quanto para um agente de IA saber
  "onde" está e "o que" é o documento sem precisar inferir do corpo do texto.
- **`status`** dá um sinal simples e universal de maturidade, útil tanto
  para o humano priorizar o que precisa de atenção quanto para um agente
  de IA decidir se deve sugerir uma revisão.
- **`updatedAt`** permite ordenar por recência (ex.: destacar na home os
  cards atualizados recentemente) e dá a agentes de IA um sinal de "quão
  atual" é a informação antes de usá-la para decisão.
- **`tags`** permite categorização leve sem exigir taxonomia rígida —
  compatível com o espírito "Markdown como fonte flexível".
- **`aiContext`** é o campo que torna o formato verdadeiramente pensado para
  colaboração humano+IA: é um canal direto do fundador para os agentes,
  embutido no próprio documento, sem precisar de configuração externa.
- Campos específicos (`sharedWith`, `validationStage`, `relatedSlugs`,
  `period`) ficam opcionais e por tipo para não poluir o schema comum e
  para deixar claro, em `oferta.md`, exatamente com quais outras seções
  aquele conteúdo é compartilhado.

### 3.5 Exemplo ilustrativo (não é código de implementação, é exemplo de dado)

```markdown
---
title: "Oferta"
section: "direcao"
slug: "oferta"
status: "em-andamento"
updatedAt: "2026-07-10T14:30:00-03:00"
tags: ["oferta", "proposta-de-valor"]
aiContext: "Ao editar este documento, garanta que a proposta de valor permaneça consistente com a Tese de Valor. Ao ser consultado a partir da página de Validação, priorize comentar sobre evidências de teste, não sobre a definição."
sharedWith: ["validacao"]
validationStage: "em-teste"
---

Nossa oferta é ...
```

## 4. Contrato da camada de dados (`lib/content.ts`)

Esta seção define o contrato que a implementação de `lib/content.ts` **deve**
seguir. As assinaturas abaixo são definitivas (contrato de tipos/funções,
não implementação).

### 4.1 Tipos

```ts
export type Section = "founder" | "direcao" | "validacao" | "caixa";

export type ContentStatus = "rascunho" | "em-andamento" | "validado";

export interface ContentFrontmatter {
  title: string;
  section: Section;
  slug: string;
  status: ContentStatus;
  updatedAt: string; // ISO 8601
  tags: string[];
  aiContext?: string;
  sharedWith?: Section[];
  validationStage?: "nao-testada" | "em-teste" | "validada" | "invalidada";
  relatedSlugs?: string[];
  period?: string;
}

export interface ContentItem {
  frontmatter: ContentFrontmatter;
  body: string;      // corpo em Markdown, sem o frontmatter
  filePath: string;  // caminho relativo dentro de content/, ex. "direcao/oferta.md"
}
```

### 4.2 Funções

```ts
/**
 * Retorna todos os ContentItem de todas as seções, lendo recursivamente
 * o diretório content/. Usado, por exemplo, para a home/dashboard.
 */
export function getAllContent(): Promise<ContentItem[]>;

/**
 * Retorna todos os ContentItem pertencentes a uma seção específica,
 * na ordem em que devem ser exibidos por padrão (ex.: ordem de criação
 * ou ordem definida por convenção de produto).
 *
 * Importante: para section === "validacao", o resultado deve incluir
 * o ContentItem de "oferta" (fisicamente armazenado em
 * content/direcao/oferta.md), respeitando a regra de compartilhamento
 * descrita na seção 2.1 desta spec.
 */
export function getContentBySection(section: Section): Promise<ContentItem[]>;

/**
 * Retorna um único ContentItem pelo slug, dentro do escopo de uma seção.
 *
 * Caso especial "oferta": chamar getContentBySlug("validacao", "oferta")
 * deve resolver e retornar o mesmo ContentItem que
 * getContentBySlug("direcao", "oferta") — ambos apontam para
 * content/direcao/oferta.md. Não deve haver dois arquivos nem duas cópias
 * de dado; a resolução do caminho físico é responsabilidade desta função.
 *
 * Retorna null (ou rejeita, a critério da implementação, desde que
 * documentado) se o slug não existir na seção.
 */
export function getContentBySlug(
  section: Section,
  slug: string
): Promise<ContentItem | null>;

/**
 * Cria ou atualiza (upsert) o conteúdo de um item. Deve serializar
 * frontmatter + body de volta para o arquivo .md correspondente,
 * atualizando updatedAt automaticamente.
 *
 * Caso especial "oferta": salvar via
 * saveContent("validacao", "oferta", { ... }) deve escrever no mesmo
 * arquivo físico content/direcao/oferta.md (não criar
 * content/validacao/oferta.md).
 */
export function saveContent(
  section: Section,
  slug: string,
  data: { frontmatter: Omit<ContentFrontmatter, "updatedAt">; body: string }
): Promise<ContentItem>;
```

### 4.3 Notas de implementação (para a equipe que for construir `lib/content.ts`)

- Estas assinaturas são o contrato público consumido pelas rotas/páginas da
  seção 6. Mudanças de assinatura devem ser tratadas como breaking change.
- A resolução do caso especial "oferta" (seções 2.1 e 4.2) é a regra mais
  importante deste contrato e deve ser coberta por teste dedicado quando a
  implementação existir.
- Esta camada é o ponto de abstração que permite, na Fase 2 do roadmap
  (ver `02-prd.md`), substituir a leitura/escrita de arquivos locais por
  chamadas ao Supabase sem alterar o restante da aplicação — desde que as
  assinaturas acima sejam preservadas.

## 5. Design system

### 5.1 Paleta

Estritamente monocromática. Sem cores de destaque (accent colors) na v1.

| Token | Uso |
|---|---|
| `background` (branco / quase-branco) | Fundo principal |
| `foreground` (preto / quase-preto) | Texto principal |
| Escala de cinzas neutros (3–5 tons) | Bordas, backgrounds secundários, texto secundário, estados de hover/disabled |

Não há paleta "dark mode" definida nesta fase; se necessário, deve inverter
os mesmos tokens neutros (preto vira fundo, branco vira texto).

### 5.2 Tipografia

- Fonte única: **Inter**, para todos os pesos e tamanhos (títulos, corpo,
  labels de UI).
- Hierarquia por peso (regular/medium/semibold) e tamanho, não por cor.

### 5.3 Border-radius

- Token único ou pequena escala (ex.: `sm`, `md`, `lg`) reaproveitando os
  defaults do shadcn/ui, aplicado consistentemente a: Cards, inputs,
  botões, itens de sidebar.
- Preferência por cantos visivelmente arredondados (não "quase quadrado"),
  reforçando a identidade visual suave do produto.

### 5.4 Sidebar — comportamento de hover

- Item de sidebar em estado de repouso: sem background, texto em cor
  neutra.
- Ao hover: background em tom de cinza claro (neutro), com transição suave.
- Item ativo (seção atual): background levemente mais forte que o hover,
  para diferenciar de "passando o mouse" vs. "seção atual".

### 5.5 Componente de Card (conteúdo)

Representa um item de `ContentItem` na visualização em grid ou lista.

| Elemento | Especificação |
|---|---|
| Título | `frontmatter.title`, peso semibold |
| Status | Badge textual com `frontmatter.status` (rascunho / em-andamento / validado), sem cor semântica (mantém monocromia — diferenciação por texto/ícone, não cor) |
| Metadado secundário | `updatedAt` formatado como data relativa ou absoluta curta |
| Tags | `frontmatter.tags`, exibidas como pequenos chips com borda arredondada |
| Corpo (preview) | Trecho inicial de `body`, truncado |
| Borda | Arredondada, seguindo token de border-radius |
| Interação | Clique no card abre o item para edição/visualização completa |

### 5.6 Toggle Grid/Lista

- Componente: `Select` (shadcn/ui) com exatamente duas opções: `"Grid"` e
  `"Lista"`.
- Escopo: aplicado por seção (o estado do toggle pode ser local à página,
  não precisa persistir entre sessões na v1).
- Efeito: alterna o layout dos `ContentItem` da seção atual entre grid
  (cards em colunas) e lista (itens empilhados, mais densos, com menos
  preview de corpo).

## 6. Consumo de conteúdo por agentes de IA

### 6.1 Visão atual (v1) — sem implementação de agentes

- Não há execução de agentes na v1. A estrutura de dados é desenhada para
  ser **compatível** com esse uso futuro, mas nenhum agente roda de fato.
- O acesso, quando existir (fases futuras), seria por **leitura e escrita
  direta dos arquivos** em `content/`, usando o mesmo contrato de
  `lib/content.ts` que a UI usa — um agente rodando localmente (ex. em um
  processo de CLI/skill) poderia importar e chamar as mesmas funções.

### 6.2 Visão futura (Fase 3 do roadmap)

- Agentes de IA com skills específicas (ex.: "agente de validação de
  oferta", "agente de análise de mercado") passam a atuar sobre o
  conteúdo via uma interface mediada — **MCP (Model Context Protocol) ou
  uma API HTTP dedicada** — em vez de acesso direto ao filesystem, o que
  permite:
  - Rodar com o app hospedado (sem depender de filesystem local
    compartilhado).
  - Auditar e limitar quais campos/seções cada skill pode ler ou escrever.
  - Registrar autoria de cada alteração (humano vs. agente, e qual agente).
- O campo `aiContext` no frontmatter (seção 3.2) continua sendo o canal
  primário pelo qual o fundador orienta o comportamento dos agentes,
  independentemente do mecanismo de transporte (filesystem direto, MCP ou
  API).
- Esta visão é descrita aqui como direção arquitetural; não faz parte da
  implementação da v1.

## 7. Rotas Next.js (App Router) — lista final

| Rota | Arquivo | Conteúdo esperado |
|---|---|---|
| `/` | `app/page.tsx` | Home/Dashboard com atalhos para as 4 seções |
| `/founder` | `app/founder/page.tsx` | Cards: Objetivo, Estilo de vida |
| `/direcao` | `app/direcao/page.tsx` | Cards: Mapa do Mercado, Mapa de Problemas, Perfil Ideal de Cliente, Tese de Valor, Oferta |
| `/validacao` | `app/validacao/page.tsx` | Cards: Oferta (compartilhado, ver seção 2.1), Primeiros clientes |
| `/caixa` | `app/caixa/page.tsx` | Cards: Fluxo de Caixa, ERP |

Layout raiz em `app/layout.tsx` provê a sidebar de navegação (com as 4
seções + home) e aplica a fonte Inter e o design system globalmente.
