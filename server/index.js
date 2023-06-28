const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const PORT = process.env.PORT || 3500;

const { logger } = require('./middlewares/logEvents');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// global middleware that writes every request to log file
app.use(logger);

// global middleware that sets Access-Control-Allow-Credentials header
app.use(require('./middlewares/credentials'));

app.use(cors(require('./config/corsOptions')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// default options
app.use(fileUpload({ createParentPath: true }));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/register', require('./routes/register.routes'));
app.use('/auth', require('./routes/auth.routes'));
app.use('/refresh', require('./routes/refresh.routes'));
app.use('/logout', require('./routes/logout.routes'));

app.use('/api/posts', require('./routes/post.routes'));

app.use('/api/users', require('./routes/user.routes'));

// catch-all route handler for any requests to an unknown route
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.log(err));
