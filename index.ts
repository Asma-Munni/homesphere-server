import "dotenv/config";

import express from "express";
import cors from "cors";

import { client } from "./src/config/db";
import propertyRoute from "./src/routes/property.route";
import uploadRoute from "./src/routes/upload.route";
import authRoute from "./src/routes/auth.route";

const app = express();

const port =
  Number(process.env.PORT) || 5000;

  
  const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());




// Routes
app.use(
  "/api/auth",
  authRoute
);

app.use(
  "/api/properties",
  propertyRoute
);

app.use(
  "/api/upload",
  uploadRoute
);

app.get("/", (_req, res) => {
  res.send(
    "HomeSphere Server is Running"
  );
});

// MongoDB Connection + Server Start
async function startServer() {
  try {
    await client.connect();

    await client
      .db("admin")
      .command({
        ping: 1,
      });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.listen(port, () => {
      console.log(
        `Server running on http://localhost:${port}`
      );
    });
  } catch (error) {
    console.error(
      "Server startup failed:",
      error
    );

    process.exit(1);
  }
}

void startServer();