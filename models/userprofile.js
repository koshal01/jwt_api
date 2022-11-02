const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
    nick_name: {
        type: String,
        required: [true, "Please provide nick name"],
        maxlength: [40, "Name should be under 40 characters"],
    },
    photos: [
        {
        id: {
            type: String,
            required: true,
        },
        secure_url: {
            type: String,
            required: true,
        },
        }
    ],
    summary: {
        type: String,
        required: [true, "Please provide your summary"]
    },
    interest: {
        type: String,
        required: [true, "Please provide your interest"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
