import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            enum: [
                "FITNESS",
                "HEALTH",
                "HOBBIES",
                "LEARNING",
                "SPIRITUALITY",
                "SOCIAL"
            ]
        },

        image: {
            type: String,
            default: ""
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["PENDING", "APPROVED", "REJECTED"],
            default: "PENDING"
        },

        rejectionReason: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Community = mongoose.model("Community", communitySchema);

export default Community;