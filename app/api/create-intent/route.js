import { NextResponse } from "next/server";
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET);

export async function POST(req) {
    try {
        const { totalPrice } = await req.json();
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice * 100,
            currency: "eur",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        return NextResponse.json({ clientSecret: paymentIntent.client_secret, })

    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
}