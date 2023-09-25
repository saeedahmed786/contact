import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const Paypal = ({ amount, onSuccess }) => {
    const [isPaid, setIsPaid] = useState(false);

    const paypalOptions = {
        'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: 'EUR', // Change this to your desired currency
    };

    const handleOnSuccess = (details) => {
        // Handle successful payment here
        setIsPaid(true);
        onSuccess(details);

    };

    useEffect(() => {
        if (isPaid) {
            // You can redirect the user or show a success message here
        }
    }, [isPaid]);

    return (
        <PayPalScriptProvider options={paypalOptions}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then(handleOnSuccess);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default Paypal;
