import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

interface Vote {
  user_id: number;
  product_id: number;
  vote_type: number; // 1 for upvote, -1 for downvote
  created_at: number;
}
