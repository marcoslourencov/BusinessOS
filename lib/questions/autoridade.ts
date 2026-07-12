import type { SectionQuestions } from "./types";

/**
 * Seção Autoridade — "Conteúdo, editorias e presença pública."
 * Do objetivo de autoridade aos temas, canais, formatos e cadência que
 * constroem reputação e presença ao longo do tempo.
 */
export const autoridadeQuestions: SectionQuestions = {
  intro:
    "Vamos estruturar sua presença pública — o que você quer ser reconhecido por dizer e como você aparece.",
  coreQuestionId: "essencia",
  questions: [
    {
      id: "essencia",
      label: "Em uma frase, por que você quer ser reconhecido?",
      help: "O território de autoridade que você quer ocupar. Escreva com suas palavras.",
      type: "long",
      placeholder:
        "Ex.: A referência prática em finanças para pequenos negócios que estão começando.",
    },
    {
      id: "objetivo",
      label: "O que essa autoridade precisa gerar para o negócio?",
      help: "Conecte reputação a resultado: confiança, vendas, parcerias, recrutamento, demanda inbound.",
      type: "long",
    },
    {
      id: "editorias",
      label: "Quais são as editorias — os grandes temas sobre os quais você fala?",
      help: "Liste de 3 a 5 territórios de conteúdo que se repetem e te posicionam.",
      type: "long",
      placeholder: "Ex.: Bastidores do negócio, erros comuns de gestão, cases de clientes.",
    },
    {
      id: "canais",
      label: "Em quais canais e plataformas você vai construir essa presença?",
      help: "Onde seu público já está e onde você consegue ser consistente. Diga o canal principal e os de apoio.",
      type: "long",
    },
    {
      id: "formatos",
      label: "Quais formatos de conteúdo combinam com você?",
      help: "Texto, vídeo, carrossel, áudio, newsletter, lives — o que você consegue produzir e sustentar.",
      type: "long",
    },
    {
      id: "cadencia",
      label: "Com que frequência você vai publicar?",
      help: "Uma cadência realista que você consegue manter por meses, não só uma semana.",
      type: "short",
      placeholder: "Ex.: 3 posts por semana + 1 newsletter quinzenal.",
    },
    {
      id: "metrica",
      label: "Qual é a métrica que mostra que a autoridade está crescendo?",
      help: "Escolha um indicador que importa de verdade e que você consegue acompanhar.",
      type: "short",
    },
    {
      id: "proximo-passo",
      label: "Qual é o próximo passo concreto para começar ou destravar?",
      help: "Uma ação clara para as próximas semanas.",
      type: "short",
    },
  ],
};
