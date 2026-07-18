require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/user');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB. Creating admin user...');
    
    const adminUser = new User({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@skylightcinema.com',
      password: 'SuperSecretAdmin123!',
      role: 'superadmin',
      phone: '1234567890'
    });

    try {
      await adminUser.save();
      console.log('Admin user successfully created!');
    } catch (e) {
      if (e.code === 11000) {
        console.log('Admin user already exists.');
      } else {
        console.error('Error creating user:', e);
      }
    }
    
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
