import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: true
        },

        joinedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

membershipSchema.index(
    {
        user: 1,
        community: 1
    },
    {
        unique: true
    }
);

const Membership = mongoose.model(
    "Membership",
    membershipSchema
);

export default Membership;