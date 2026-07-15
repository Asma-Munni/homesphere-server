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
  const clientUrl =
  process.env.CLIENT_URL ??
  "http://localhost:3000";

// Middleware
app.use(
  cors({
    origin: clientUrl,
    credentials: true,

    methods: [
      "GET",
      "POST",
      "PATCH",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

app.use(express.json());

// Debug: পরে remove করে দেবে
console.log(
  "JWT SECRET LOADED:",
  Boolean(process.env.JWT_SECRET)
);

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