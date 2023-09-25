const mongoose = require("mongoose");

const connectB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("MongoDb connected");
        }
    } catch (error) {
        console.log(error);
    }
};
export default connectB;