import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeForm } from './StripeForm';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Stripe = ({ data }) => {
    const [stripeLoading, setStripeLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState();
    const [isDebit, setIsDebit] = useState(false);


    const createPaymentIntent = async () => {
        setStripeLoading(true);
        await axios.post("/api/create-intent", { totalPrice: data?.amount }).then(res => {
            setClientSecret(res.data.clientSecret);
            setIsDebit(true);
            setStripeLoading(false)
        }).catch(err => {
            console.log(err);
            setStripeLoading(false)
        })
    }


    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance
    }

    useEffect(() => {
        createPaymentIntent();
        return () => {

        }
    }, [])

    const transactionSuccess = async (paymentData) => {
        await axios.post('/api/make-payment',
            {
                paymentData,
                data
            })
            .then(res => {
                console.log(res.data);
                if (res.status === 200) {
                    alert(res.data.msg);
                    document.location.reload();
                } else {
                    alert(res.data.msg)
                }
            })
    }

    return (
        <div>
            {
                stripeLoading ?
                    <div>Loading...</div>
                    :
                    (
                        isDebit &&
                        <div className='border p-4 py-2 pt-0 my-4'>
                            <Elements options={options} stripe={stripePromise}>
                                <StripeForm totalPrice={parseInt(data?.amount * 10)} placeOrder={transactionSuccess} />
                            </Elements>
                        </div>
                    )
            }
        </div>
    )
}

export default Stripe
