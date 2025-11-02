// backend/src/controllers/adminController.js
import * as adminService from "../services/adminService.js";
import { RESPONSES } from "../utils/messages.js";

// Get system metrics
export const getSystemMetrics = async (req, res) => {
  try {
    const metrics = await adminService.getSystemMetrics();
    res.json(RESPONSES.SUCCESS("System metrics fetched successfully", metrics));
  } catch (error) {
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch system metrics"));
  }
};

// Queue management
export const getProcessingQueue = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const queue = await adminService.getProcessingQueue({
      status,
      page: parseInt(page),
      limit: parseInt(limit),
    });
    res.json(RESPONSES.SUCCESS("Processing queue fetched successfully", queue));
  } catch (error) {
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch processing queue"));
  }
};

export const retryJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await adminService.retryJob(jobId);
    res.json(RESPONSES.SUCCESS("Job retry initiated successfully", result));
  } catch (error) {
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to retry job"));
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    await adminService.deleteJob(jobId);
    res.json(RESPONSES.SUCCESS("Job deleted successfully"));
  } catch (error) {
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to delete job"));
  }
};

// User management
export const getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      role,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const users = await adminService.getUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
      role,
      sortBy,
      sortOrder,
    });

    res.json(RESPONSES.SUCCESS("Users fetched successfully", users));
  } catch (error) {
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch users"));
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await adminService.updateUserStatus(userId, status);
    res.json(RESPONSES.SUCCESS("User status updated successfully", user));
  } catch (error) {
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to update user status"));
  }
};

// Report management
export const getReports = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      userId,
      dateFrom,
      dateTo,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const reports = await adminService.getReports({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      status,
      userId,
      dateFrom,
      dateTo,
      sortBy,
      sortOrder,
    });

    res.json(RESPONSES.SUCCESS("Reports fetched successfully", reports));
  } catch (error) {
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to fetch reports"));
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    await adminService.deleteReport(reportId);
    res.json(RESPONSES.SUCCESS("Report deleted successfully"));
  } catch (error) {
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to delete report"));
  }
};

export const regenerateReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const result = await adminService.regenerateReport(reportId);
    res.json(
      RESPONSES.SUCCESS("Report regeneration initiated successfully", result)
    );
  } catch (error) {
    res.status(500).json(RESPONSES.SERVER_ERROR("Failed to regenerate report"));
  }
};

// System analytics
export const getSystemAnalytics = async (req, res) => {
  try {
    const { dateRange = "7d" } = req.query;
    const analytics = await adminService.getSystemAnalytics(dateRange);
    res.json(
      RESPONSES.SUCCESS("System analytics fetched successfully", analytics)
    );
  } catch (error) {
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch system analytics"));
  }
};
