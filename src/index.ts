import express from 'express';
import bookRoutes from './routes/bookroutesexample';
import pool from './db/pool';

// async function testConnectToDB() {
// 	try {
// 		await pool.connect();
// 		console.log('connected to DB!');
// 	} catch (err) {
// 		console.error(err);
// 	}
// }

// async () => await connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// app.use('/', testConnectToDB);
app.use('/api', bookRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
