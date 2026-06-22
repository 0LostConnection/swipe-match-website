import type { ArchetypeScores, Card, CardCategory } from "./types";

// Score tuple order: [caotica, conforto, flaneur, nomade, bardo, coop, literaria]
type ScoreTuple = [number, number, number, number, number, number, number];

function scores(t: ScoreTuple): ArchetypeScores {
  return {
    caotica: t[0],
    conforto: t[1],
    flaneur: t[2],
    nomade: t[3],
    bardo: t[4],
    coop: t[5],
    literaria: t[6],
  };
}

function card(
  id: string,
  label: string,
  category: CardCategory,
  emoji: string,
  t: ScoreTuple,
  flavorText: string,
): Card {
  return { id, label, category, emoji, scores: scores(t), flavorText };
}

export const CARDS: Card[] = [
  // --- Comida (food) -------------------------------------------------------
  card("acai", "Açaí", "food", "🍇", [3, 1, 0, 2, 0, 0, 0],
    "Açaí no fim da tarde é praticamente uma religião pra mim."),
  card("pizza", "Pizza", "food", "🍕", [2, 2, 0, 0, 0, 3, 0],
    "Pizza às 23h dividindo uma caixa é o meu amor de verdade."),
  card("sushi", "Sushi", "food", "🍣", [1, 0, 2, 0, 1, 1, 1],
    "Já sei onde a gente vai na primeira vez. Já reservei mentalmente."),
  card("vinho", "Vinho", "food", "🍷", [0, 2, 2, 0, 3, 0, 1],
    "Tenho uma garrafa esperando uma conversa boa pra ser aberta."),
  card("cafe", "Café especial", "food", "☕", [0, 1, 1, 2, 2, 0, 3],
    "Tenho um lugar aqui que você ia amar. Já fui duas vezes essa semana."),
  card("hamburguer", "Hambúrguer artesanal", "food", "🍔", [2, 1, 2, 0, 0, 2, 0],
    "Tenho um ranking pessoal dos melhores da cidade. É sério."),
  card("cha", "Chá", "food", "🍵", [0, 2, 1, 1, 1, 0, 3],
    "Tenho uma gaveta inteira só de chá. Cada um pra um tipo de dia."),
  card("churrasco", "Churrasco", "food", "🥩", [3, 2, 0, 1, 0, 1, 0],
    "Eu assumo a churrasqueira e não largo. É o meu palco."),
  card("gastronomia", "Restaurante novo", "food", "🍽️", [1, 0, 3, 0, 2, 0, 0],
    "Tenho uma lista de lugares novos pra testar maior que minha agenda."),
  card("doces", "Doces artesanais", "food", "🧁", [0, 3, 1, 0, 1, 1, 2],
    "Sobremesa não é opcional. É o motivo principal da saída."),

  // --- Música (music) ------------------------------------------------------
  card("mpb", "MPB", "music", "🎶", [0, 1, 1, 0, 3, 0, 1],
    "MPB no fim de tarde resolve qualquer dia ruim."),
  card("funk", "Funk / Pagode", "music", "🔊", [3, 1, 0, 0, 0, 0, 0],
    "Bastou tocar e eu já tô de pé. Não tem como ficar parado."),
  card("rock", "Rock / Indie", "music", "🎸", [1, 0, 1, 3, 1, 2, 1],
    "Tenho show guardado na memória que mudou meu ano."),
  card("jazz", "Jazz", "music", "🎷", [0, 1, 3, 0, 2, 0, 1],
    "Jazz num bar pequeno e mal iluminado é meu cenário favorito."),
  card("lofi", "Lo-fi / Chill", "music", "🎧", [0, 2, 0, 1, 1, 1, 3],
    "Você também trabalha/estuda com isso? Finalmente alguém."),
  card("eletronica", "Eletrônica", "music", "🎛️", [2, 0, 2, 1, 0, 2, 0],
    "Tem um set que eu escuto quando preciso de energia. Te mando."),
  card("pop", "Pop", "music", "🎤", [2, 2, 1, 0, 0, 1, 0],
    "Não tenho vergonha nenhuma das minhas playlists pop. Zero."),
  card("classica", "Clássica / Erudita", "music", "🎻", [0, 1, 2, 1, 3, 0, 2],
    "Tem peças que eu coloco só pra sentir que o dia tem trilha sonora."),
  card("sertanejo", "Sertanejo", "music", "🤠", [2, 3, 0, 1, 0, 0, 0],
    "Sertanejo no carro com a janela aberta é felicidade pura."),
  card("folk", "Folk / Acústico", "music", "🪕", [0, 1, 1, 3, 2, 0, 2],
    "Folk acústico combina demais com café e silêncio."),

  // --- Tópico / Interesse (topic) -----------------------------------------
  card("games", "Games", "topic", "🎮", [0, 1, 0, 0, 0, 3, 0],
    "Co-op ou competitivo? Resposta errada e a gente tem um problema."),
  card("livros", "Livros", "topic", "📚", [0, 1, 0, 1, 2, 0, 3],
    "Que gênero você lê? Isso diz tudo sobre uma pessoa."),
  card("viagens", "Viagens", "topic", "✈️", [2, 0, 3, 2, 1, 0, 0],
    "Mapa aberto, sem roteiro. É o único jeito certo de viajar."),
  card("arte", "Arte", "topic", "🎨", [0, 0, 2, 1, 3, 0, 2],
    "Tem uma exposição aqui que fecha semana que vem. Perguntando por perguntando."),
  card("tech", "Tecnologia / Gadgets", "topic", "💻", [0, 0, 1, 0, 0, 3, 1],
    "Eu vou querer te mostrar uns gadgets. Avisado está você."),
  card("culinaria", "Culinária", "topic", "🍳", [1, 3, 2, 0, 1, 0, 0],
    "Cozinhar junto vale mais que qualquer restaurante chique."),
  card("cinema", "Cinema", "topic", "🎬", [0, 2, 1, 0, 2, 1, 3],
    "A gente tem muito a debater. Provavelmente tudo ao mesmo tempo."),
  card("natureza", "Natureza", "topic", "🌲", [1, 0, 0, 3, 0, 0, 1],
    "Preciso de verde pra recarregar. Conheço os melhores cantos."),
  card("moda", "Moda / Estética", "topic", "👗", [2, 1, 3, 0, 1, 0, 0],
    "Eu reparo nos detalhes. Um bom look me ganha na hora."),
  card("filosofia", "Filosofia", "topic", "🧠", [0, 0, 1, 1, 2, 1, 3],
    "Conversa que vira papo existencial às 2h é a minha favorita."),

  // --- Aesthetic / Cenário (aesthetic) ------------------------------------
  card("sofa_sexta", "Sofá + série na sexta", "aesthetic", "🛋️", [0, 3, 0, 0, 1, 2, 2],
    "Minha sexta favorita é essa. Série boa, sem compromisso de horário."),
  card("balada_sexta", "Balada na sexta", "aesthetic", "🪩", [3, 0, 1, 0, 0, 1, 0],
    "Quando bate a vontade de dançar, não tem como segurar."),
  card("trilha_manha", "Trilha de manhã cedo", "aesthetic", "🥾", [0, 0, 1, 3, 1, 0, 1],
    "Conheço uma trilha boa daqui a 40 minutos. Sério."),
  card("cafe_livro", "Café com livro e chuva", "aesthetic", "📖", [0, 2, 1, 1, 2, 0, 3],
    "Dia de chuva com café e livro é meu plano perfeito de descanso."),
  card("setup_gamer", "Setup gamer no escuro", "aesthetic", "🖥️", [0, 0, 0, 0, 0, 3, 1],
    "Meu setup é meu refúgio. Te mostro a iluminação depois."),
  card("galeria_arte", "Galeria de arte vazia", "aesthetic", "🖼️", [0, 0, 2, 1, 3, 0, 2],
    "Galeria vazia num dia de semana é um luxo que pouca gente entende."),
  card("churrasco_amigos", "Churrasco com a galera", "aesthetic", "🔥", [3, 2, 1, 1, 0, 1, 0],
    "Junto a galera, ligo o som e o dia inteiro some. Melhor coisa."),
  card("viagem_sozinha", "Viagem solo sem roteiro", "aesthetic", "🎒", [1, 0, 2, 3, 1, 0, 1],
    "Já fiz uma viagem só com a mochila e zero plano. Recomendo demais."),
];

export const CARD_BY_ID: Map<string, Card> = new Map(
  CARDS.map((c) => [c.id, c]),
);

export function getCard(id: string): Card | undefined {
  return CARD_BY_ID.get(id);
}
