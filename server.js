const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// MongoDB Connection String
const mongoDBConnectionString = "mongodb://localhost:27017/myblog"; // Replace with your connection string

mongoose
  .connect(mongoDBConnectionString)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

// Schema and Model
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  dateCreated: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// Middleware
app.use(express.static("public"));
app.use(express.json());

// CRUD Operations
// Get all posts
app.get("/api/posts", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

// Get a single post by ID
app.get("/api/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  res.send(post);
});

// Create a new post
app.post("/api/posts", async (req, res) => {
  let post = new Post({ title: req.body.title, content: req.body.content });
  post = await post.save();
  res.send(post);
});

// Update a post
app.put("/api/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
    },
    { new: true }
  );

  if (!post) return res.status(404).send("Post not found");
  res.send(post);
});

// Delete a post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).send("Post not found");
    res.send(post);
  } catch (error) {
    res.status(500).send("Error deleting post");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
