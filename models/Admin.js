import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Role",
        required: true,
    },
}, {timestamps: true});

AdminSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
    next();
});

const Admin = mongoose.model('admin', AdminSchema);

export default Admin;