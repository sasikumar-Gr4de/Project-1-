import Joi from "joi";

export const CreateUserInputValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    full_name: Joi.string().min(2).max(100).required().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
      "any.required": "Full name is required",
    }),
    client_type: Joi.string()
      .valid("internal", "external")
      .required()
      .messages({
        "any.only": "Client type must be either internal or external",
        "any.required": "Client type is required",
      }),
    role: Joi.string()
      .valid("coach", "player", "parent", "admin", "data-reviewer", "annotator")
      .required()
      .messages({
        "any.only": "Invalid role specified",
        "any.required": "Role is required",
      }),
    phone_number: Joi.string()
      .pattern(/^\+?[\d\s-()]+$/)
      .optional()
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),
    avatar_url: Joi.string().uri().optional().messages({
      "string.uri": "Please provide a valid URL for avatar",
    }),
    reference_id: Joi.when("client_type", {
      is: "external",
      then: Joi.when("role", {
        is: Joi.valid("admin", "data-reviewer", "annotator"),
        then: Joi.optional().allow(null),
        otherwise: Joi.string().uuid().required(),
      }),
      otherwise: Joi.optional().allow(null),
    }).messages({
      "string.guid": "Reference ID must be a valid UUID",
      "any.required":
        "Reference ID is required for external users with coach, player, or parent roles",
    }),
  });

  const { error } = schema.validate(data);
  if (error) {
    return {
      success: false,
      message: error.details[0].message,
    };
  }
  return { success: true };
};

export const UpdateUserInputValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().optional().messages({
      "string.email": "Please provide a valid email address",
    }),
    full_name: Joi.string().min(2).max(100).optional().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
    }),
    client_type: Joi.string()
      .valid("internal", "external")
      .optional()
      .messages({
        "any.only": "Client type must be either internal or external",
      }),
    role: Joi.string()
      .valid("coach", "player", "parent", "admin", "data-reviewer", "annotator")
      .optional()
      .messages({
        "any.only": "Invalid role specified",
      }),
    phone_number: Joi.string()
      .pattern(/^\+?[\d\s-()]+$/)
      .optional()
      .allow(null)
      .messages({
        "string.pattern.base": "Please provide a valid phone number",
      }),
    avatar_url: Joi.string().uri().optional().allow(null).messages({
      "string.uri": "Please provide a valid URL for avatar",
    }),
    reference_id: Joi.string().uuid().optional().allow(null).messages({
      "string.guid": "Reference ID must be a valid UUID",
    }),
    is_active: Joi.boolean().optional(),
  });

  const { error } = schema.validate(data);
  if (error) {
    return {
      success: false,
      message: error.details[0].message,
    };
  }
  return { success: true };
};
