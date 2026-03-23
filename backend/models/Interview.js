

import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // Firebase UID
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    questions: [
      {
        question: { type: String, required: true },

        //  FIX: allow empty user answers safely
        answer: { 
          type: String, 
          required: true, 
          default: "No answer provided" 
        },

        // AI Feedback (optional)
        aiFeedback: { 
          type: String, 
          default: "" 
        },
      },
    ],
  },
  { timestamps: true }
);

// Export Interview model
export default mongoose.model("Interview", InterviewSchema);



