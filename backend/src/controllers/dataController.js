import {
  createPlayerData,
  changePlayerDataStatus,
  getAllPlayerDataByPlayerId,
} from "../services/dataService.js";
import { RESPONSES } from "../utils/messages.js";

// Create new player data => trigger analysis workflow
export const createData = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const playerData = req.body;
    const data = await createPlayerData(userId, playerData);
    res.json(RESPONSES.SUCCESS("Player data created successfully", data));
  } catch (error) {
    console.log("Create player data error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to create player data"));
  }
};

// Change player data status
export const changeDataStatus = async (req, res) => {
  try {
    const { dataId } = req.params;
    const { status } = req.body;

    const data = await changePlayerDataStatus(dataId, status);

    if (error) {
      throw new Error("Failed to update player data status");
    }

    res.json(
      RESPONSES.SUCCESS("Player data status updated successfully", data)
    );
  } catch (error) {
    console.log("Change player data status error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to change player data status"));
  }
};

export const getDataByPlayerId = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { pagination } = req.query;
    const data = await getAllPlayerDataByPlayerId(userId, pagination);
    res.json(RESPONSES.SUCCESS("Player data fetched successfully", data));
  } catch (error) {
    console.log("Get player data by player ID error:", error);
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch player data"));
  }
};
