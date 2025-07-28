import express from 'express';
import cors from 'cors';
import users from './routes/users';
import products from './routes/products';
// import category from './routes/category';
import auth from './routes/auth';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'http://luigrosz.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/users', users);
app.use('/products', products);
// app.use('/category', category);
app.use('/auth', auth);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
