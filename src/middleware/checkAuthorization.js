import jwt from 'jsonwebtoken';

const checkAuthorization = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).send('you are not logged in');

  const token = authorization.split(' ');
  if (token[0] !== 'Bearer' || token.length !== 2) return res.status(401).send('token invalid');

  try {
    res.locals.requestor = await jwt.verify(token[1], 'ServerInternalPrivateKey', { expiresIn: '30m' });
  } catch (error) {
    return res.status(500).send(error);
  }

  next();
};

export default checkAuthorization;
