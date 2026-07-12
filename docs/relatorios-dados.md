# Relatórios com dados reais + fontes

Blocos de conteúdo podem carregar um campo `report` no frontmatter com **dados reais
pesquisados na internet**, cada um com sua natureza e fontes citáveis. É renderizado
pela seção "Pesquisa de mercado" (`components/content-report.tsx`).

## Como preencher

Hoje o `report` é autorado **sob demanda por pesquisa via chat**: peça "gere o relatório
de X" e o agente pesquisa (WebSearch/WebFetch) fontes confiáveis e escreve o `report`
no `.md` do bloco. No futuro, o botão "Gerar dados" fará isso em runtime pela mesma
seam (`lib/report.ts` → `generateReport`).

## Schema (`Report` em `lib/types.ts`)

```yaml
report:
  summary: >-
    Síntese executiva curta (mesmo markdown-ish do briefing: **bold**, _italic_, listas "- ").
  generatedAt: '2026-07-12T00:00:00-03:00'   # ISO 8601
  generatedBy: claude-web-research
  findings:
    - label: Tamanho do mercado (SAM)
      value: '~R$ 2,4 bi/ano'
      kind: fato            # fato | meta | expectativa
      detail: Narrativa curta opcional.
      sourceIndexes: [0, 1] # índices (base 0) em sources[]
  sources:
    - title: Título da publicação
      url: https://exemplo.com/relatorio
      publisher: Sebrae      # opcional
      publishedAt: '2025'    # opcional (ano ou ISO)
```

## Natureza do dado (`kind`) — regra de ouro

- **`fato`** — dado real e verificável, com fonte confiável. **Sempre** cite `sourceIndexes`.
- **`meta`** — objetivo definido pelo founder (ex.: "chegar a 100 clientes"). Não é fato de mercado.
- **`expectativa`** — projeção/estimativa (nossa ou de terceiros), não confirmada.

Nunca rotule uma estimativa como `fato`. Na dúvida entre meta e expectativa: se é um alvo
que **nós** definimos, é `meta`; se é uma previsão, é `expectativa`.

## Cuidados

- **Sem chaves `undefined` aninhadas.** O saneamento em `saveContent` só remove `undefined`
  de topo — dentro de `report`, **omita** chaves opcionais em vez de setá-las como `undefined`.
- Prefira fontes primárias/institucionais (IBGE, Sebrae, relatórios de fabricantes, imprensa
  de referência) a blogs. Registre `publishedAt` para o leitor avaliar a atualidade.
