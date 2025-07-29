import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({
	connectionString: 'postgresql://postgres:ynk_gzc@mvr4dyf6WFR@db.xxlcrzzazbsnrglmnghg.supabase.co:5432/postgres',
        ssl: { rejectUnauthorized: false }
});

// link test image: https://lgrz-marketplace-images.s3.sa-east-1.amazonaws.com/fizz.jpeg
export default pool;
