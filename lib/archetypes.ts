import type { Archetype, ArchetypeId } from "./types";

export const ARCHETYPE_IDS: ArchetypeId[] = [
  "caotica",
  "conforto",
  "flaneur",
  "nomade",
  "bardo",
  "coop",
  "literaria",
];

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  caotica: {
    id: "caotica",
    title: "Alma Caótica",
    subtitle:
      "Você é a energia que muda o plano de última hora e faz todo mundo agradecer depois.",
    icon: "🌪️",
    gradient: ["#FF6B35", "#FF3366"],
    badgeLabel: "ARQUÉTIPO RARO",
  },
  conforto: {
    id: "conforto",
    title: "Arquiteta do Conforto",
    subtitle:
      "O seu lugar favorito no mundo é qualquer lugar onde você se sente em casa.",
    icon: "🛋️",
    gradient: ["#7C2D12", "#C2410C"],
    badgeLabel: "ARQUÉTIPO ACOLHEDOR",
  },
  flaneur: {
    id: "flaneur",
    title: "Flâneur Urbano",
    subtitle:
      "Você transforma qualquer cidade em um mapa de descobertas que ninguém mais conhece.",
    icon: "🗺️",
    gradient: ["#92400E", "#D97706"],
    badgeLabel: "ARQUÉTIPO EXPLORADOR",
  },
  nomade: {
    id: "nomade",
    title: "Refúgio Nômade",
    subtitle: "Você precisa de natureza como os outros precisam de wi-fi.",
    icon: "🌿",
    gradient: ["#064E3B", "#10B981"],
    badgeLabel: "ARQUÉTIPO SELVAGEM",
  },
  bardo: {
    id: "bardo",
    title: "Bardo Cult",
    subtitle:
      "Você tem uma playlist para cada estado emocional e não tem medo de compartilhar nenhuma.",
    icon: "🎵",
    gradient: ["#312E81", "#7C3AED"],
    badgeLabel: "ARQUÉTIPO LENDÁRIO",
  },
  coop: {
    id: "coop",
    title: "Estrategista de Co-op",
    subtitle:
      "A sua linguagem do amor é carregar o time e dividir uma pizza às 23h.",
    icon: "🎮",
    gradient: ["#1E3A8A", "#0EA5E9"],
    badgeLabel: "ARQUÉTIPO ÉPICO",
  },
  literaria: {
    id: "literaria",
    title: "Alma Literária",
    subtitle:
      "Você vive em dois mundos ao mesmo tempo e o mais rico fica na sua cabeça.",
    icon: "📚",
    gradient: ["#1E1B4B", "#4C1D95"],
    badgeLabel: "ARQUÉTIPO MÍSTICO",
  },
};

export function getArchetype(id: ArchetypeId): Archetype {
  return ARCHETYPES[id];
}
