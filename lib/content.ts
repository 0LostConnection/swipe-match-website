/**
 * All Portuguese copy + the editable data (places, interest tags) live here so
 * everything is easy to tweak in one spot.
 */

export const HER_NAME = "Luana";

export const intro = {
  emojis: {
    welcome: "👋",
    rejected: "🤔",
    returningFlash: "😏",
  },
  first: {
    text: "Esta é uma experiência interativa, então não tenha pressa!",
    button: "Começar?",
  },
  returning: {
    text: "Então você está aqui de novo! Vai fazer de novo ou só mostrar para alguém?",
    button: "Começar?",
  },
  rejected: {
    text: "Então você está aqui de novo! Mudou de ideia?",
    button: "Começar?",
  },
} as const;

export const ask = {
  greeting: `Oi ${HER_NAME}! 👋`,
  greetingAnimated: `Oi ${HER_NAME} `,
  highlight: "algo diferente...",
  lines: [
    "Construí este site só para te chamar para sair, porque sei que você merece algo diferente...",
    "Eu amei o seu sorriso e a sua timidez",
    "Como uma pessoa tímida também...",
  ],
  question: "O que você acha de sairmos?",
  yes: "Sim",
  yesButton: "Sim 💘",
  no: "Não",
  imageAlts: {
    happy: "Pug feliz com chapéu e pirulito",
    sad: "Pug triste",
  },
} as const;

export const secondChance = {
  // The ask text repeats here, but the buttons change.
  serio: "Sério?",
  changedMind: "Mudei de ideia",
} as const;

export const finalRejection = {
  title: "Ok então... 😔",
  subtitle: "De qualquer forma, foi um prazer te conhecer",
  button: "Sair",
  exitHint: "pode fechar a aba 🥲",
  imageAlt: "Pug olhando para o lado",
} as const;

export const place = {
  heading: "O que você acha desses lugares?",
  suggestButton: "Sugerir outro lugar",
  suggestPlaceholder: "Manda sua ideia de lugar...",
  suggestConfirm: "Enviar",
  customLabel: "Sua sugestão:",
  editButton: "✎ Editar",
  continue: "Continuar →",
} as const;

export type Place = {
  id: string;
  name: string;
  time: string;
  address: string;
  emoji: string;
};

export const PLACES: Place[] = [
  {
    id: "cafe",
    name: "Café da esquina",
    time: "Tarde, 15h",
    address: "Rua de exemplo, 123",
    emoji: "☕",
  },
  {
    id: "sorvete",
    name: "Sorveteria artesanal",
    time: "Fim de tarde, 17h",
    address: "Av. dos doces, 45",
    emoji: "🍦",
  },
  {
    id: "parque",
    name: "Parque + piquenique",
    time: "Manhã, 10h",
    address: "Parque central",
    emoji: "🧺",
  },
  {
    id: "cinema",
    name: "Cinema",
    time: "Noite, 20h",
    address: "Shopping de exemplo",
    emoji: "🎬",
  },
];

export const availability = {
  heading: "Só para eu ter uma ideia... Quando você está livre?",
  hint: "Você pode selecionar mais de um dia.",
  next: "Próximo →",
} as const;

export const interestsCopy = {
  heading: "Estou curioso sobre você, do que você gosta?",
  done: "Concluído →",
  searchPlaceholder: "Procurar ou adicionar...",
  addCustom: "Adicionar",
  emptyResult: "Não achou? Adicione do seu jeito:",
  imageAlt: "Emoji curioso",
} as const;

export const INTEREST_CATEGORIES: {
  id: "food" | "topics";
  label: string;
  emoji: string;
  options: string[];
}[] = [
  {
    id: "food",
    label: "Comida",
    emoji: "🍫",
    options: [
      "Chocolate",
      "Sushi",
      "Pizza",
      "Açaí",
      "Hambúrguer",
      "Café",
      "Doces",
      "Massa",
    ],
  },
  {
    id: "topics",
    label: "Tópicos",
    emoji: "💬",
    options: [
      "Geek",
      "Música",
      "Filmes",
      "Viagens",
      "Arte",
      "Games",
      "Livros",
      "Natureza",
    ],
  },
];

export const thankYou = {
  title: "Obrigado!",
  subtitle: "Já já a gente conversa 😄",
  restartAriaLabel: "Fazer de novo",
  imageAlt: "Emoji comemorando",
} as const;

export const catInterstitial = {
  thinking: "Deixa eu pensar...",
  ready: "Pensei bem!",
  continue: "Ok, pode continuar 😄",
  imageAlt: "Gatinho pensativo",
} as const;

export const celebration = {
  title: "Aeee! 🎉",
  subtitle: "Você fez meu dia.",
  imageAlt: "Cachorrinho comemorando com uma borboleta no nariz",
} as const;

export const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
