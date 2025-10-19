import api from "@/services/base.api";

export const PlayersApiService = {
  // Fetch all players with optional query parameters
  getPlayers: (params) => api.get("/players", { params }),

  // Fetch a single player by ID
  getPlayerById: (id) => api.get(`/players/${id}`),

  // Create a new player
  createPlayer: (data) => api.post("/players", data),

  // Update an existing player by ID
  updatePlayer: (id, data) => api.put(`/players/${id}`, data),

  // Delete a player by ID
  deletePlayer: (id) => api.delete(`/players/${id}`),
};
