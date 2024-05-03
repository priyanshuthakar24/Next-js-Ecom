'use client';
import React from 'react'
import { ProductResponse } from '../types'
import ProductForm, { InitialValue } from './ProductForm'
interface Props {
    product: ProductResponse
}
export default function UpdateProduct({ product }: Props) {
    const initialValue: InitialValue = {
        ...product,
        thumbnail: product.thumbnail.url,
        images: product.images?.map(({ url }) => url),
        mrp: product.price.base,
        salePrice: product.price.discounted,
        bulletPoints: product.bulletPoints || [],
    }
    return (
        <ProductForm initialValue={initialValue} onSubmit={(values)=>{
            console.log(values)
        }}  />
    )
}
