import {
  updateUserProfile,
  getUserDashboard,
  getUserReports,
  getReportDetails,
} from "../services/userService.js";
import { RESPONSES, USER_MESSAGES } from "../utils/messages.js";

/**
 * Get user dashboard data
 */
export const getDashboard = async (req, res) => {
  try {
    const dashboardData = await getUserDashboard(req.user.id);
    res.json(
      RESPONSES.SUCCESS("Dashboard data fetched successfully", dashboardData)
    );
  } catch (error) {
    console.error("Get dashboard error:", error);

    if (error.message?.includes("Player profile not found")) {
      return res
        .status(404)
        .json(
          RESPONSES.ERROR(
            "Player profile not found. Please complete your player profile."
          )
        );
    }

    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch dashboard data"));
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedProfile = await updateUserProfile(req.user.id, updates);

    res.json(RESPONSES.SUCCESS(USER_MESSAGES.PROFILE_UPDATED, updatedProfile));
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.message?.includes("Player profile not found")) {
      return res.status(404).json(RESPONSES.ERROR("Player profile not found"));
    }

    res.status(500).json(RESPONSES.SERVER_ERROR(USER_MESSAGES.INTERNAL_ERROR));
  }
};

/**
 * Get user reports
 */
export const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reportsData = await getUserReports(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );

    res.json(RESPONSES.SUCCESS("Reports fetched successfully", reportsData));
  } catch (error) {
    console.error("Get reports error:", error);

    if (error.message?.includes("Player profile not found")) {
      return res.status(404).json(RESPONSES.ERROR("Player profile not found"));
    }

    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch reports"));
  }
};

/**
 * Get single report
 */
export const getReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await getReportDetails(reportId, req.user.id);

    res.json(RESPONSES.SUCCESS("Report fetched successfully", report));
  } catch (error) {
    console.error("Get report error:", error);

    if (error.code === "PGRST116") {
      // Record not found
      return res.status(404).json(RESPONSES.ERROR("Report not found"));
    }

    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch report"));
  }
};
