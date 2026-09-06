import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
    {
        community: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            required: true
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true,
            trim: true
        },

        isPinned: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Announcement = mongoose.model(
    "Announcement",
    announcementSchema
);

export default Announcement;