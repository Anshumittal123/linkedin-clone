import mongoose from "mongoose";

const connectRequestSchema = new mongoose.Schema({
        sender: {
            type: mongoose.Schema.Type.ObjectId,
            ref: "User",
            required: true
        },
        recipient: {
            type: mongoose.Schema.Type.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    {timestamps: true}
);

const ConnectRequest = mongoose.model("ConnectRequest", connectRequestSchema);
export default ConnectRequest;