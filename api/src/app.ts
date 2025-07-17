import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🎉 Look Morty im a pickle!! and more boring stuff -> Server is running on port ${PORT}`);
  console.log(`📍 Access the API at: http://localhost:${PORT}`);
});

export default app;
