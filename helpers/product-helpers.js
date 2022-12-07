var db = require("../config/connection");
// var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID
module.exports = {
  addproduct: (product,urls, callback) => {
    product.price = Number(product.price),
      product.offerPrice = Number(product.price),
      product.stock = Number(product.stock)
    product.images = urls
    console.log(product,'777777777777777777777777777777777777777777');
    db.get()
      .collection("product")
      .insertOne(product)
      .then((data) => {
        callback(data.insertedId.toString());
      });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collections.PRODUCT_COLLECTION)
        .find()
        .toArray();
      resolve(product);
    });
  },

  deleteProducts: (prodId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(prodId) }).then((response) => {
        console.log(response);
        resolve(response)
      })
    })
  },

  getProductDetails: (proId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id: ObjectId(proId) }).then((product) => {
        resolve(product)
      })
    })

  },


  
  updateProducts: (proid, prodetails,urls) => {
    // prodetails.images = images
    product.price = Number(prodetails.price),
      // product.offerprice = Number(prodetails.offerprice),
      product.stock = Number(prodetails.stock)
    return new Promise((resolve, reject) => {
      // prodetails.price = Number(prodetails.price)  
      db.get().collection(collections.PRODUCT_COLLECTION)
        .updateOne({ _id: ObjectId(proid) }, {
          $set: {
            name: prodetails.name,
            // brand: prodetails.brand,
            stock: prodetails.stock,
            price: prodetails.price,
            category: prodetails.category,
            description: prodetails.description,
            image:urls
          }
            // name: prodetails.name,
            // category: prodetails.category,
            // price: prodetails.price
          
        }).then((response) => {
          resolve()
        })
    })
  },



  getProductImage:(proId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.PRODUCT_COLLECTION).findOne({ _id:ObjectId(proId) }).then((response) => {
        resolve(response)
      })
    })
  },
  // category

  addCategory: (category) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.CATEGORY_COLLECTION).insertOne(category).then((response) => {
        resolve(response)
      })
    })

  },

  getCategory: () => {
    return new Promise((resolve, reject) => {
      let category = db.get().collection(collections.CATEGORY_COLLECTION).find().toArray()
      resolve(category)
    })
  },

  deleteCategory: (ctgryId) => {
    return new Promise((resolve, reject) => {
      db.get().collection(collections.CATEGORY_COLLECTION).deleteOne({ _id: ObjectId(ctgryId) }).then((response) => {
        resolve(response)

      })

    })
  },

  // category filter

  findCategory: (categoryName) => {
     categoryName=categoryName.toUpperCase()
    return new Promise(async (resolve, reject) => {
      let response = await db.get().collection(collections.PRODUCT_COLLECTION)
        .find({
          category: categoryName
        }).toArray()
      console.log(response)
      resolve(response)
    })
    

  },
  //UPDATE PRODUCT CATEGORY
  updateProductCategory: (category) => {
    return new Promise(async (resolve, reject) => {
      category.inputValue = category.inputValue.toUpperCase()
      await db.get().collection(collections.PRODUCT_COLLECTION).updateMany({
        category: category.categoryName
      }, {
        $set: {
          category: category.inputValue
        }
      })
      resolve()
    })
  }





};
