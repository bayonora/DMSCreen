import { useState, useEffect, useCallback } from "react";
import { Player, NPC, Character, Combatant, MapData, Shop, ShopItem, Note, CustomItem, LootTable } from "../types";
import { v4 as uuidv4 } from "uuid";

// We use a custom hook instead of Zustand to keep it simple and directly tied to localStorage events if needed.
// But a global singleton is better for React so all components share state.
// We'll create a simple pub-sub store.

type UIState = {
  combatActive: boolean;
  currentTurn: number;
  round: number;
  editingNoteId: string | "new" | null;
  draftNote: Partial<Note> | null;
  // Let's also keep track of selected tabs in nested views if needed, 
  // but just preserving the note editor and combat state is the most requested.
};

type StoreState = {
  players: Player[];
  npcs: NPC[];
  combatants: Combatant[];
  graveyard: Combatant[];
  maps: MapData[];
  shops: Shop[];
  notes: Note[];
  customItems: CustomItem[];
  lootTables: LootTable[];
  uiState: UIState;
};

const DEFAULT_STATE: StoreState = {
  players: [],
  npcs: [],
  combatants: [],
  graveyard: [],
  maps: [],
  shops: [],
  notes: [],
  customItems: [],
  lootTables: [],
  uiState: {
    combatActive: false,
    currentTurn: 0,
    round: 1,
    editingNoteId: null,
    draftNote: null,
  }
};

const STORE_KEY = "dnd_dm_screen_data";

class Store {
  state: StoreState;
  listeners: Set<() => void> = new Set();

  constructor() {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.state = { ...DEFAULT_STATE, ...parsed };
        if (!this.state.uiState) {
          this.state.uiState = DEFAULT_STATE.uiState;
        }
      } catch {
        this.state = DEFAULT_STATE;
      }
    } else {
      this.state = DEFAULT_STATE;
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getState() {
    return this.state;
  }

  setState(newState: Partial<StoreState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((l) => l());
    this.save();
  }

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save to localStorage. It might be full.", e);
      alert("Error al guardar: La memoria del navegador está llena. Reduce el tamaño de las imágenes.");
    }
  }

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "dm_screen_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  importData(jsonString: string) {
    try {
      const parsed = JSON.parse(jsonString);
      // Basic validation could be added here
      this.setState(parsed);
    } catch (e) {
      alert("Error al importar: Archivo no válido.");
    }
  }
}

export const store = new Store();

export function useStore() {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    return store.subscribe(() => setState(store.getState()));
  }, []);

  return state;
}

