import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';
import { signAccessToken, signRefreshToken, verifyIfLoggedIn } from '../middlewares/jwt.js';

const router = Router();

router.get("/me", async (req: Request, res: Response): Promise<any> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ loggedIn: false });

    const result = signRefreshToken(req);
    if (result === undefined) return res.status(401).json({ loggedIn: false });
    res.json({ loggedIn: true });
  } catch (e) {
    res.status(401).json({ loggedIn: false });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(200).json({ message: 'Invalid credentials' });
    }

    const userPayload = { id: user.id, username: user.username, role: user.role };

    signAccessToken(userPayload, res);

    return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });

  } catch (e) {
    console.error('Error during login:', e);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
});

router.post('/refresh-token', async (req: Request, res: Response): Promise<any> => {
  const result = signRefreshToken(req);
  try {
    if (result) {
      res.cookie('accessToken', `${result.accessToken}`, { maxAge: 5 * 60 * 1000 });
      return res.status(200).json({ message: 'Access token refreshed' });
    } else {
      throw Error;
    }
  } catch (e) {
    return res.status(401).json({ message: 'No refresh token found or invalid token.' });
  }
});

export default router;
