require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.render('index', { users });
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

app.post('/add-user', async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.redirect('/');
  }
  
  const newUser = new User({ name: username });
  await newUser.save();
  res.redirect('/');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