export const actions = {
  updateUI: (updates: Partial<UIState>) => {
    store.setState({ uiState: { ...store.getState().uiState, ...updates } });
  },
  // Party & NPCs
  addPlayer: (p: Omit<Player, "id" | "type">) => {
    store.setState({ players: [...store.getState().players, { ...p, id: uuidv4(), type: "player" }] });
  },
  updatePlayer: (id: string, p: Omit<Player, "id" | "type">) => {
    store.setState({
      players: store.getState().players.map((x) => (x.id === id ? { ...x, ...p } : x)),
    });
  },
  deletePlayer: (id: string) => {
    store.setState({ players: store.getState().players.filter((x) => x.id !== id) });
  },
  addNPC: (n: Omit<NPC, "id" | "type">) => {
    store.setState({ npcs: [...store.getState().npcs, { ...n, id: uuidv4(), type: "npc" }] });
  },
  updateNPC: (id: string, n: Omit<NPC, "id" | "type">) => {
    store.setState({
      npcs: store.getState().npcs.map((x) => (x.id === id ? { ...x, ...n } : x)),
    });
  },
  deleteNPC: (id: string) => {
    store.setState({ npcs: store.getState().npcs.filter((x) => x.id !== id) });
  },
  getCharacter: (id: string): Character | undefined => {
    const state = store.getState();
    return state.players.find((p) => p.id === id) || state.npcs.find((n) => n.id === id);
  },

  // Initiative
  addCombatant: (characterId: string, initiative: number) => {
    const state = store.getState();
    if (state.combatants.some(c => c.characterId === characterId)) {
      alert("Este personaje ya está en la iniciativa.");
      return;
    }
    const char = actions.getCharacter(characterId);
    if (!char) return;
    store.setState({
      combatants: [
        ...state.combatants,
        { id: uuidv4(), characterId, initiative, hpCurrent: char.hpMax, statuses: [] },
      ].sort((a, b) => b.initiative - a.initiative),
    });
  },
  updateCombatant: (id: string, updates: Partial<Combatant>) => {
    store.setState({
      combatants: store.getState().combatants.map((c) => (c.id === id ? { ...c, ...updates } : c)).sort((a, b) => b.initiative - a.initiative),
    });
  },
  killCombatant: (id: string) => {
    const state = store.getState();
    const c = state.combatants.find((x) => x.id === id);
    if (!c) return;
    store.setState({
      combatants: state.combatants.filter((x) => x.id !== id),
      graveyard: [...state.graveyard, c],
    });
  },
  reviveCombatant: (id: string) => {
    const state = store.getState();
    const c = state.graveyard.find((x) => x.id === id);
    if (!c) return;
    store.setState({
      graveyard: state.graveyard.filter((x) => x.id !== id),
      combatants: [...state.combatants, c].sort((a, b) => b.initiative - a.initiative),
    });
  },
  deleteFromGraveyard: (id: string) => {
    store.setState({
      graveyard: store.getState().graveyard.filter((x) => x.id !== id),
    });
  },

  // Maps
  addMap: (map: Omit<MapData, "id">) => {
    store.setState({ maps: [...store.getState().maps, { ...map, id: uuidv4() }] });
  },
  deleteMap: (id: string) => {
    store.setState({ maps: store.getState().maps.filter((m) => m.id !== id) });
  },

  // Shops
  addShop: (shop: Omit<Shop, "id" | "items">) => {
    store.setState({ shops: [...store.getState().shops, { ...shop, id: uuidv4(), items: [] }] });
  },
  updateShop: (id: string, shop: Omit<Shop, "id" | "items">) => {
    store.setState({
      shops: store.getState().shops.map((s) => (s.id === id ? { ...s, ...shop } : s)),
    });
  },
  deleteShop: (id: string) => {
    store.setState({ shops: store.getState().shops.filter((s) => s.id !== id) });
  },
  addShopItem: (shopId: string, item: Omit<ShopItem, "id">) => {
    const state = store.getState();
    store.setState({
      shops: state.shops.map((s) =>
        s.id === shopId ? { ...s, items: [...s.items, { ...item, id: uuidv4() }] } : s
      ),
    });
  },
  updateShopItem: (shopId: string, itemId: string, item: Partial<ShopItem>) => {
    const state = store.getState();
    store.setState({
      shops: state.shops.map((s) =>
        s.id === shopId
          ? { ...s, items: s.items.map((i) => (i.id === itemId ? { ...i, ...item } : i)) }
          : s
      ),
    });
  },
  deleteShopItem: (shopId: string, itemId: string) => {
    const state = store.getState();
    store.setState({
      shops: state.shops.map((s) =>
        s.id === shopId
          ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
          : s
      ),
    });
  },

  // Notes
  addNote: (note: Omit<Note, "id">) => {
    store.setState({ notes: [...(store.getState().notes || []), { ...note, id: uuidv4() }] });
  },
  updateNote: (id: string, note: Partial<Note>) => {
    store.setState({
      notes: (store.getState().notes || []).map((n) => (n.id === id ? { ...n, ...note } : n)),
    });
  },
  deleteNote: (id: string) => {
    store.setState({ notes: (store.getState().notes || []).filter((n) => n.id !== id) });
  },
  
  // Custom Items
  addCustomItem: (item: Omit<CustomItem, "id">) => {
    store.setState({ customItems: [...(store.getState().customItems || []), { ...item, id: uuidv4() }] });
  },
  updateCustomItem: (id: string, item: Partial<CustomItem>) => {
    store.setState({
      customItems: (store.getState().customItems || []).map((i) => (i.id === id ? { ...i, ...item } : i)),
    });
  },
  deleteCustomItem: (id: string) => {
    store.setState({ customItems: (store.getState().customItems || []).filter((i) => i.id !== id) });
  },

  // Loot Tables
  addLootTable: (table: Omit<LootTable, "id">) => {
    store.setState({ lootTables: [...(store.getState().lootTables || []), { ...table, id: uuidv4() }] });
  },
  updateLootTable: (id: string, table: Partial<LootTable>) => {
    store.setState({
      lootTables: (store.getState().lootTables || []).map((t) => (t.id === id ? { ...t, ...table } : t)),
    });
  },
  deleteLootTable: (id: string) => {
    store.setState({ lootTables: (store.getState().lootTables || []).filter((t) => t.id !== id) });
  },
};
