const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
        },
        travelStyle: {
            type: String,
            required: [true, 'Please select a travel style'],
            enum: ['Luxury', 'Budget', 'Adventure', 'Family', 'Solo', 'Adventure & Outdoors'],
        },
        profileBio: {
            type: String,
        },
        monthlyBudget: {
            type: Number,
            default: 0,
        },
        topDestinations: [
            {
                type: String,
            },
        ],
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        profilePicture: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['active', 'deactivated'],
            default: 'active',
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
