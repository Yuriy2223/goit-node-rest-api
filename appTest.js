import express from "express";
import morgan from "morgan";
import cors from "cors";

import usersRouter from "./routes/usersRouter";

const appTest = express();

// middlewares
appTest.use(cors());
appTest.use(express.json());
appTest.use(morgan("dev"));
appTest.use("/public", express.static("public"));

// routes
appTest.use("/users", usersRouter);

// 404
appTest.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// error handling
appTest.use((error, req, res, next) => {
  console.error("Handling errors: ", error.message, error.name);

  // handle mongoose validation error
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: error.message,
    });
  }

  // handle ObjectId validation
  if (error.message.includes("Cast to ObjectId failed for value")) {
    return res.status(400).json({
      message: "id is invalid",
    });
  }

  if (error.status) {
    return res.status(error.status).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
  
});

export default appTest;
