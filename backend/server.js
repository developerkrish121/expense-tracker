const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

//  Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json());

//  MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected "))
  .catch((err) => console.log(err));


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);


const expenseSchema = new mongoose.Schema({
  userId: String, 
  title: String,
  amount: Number
});

const Expense = mongoose.model("Expense", expenseSchema);




app.get("/", (req, res) => {
  res.send("Server is running ");
});




app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("User already exists ");
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    res.send("User registered ");
  } catch (error) {
    res.status(500).send("Error registering user ");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    console.log("LOGIN ERROR:", error); // 🔥 DEBUG
    res.status(500).json({ message: error.message }); // 🔥 SHOW ERROR
  }
});


app.post("/add-expense", auth, async (req, res) => {
  try {
    const { title, amount } = req.body;

    const newExpense = new Expense({
      title,
      amount,
      userId: req.user.userId
    });

    await newExpense.save();

    res.send("Expense saved ");
  } catch (error) {
    res.status(500).send("Error saving expense ");
  }
});


app.get("/expenses", auth, async (req, res) => {
  try {
    const data = await Expense.find({ userId: req.user.userId });
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data ");
  }
});


app.delete("/delete-expense/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;

    await Expense.findByIdAndDelete(id);

    res.send("Expense deleted ");
  } catch (error) {
    res.status(500).send("Error deleting ");
  }
});


app.put("/update-expense/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const { title, amount } = req.body;

    const updated = await Expense.findByIdAndUpdate(
      id,
      { title, amount },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).send("Error updating ");
  }
});


const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});