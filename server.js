const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const allowedOrigins = require('./config/allowedOrigins');
const corsOptions = require('./config/corsOptions');

const PORT = process.env.PORT || 3500;

const user = [
  {
    id: 1,
    email: 'user1@mail.com',
    password: 'P4ssword',
  },
];

/**
 * CORS OPTIONS
 */
/**
 * CREDENTIALS
 */
const credentials = (req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }

  next();
};

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use('/login', async (req, res) => {
  res.send({
    user: user[0],
  });
});

app.use(routes);

app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send(err.message);
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
