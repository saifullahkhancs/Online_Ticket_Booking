const mongoose = require('mongoose');

/**
 * Registered user of the booking site.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fullName: { type: String, trim: true },
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

userSchema.pre('save', function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`.trim();
  next();
});

module.exports = mongoose.model('User', userSchema);
