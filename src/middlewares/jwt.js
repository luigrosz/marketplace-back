import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const signAccessToken = (req, res) => {
  try {
    if (req) {
      const accessToken = jwt.sign({ ...req }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
      const refreshToken = jwt.sign({ ...req }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '90d' });
      res.cookie('refreshToken', `${refreshToken}`, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
    }
  } catch (e) {
    return res.status(500).json(e);
  }
}

const signRefreshToken = (req) => {
  try {
    const getToken = req.cookies.refreshToken;
    if (getToken) {
      const { id, username } = jwt.verify(getToken, process.env.REFRESH_TOKEN_SECRET)
      const accesssToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
      return { accesssToken }
    }
  } catch (e) {
    return res.status(401).json(e);
  }
}

export { signAccessToken, signRefreshToken };
