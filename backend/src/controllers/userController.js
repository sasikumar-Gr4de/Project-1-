import {
  updateUserProfile,
  getUserDashboard,
  getUserReports,
  getReportDetails,
} from "../services/userService.js";
import { RESPONSES, USER_MESSAGES } from "../utils/messages.js";

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
    res.status(500).json(RESPONSES.SERVER_ERROR(USER_MESSAGES.INTERNAL_ERROR));
  }
};

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
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch dashboard data"));
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
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch report"));
  }
};
