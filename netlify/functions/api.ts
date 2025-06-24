import express from 'express'
import serverless from 'serverless-http'
import jsonwebtoken from 'jsonwebtoken'
import bodyParser from 'body-parser'
const app = express()
const router = express.Router()

// app.use(express.raw({type: "application/json"}))
// app.use(bodyParser.json());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const getToken = (req: any) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }

  return null;
}

router.get('/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

router.post('/profile', (req, res) => {
  console.log(req.body)
  res.json(req.body)
})

const pk = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA8N904kXD+cO6ZgDGYKvQ
74DJCc2SIsD1e53xKrehpNq95jjSFe/M8wNMdhNRLZz2cLS0J9b99t13O0xCau3I
jBD85g467rWCFNGBxuGhK12sSNz0HmsOJ5gbckMF8XFdBz3Jj6+zrm8sUtxenSf2
EtNUytVlhKMd2/q8UJmB6kR7zWbAP0F9i5VvnW1/rM1oUgfOGZzwBaxc9Us9Qmo+
L6QoZ5Z6LCBdIRzZ2v2RLwvHrNUdA6gvJKWhdzMlo7891L8RycWU+NHHX2Tm0a4F
Bpm3hpAkiGyoJ6XAO0X/aWknjHGcn8k36Ds7esfc29y4K9C7BsojLT/iTTTX7k1X
JHpwljjFPTq1lAL3bPnWdTh/ilMvRXN/T8Gx6TXr5O2Ko3hkew29BwdmzJOZ7pUv
vW+ItfSLqXaCm2wh/jx2L/g+5GF/GfsP5xriaqE+YricdiafW3npZReOno71dBOq
7a1Wp5YXBauuUawZ7QW+Ceu1MzCMxgnA4Kakmz258u7RzKEt+FNxy99rGz36Fjs2
dVbNZr4P9cjmT1Y4Df6Cec7LxxdxhkDtQQxbHpbo4EEs4i5z/wDNEf5V9WVkSBM0
odMvtbnSvw6XzaEWHckUxIOXywiN107QWUXSc2B7gcNOgeUtS7WCEzuCRsIFydp8
glObGum28z+BNkWYB8YO+icCAwEAAQ==
-----END PUBLIC KEY-----
`  
router.post('/prompt', (req, res) => {
  const token = getToken(req)
  console.log(token)
  jsonwebtoken.verify(token, pk,  { algorithms: ['RS256'] }, (err, decoded) => {
    if (err) {
      res.status(400).json({ error: err });
      } else {
      const data = { decoded, params: req.body, token: token, data: '你是一个测试开发工程师', prompt: '你是一个测试开发工程师', type: 'partial' }
      console.log(data)
      res.status(200).json(data);
    }
  });
})

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app, {
  request(request: any, event: any) {
    request.body = event.rawBody;
  },
});



  