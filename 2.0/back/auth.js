var express = require('express');
var router = express.Router();

router.get('/', async function(req, res) {
  const state = generateRandom(32);
  const nonce = generateRandom(32);
  const authorizationUrl = req.app.locals.client.authorizationUrl({
    redirect_uri: 'http://127.0.0.1:3001/auth/comeback',
    scope: 'openid',
    state,
    nonce
  });
  res.setHeader('nonce', nonce)
  res.setHeader('state', state)
  res.header('Access-Control-Expose-Headers', ['nonce', 'state'])
  res.send(authorizationUrl); 
});

router.get('/token', async function(req, res) {
  const state = req.query.state;
  const nonce = req.query.nonce;
  req.app.locals.client.callback('http://127.0.0.1:3001/auth/comeback', req.query, { nonce, state })
    .then(function (tokenSet) {
      res.send(tokenSet);
    })
})

router.get('/testAuth', async function(req, res) {
  console.log('accessToken:   ' + req.query.accessToken);
  console.log('refreshToken:    ' + req.query.refreshToken);
  req.app.locals.client.introspect(req.query.accessToken)
    .then((status) => {
      if(status.active === true) {
        res.status(200);
        res.send('OK');
      }
      else {
        req.app.locals.client.introspect(req.query.refreshToken)
          .then((status) => {
            if(status.active === true) {
              req.app.locals.client.refresh(req.query.refreshToken)
                .then((tokenSet) => {
                  res.status(401);
                  res.send(tokenSet); 
                })
            } else {
              res.status(403);
              res.send('not ok')
            }
          })
      }
    })
})

function generateRandom(length) {
  let random = ''
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    random += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return random;
}

module.exports = router;
