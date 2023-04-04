const db = require('../config/connection');
const { User } = require('../models');

const userData = require('./userData.json');

db.once('open', async () => {
  await User.deleteMany({});

  const users = await User.insertMany(userData);

  console.log('Test Users seeded! 💃🕺📚');
  process.exit(0);
});