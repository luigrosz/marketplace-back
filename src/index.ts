import express from 'express';
import users from './routes/users';
import products from './routes/products';

// async () => await connectToDB();

const app = express();
const PORT = 3001;
app.use(express.json());

app.use('/users', users);
app.use('/products', products);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
