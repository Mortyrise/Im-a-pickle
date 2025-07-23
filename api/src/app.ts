import express from 'express';
import cors from 'cors';
import authRoutes from './application/routes/authRoutes';
import characterRoutes from './application/routes/characterRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rick and Morty API',
      version: '1.0.0',
      description: 'API para Rick and Morty con autenticación',
    },
    servers: [
      {
        url: 'http://localhost:' + PORT,
      },
    ],
  },
  apis: ['./src/application/routes/*.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/auth', authRoutes);
app.use('/api/characters', characterRoutes);



app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🎉 Look Morty im a pickle!! and more boring stuff -> Server is running on port ${PORT}`);
  console.log(`📍 Access the API at: http://localhost:${PORT}`);
});

export default app;
