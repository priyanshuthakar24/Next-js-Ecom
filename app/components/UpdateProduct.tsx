'use client';
import React from 'react'
import { ProductResponse, ProductToUpdate } from '../types'
import ProductForm, { InitialValue } from './ProductForm'
import { removeAndUpdateProductImage, removeImageFromCloud, updateProduct } from '../(admin)/products/action';
import { extractPublicId, uploadImage } from '../utils/helper';
import { NewProductInfo } from '../types';
import { updateProductInfoSchema } from '@utils/validationSchema';
import { toast } from 'react-toastify';
import { ValidationError } from 'yup';
import { useRouter } from 'next/navigation';
interface Props {
    product: ProductResponse
}
export default function UpdateProduct({ product }: Props) {

    const router = useRouter();
    const initialValue: InitialValue = {
        ...product,
        thumbnail: product.thumbnail.url,
        images: product.images?.map(({ url }) => url),
        mrp: product.price.base,
        salePrice: product.price.discounted,
        bulletPoints: product.bulletPoints || [],
    }
    const handleImageRemove = (source: string) => {
        const publicId = extractPublicId(source);

        removeAndUpdateProductImage(product.id, publicId);
    };
    const handleOnSubmit = async (values: NewProductInfo) => {
        try {
            const { thumbnail, images } = values
            await updateProductInfoSchema.validate(values, { abortEarly: false });
            // const thumbnailRes = await uploadImage(thumbnail!);
            const dataToUpdate: ProductToUpdate = {
                title: values.title,
                description: values.description,
                bulletPoints: values.bulletPoints,
                category: values.category,
                quantity: values.quantity,
                price: {
                    base: values.mrp,
                    discounted: values.salePrice
                }
            };

            if (thumbnail) {
                await removeImageFromCloud(product.thumbnail.id);
                const { id, url } = await uploadImage(thumbnail)
                dataToUpdate.thumbnail = { id, url }
            }
            if (images.length) {
                const uploadPromise = images.map(async (imgFile) => {
                    return await uploadImage(imgFile)
                })
                dataToUpdate.images = await Promise.all(uploadPromise)
            }
            updateProduct(product.id, dataToUpdate)
            router.refresh();
            router.push('/products')
        } catch (error) {
            if (error instanceof ValidationError) {
                error.inner.map(err => {
                    toast.error(err.message)
                })
            }
        }
    }
    return (
        <ProductForm onImageRemove={handleImageRemove} initialValue={initialValue} onSubmit={handleOnSubmit} />
    )
}
