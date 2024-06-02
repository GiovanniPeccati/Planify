const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");

const app = express();

const dbURI =
  "mongodb+srv://<username>:<password>@testcluster.yghusht.mongodb.net/list?retryWrites=true&w=majority&appName=<ClusterName>";

mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.redirect("/todos");
});

app.get("/create", (req, res) => {
  res.render("create", { title: "Nuovo Compito" });
});

app.get("/todos", (req, res) => {
  Todo.find()
    .sort({ createdAt: -1 })
    .then((result) =>
      res.render("index", { list: result, title: "Tutti i Compiti" })
    )
    .catch((err) => console.log(err));
});

app.post("/todos", (req, res) => {
  const todo = new Todo(req.body);

  todo
    .save()
    .then((result) => res.redirect("/todos"))
    .catch((err) => console.log(err));
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;

  Todo.findById(id)
    .then((result) =>
      res.render("details", { todo: result, title: "Dettagli" })
    )
    .catch((err) => console.log(err));
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  Todo.findByIdAndDelete(id)
    .then((result) => res.json({ redirect: "/todos" }))
    .catch((err) => console.log(err));
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});
