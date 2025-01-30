import { Router, Request, Response } from 'express';
import pool from '../db/pool';

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

router.get('/', async (req: Request, res: Response): Promise<any> => {
	try {
		const result = await pool.query(`SELECT * FROM products FETCH FIRST 30 ROW ONLY;`);
		return res.status(200).json(result.rows);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'error fetching products' });
	}
});

router.post('/', async (req: Request, res: Response): Promise<any> => {
	const { name, category_id, user_id, price, image_url } = req.body;

	try {
		let date = new Date(Date.now());
		date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
		await pool.query(
			`INSERT INTO Product (name, category_id, user_id, price, image_url, votes, created_at, modified_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
			[name, category_id, user_id, price, image_url, 0, date, date]
		);

		res.status(201).json({ message: 'product created' });
	} catch (e) {
		console.error('error creating product:', e);
		res.status(500).json({ error: 'failed to create product' });
	}
});

export default router;
