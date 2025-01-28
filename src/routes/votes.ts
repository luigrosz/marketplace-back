import { Router, Request, Response } from 'express';

const router = Router();

interface Vote {
	user_id: number;
	product_id: number;
	vote_type: number;
	created_at: number;
}
