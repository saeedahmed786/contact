import connectB from "@/app/lib/mongodb";
import Contact from "@/app/models/contact";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { data, paymentData } = await req.json();
    try {
        const { name, email, amount } = data;
        await connectB();
        const contact = new Contact({ name, email, paymentData, amount });

        await contact.save();

        return NextResponse.json({ msg: "Payment is done and message sent successfully" })

    } catch (error) {
        console.log(error);
        return NextResponse.json(error);
    }
}