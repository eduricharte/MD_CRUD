const express = require("express");
const app = express();

const admin = require("../node_modules/firebase-admin");
const credentials = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = admin.firestore();

app.post("/create", async (req, res) => {
  try {
    console.log(req.body);
    const id = req.body.email;
    const userJson = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    const response = db.collection("users").add(userJson);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.get("/read/all", async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const response = await usersRef.get();
    let usersArray = [];
    response.forEach((doc) => {
      usersArray.push(doc.data());
    });
    res.send(usersArray);
  } catch (error) {
    res.send(error);
  }
});

app.get("/read/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const response = await userRef.get();
    res.send(response.data());
  } catch (error) {
    res.send(error);
  }
});

app.post("/update", async (req, res) => {
  try {
    const id = req.body.id;
    //TODO: Change this to recieve all data and change to the new data
    const newFirstName = "Ilse Maria";
    const userRef = await db.collection("users").doc(id).update({
      firstName: newFirstName,
    });
    res.send(userRef);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const userRef = await db.collection("users").doc(req.params.id).delete();
    res.send(userRef);
  } catch (error) {
    res.send(error);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Simón carnal ando vivito en el puerto ${PORT}.`);
});
