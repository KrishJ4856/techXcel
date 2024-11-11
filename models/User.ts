const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,       // Name of the user (e.g., from OAuth profile)
  email: {
    type: String,
    unique: true,    // Email should be unique for each user
    required: true   // Required field
  },
  image: String,      // URL of the user's profile image (e.g., from OAuth profile)
  password: String,   // Optional, will be used for email/password sign-ups
  selectedTopics: [
    {
      category: String,  // e.g., "JavaScript"
      lastResource: {
        topic: String,   // e.g., "Introduction to JavaScript"
        subtopic: String, // e.g., "What is JavaScript"
        resource: String, // e.g., "https://developer.mozilla.org/..."
      }
    }
  ],
  lastCategory: String, // The last category the user was learning
});

// Check if model already exists to prevent overwriting
module.exports = mongoose.models.User || mongoose.model('User', userSchema);