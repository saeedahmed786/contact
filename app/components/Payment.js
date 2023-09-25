import React, { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripeForm } from './StripeForm';
import axios from 'axios';
import dynamic from 'next/dynamic';
const Paypal = dynamic(() => import('./Paypal'));


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Stripe = ({ data }) => {
    const [stripeLoading, setStripeLoading] = useState(false);
    const [clientSecret, setClientSecret] = useState();
    const [isDebit, setIsDebit] = useState(false);
    const [showStripe, setShowStripe] = useState(true);


    const createPaymentIntent = async () => {
        setStripeLoading(true);
        await axios.post("/api/create-intent", { totalPrice: data?.amount }).then(res => {
            setClientSecret(res.data.clientSecret);
            setIsDebit(true);
            setStripeLoading(false);
            setShowStripe(true);
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
                console.log(res.data)
                if (res.status === 200) {
                    alert(res.data.msg);
                    document.location.reload();
                } else {
                    alert(res.data.msg)
                }
            })
    }

    const transactionError = (err) => {
        console.log(err);
    }

    const transactionCanceled = (err) => {
        console.log(err);
    }

    return (
        <div>
            {
                stripeLoading ?
                    <div>Loading...</div>
                    :
                    <>
                        {
                            <div className="payment-information p-4">
                                <div className="payment-container">
                                    <div className='each-payments'>
                                        <div className="form-check radio d-flex justify-content-between align-items-center">
                                            <div className="form-check-input">
                                                <input
                                                    onClick={() => { createPaymentIntent() }}
                                                    defaultChecked={false}
                                                    checked={showStripe} type="radio" />
                                                <label className="form-check-label">
                                                    Credit Card
                                                </label>
                                            </div>
                                        </div>
                                        {
                                            showStripe &&
                                            (
                                                stripeLoading ?
                                                    <div>Loading...</div>
                                                    :
                                                    (
                                                        <div className='border p-4 py-2 pt-0 my-4'>
                                                            <Elements options={options} stripe={stripePromise}>
                                                                <StripeForm totalPrice={parseInt(data?.amount * 10)} placeOrder={transactionSuccess} />
                                                            </Elements>
                                                        </div>
                                                    )
                                            )
                                        }
                                    </div>
                                    <div className='each-payments'>
                                        <div className="form-check-input">
                                            <input
                                                onClick={() => setShowStripe(false)}
                                                defaultChecked={false}
                                                checked={!showStripe} type="radio" />
                                            <div>
                                                <label>Pay with Paypal</label>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        !showStripe &&
                                        <div>
                                            <div style={{ margin: "15px 0px", fontWeight: "bold" }}>
                                                Total Amount {data?.amount * 10}€
                                            </div>
                                            <Paypal
                                                amount={parseInt(data?.amount * 10)}
                                                onSuccess={transactionSuccess}
                                                transactionError={transactionError}
                                                transactionCanceled={transactionCanceled}
                                            />
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </>
            }
        </div>
    )
}

export default Stripe
