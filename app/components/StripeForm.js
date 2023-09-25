import React, { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";

export const StripeForm = ({ totalPrice, placeOrder }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);




    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(process.env.NEXT_PUBLIC_STRIPE_CLIENT_SECRET);

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            console.log(paymentIntent);
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    placeOrder(paymentIntent);
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe]);



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        await stripe.confirmPayment({
            elements,
            redirect: "if_required"
            // confirmParams: {
            //     return_url: process.env.REACT_APP_STRIPE_REDIRECT_URL,
            // },
        }).then(res => {
            const { error } = res;
            console.log(error);
            if (error) {
                alert(error?.message)
            } else {
                placeOrder(res.paymentIntent);
                // alert("Payment successfull");
            }
        }).catch(error => {
            console.log(error);
            if (error?.type === "card_error" || error?.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
        })


        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        setIsLoading(false);

    };

    return (
        <div className="mt-5">
            <div>
                {message}
            </div>
            <form id="payment-form" onSubmit={handleSubmit}>
                <div>
                    Pay {totalPrice}€
                </div>
                <PaymentElement id="payment-element" />
                <button style={{ marginTop: "10px" }} disabled={isLoading || !stripe || !elements} id="submit">
                    <span id="button-text">
                        {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                    </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
        // </Elements>
    );
}