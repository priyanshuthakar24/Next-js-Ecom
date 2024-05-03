"use server"

import startDb from '@/app/lib/db';
import ProductModel, { NewProduct } from '@/app/models/productModel';
import { NewProductInfo } from '@/app/types';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});
export const getCloudConfig = async () => {
    return {
        name: process.env.CLOUD_NAME!,
        key: process.env.CLOUD_API_KEY!,
    };
}
export const getCloudSignature = async () => {
    const secret = cloudinary.config().api_secret!
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = cloudinary.utils.api_sign_request({
        timestamp
    }, secret)
    return { timestamp, signature }
}

export const createProduct = async (info: NewProduct) => {
    try {
        await startDb();
        await ProductModel.create({ ...info });
    } catch (error) {
        console.log((error as any).message);
        throw new Error('Somthing went wrong, can not create product!');
    }
};

export const removeImageFromCloud = async (publicId: string) => {
    await cloudinary.uploader.destroy(publicId);
}