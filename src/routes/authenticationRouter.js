import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Trainer from '../model/Trainer.js';
import Roles from '../model/Roles.js';
import ClientCode from '../model/ClientCode.js';
import Client from '../model/Client.js';

const OAuthRouter = Router();

OAuthRouter.get('/authorize', async (req, res) => {
  const queryParams = req.query;
  const roles = (await Roles.findAll({ attributes: ['role'], raw: true })).map((r) => r.role);
  const client = await Client.findOne({ where: { id: queryParams.id } });

  if (!client) {
    return res.status(401).send({ error: 'Application is not authorized' });
  }

  if (!queryParams.redirect_uri) {
    return res.status(400).send({ error: 'No redirect URI provided' });
  }

  if (!roles.includes(queryParams.roles)) {
    return res.status(400).send('No user roles provided');
  }

  const authorizationCode = uuidv4().toString();
  try {
    await ClientCode.create({
      clientId: client.id,
      authorization_code: authorizationCode,
    });
  } catch (error) {
    return res.status(400).send(error);
  }

  return res.redirect(`${queryParams.redirect_uri}?authorization_code=${authorizationCode}`);
});

OAuthRouter.post('/oauth/token', async (req, res) => {
  const queryParams = req.query;
  const { login, password } = req.body;
  const client = await Client.findOne({
    where: {
      id: queryParams.id,
      secret: queryParams.secret,
    },
  });

  if (!client) {
    return res.status(401).send({ error: 'Application is not authorized' });
  }

  if (!queryParams.code) {
    return res.status(400).send({ error: 'No authorization code provided' });
  }

  try {
    const clientCode = await ClientCode.findOne({
      where: {
        authorization_code: queryParams.code,
        clientId: client.id,
      },
    });

    const user = await Trainer.findOne({
      where: {
        login,
      },
    });

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ error: 'Login or password is wrong' });
    }

    const accessToken = jwt.sign(
      { id: user.id },
      'ServerInternalPrivateKey',
      { expiresIn: '30m' },
      {},
    );

    await clientCode.destroy();

    return res.status(200).send({ accessToken, tokenType: 'Bearer', expiresIn: '30m' });
  } catch (error) {
    return res.status(400).send(error);
  }
});

export default OAuthRouter;
