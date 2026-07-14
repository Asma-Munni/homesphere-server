import {Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { db } from "../config/db";
import { ObjectId } from "mongodb";
import type {
  Document,
  Filter,
  Sort,
} from "mongodb";





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





const escapeRegex = (
  value: string
): string => {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
};


export const getProperties = async (
  req: Request,
  res: Response
) => {
  try {
    const properties =
      db.collection("properties");


    // Query values

    const search =
      typeof req.query.search === "string"
        ? req.query.search.trim()
        : "";


    const category =
      typeof req.query.category === "string"
        ? req.query.category.trim()
        : "";


    const location =
      typeof req.query.location === "string"
        ? req.query.location.trim()
        : "";


    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : "newest";


    const page = Math.max(
      Number.parseInt(
        String(
          req.query.page ?? "1"
        ),
        10
      ) || 1,
      1
    );


    const limit = Math.min(
      Math.max(
        Number.parseInt(
          String(
            req.query.limit ?? "9"
          ),
          10
        ) || 9,
        1
      ),
      50
    );


    const minPriceValue =
      typeof req.query.minPrice === "string" &&
      req.query.minPrice.trim() !== ""
        ? Number(req.query.minPrice)
        : undefined;


    const maxPriceValue =
      typeof req.query.maxPrice === "string" &&
      req.query.maxPrice.trim() !== ""
        ? Number(req.query.maxPrice)
        : undefined;



    // MongoDB filter conditions

    const conditions: Filter<Document>[] = [];


    // Search filter

    if (search) {
      const safeSearch =
        escapeRegex(search);

      conditions.push({
        $or: [
          {
            title: {
              $regex: safeSearch,
              $options: "i",
            },
          },
          {
            shortDescription: {
              $regex: safeSearch,
              $options: "i",
            },
          },
          {
            description: {
              $regex: safeSearch,
              $options: "i",
            },
          },
          {
            location: {
              $regex: safeSearch,
              $options: "i",
            },
          },
          {
            category: {
              $regex: safeSearch,
              $options: "i",
            },
          },
        ],
      });
    }


    // Category filter

    if (category) {
      conditions.push({
        category: {
          $regex:
            `^${escapeRegex(category)}$`,
          $options: "i",
        },
      });
    }


    // Location filter

    if (location) {
      conditions.push({
        location: {
          $regex:
            escapeRegex(location),
          $options: "i",
        },
      });
    }


    // Price filter

    const priceFilter: {
      $gte?: number;
      $lte?: number;
    } = {};


    if (
      minPriceValue !== undefined &&
      !Number.isNaN(minPriceValue)
    ) {
      priceFilter.$gte =
        minPriceValue;
    }


    if (
      maxPriceValue !== undefined &&
      !Number.isNaN(maxPriceValue)
    ) {
      priceFilter.$lte =
        maxPriceValue;
    }


    if (
      Object.keys(priceFilter).length > 0
    ) {
      conditions.push({
        price: priceFilter,
      });
    }


    const filter: Filter<Document> =
      conditions.length > 0
        ? {
            $and: conditions,
          }
        : {};



    // Sorting

    let sortOptions: Sort;


    switch (sort) {
      case "oldest":
        sortOptions = {
          createdAt: 1,
        };
        break;


      case "price-asc":
        sortOptions = {
          price: 1,
        };
        break;


      case "price-desc":
        sortOptions = {
          price: -1,
        };
        break;


      case "title-asc":
        sortOptions = {
          title: 1,
        };
        break;


      case "title-desc":
        sortOptions = {
          title: -1,
        };
        break;


      case "newest":
      default:
        sortOptions = {
          createdAt: -1,
        };
        break;
    }



    // Pagination

    const skip =
      (page - 1) * limit;


    const [
      result,
      total,
    ] = await Promise.all([
      properties
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .toArray(),

      properties.countDocuments(
        filter
      ),
    ]);


    const totalPages =
      total > 0
        ? Math.ceil(
            total / limit
          )
        : 0;



    return res.status(200).json({
      success: true,

      // Existing response format preserved
      data: result,

      pagination: {
        page,
        limit,
        total,
        totalPages,

        hasNextPage:
          page < totalPages,

        hasPreviousPage:
          page > 1,
      },
    });

  } catch (error) {
    console.log(
      "GET PROPERTY ERROR:",
      error
    );


    return res.status(500).json({
      success: false,

      message:
        "Failed to retrieve properties",
    });
  }
};

// Get a single property by ID
export const getSingleProperty = async (
  req: Request,
  res: Response
) => {

  try {

    const property =
      await db.collection("properties")
      .findOne({
        _id: new ObjectId(req.params.id as string)
      });


    res.status(200).json({

      success:true,

      data:property

    });


  } catch(error) {


    console.log(error);


    res.status(500).json({

      success:false,

      message:"Failed to get property"

    });

  }

};

export const getOwnerProperties = async (
  req: Request,
  res: Response
) => {


  try {


    const properties =
      db.collection("properties");



    const result =
      await properties
      .find({

        ownerId: req.params.ownerId

      })
      .toArray();



    res.status(200).json({

      success:true,

      data:result

    });



  }
  catch(error){


    console.log(
      "OWNER PROPERTY ERROR:",
      error
    );


    res.status(500).json({

      success:false,

      message:"Failed to get owner properties"

    });


  }


};

export const deleteProperty = async (
  req: AuthRequest,
  res: Response
) => {


try{


const properties =
db.collection("properties");



const result =
await properties.deleteOne({

_id: new ObjectId(
req.params.id as string
)

});



if(result.deletedCount === 0){

return res.status(404).json({

success:false,

message:"Property not found"

});

}



res.status(200).json({

success:true,

message:"Property deleted successfully"

});



}
catch(error){


console.log(
"DELETE ERROR:",
error
);



res.status(500).json({

success:false,

message:"Failed to delete property"

});


}


};

export const updateProperty = async (
  req: AuthRequest,
  res: Response
) => {


try{


const properties =
db.collection("properties");



const id =
req.params.id as string;



const {
 _id,
 ...updateData
}=req.body;

const property =
await properties.findOne({

_id:new ObjectId(id)

});



if(!property){

return res.status(404).json({

success:false,

message:"Property not found"

});

}




if(property.ownerId !== req.user.userId){


return res.status(403).json({

success:false,

message:"You are not allowed to update this property"

});


}



const result =
await properties.updateOne(

{
 _id:new ObjectId(id)
},


{
 $set:updateData
}

);




if(result.matchedCount===0){

return res.status(404).json({

success:false,

message:"Property not found"

});

}



res.status(200).json({

success:true,

message:"Property updated successfully"

});



}
catch(error){


console.log(
"UPDATE ERROR:",
error
);



res.status(500).json({

success:false,

message:"Failed to update property"

});


}


};