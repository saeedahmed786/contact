const { Schema, default: mongoose } = require("mongoose");

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/]
    },
    paymentData: {
        type: Object
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        validate: {
            validator: function (value) {
                return value > 0;
            },
            message: 'Value must be greater than zero',
        },
    }
}, { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;