import express from 'express';
import config from './config.js';
import trainerRouter from './routes/trainerRouter.js';
import pokemonRouter from './routes/pokemonRouter.js';
import authenticationRouter from './routes/authenticationRouter.js';
import exchangeRouter from './routes/exchangeRouter.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' assert { type: "json" };

const app = express();
const port = config.NODE_APP_PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'ok' });
});

app.use(authenticationRouter);

app.use('/trainer', trainerRouter);

app.use('/pokemon', pokemonRouter);

app.use('/exchange', exchangeRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,{explorer : true}));

app.get('*', (req, res) => {
  res.status(404).send('404 - Not found');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
