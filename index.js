const express = require("express");
const cors = require('cors');
const { createSequelizeInstance } = require('./connection');
const router = require('./routes/routes');
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));

