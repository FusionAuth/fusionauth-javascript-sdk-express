import express from 'express';
import { fusionAuthClient } from '../fusionAuthClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  console.log('In /me...');
  const access_token = req.cookies['app.at'];

  if (!access_token) {
    console.log('Access token missing');
    res.sendStatus(401);
    return;
  }

  try {
    // submit request to get user information
    const user = await fusionAuthClient('/oauth2/userinfo', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
