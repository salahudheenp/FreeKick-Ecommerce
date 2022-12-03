var db = require("../config/connection");
var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID

// add to cart
module.exports={
addToCart: (prodId, usrId) => {
    let proObj = {
        item: ObjectId(prodId),
        quantity: 1
    }
    console.log(prodId, '*******', usrId);
    return new Promise(async (resolve, reject) => {
        let usrCart = await db.get().collection(collections.CART_COLLECTION).findOne({ user: ObjectId(usrId) })
        console.log(usrCart, "fgvd");
        if (usrCart) {
            let proexist = usrCart.products.findIndex(products => products.item == prodId)
            // let productExist = usercart.products.findIndex(products => products.item == productid)
            if (proexist != -1) {
                db.get().collection(collections.CART_COLLECTION)
                    .updateOne({ user: ObjectId(usrId), 'products.item': ObjectId(prodId) },
                        {
                            $inc: { 'products.$.quantity': 1 }
                        }
                    ).then(() => {
                        resolve()
                    })

            } else {
                db.get().collection(collections.CART_COLLECTION).updateOne({ user: ObjectId(usrId) },
                    {
                        $push: { products: proObj }
                    }).then((response) => {
                        resolve()
                    })


            }


        } else {

            let cartObj = {
                user: ObjectId(usrId),
                products: [proObj]
            }
            db.get().collection(collections.CART_COLLECTION).insertOne(cartObj).then((response) => {
                resolve(response)
            })
        }
    })

},

    
getCartProducts: (usrId) => {
        console.log(usrId);
        return new Promise(async (resolve, reject) => {
            let cartItems = await db.get().collection(collections.CART_COLLECTION).aggregate([
                {
                    '$match': {
                        'user': new ObjectId(usrId)
                    }
                }, {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$project': {
                        'item': '$products.item',
                        'quantity': '$products.quantity'
                    }
                }, {
                    '$lookup': {
                        'from': 'product',
                        'localField': 'item',
                        'foreignField': '_id',
                        'as': 'products'
                    }
                }, {
                    '$project': {
                        'item': 1,
                        'quantity': 1,
                        'product': {
                            '$arrayElemAt': [
                                '$products', 0
                            ]
                        }
                    }
                }, {
                    '$project': {
                        'item': 1,
                        'quantity': 1,
                        'product': 1,
                        
                        'total': {
                            '$multiply': [
                                '$quantity', '$product.offerPrice'
                            ]
                        }
                    }
                }
            ]).toArray()
            console.log(cartItems,'ooooooooooooooooooooo');


            resolve(cartItems)

        })
    },



        changeProductQuantity: (details) => {

            details.count = parseInt(details.count)
            details.quantity = parseInt(details.quantity)

            return new Promise((resolve, reject) => {
                if (details.count == -1 && details.quantity == 1) {
                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne({ _id: ObjectId(details.cart) },
                            {
                                $pull: { products: { item: ObjectId(details.product) } }
                            }
                        ).then((response) => {
                            resolve({ removeProduct: true })
                        })
                } else {
                    db.get().collection(collections.CART_COLLECTION)
                        .updateOne({ _id: ObjectId(details.cart), 'products.item': ObjectId(details.product) },
                            {
                                $inc: { 'products.$.quantity': details.count }
                            }
                        ).then((response) => {

                            resolve({ status: true })
                        })

                }


            })
        },

    getTotalAmount: (userId) => {
        return new Promise(async (resolve, reject) => {
           

            
            let total = await db.get().collection(collections.CART_COLLECTION).aggregate(
                [
                    {
                        '$match': {
                            'user': new ObjectId(userId)
                        }
                    }, {
                        '$unwind': {
                            'path': '$products'
                        }
                    }, {
                        '$project': {
                            'item': '$products.item',
                            'quantity': '$products.quantity'
                        }
                    }, {
                        '$lookup': {
                            'from': 'product',
                            'localField': 'item',
                            'foreignField': '_id',
                            'as': 'products'
                        }
                    }, {
                        '$unwind': {
                            'path': '$products'
                        }
                    }, {
                        '$project': {
                            'item': 1,
                            'quantity': 1,
                            'products': 1,
                            'stock': '$products.stock'
                        }
                    }, {
                        '$match': {
                            'stock': {
                                '$gt': 0
                            }
                        }
                    }, {
                        '$group': {
                            '_id': null,
                            'total': {
                                '$sum': {
                                    '$multiply': [
                                        '$quantity', '$products.offerPrice'
                                    ]
                                }
                            }
                        }
                    }
                ]
            ).toArray()
            console.log(total, '***************************************');



            resolve(total[0]?.total)

        })
 },
                // delete product from cart
                deleteProductInCart: (id, userId) => {
                    return new Promise((resolve, reject) => {
                        db.get().collection(collections.CART_COLLECTION).updateOne({
                            user: ObjectId(userId)
                        },
                            {
                                $pull: { products: { item: ObjectId(id) } }
                            }
                        ).then((response) => {
                            resolve(response)
                        })
                    })
                },


    // getCartCount:(userId)=>{
    //     return new Promise((resolve, reject) => {
    //         let count
    //         let cart=db.get().collection(collections.CART_COLLECTION).find({_id:ObjectId(userId)})
    //         if(cart){
    //             count=cart.products.length
    //         }
    //         resolve(count)
    //     })
    // }

}
