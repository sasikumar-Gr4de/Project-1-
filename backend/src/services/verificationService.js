import { supabase } from "../config/supabase.config.js";
import crypto from "crypto";
import { VERIFICATION_STATUS } from "../utils/constants.js";

export const getPendingVerifications = async (filters = {}) => {
  try {
    let query = supabase
      .from("player_verifications")
      .select(
        `
        *,
        users:player_id (
          player_name,
          email,
          avatar_url
        )
        `,
        { count: "exact" }
      )
      .order("created_at", { ascending: false });

    // Apply status filter - if not "all", filter by specific status
    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    // Apply document type filter
    if (filters.document_type && filters.document_type !== "all") {
      query = query.eq("document_type", filters.document_type);
    }

    // Apply pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      items: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error("Get verifications error:", error);
    throw new Error("Failed to fetch verifications");
  }
};

export const getVerificationStats = async () => {
  try {
    const { data, error } = await supabase
      .from("player_verifications")
      .select("status, document_type");

    if (error) throw error;

    const stats = {
      total: data.length,
      pending: data.filter((v) => v.status === VERIFICATION_STATUS.PENDING)
        .length,
      approved: data.filter((v) => v.status === VERIFICATION_STATUS.APPROVED)
        .length,
      rejected: data.filter((v) => v.status === VERIFICATION_STATUS.REJECTED)
        .length,
      byType: {},
    };

    // Count by document type
    data.forEach((verification) => {
      if (!stats.byType[verification.document_type]) {
        stats.byType[verification.document_type] = {
          total: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
        };
      }
      stats.byType[verification.document_type].total++;
      stats.byType[verification.document_type][verification.status]++;
    });

    return stats;
  } catch (error) {
    console.error("Get verification stats error:", error);
    throw new Error("Failed to fetch verification stats");
  }
};

export const reviewVerification = async (
  verificationId,
  adminId,
  action,
  note
) => {
  try {
    const { data, error } = await supabase
      .from("player_verifications")
      .update({
        status: action,
        reviewed_by: adminId,
        review_note: note,
        reviewed_at: new Date().toISOString(),
      })
      .eq("verification_id", verificationId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Review verification error:", error);
    throw new Error("Failed to review verification");
  }
};

export const getVerificationById = async (verificationId) => {
  try {
    const { data, error } = await supabase
      .from("player_verifications")
      .select("*")
      .eq("id", verificationId)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Get verification by ID error:", error);
    throw new Error("Failed to fetch verification");
  }
};

export const calculateFileHash = async (fileBuffer) => {
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};
