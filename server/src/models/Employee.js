const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true
        },

        employeeCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
      },
  
      firstName: {
        type: String,
        required: true,
        trim: true
      },
  
      lastName: {
        type: String,
        required: true,
        trim: true
      },
  
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
      },
  
      phone: {
        type: String,
        required: true,
        trim: true
      },
      
    //   department: {
    //     type: String,
    //     required: true
    //   },
  
    //   designation: {
    //     type: String,
    //     required: true
    //   },
  
      status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        default: "ACTIVE"
      },
    createdAt : {
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type: Date,
        default: Date.now
    }
    },
  );
  
  module.exports = mongoose.model("Employee", employeeSchema);