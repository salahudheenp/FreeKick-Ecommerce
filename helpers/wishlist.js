var db = require("../config/connection");
var collections = require("../config/collections");
const { response } = require("../app");
const ObjectId = require("mongodb").ObjectID
const moment = require('moment')


exports.addToWishlist = (prodId, userId)=>{
    return new Promise(async (resolve, reject) => {
     let userWish = await db.get().collection(collections.WISHLIST_COLLECTION).findOne({ user:ObjectId(userId) })
     let count
     let prodObj={
        item:ObjectId(prodId)
     }
     if(userWish){
        count=userWish.products.length
        let productExist=userWish.products.findIndex(product=>product.item==prodId)
        if(productExist==-1){
            db.get().collection(collections.WISHLIST_COLLECTION).updateOne({
                user:ObjectId(userId)
            },{
                $push: { products: { item: ObjectId(prodId) } }
            }
            ).then((response)=>{
                resolve(count)
            })
        }else{
            db.get().collection(collections.WISHLIST_COLLECTION)
                .updateOne({ user: ObjectId(userId) },
                    {
                        $pull: { products: { item:ObjectId(prodId) } }
                    }).then((response) => {
                        reject()
                    })
        }
     }else{
        console.log('elseeeeeeeeeeeeee?????????<><><><><><><><><>><><<><>');
         let wishObj = {
             user: ObjectId(userId),
             products: [prodObj]
         }
         db.get().collection(collections.WISHLIST_COLLECTION).insertOne(wishObj).then((response) => {
             count = 0
             resolve(count)
         })
     }
  
    })
}


//WISHLIST PRODUCTS
exports.getWishProducts= (userId) => {
    return new Promise(async (resolve, reject) => {
        let wishlist = await db.get().collection(collections.WISHLIST_COLLECTION).aggregate([
            {
                $match: { user: ObjectId(userId) }
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                }
            }, {
                $lookup: {
                    from: collections.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    product: { $arrayElemAt: ['$product', 0] }
                }
            }
        ]).toArray()
        resolve(wishlist)
    })
}

//DELTE PRODUCT FROM CART
exports.deleteProductFromWish= (prodId, userId) => {
    return new Promise((resolve, reject) => {
        db.get().collection(collections.WISHLIST_COLLECTION).updateOne({
            user: ObjectId(userId)
        },
            {
                $pull: { products: { item: ObjectId(prodId) } }
            }
        ).then(() => {
            resolve()
        })
    })
}