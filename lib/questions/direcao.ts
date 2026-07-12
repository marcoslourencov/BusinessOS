import type { SectionQuestions } from "./types";

/**
 * Seção Direção — "Mercado, problema, cliente e oferta."
 * Perguntas para deixar claro onde você joga, para quem, e por que a sua
 * oferta faz sentido melhor do que as alternativas.
 */
export const direcaoQuestions: SectionQuestions = {
  intro:
    "Vamos deixar claro o mercado, o problema, o cliente e a oferta deste bloco — uma pergunta de cada vez.",
  coreQuestionId: "essencia",
  questions: [
    {
      id: "essencia",
      label: "Em uma frase, qual é a direção deste bloco?",
      help: "Resuma com suas palavras o que você está construindo e para quem.",
      type: "long",
      placeholder:
        "Ex.: Uma consultoria de finanças para donos de pequenas clínicas.",
    },
    {
      id: "mercado",
      label: "Em que mercado ou contexto você está jogando?",
      help: "Descreva o setor, o momento e o tamanho aproximado da oportunidade.",
      type: "long",
    },
    {
      id: "problema",
      label: "Qual é o problema central que você resolve?",
      help: "A dor específica que faz o cliente procurar uma solução — quanto mais concreta, melhor.",
      type: "long",
    },
    {
      id: "cliente-ideal",
      label: "Quem é o cliente ideal para isso?",
      help: "Traçe o perfil de quem sente essa dor com mais força: quem é, o que faz, como você o reconhece.",
      type: "long",
    },
    {
      id: "oferta",
      label: "Qual é a sua oferta ou solução?",
      help: "O que você entrega, em que formato, e como o cliente percebe o valor.",
      type: "long",
    },
    {
      id: "diferenciacao",
      label: "Por que você, e não as alternativas?",
      help: "O que o cliente faz hoje sem você — e por que a sua solução é a melhor escolha.",
      type: "long",
    },
    {
      id: "evidencias",
      label: "Quais evidências ou premissas sustentam essa direção?",
      help: "O que você já sabe de fato e o que ainda é uma aposta que precisa ser confirmada.",
      type: "long",
    },
    {
      id: "proximo-passo",
      label: "Qual é o próximo passo concreto para avançar nessa direção?",
      help: "Uma ação clara para as próximas semanas.",
      type: "short",
    },
  ],
};
