# BusinessOS — Briefing de Produto

> **Tagline:** "Pra quem está começando do zero"

## 1. O que é

BusinessOS é a inteligência do negócio do fundador: um sistema de tomada de
decisão que funciona como um sistema operacional para empreendedores. Não é
um dashboard de métricas — é uma interface onde o fundador **escreve e
mantém** as informações estratégicas do próprio negócio (objetivo, mercado,
problemas, cliente ideal, oferta, caixa etc.), e onde, ao mesmo tempo,
**múltiplos agentes de IA** com skills específicas têm acesso de leitura e
escrita a esse mesmo contexto para colaborar ativamente no desenvolvimento do
negócio.

O produto existe porque montar um negócio do zero é, na prática, um exercício
contínuo de clareza: o fundador raramente tem um lugar único, vivo e
estruturado onde suas decisões estratégicas moram — ficam espalhadas em
notas, planilhas, conversas de IA sem memória e na própria cabeça. BusinessOS
propõe um único lugar, com estrutura mínima, que serve tanto para o humano
pensar quanto para agentes de IA agirem sobre o mesmo material.

## 2. Problema

- Founders solo e early-stage não têm um repositório único de contexto
  estratégico do negócio — o conhecimento fica fragmentado e desatualizado.
- Ferramentas de IA generativa (chats, copilots) não têm acesso persistente
  e estruturado ao contexto real do negócio; cada conversa recomeça do zero.
- Dashboards tradicionais mostram números, mas não capturam a camada de
  raciocínio estratégico (por que a oferta é essa, quem é o cliente ideal,
  o que já foi validado) que orienta as decisões do dia a dia.
- Ferramentas de gestão "prontas" (ERPs, CRMs) são pesadas demais para quem
  está começando do zero e ainda está definindo o próprio modelo de negócio.

## 3. Para quem é

- Fundadores solo ou em dupla, em estágio **early-stage / pré-tração**.
- Pessoas "começando do zero": sem estrutura organizacional herdada, sem
  processos definidos, que precisam pensar o negócio com clareza antes de
  escalar operação.
- Usuário único por instância na v1 (sem multiusuário) — o fundador é ao
  mesmo tempo o único humano operador e o "dono" do contexto que os agentes
  de IA vão consumir.

## 4. Proposta de valor

- **Um só lugar para o raciocínio estratégico do negócio**, organizado em
  seções que seguem a jornada natural do founder: quem sou eu (Founder),
  para onde vou (Direção), o que já testei (Validação), como estou indo
  financeiramente (Caixa).
- **O mesmo conteúdo serve ao humano e à IA.** O fundador edita em uma UI
  simples; agentes de IA leem e escrevem no mesmo material para ajudar a
  desenvolver o negócio — sem duplicação de contexto, sem re-explicar tudo
  a cada prompt.
- **Simplicidade radical de armazenamento.** Início em arquivos Markdown
  locais, sem banco de dados, sem infraestrutura — o que torna o conteúdo
  transparente, versionável e portátil desde o primeiro dia.

## 5. Princípio arquitetural central

> **Markdown com frontmatter como fonte da verdade do contexto do negócio.**

Cada unidade de conteúdo (ex.: "Objetivo", "Mapa do Mercado", "Oferta") é um
único arquivo `.md`: metadados estruturados no frontmatter (título, seção,
slug, status, tags, instrução para IA etc.) + corpo em prosa livre. Essa
escolha resolve dois problemas ao mesmo tempo:

1. **Editável por humano** — é texto simples, pode virar formulário/editor
   numa UI amigável, sem exigir schema rígido de banco de dados.
2. **Consumível por LLMs/agentes** — é o formato mais natural para um agente
   de IA ler, entender contexto e propor edições, sem camadas de tradução.

Humano e agentes de IA compartilham a mesma fonte de dados. Não há uma cópia
"para IA" e outra "para o app" — é o mesmo arquivo.

## 6. Princípios de design

- **Minimalista, monocromático (preto e branco).** Sem cor decorativa;
  hierarquia visual vem de tipografia, espaçamento e estado (hover, seleção).
- **Cards, não tabelas.** Conteúdo é apresentado como cards navegáveis, com
  alternância entre visualização em grade e em lista.
- **Bordas arredondadas** em cards, inputs e itens de navegação — linguagem
  visual suave, consistente com um produto de reflexão estratégica, não de
  planilha operacional.
- **Sidebar com hover destacado** (background ao passar o mouse) para reforçar
  a sensação de "sistema operacional" navegável.
- **Tipografia:** Inter, para leitura confortável de texto longo (prosa) e
  boa legibilidade em UI compacta.

## 7. Stack (alto nível)

| Camada | Escolha |
|---|---|
| Framework web | Next.js (App Router) + TypeScript |
| Estilo | Tailwind CSS |
| Componentes base | shadcn/ui |
| Documentação de componentes | Storybook |
| Armazenamento (fase atual) | Arquivos Markdown locais (`content/` no filesystem) |
| Armazenamento (futuro) | Supabase (banco de dados gerenciado) |
| Fonte | Inter |
| Agentes de IA | Múltiplos agentes com skills específicas, operando sobre o mesmo conteúdo MD+frontmatter que o humano edita |

Na fase atual, o app é um webapp clássico, sem SSR de dados sensíveis e sem
banco de dados conectado.

## 8. Escopo da primeira fase

### Dentro do escopo (v1)

- As 4 seções (Founder, Direção, Validação, Caixa) com seus respectivos cards
  de conteúdo, navegáveis via sidebar.
- Leitura e edição de conteúdo de cada card, persistido como arquivo
  Markdown local com frontmatter.
- Alternância de visualização grid/lista dentro de cada seção.
- Design system inicial (preto/branco, cards, Inter, bordas arredondadas).
- Estrutura de pastas e contratos de dados pensados desde já para permitir
  a leitura/escrita por agentes de IA (mesmo que a orquestração de agentes
  em si não seja implementada nesta fase).

### Fora do escopo (v1) — visão futura

- **Banco de dados real** (Supabase) — a v1 usa apenas arquivos locais.
- **Autenticação** de usuários.
- **Colaboração multiusuário** (múltiplos fundadores/equipe no mesmo
  workspace, permissões, controle de concorrência).
- **Orquestração real de agentes de IA** executando ações de forma autônoma
  (a v1 prevê a estrutura de dados compatível com isso, mas não implementa
  agentes ativos).

Essas quatro frentes compõem o roadmap de evolução do produto além da v1
(ver `docs/02-prd.md`, seção de Roadmap).
