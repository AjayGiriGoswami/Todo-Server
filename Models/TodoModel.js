import mongoose from "mongoose";

const TodoSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const todo = mongoose.model("todo", TodoSchema);
export default todo;
