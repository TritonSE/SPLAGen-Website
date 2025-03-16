import { RequestHandler } from "express";

export const createAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Create announcement route works!");
  } catch (error) {
    next(error);
  }
};

export const editAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Edit announcement route works!");
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Delete announcement route works!");
  } catch (error) {
    next(error);
  }
};

export const getMultipleAnnouncements: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Get multiple announcements route works!");
  } catch (error) {
    next(error);
  }
};

export const getIndividualAnnouncementDetails: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Get individual announcement details route works!");
  } catch (error) {
    next(error);
  }
};
