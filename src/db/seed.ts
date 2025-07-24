import pool from './pool';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    await pool.query('DELETE FROM Votes;');
    await pool.query('DELETE FROM Products;');
    await pool.query('DELETE FROM Users;');
    await pool.query('DELETE FROM Category;');
    console.log('Cleared existing data.');

    await pool.query(`
      INSERT INTO Category (name) VALUES
      ('Eletronicos'),
      ('Moveis'),
      ('Roupas');
    `);
    console.log('Seeded Categories.');

    const hashedPassword1 = await bcrypt.hash('password123', 10);
    const hashedPassword2 = await bcrypt.hash('securepass', 10);
    const date = new Date(Date.now());

    await pool.query(`
      INSERT INTO Users (username, password, first_name, last_name, phone, role, created_at, modified_at) VALUES
      ('john_doe', $1, 'John', 'Doe', '123-456-7890', 0, $3, $3),
      ('admin_user', $2, 'Admin', 'User', '098-765-4321', 1, $3, $3);
    `, [hashedPassword1, hashedPassword2, date]);
    console.log('Seeded Users.');

    const usersResult = await pool.query('SELECT id, username FROM Users ORDER BY id ASC;');
    const johnDoeId = usersResult.rows.find(u => u.username === 'john_doe')?.id;
    const adminUserId = usersResult.rows.find(u => u.username === 'admin_user')?.id;

    const categoriesResult = await pool.query('SELECT id, name FROM Category ORDER BY id ASC;');
    const eletronicosId = categoriesResult.rows.find(c => c.name === 'Eletronicos')?.id;
    const moveisId = categoriesResult.rows.find(c => c.name === 'Moveis')?.id;
    const roupasId = categoriesResult.rows.find(c => c.name === 'Roupas')?.id;

    if (johnDoeId && eletronicosId && roupasId) {
      await pool.query(`
        INSERT INTO Products (name, category_id, user_id, price, image_url, votes, created_at, modified_at) VALUES
        ('Laptop', $1, $2, 1200.00, 'https://lgrz-marketplace-images.s3.sa-east-1.amazonaws.com/fizz.jpeg', 15, $3, $3),
        ('Vintage T-Shirt', $4, $2, 18.99, 'https://lgrz-marketplace-images.s3.sa-east-1.amazonaws.com/fizz.jpeg', 3, $3, $3),
        ('Smartphone X', $1, $2, 800.00, 'https://lgrz-marketplace-images.s3.sa-east-1.amazonaws.com/fizz.jpeg', 20, $3, $3);
      `, [eletronicosId, johnDoeId, date, roupasId]);
      console.log('Seeded Products.');
    } else {
      console.warn('Could not find necessary IDs for seeding products. Skipping product seed.');
    }

    if (johnDoeId && adminUserId) {
      const productsResult = await pool.query('SELECT id, name FROM Products ORDER BY id ASC;');
      const laptopId = productsResult.rows.find(p => p.name === 'Laptop')?.id;

      if (laptopId) {
        await pool.query(`
                INSERT INTO Votes (user_id, product_id, vote_type, created_at) VALUES
                ($1, $2, 1, $3),
                ($4, $2, 1, $3);
            `, [johnDoeId, laptopId, date, adminUserId]);
        console.log('Seeded Votes.');
      }
    }


    console.log('Database seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
