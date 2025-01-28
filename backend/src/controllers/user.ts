import { Request, Response } from 'express';

// Temporary storage until database is set up
const users: any[] = [];

export const createUser = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    users.push({ id: users.length + 1, ...userData });
    return res.status(201).json({ message: 'User created successfully', user: userData });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const index = users.findIndex(user => user.id === parseInt(id));
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    users.splice(index, 1);
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error getting user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};