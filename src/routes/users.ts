import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

const router = Router();

interface User {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: number;
  modified_at: number;
}

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await pool.query(`SELECT * FROM users FETCH FIRST 30 ROW ONLY;`);
    res.status(200).json(result.rows);
  } catch (e) {
    console.error('error fetching users');
    res.status(500).json({ message: 'error fetching users' });
  }
});

router.post('/getUserByUsername', async (req: Request, res: Response): Promise<any> => {
  const { username } = req.body;
  try {
    const result = await pool.query('SELECT * FROM USERS WHERE username = $1', [username]);
    if (result.rowCount === 0) {
      return res.status(200).json({ message: 'usuario nao encontrado' });
    } else {
      return res.status(200).json(result.rows);
    }
  } catch (e) {
    console.error('error getting user by name');
    res.status(500).json({ message: 'error fetching user by name' });
  }
});

router.post('/create', async (req: Request, res: Response): Promise<any> => {
  const { username, password, phone } = req.body;
  try {
    if (!username || !password || !phone) {
      return res.status(400).json({ message: 'missing required fields' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let date = new Date(Date.now());
    date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    await pool.query(
      `INSERT INTO USERS (username, password, phone, created_at, modified_at) VALUES ($1, $2, $3, $4, $5);`,
      [username, hashedPassword, phone, date, date]
    );
    return res.status(201).json('user created');
  } catch (e) {
    return res.status(500).json({ message: 'user not created' });
  }
});

router.delete('/delete/:id', async (req: Request, res: Response): Promise<any> => {
  const userId = parseInt(req.params.id);
  try {
    const result = await pool.query('DELETE FROM USERS WHERE id = $1 RETURNING *', [userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'user not found' });
    } else {
      return res.status(200).json({ message: 'user deleted' });
    }
  } catch (e) {
    return res.status(500).json({ message: 'user not deleted' });
  }
});

export default router;
