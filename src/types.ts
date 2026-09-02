export type StatBlock = {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
};

export type Player = {
  id: string;
  type: "player";
  name: string;
  classAndLevel: string;
  race: string;
  hpMax: number;
  ac: number;
  stats: StatBlock;
  passivePerception: number;
};

export type NPC = {
  id: string;
  type: "npc";
  name: string;
  race: string;
  ac: number;
  hpMax: number;
  stats: StatBlock;
  cr: string;
  skills: string;
  senses: string;
  languages: string;
  specialTraits: string;
  actions: string;
};

export type Character = Player | NPC;

export type StatusEffect = {
  id: string;
  name: string;
  description: string;
};

export type Combatant = {
  id: string;
  characterId: string; // Ref to Player or NPC
  initiative: number;
  hpCurrent: number;
  statuses: StatusEffect[];
};

export type MapData = {
  id: string;
  name: string;
  image: string; // Base64
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string; // Base64
  hidden: boolean;
};

export type Shop = {
  id: string;
  name: string;
  ownerName: string;
  ownerImage: string; // Base64
  items: ShopItem[];
};
