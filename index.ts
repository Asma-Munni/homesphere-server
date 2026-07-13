import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { client } from "./src/config/db";
import propertyRoute from "./src/routes/property.route";


dotenv.config();


const app = express();


const port = process.env.PORT || 5000;



// Middleware

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use(express.json());



// Routes

app.use(
  "/api/properties",
  propertyRoute
);



app.get("/", (req, res) => {

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



    app.listen(
      port,
      () => {

        console.log(
          `Server running on port ${port}`
        );

      }
    );


  } catch(error) {


    console.log(
      "Server startup failed:",
      error
    );


  }

}



startServer();