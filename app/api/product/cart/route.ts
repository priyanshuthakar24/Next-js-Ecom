import startDb from "@/app/lib/db"
import CartModel from "@/app/models/cartModel"
import { NewCartRequest } from "@/app/types"
import { auth } from "@/auth"
import { error } from "console"
import { isValidObjectId } from "mongoose"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const session = await auth()
        const user = session?.user
        if (!user) return NextResponse.json({ error: 'unauthorized request!' }, { status: 401 })

        const { productId, quantity } = await req.json() as NewCartRequest
        if (!isValidObjectId(productId) || isNaN(quantity)) return NextResponse.json({ error: 'Invalid request!' }, { status: 401 })
        await startDb()
        const cart = await CartModel.findOne({ userId: user.id });
        if (!cart) {
            await CartModel.create({
                userId: user.id,
                items: [{ productId, quantity }]
            });
            return NextResponse.json({ success: true })
        }
        const existingItem = cart.items.find((item) => item.productId.toString() === productId)
        if (existingItem) {
            existingItem.quantity += quantity
            if (existingItem.quantity <= 0) {
                cart.items.filter((item) => item.productId.toString() !== productId)
            }
        } else {
            cart.items.push({ productId: productId as any, quantity })
        }
        await cart.save()
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: (error as any).message }, { status: 500 })
    }
}