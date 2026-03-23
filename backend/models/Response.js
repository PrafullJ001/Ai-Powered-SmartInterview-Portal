import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  userName: String,
  role: String,
  answers: [
    {
      questionId: String,
      userAnswer: String,
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Response", responseSchema);
