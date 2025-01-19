import { RequestHandler } from "express";

class UserController {
  static getPersonalInformation: RequestHandler = async (req, res) => {
    res.status(200).send("Get personal information route works!");
  }

  static editPersonalInformation: RequestHandler = async (req, res) => {
    res.status(200).send("Edit personal information route works!");
  }

  static getProfessionalInformation: RequestHandler = async (req, res) => {
    res.status(200).send("Get professional information route works!");
  }

  static editProfessionalInformation: RequestHandler = async (req, res) => {
    res.status(200).send("Edit professional information route works!");
  }

  static getDirectoryPersonalInformation: RequestHandler = async (req, res) => {
    res.status(200).send("Get directory personal information route works!");
  }

  static editDirectoryPersonalInformation: RequestHandler = async (req, res) => {
    res.status(200).send("Edit directory personal information route works!");
  }

  static getDirectoryDisplayInfo: RequestHandler = async (req, res) => {
    res.status(200).send("Get directory display information route works!");
  }

  static editDirectoryDisplayInfo: RequestHandler = async (req, res) => {
    res.status(200).send("Edit directory display information route works!");
  }
}

export default UserController;
