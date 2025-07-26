import { Router, Request, Response } from 'express';
import pool from '../db/pool';

import authenticateToken from '../middlewares/authMiddleware';

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

// const ids_categorias = {
//   Eletronicos: 1,
//   Moveis: 2,
//   Roupas: 3,
// }

router.get('/', async (req: Request, res: Response): Promise<any> => {
  const { category, name } = req.query;
  try {
    let query = `SELECT * FROM products`;
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (category || name) {
      query += ` WHERE`;
    }

    if (category) {
      query += ` category_id = $${paramIndex}`;
      queryParams.push(category);
      paramIndex++;
    }

    if (name) {
      if (category) {
        query += ` AND`;
      }
      query += ` name ILIKE $${paramIndex}`;
      queryParams.push(`%${name}%`);
      paramIndex++;
    }

    query += ` FETCH FIRST 30 ROW ONLY;`;

    const result = await pool.query(query, queryParams);
    return res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'error fetching products' });
  }
});

router.post('/create', authenticateToken, async (req: Request, res: Response): Promise<any> => {
  const { name, category_id, price, image_url } = req.body;
  const user_id = (req as any).user.id;
  try {
    let date = new Date(Date.now());
    date.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    await pool.query(
      `INSERT INTO products (name, category_id, user_id, price, image_url, votes, created_at, modified_at)
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
