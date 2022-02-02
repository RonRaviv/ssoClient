var express = require('express');
var router = express.Router();
const { Issuer } = require('openid-client')

/* GET home page. */
router.get('/', async function(req, res) {
  const recivedIssuer = await Issuer.discover('http://127.0.0.1:8080/auth/realms/dev/.well-known/openid-configuration');
  const client = new recivedIssuer.Client({
    client_id: 'testapp', 
    client_secret: 'fvUfVcaOB9m9eciBR5aEIksI84bTppqa',
  });

  const state = req.query.state;
  const nonce = req.query.nonce;
  const authorizationUrl = client.authorizationUrl({
    redirect_uri: 'http://127.0.0.1:3001/auth/comeback',
    scope: 'openid',
    state,
    nonce
  });
  res.send(authorizationUrl);
});

router.get('/token', async function(req, res) {
  const recivedIssuer = await Issuer.discover('http://127.0.0.1:8080/auth/realms/dev/.well-known/openid-configuration');
  const client = new recivedIssuer.Client({
    client_id: 'testapp',
    client_secret: 'fvUfVcaOB9m9eciBR5aEIksI84bTppqa',
    redirect_uris: ['http://127.0.0.1:3001/auth/comeback'],
    response_types: ['code'],
  });

  const state = req.query.state;
  const nonce = req.query.nonce;
  client.callback('http://127.0.0.1:3001/auth/comeback', req.query, { nonce, state })
    .then(function (tokenSet) {
      client.introspect(tokenSet.access_token)
        .then((x) => {
          res.send(tokenSet);
        })
    })
})

router.get('/testAuth', async function(req, res) {
  const recivedIssuer = await Issuer.discover('http://127.0.0.1:8080/auth/realms/dev/.well-known/openid-configuration');
  const client = new recivedIssuer.Client({
    client_id: 'testapp', 
    client_secret: 'fvUfVcaOB9m9eciBR5aEIksI84bTppqa',
  });


  console.log('accessToken:   ' + req.query.accessToken);
  console.log('refreshToken:    ' + req.query.refreshToken);
  client.introspect(req.query.accessToken)
    .then((status) => {
      if(status.active === true) {
        res.status(200);
        res.send('OK');
      }
      else {
        client.revoke(req.query.accessToken);
        client.introspect(req.query.refreshToken)
          .then((status) => {
            if(status.active === true) {
              client.refresh(req.query.refreshToken)
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

module.exports = router;
