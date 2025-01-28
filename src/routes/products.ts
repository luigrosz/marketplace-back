import { Router, Request, Response } from 'express';

const router = Router();

interface Product {
	name: string;
	category_id: number;
	user_id: number;
	price: string;
	image_url: string;
	votes: number;
	created_at: number;
	modified_at: number;
}
