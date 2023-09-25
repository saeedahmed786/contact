"use client";
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
const DynamicComponent = dynamic(() => import('./Stripe'));

const Contact = () => {
    const [showStripe, setShowStripe] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const submitForm = async (e) => {
        e.preventDefault();
        setShowStripe(true);
    }

    return (
        <div>
            <section className="contact-us" id="contact-section">
                {
                    showStripe ?
                        <DynamicComponent data={formData} />
                        :
                        <div>
                            <form id="contact" onSubmit={submitForm}>
                                <div className="section-heading">
                                    <h4>Contact us</h4>
                                </div>
                                <div className="inputField">
                                    <label>Name: </label>
                                    <input type="name" name="name" id="name" placeholder="Your name" autoComplete="on" required onChange={handleChange} />
                                </div>
                                <div className="inputField">
                                    <label>Email: </label>
                                    <input type="Email" name="email" id="email" placeholder="Your email" required="" onChange={handleChange} />
                                </div>
                                <div className="inputField">
                                    <label>Amount of tickets: </label>
                                    <input type="number" name="amount" id="name" placeholder="Amount of tickets (Each ticket is 10€)" autoComplete="on" required onChange={handleChange} />
                                </div>
                                <div className="inputField btn">
                                    <button type="submit" id="form-submit" className="main-gradient-button">Send a message</button>
                                </div>
                            </form>
                        </div>
                }
            </section>
        </div>
    )
}

export default Contact
