import mongoose, { Schema } from "mongoose";


const propertySchema = new Schema(
  {
    title:{
      type:String,
      required:true,
    },

    shortDescription:{
      type:String,
      required:true,
    },

    description:{
      type:String,
      required:true,
    },

    price:{
      type:Number,
      required:true,
    },

    location:{
      type:String,
      required:true,
    },

    category:{
      type:String,
      required:true,
    },

    bedrooms:{
      type:Number,
      required:true,
    },

    bathrooms:{
      type:Number,
      required:true,
    },

    image:{
      type:String,
      required:false,
    },

  },

  {
    timestamps:true,
  }

);


export const Property =
mongoose.model(
  "Property",
  propertySchema
);