import { body, param, query } from "express-validator";

import { validateRequest } from "./validateRequestHelper";

export const createDiscussion = [
  body("title").isString().notEmpty().trim().withMessage("Title is required"),
  body("content").isString().notEmpty().trim().withMessage("Content is required"),
  validateRequest,
];

export const editDiscussion = [
  param("id").toInt().isInt().withMessage("Valid discussion ID is required"),
  body("title").optional().isString().trim().withMessage("Title must be a string"),
  body("content").optional().isString().trim().withMessage("Content must be a string"),
  validateRequest,
];

export const deleteDiscussion = [
  param("id").toInt().isInt().withMessage("Valid discussion ID is required"),
  validateRequest,
];

export const deleteMultipleDiscussions = [
  body("ids")
    .isArray({ min: 1 })
    .withMessage("IDs must be an array with at least one element")
    .custom(
      (ids: unknown) =>
        Array.isArray(ids) && ids.every((id) => typeof id === "number" && Number.isInteger(id)),
    )
    .withMessage("All IDs must be integers"),
  validateRequest,
];

export const getMultipleDiscussions = [
  query("page").optional().toInt().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .toInt()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer"),
  validateRequest,
];

export const getDiscussion = [
  param("id").toInt().isInt().withMessage("Valid discussion ID is required"),
  validateRequest,
];
