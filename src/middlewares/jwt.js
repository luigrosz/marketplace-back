import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const signAccessToken = (req, res) => {
  try {
    if (req) {
      const accessToken = jwt.sign({ ...req }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
      const refreshToken = jwt.sign({ ...req }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '90d' });
      res.cookie('accessToken', `${accessToken}`, { maxAge: 5 * 60 * 1000, httpOnly: true }); // 5 minutes
      res.cookie('refreshToken', `${refreshToken}`, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true }); // 90 days
    }
  } catch (e) {
    console.error("Error signing tokens:", e);
    throw e;
  }
}

const signRefreshToken = (req) => {
  try {
    const getToken = req.cookies.refreshToken;
    if (getToken) {
      const { id, username } = jwt.verify(getToken, process.env.REFRESH_TOKEN_SECRET)
      const accessToken = jwt.sign({ id, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' })
      return { accessToken }
    }
  } catch (e) {
    throw e;
  }
}

export { signAccessToken, signRefreshToken };
