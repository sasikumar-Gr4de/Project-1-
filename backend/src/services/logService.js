import { supabase } from "../config/supabase.config.js";

// Create audit log service
export const createAuditLog = async (
  actorId,
  entity,
  entityId,
  action,
  diff
) => {
  try {
    await supabase.from("audit_logs").insert([
      {
        actor_id: actorId,
        entity,
        entity_id: entityId,
        action,
        diff_json: diff,
        created_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("Create audit log error:", error);
  }
};

// Remove audit log service
export const removeAuditLog = async (auditLogId) => {
  try {
    await supabase.from("audit_logs").delete().eq("id", auditLogId);
  } catch (error) {
    console.error("Remove audit log error:", error);
  }
};

// Get audit log service
export const getAuditLog = async (auditLogId) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("id", auditLogId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Get audit log error:", error);
    throw new Error("Failed to get audit log");
  }
};

// Get all audit logs service
export const getAllAuditLogs = async (filters = {}) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .eq("id", auditLogId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Get all audit logs error:", error);
    throw new Error("Failed to get all audit logs");
  }
};
