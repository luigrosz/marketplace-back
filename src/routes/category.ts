import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

interface Category {
	name: string;
}

router.get('/', async (req: Request, res: Response): Promise<any> => {
	try {
		const result = await pool.query(`SELECT * FROM category FETCH FIRST 10 ROW ONLY;`);
		return res.status(200).json(result.rows);
	} catch (e) {
		console.error(e);
		return res.status(500).json({ message: 'error fetching categories' });
	}
});
