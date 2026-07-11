# BusinessOS — PRD (Product Requirements Document)

Documento de referência funcional para a v1 do BusinessOS. Para a visão de
produto e princípios gerais, ver `docs/01-briefing.md`. Para a especificação
técnica (schemas, contratos de dados, rotas), ver `docs/03-spec.md`.

## 1. Personas

### 1.1 Fundador solo / early-stage (persona primária)

- Está construindo um negócio do zero, sozinho ou com um sócio.
- Não tem processos, ferramentas ou estrutura organizacional herdada.
- Precisa de clareza estratégica mais do que de automação operacional.
- Usa IA no dia a dia (chats, copilots) mas sente que perde contexto entre
  conversas.
- É o único usuário humano do sistema na v1 (não há multiusuário).

### 1.2 Agente de IA com skill específica (persona secundária, "usuário não humano")

- Não é uma pessoa, mas um consumidor ativo do mesmo conteúdo do fundador.
- Precisa de contexto estruturado e legível para atuar com uma skill
  específica (ex.: um agente de "validação de oferta", um agente de
  "análise de mercado").
- Na v1, essa persona é considerada apenas no design dos dados (arquivos
  MD+frontmatter, campo `aiContext`) — não há execução real de agentes.

## 2. Jobs-to-be-done

| Job | Descrição |
|---|---|
| Registrar clareza | "Quando estou definindo meu negócio, quero escrever minhas conclusões estratégicas em um só lugar, para não perder o raciocínio e poder revisitá-lo." |
| Organizar por etapas do pensamento | "Quando estou começando do zero, quero separar quem eu sou (Founder), para onde vou (Direção), o que já testei (Validação) e como estou financeiramente (Caixa), para não misturar tudo." |
| Editar sem fricção | "Quando percebo que uma definição mudou, quero editar aquele card rapidamente, sem formulários complexos." |
| Escolher a visualização | "Quando tenho poucos ou muitos cards numa seção, quero alternar entre grid (visual) e lista (denso), conforme minha necessidade do momento." |
| Preparar terreno para IA | "Quando uso IA para me ajudar a tomar decisões, quero que ela tenha acesso ao mesmo contexto que eu mantenho, sem precisar reexplicar tudo." |

## 3. Páginas / rotas (v1)

Uma rota por seção, mais uma home/dashboard de entrada.

| Rota | Seção | Descrição |
|---|---|---|
| `/` | Home / Dashboard | Visão geral: atalhos para as 4 seções, possivelmente destaque de cards recém-atualizados. |
| `/founder` | Founder | Contexto pessoal do fundador. |
| `/direcao` | Direção | Estratégia e direcionamento do negócio. |
| `/validacao` | Validação | Evidências e aprendizados de mercado. |
| `/caixa` | Caixa | Saúde financeira do negócio. |

### 3.1 Founder — cards de conteúdo

| Card | Slug | Descrição |
|---|---|---|
| Objetivo | `objetivo` | O que o fundador busca com o negócio (motivação, meta pessoal/financeira, horizonte de tempo). |
| Estilo de vida | `estilo-de-vida` | Como o fundador quer viver enquanto constrói o negócio (rotina, limites, prioridades pessoais). |

### 3.2 Direção — cards de conteúdo

| Card | Slug | Descrição |
|---|---|---|
| Mapa do Mercado | `mapa-do-mercado` | Panorama do mercado em que o negócio atua: tamanho, concorrência, tendências. |
| Mapa de Problemas | `mapa-de-problemas` | Problemas identificados que o negócio pode resolver, priorizados. |
| Perfil Ideal de Cliente | `perfil-ideal-de-cliente` | Definição do cliente ideal (ICP): quem é, dores, contexto. |
| Tese de Valor | `tese-de-valor` | A hipótese central de por que o negócio gera valor. |
| Oferta | `oferta` | Definição da oferta: o quê, para quem, proposta de valor. **Card compartilhado** — ver seção 3.5. |

### 3.3 Validação — cards de conteúdo

| Card | Slug | Descrição |
|---|---|---|
| Oferta | `oferta` | Mesmo conteúdo do card "Oferta" de Direção, com ênfase em status de validação (testes, aprendizados, evidências). **Card compartilhado** — ver seção 3.5. |
| Primeiros clientes | `primeiros-clientes` | Registro dos primeiros clientes/leads: quem são, como chegaram, resultado. |

### 3.4 Caixa — cards de conteúdo

| Card | Slug | Descrição |
|---|---|---|
| Fluxo de Caixa | `fluxo-de-caixa` | Entradas, saídas e saldo projetado/realizado. |
| ERP | `erp` | Ponto de referência para dados/processos de gestão operacional (hoje, apenas registro em Markdown; não é um ERP funcional). |

### 3.5 Decisão de produto: card "Oferta" compartilhado entre Direção e Validação

**Decisão já tomada (documentada aqui, implementação em `03-spec.md`):**
"Oferta" é o **mesmo conceito e o mesmo arquivo de conteúdo** (slug único
`oferta`), acessível a partir de duas páginas diferentes:

