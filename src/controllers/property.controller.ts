import { Request, Response } from "express";
import { db } from "../config/db";



export const createProperty = async (
  req: Request,
  res: Response
) => {

  try {

    const properties =
      db.collection("properties");


    const result =
      await properties.insertOne(
        req.body
      );


    res.status(201).json({

      success: true,

      message:
        "Property created successfully",

      data: result,

    });


  } catch (error) {

    console.log(
      "CREATE PROPERTY ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to create property",

    });

  }

};





export const getProperties = async (
  req: Request,
  res: Response
) => {

  try {


    const properties =
      db.collection("properties");


    const result =
      await properties
        .find()
        .toArray();



    res.status(200).json({

      success: true,

      data: result,

    });



  } catch (error) {


    console.log(
      "GET PROPERTY ERROR:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Failed to retrieve properties",

    });

  }

};