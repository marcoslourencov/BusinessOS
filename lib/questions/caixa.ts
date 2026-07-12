import type { SectionQuestions } from "./types";

/**
 * Seção Caixa — "Fluxo de caixa e gestão operacional."
 * Perguntas para enxergar de onde vem o dinheiro, para onde ele vai, e quanto
 * tempo de fôlego o negócio tem.
 */
export const caixaQuestions: SectionQuestions = {
  intro:
    "Vamos organizar os números e a saúde financeira deste bloco — sem jargão, com clareza.",
  coreQuestionId: "essencia",
  questions: [
    {
      id: "essencia",
      label: "Em uma frase, como o dinheiro entra e sai deste bloco?",
      help: "Resuma o modelo financeiro com suas palavras.",
      type: "long",
      placeholder:
        "Ex.: Recebo mensalidades de clientes fixos e pago 2 pessoas + ferramentas.",
    },
    {
      id: "receitas",
      label: "Quais são as suas fontes de receita?",
      help: "Liste de onde vem o dinheiro e, se possível, o peso de cada fonte.",
      type: "long",
    },
    {
      id: "custos",
      label: "Quais são os principais custos e despesas?",
      help: "Separe o que é fixo do que é variável — e o que mais pesa hoje.",
      type: "long",
    },
    {
      id: "margem",
      label: "Como funciona a sua margem e a sua precificação?",
      help: "Quanto sobra depois dos custos, e como você chega ao preço que cobra.",
      type: "long",
    },
    {
      id: "runway",
      label: "Quanto caixa você tem e por quanto tempo ele dura?",
      help: "O saldo disponível e por quantos meses ele cobre suas despesas no ritmo atual.",
      type: "long",
    },
    {
      id: "riscos-financeiros",
      label: "Quais são os maiores riscos financeiros?",
      help: "Concentração em poucos clientes, sazonalidade, inadimplência, custos que podem disparar.",
      type: "long",
    },
    {
      id: "indicadores",
      label: "Quais indicadores você acompanha de perto?",
      help: "Os números que você olha para saber se o caixa está saudável.",
      type: "long",
    },
    {
      id: "proximo-passo",
      label: "Qual é o próximo passo ou número a bater?",
      help: "Uma meta financeira concreta e um prazo para as próximas semanas.",
      type: "short",
    },
  ],
};
