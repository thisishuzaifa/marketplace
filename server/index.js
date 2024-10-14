const express = require("express");
const app = express();
const port = 3000;
const db = require("./db/marletplace-db");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function seedDatabase() {
  try {
    await db.seedDatabase();
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
