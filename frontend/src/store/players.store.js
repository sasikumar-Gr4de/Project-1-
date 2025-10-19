import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import { zustandEncryptedStorage } from "@/utils/storage";
import { PlayersApiService } from "@/services/players.api";

export const usePlayersStore = create(
  devtools(
    persist(
      (set, get) => ({
        getAllPlayers: async () => {
          const res = await PlayersApiService.getPlayers();
          return res.data;
        },
        addNewPlayer: async (playerData) => {
          const res = await PlayersApiService.createPlayer(playerData);
          return res.data;
        },
        updatePlayer: async (id, playerData) => {
          const res = await PlayersApiService.updatePlayer(id, playerData);
          return res.data;
        },
        deletePlayer: async (id) => {
          const res = await PlayersApiService.deletePlayer(id);
          return res.data;
        },
      }),
      {
        name: "players-storage",
        storage: zustandEncryptedStorage,
        partialize: (state) => ({}),
      }
    ),
    {
      name: "players-store",
      store: "playersStore",
    }
  )
);
