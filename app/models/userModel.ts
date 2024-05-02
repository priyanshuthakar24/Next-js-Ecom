import { Document, Model, Schema, model, models } from "mongoose"
import { compare, genSalt, hash } from 'bcrypt';

interface UserDocument extends Document {
    email: string;
    name: string;
    password: string;
    role: "admin" | "user";
    avatar?: { url: string; id: string };
    varified: boolean;
}

interface Method {
    comparePassword(password: string): Promise<boolean>
}

// main Schema defination 
const userSchema = new Schema<UserDocument, {}, Method>({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    avatar: { type: Object, url: String, id: String },
    varified: { type: Boolean, default: false },
}, { timestamps: true });


// utility method for hashing the password 
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) return next();

        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        throw error;
    }
});

// method for comparing the hash password 
userSchema.methods.comparePassword = async function (password) {
    try {
        return await compare(password, this.password)
    } catch (error) {
        throw error;
    }
}


const UserModel = models.User || model('User', userSchema)

export default UserModel as Model<UserDocument, {}, Method>