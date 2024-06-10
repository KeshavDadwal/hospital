const express = require("express");
const cors = require('cors');
const { createSequelizeInstance } = require('./connection');
const router = require('./routes/routes');
const fileUpload = require('express-fileupload'); // Import express-fileupload
require('dotenv').config(); // Ensure environment variables are loaded

const app = express();
const PORT = 8000;

const sequelize = createSequelizeInstance();
sequelize.authenticate()
  .then(() => {
    console.log('Connected to the database');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Token'],
  credentials: true
}));

// Increase payload size limits
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Use express-fileupload with increased file size limit
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}));

app.use("/", router);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

// const express = require("express");
// const cors = require('cors');
// const { createSequelizeInstance } = require('./connection');
// const router = require('./routes/routes');
// const app = express();
// const PORT = 8000;

// const sequelize = createSequelizeInstance();
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connected to the database');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'X-Access-Token'],
//   credentials: true
// }));

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// app.use("/", router);

// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).send('Internal Server Error');
// });

// app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

