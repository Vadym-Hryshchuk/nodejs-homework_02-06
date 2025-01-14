const mongoose = require("mongoose");

const app = require("./app");
const { DB_URI } = process.env;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("Database connection successful");
    app.listen(8080, () => {
      console.log("Server running. Use our API on port: 8080");
    });
  })
  .catch((err) => {
    console.log(err.message);
    process.exit(1);
  });
