import express from 'express';
import books from './routes/bookroutesexample';
import users from './routes/users';

// async () => await connectToDB();

const app = express();
const PORT = 3001;
app.use(express.json());

// app.get('/books', books);
app.use('/books', books);
app.use('/user', users);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
