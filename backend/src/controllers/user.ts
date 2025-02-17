import { RequestHandler } from "express";
import mongoose from "mongoose";
import User from '../models/user'

export const getPersonalInformation: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Get personal information route works!");
  } catch (error) {
    next(error);
  }
};

export const editPersonalInformation: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Edit personal information route works!");
  } catch (error) {
    next(error);
  }
};

export const getProfessionalInformation: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Get professional information route works!");
  } catch (error) {
    next(error);
  }
};

export const editProfessionalInformation: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Edit professional information route works!");
  } catch (error) {
    next(error);
  }
};

export const getDirectoryPersonalInformation: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Get directory personal information route works!");
  } catch (error) {
    next(error);
  }
};

export const editDirectoryPersonalInformation: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Edit directory personal information route works!");
  } catch (error) {
    next(error);
  }
};

export const getDirectoryDisplayInfo: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const editDirectoryDisplayInfo: RequestHandler = async (req, res, next) => {
  try {
    res.status(200).send("Edit directory display information route works!");
  } catch (error) {
    next(error);
  }
};
