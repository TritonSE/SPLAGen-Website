import express from 'express';
import userRoutes from './routes/user';
import discussionRoutes from './routes/discussion';
import replyRoutes from './routes/reply';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/replies', replyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});