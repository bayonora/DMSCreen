export type CharacterTag = {
  id: string;
  name: string;
  description: string;
};

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
  tags?: CharacterTag[];
};

export type NPC = {
  isTemp?: boolean;
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
  tags?: CharacterTag[];
};

export type Creature = {
  isTemp?: boolean;
  id: string;
  type: "creature";
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
  tags?: CharacterTag[];
};

export type Character = Player | NPC | Creature;

export type StatusEffect = {
  id: string;
  name: string;
  description: string;
  duration: number; // 0 for infinite
};

export type Combatant = {
  id: string;
  characterId: string; // Ref to Player or NPC
  initiative: number;
  hpCurrent: number;
  statuses: StatusEffect[];
  isTemp?: boolean;
  tempData?: NPC | Creature;
};

export type LocationData = {
  id: string;
  name: string;
  region?: string;
  description: string;
  image?: string;
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

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
};

export type CustomItem = {
  id: string;
  name: string;
  description?: string;
  value?: string;
  image?: string;
};

export type LootTable = {
  id: string;
  name: string;
  items: string[];
};

export type QuestStatus = "active" | "completed" | "failed";

export type Quest = {
  id: string;
  title: string;
  description: string;
  location?: string;
  reward?: string;
  image?: string; // base64
  parentId: string | null;
  status: QuestStatus;
  createdAt: number;
  details?: QuestDetail[];
};

export type QuestDetail = {
  id: string;
  name: string;
  description: string;
  createdAt: number;
};
