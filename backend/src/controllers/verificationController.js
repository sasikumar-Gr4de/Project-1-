import * as verificationService from "../services/verificationService.js";
import { RESPONSES } from "../utils/messages.js";
import { VERIFICATION_STATUS, PAGINATION } from "../utils/constants.js";

// Get all verifications with filtering and pagination (admin only)
export const getPendingVerifications = async (req, res) => {
  try {
    const {
      document_type = "all",
      status = "all",
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
    } = req.query;

    const verifications = await verificationService.getPendingVerifications({
      document_type,
      status,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.json(
      RESPONSES.SUCCESS("Verifications fetched successfully", verifications)
    );
  } catch (error) {
    console.error("Get verifications error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch verifications"));
  }
};

// Review verification (admin only)
export const reviewVerification = async (req, res) => {
  try {
    const { verification_id } = req.params;
    const { action, note } = req.body;
    const adminId = req.user.id;

    if (
      ![VERIFICATION_STATUS.APPROVED, VERIFICATION_STATUS.REJECTED].includes(
        action
      )
    ) {
      return res
        .status(400)
        .json(RESPONSES.BAD_REQUEST("Action must be 'approved' or 'rejected'"));
    }

    const verification = await verificationService.reviewVerification(
      verification_id,
      adminId,
      action,
      note
    );

    res.json(
      RESPONSES.SUCCESS(`Verification ${action} successfully`, verification)
    );
  } catch (error) {
    console.error("Review verification error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to review verification"));
  }
};

// Get verification stats (admin only)
export const getVerificationStats = async (req, res) => {
  try {
    const stats = await verificationService.getVerificationStats();

    res.json(
      RESPONSES.SUCCESS("Verification stats fetched successfully", stats)
    );
  } catch (error) {
    console.error("Get verification stats error:", error);
    res
      .status(500)
      .json(RESPONSES.SERVER_ERROR("Failed to fetch verification stats"));
  }
};
