import { Router, Request, Response } from 'express';
import pool from '../db/pool';

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
	res.json('hello from users!');
});

router.post('/create', async (req: Request, res: Response): Promise<any> => {
	const { username, password, first_name, last_name, phone } = req.body;
	try {
		let date = new Date(Date.now());
		date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
		await pool.query(
			`INSERT INTO USERS (username, password, first_name, last_name, phone, created_at, modified_at) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
			[username, password, first_name, last_name, phone, date, date]
		);
		res.json('Usuario criado com sucesso');
	} catch (e) {
		console.log('erro:' + e);
		res.status(500).json({ message: 'usuario nao criado' });
	}
});

router.delete('/delete/:id', async (req: Request, res: Response): Promise<any> => {
	const userId = parseInt(req.params.id);
	try {
		const result = await pool.query('DELETE FROM USERS WHERE id = $1 RETURNING *', [userId]);
		if (result.rowCount === 0) {
			return res.status(404).json({ message: 'User not found' });
		} else {
			return res.status(200).json({ message: 'usuario deletado' });
		}
	} catch (e) {
		console.log(e);
		return res.status(500).json({ message: 'usuario nao deletado' });
	}
});

export default router;
