const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const bookSchema = require("./Book");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Must use a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    // Saves saved books in array for book schema
    savedBooks: [bookSchema],
  },
  // Allows virtuals
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hashes user password for better security
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Checks if user's passowrd matches
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Get book count in user's saved books
userSchema.virtual("bookCount").get(function () {
  return this.savedBooks.length;
});

const User = model("User", userSchema);

module.exports = User;
