const mongoose = require("mongoose");
async function ConnectDB () {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("mongodb connected successfully")
    } catch (error) {
        console.error("MongoDB error: ",error.message)
        process.exit(1)
    }
};
module.exports = {ConnectDB};
//The above function enables us to connect to mongodb once
//well understood mongodb connection
//mongoose helps us connect to mongodb