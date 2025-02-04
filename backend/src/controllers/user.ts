import { Request, Response } from "express";

// Temporary storage until database is set up
type User = {
  id: number;
  name: string;
  email: string;
};

const users: User[] = [];

export const createUser = (req: Request, res: Response) => {
  try {
    const { name, email } = req.body as { name: string; email: string };
    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }
    const newUser: User = {
      id: users.length + 1,
      name,
      email,
    };
    users.push(newUser);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Valid user ID is required" });
      return;
    }
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    users.splice(index, 1);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllUsers = (_req: Request, res: Response) => {
  try {
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUser = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Valid user ID is required" });
      return;
    }
    const user = users.find((u) => u.id === id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
