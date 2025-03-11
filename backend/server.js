import express from "express";
import "dotenv/config";
import colors from "colors";
import cors from "cors";
import campaign from "./campaign/router.js";
import { connectToDatabase } from "./db.js";

connectToDatabase();

const app = express();

// Database connection configuration

const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware to parse JSON payloads
app.use(express.json());

//Mount routers

app.use("/campaign", campaign);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.yellow.underline);
});
