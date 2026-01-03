// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },

    loginId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["HR", "EMPLOYEE"],
      required: true
    },

    isFirstLogin: {
      type: Boolean,
      default: true
    },

    isActive: {
      type: Boolean,
      default: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
  }
);

module.exports = mongoose.model("User", userSchema);
