import todo from "../Models/TodoModel.js";

export const createtodo = async (req, res) => {
  const todoo = new todo({
    text: req.body.text,
    completed: req.body.completed,
    user: req.user._id,
  });
  try {
    const newTodo = await todoo.save();
    return res.status(200).json({
      message: "todo created succesfully",
      newTodo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getTodo = async (req, res) => {
  try {
    const pretodo = await todo.find({ user: req.user._id });
    return res.status(200).json({
      message: "todo fectch succesfully",
      pretodo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updatedTodos = await todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTodos) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      message: "Todo updated successfully",
      updatedTodos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removetodo = async (req, res) => {
  try {
    const deletedTodo = await todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
