import type { SectionQuestions } from "./types";

/**
 * Seção Validação — "Testar a oferta e aprender com clientes."
 * Perguntas para transformar uma aposta em um experimento com critério claro,
 * registrar o resultado e decidir o que fazer a seguir.
 */
export const validacaoQuestions: SectionQuestions = {
  intro:
    "Vamos registrar a hipótese, o teste que você fez e o que aprendeu com os clientes.",
  coreQuestionId: "hipotese",
  questions: [
    {
      id: "hipotese",
      label: "Qual é a hipótese que você quer testar?",
      help: "Escreva a aposta central em uma frase — algo que possa se mostrar verdadeiro ou falso.",
      type: "long",
      placeholder:
        "Ex.: Donos de clínica pagariam R$500/mês por um fechamento financeiro pronto.",
    },
    {
      id: "experimento",
      label: "Como você vai testar isso na prática?",
      help: "Descreva o experimento: o que fazer, com quem falar, em quanto tempo.",
      type: "long",
    },
    {
      id: "criterio-sucesso",
      label: "Qual é o critério ou métrica que diz se deu certo?",
      help: "Defina o número ou sinal claro que separa sucesso de fracasso antes de começar.",
      type: "long",
    },
    {
      id: "resultado",
      label: "O que realmente aconteceu?",
      help: "Registre os fatos e números observados, sem filtrar pelo que você esperava.",
      type: "long",
    },
    {
      id: "aprendizado",
      label: "Qual foi o principal aprendizado?",
      help: "O que ficou mais claro sobre o cliente, o problema ou a oferta.",
      type: "long",
    },
    {
      id: "decisao",
      label: "Diante disso, você vai persistir, ajustar ou pivotar?",
      help: "Escolha a direção que o resultado sustenta — e seja honesto com o que os dados dizem.",
      type: "select",
      options: [
        { value: "persistir", label: "Persistir — o teste confirmou a hipótese" },
        { value: "ajustar", label: "Ajustar — a ideia vale, mas precisa de mudanças" },
        { value: "pivotar", label: "Pivotar — mudar de rumo com base no que aprendi" },
      ],
    },
    {
      id: "justificativa-decisao",
      label: "Por que essa decisão?",
      help: "Conecte o que você observou à escolha que fez — isso ajuda a lembrar o raciocínio depois.",
      type: "long",
    },
    {
      id: "proximo-passo",
      label: "Qual é o próximo teste ou passo concreto?",
      help: "Uma ação clara para as próximas semanas.",
      type: "short",
    },
  ],
};
