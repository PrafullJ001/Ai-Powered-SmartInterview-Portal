import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  role: { type: String, required: true },
  questionText: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: true },
});

export default mongoose.model("Question", questionSchema);
