const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/registrationDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create mongoose schema
const registrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  studentId: String,
  email: String,
  password: String,
  gender: String
});

// Create mongoose model
const Registration = mongoose.model('Registration', registrationSchema);

// Handle registration post request
app.post('/register', (req, res) => {
    const { firstName, lastName, studentId, email, password, gender } = req.body;
    const newRegistration = new Registration({ firstName, lastName, studentId, email, password, gender });
  
    newRegistration.save()
      .then(registration => {
        res.status(200).json({ message: 'Registration successful' });
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: 'Registration failed' });
      });
  });
  

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
