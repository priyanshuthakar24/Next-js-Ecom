import { error } from "console";
import mongoose from "mongoose";
let connection: typeof mongoose;

const url = "mongodb+srv://priyanshuthakar24:%40pinku24@cluster0.c77xwlg.mongodb.net/next-ecom";

const startDb = async () => {
    try {
        if (!connection) {
            connection = await mongoose.connect(url);
        }
        return connection;
    } catch (errors) {
        throw new Error((error as any).message);
    }
};

export default startDb;