- Em **Direção**, a página enfatiza a **definição** da oferta (o quê, para
  quem, proposta de valor) — é a seção onde a oferta é formulada.
- Em **Validação**, a página enfatiza o **status de validação** daquela
  mesma oferta (testes realizados, aprendizados, evidências de mercado) —
  é a seção onde a oferta é testada e revisada.

Não existem dois arquivos nem duas fontes de verdade: editar a oferta em
qualquer uma das duas páginas edita o mesmo documento. A diferença é de
**apresentação/ênfase de UI**, não de dado. Essa regra deve ser respeitada
por qualquer implementação futura da camada de dados (ver `03-spec.md`).

## 4. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF-01 | O sistema deve listar, para cada seção, os cards de conteúdo correspondentes (tabelas acima). |
| RF-02 | O usuário deve poder abrir um card e visualizar seu conteúdo (frontmatter renderizado + corpo em prosa). |
| RF-03 | O usuário deve poder editar o conteúdo de um card (frontmatter relevante + corpo) e salvar as alterações. |
| RF-04 | O usuário deve poder criar um novo card dentro de uma seção (quando aplicável a itens não fixos, ex. "Primeiros clientes" pode comportar múltiplas entradas). |
| RF-05 | O usuário deve poder alternar, por seção, entre visualização em **grid** (cards) e em **lista**, via um controle do tipo select com duas opções. |
| RF-06 | A navegação principal (sidebar) deve listar as 4 seções e permitir trocar de seção com um clique. |
| RF-07 | Itens do sidebar devem responder a hover com destaque de background. |
| RF-08 | O card "Oferta" deve ser acessível e editável tanto a partir de `/direcao` quanto de `/validacao`, apontando para o mesmo arquivo de conteúdo (`content/direcao/oferta.md`, ver spec). Uma edição feita a partir de qualquer uma das duas páginas deve refletir imediatamente na outra. |
| RF-09 | Cada card deve exibir metadados básicos de forma visível (ex.: status, última atualização). |
| RF-10 | O sistema deve funcionar sem exigir conexão a um banco de dados externo. |

## 5. Requisitos não-funcionais

| ID | Requisito |
|---|---|
| RNF-01 | **Performance:** navegação entre seções e abertura de cards deve ser quase instantânea (conteúdo local em arquivos, sem chamadas de rede a serviços externos). |
| RNF-02 | **Simplicidade:** a complexidade de infraestrutura deve ser mínima na v1 — sem servidor de banco de dados, sem autenticação, sem filas/serviços externos. |
| RNF-03 | **Sem lock-in de banco de dados:** a camada de dados deve ser abstraída (ver contrato em `03-spec.md`) de forma que trocar o armazenamento de arquivos locais para Supabase (fase 2) não exija reescrever a UI. |
| RNF-04 | **Portabilidade do conteúdo:** todo o conteúdo do negócio deve poder ser copiado, versionado (ex. Git) e lido fora do app, por ser Markdown puro. |
| RNF-05 | **Consistência visual:** toda a UI deve seguir o design system definido (preto/branco, Inter, bordas arredondadas) documentado e validado via Storybook. |
| RNF-06 | **Preparação para IA:** a estrutura de arquivos e frontmatter deve ser desenhada desde a v1 para ser diretamente consumível por agentes de IA, sem exigir uma reestruturação de dados nas fases seguintes. |

## 6. Critérios de aceite da v1

- [ ] As 4 seções (`/founder`, `/direcao`, `/validacao`, `/caixa`) existem e são navegáveis pelo sidebar.
- [ ] Cada seção exibe os cards de conteúdo listados nas tabelas da seção 3.
- [ ] É possível abrir, editar e salvar o conteúdo de qualquer card, com persistência em arquivo Markdown local.
- [ ] O card "Oferta" é o mesmo arquivo/conteúdo em `/direcao` e `/validacao`, com apresentação diferente (definição vs. validação) mas dado único.
- [ ] Cada seção permite alternar entre visualização em grid e em lista.
- [ ] O sidebar aplica destaque de hover em seus itens.
- [ ] Nenhuma funcionalidade da v1 depende de banco de dados, autenticação ou serviço externo.
- [ ] Os componentes principais (Card, toggle Grid/Lista, itens de sidebar) estão documentados no Storybook.

## 7. Roadmap futuro

| Fase | Escopo |
|---|---|
| **Fase 1 (esta v1)** | Arquivos Markdown locais, UI de leitura/edição, 4 seções, sem banco de dados, sem autenticação, sem agentes ativos. |
| **Fase 2** | Introdução do Supabase como banco de dados: migração do conteúdo de arquivos locais para tabelas, mantendo o contrato de dados (`lib/content.ts`) como camada de abstração. Possível introdução de autenticação básica de dono único. |
| **Fase 3** | Agentes de IA com skills específicas passam a **executar ações reais** sobre o conteúdo (propor edições, preencher lacunas, gerar análises), com leitura/escrita mediada por API/MCP em vez de acesso direto a arquivos. |
| **Fase 4** | Colaboração multiusuário: múltiplos membros de equipe no mesmo workspace, controle de permissões, histórico de alterações por autor (humano ou agente). |
