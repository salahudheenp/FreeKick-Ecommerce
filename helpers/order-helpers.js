var db = require("../config/connection");
var collections = require("../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("../app");
const ObjectId = require("mongodb").ObjectID 

module.exports = {

    getUserOrders: (userId) => {
    return new Promise(async (resolve, reject) => {
        let orders = await db.get().collection(collections.ORDER_COLLECTION).aggregate(
            [
                {
                    '$match': {
                        'userId': new ObjectId(userId)
                    }
                }, {
                    '$project': {
                        'address': '$address.address',
                        'date': 1,
                        'displayDate':1,
                        'status': 1,
                        'totalAmount': 1,
                        'paymentMethod': 1,
                        'price': '$products.offerPrice'
                    }
                }, {
                    '$sort': {
                        'date':-1
                    }
                }
            ]
        ).toArray()
        

            // .aggregate([
            //     {
            //         '$match': {
            //             'userId': new ObjectId('635e4c05c2a84ae88fcff839')
            //         }
            //     }, {
            //         '$unwind': {
            //             'path': '$products'
            //         }
            //     }, {
            //         '$project': {
            //             'userId': 1,
            //             'id': 1,
            //             'paymentMethod': 1,
            //             'date': 1,
            //             'totalAmount': 1,
            //             'status': 1,
            //             'address': '$address.address',
            //             'quantity': '$products.quantity',
            //             'subtotal': '$products.total',
            //             'productInfo': '$products.product'
            //         }
            //     }
            // ])
        resolve(orders)
    })
},

    // getOrders:(userId,orderId)=>{
    //     return new Promise((resolve, reject) => {
    //    db.get().collection(collections.ORDER_COLLECTION).findOne({userId:ObjectId(userId)},{_id:ObjectId(orderId)}).then((response)=>{
    //     resolve(response)

    //    })


    //     })
    // },

    //user side
     getOrderProducts:(orderId)=>{
      return new Promise(async(resolve, reject) => {
         let orderItems=await db.get().collection(collections.ORDER_COLLECTION).aggregate([
      {
             $match:{_id:ObjectId(orderId)}
           },
           {
             $unwind:'$products'
           },
           {
                     '$project': {
                   'userId': 1,
                   'id': 1,
                   'item': '$products.item',
                   'paymentMethod': 1,
                   'date': 1,
                   'totalAmount': 1,
                   'status': '$products.status',
                   'address': '$address.address',
                   'quantity': '$products.quantity',
                   'subtotal': '$products.total',
                   'productInfo': '$products.product',
                   'actualPrice': '$products.product.price',
                   'offerPrice': '$products.product.offerPrice'
               }
        }        
        ]).toArray()
        console.log(orderItems,'1234435erbfvdhdxgrd');
        resolve(orderItems)
      })
    },

    orderAmountDetails:(orderId)=>{
        return new Promise(async (resolve, reject) => {
            let totalPrice =await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                {
                    '$match': {
                        '_id': new ObjectId(orderId)
                    }
                }, {
                    '$unwind': {
                        'path': '$products'
                    }
                }, {
                    '$project': {
                       
                        'actualPrice': '$products.product.price',
                        'offerPrice': '$products.product.offerPrice',
                        'offerTotal': {
                            '$multiply': [
                                '$products.quantity', '$products.product.offerPrice'
                            ]
                        },
                        'totalPrice': {
                            '$multiply': [
                                '$products.quantity', '$products.product.price'
                            ]
                        }
                    }
                }, {
                    '$group': {
                        '_id': null,
                        'total': {
                            '$sum': '$totalPrice'
                        }
                    }
                }
            ]

            ).toArray()
            resolve(totalPrice[0]?.total)
        })
    },

    getTotalOffer:(orderId)=>{
        return new Promise(async (resolve, reject) => {
            let offerTotal=await db.get().collection(collections.ORDER_COLLECTION).aggregate(
                [
                    {
                        '$match': {
                            '_id': new ObjectId(orderId)
                        }
                    }, {
                        '$unwind': {
                            'path': '$products'
                        }
                    }, {
                        '$project': {
                            'actualPrice': '$products.product.price',
                            'offerPrice': '$products.product.offerPrice',
                            'offerTotal': {
                                '$multiply': [
                                    '$products.quantity', '$products.product.offerPrice'
                                ]
                            },
                            'totalPrice': {
                                '$multiply': [
                                    '$products.quantity', '$products.product.price'
                                ]
                            }
                        }
                    }, {
                        '$group': {
                            '_id': null,
                            'total': {
                                '$sum': '$offerTotal'
                            }
                        }
                    }
                ]
            ).toArray()
            console.log(offerTotal,'///***************/////////*************/////////////***********');
            resolve(offerTotal[0]?.total)
        })

    },

    couponDetails: (orderId)=>{
        return new Promise(async (resolve, reject) => {
          let coupon= await db.get().collection(collections.ORDER_COLLECTION).aggregate(
              [
                  {
                      '$match': {
                          '_id': new ObjectId(orderId)
                      }
                  }, 
                   {
                      '$project': {
                          'coupon': 1,
                          'couponOffer': 1,
                          'fainalAmount': 1,
                          'totalAmount': 1,
                        //   'offerPrice': '$products.product.offerPrice',
                          'displayDate': 1
                      }
                  }
              ]
            ).toArray()
            resolve(coupon[0])

        })
    
    },


    //  cancel order

    
    cancelOrder: (orderId,prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId), 'products.item':ObjectId(prodId) },
                {
                    $set: {
                        'products.$.status': 'canceled'
                    }

                }
            ).then(() => {
                resolve()
            })
        })
    },


    // admin side

    getAllOrderProducts:(orderId)=>{
        return new Promise(async (resolve, reject) => {
       let products= await db.get().collection(collections.ORDER_COLLECTION).aggregate(
                [
                    {
                        '$match': {
                            '_id': new ObjectId(orderId)
                        }
                    }, {
                        '$unwind': {
                            'path': '$products'
                        }
                    }, {
                        '$project': {
                            'userId': 1,
                            'id': 1,
                            'paymentMethod': 1,
                            'date': 1,
                            'totalAmount': 1,
                            'status': '$products.status',
                            'address': '$address.address',
                            'quantity': '$products.quantity',
                            'subtotal': '$products.total',
                            'productInfo': '$products.product'
                        }
                    }
                ]


            ).toArray()
            console.log(products,'11111111111111111111111111111122222222222222222222222222222222223333333333333344444444444555555555');
            resolve(products)
        })
    },

   

    getProductDetails:(prodId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collections.PRODUCT_COLLECTION).findOne({_id:ObjectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })

    },
 //return order
    returnOrder:(userId,data,product)=>{
        
        return new Promise((resolve, reject) => {
            db.get().collection(collections.ORDER_COLLECTION).updateOne({
                _id:ObjectId(data.orderId),
                'products.item':ObjectId(data.prodId)
            },
            {
                $set:{'products.$.status':'returned-pending'}

            }).then(async (response)=>{
                resolve(response)
                // console.log(response, 'astrrestrstertded');
                // let product=db.get().collection(collections.ORDER_COLLECTION)

                // console.log(product.offerPrice,"qqqqqqqqqqqqqqqqaaaaaaaaaaaaaaaqqqqqqqqqqqqqq");
                // db.get().collection(collections.WALLET_COLLECTION).updateOne({
                //     userId:ObjectId(userId)
                // }, {
                //     $inc: { walletBalance: (product.offerPrice) }
                // })

                // let quantity =await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                //     {
                //         '$match': {
                //             '_id': new ObjectId(data.orderId)
                //         }
                //     }, {
                //         '$unwind': {
                //             'path': '$products'
                //         }
                //     }, {
                //         '$match': {
                //             'products.item': new ObjectId(data.prodId)
                //         }
                //     }, {
                //         '$project': {
                //             'quantity': '$products.quantity',
                //             'price': '$products.product.offerPrice'
                //         }
                //     }
                // ]).toArray()
                // console.log(quantity, '11122222233333333');
                // let count=quantity[0].quantity
                // let price=quantity[0].price
            
                // console.log(count,'>>>>>>>><<<<<<<<<<<<<<<<<<>>>>>>>>>>><<<<<<<<<',price);
                // db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(data.prodId) }, { $inc: { stock:count } })
                // db.get().collection(collections.WALLET_COLLECTION).updateOne({
                //      userId:ObjectId(userId)
                //  }, {
                //      $inc: { walletBalance:price  }
                //  })

            })
           
        })
    },




//return order Admin
    returnOrderAdmin: ( data, product) => {

    return new Promise((resolve, reject) => {
        db.get().collection(collections.ORDER_COLLECTION).updateOne({
            _id: ObjectId(data.orderId),
            'products.item': ObjectId(data.prodId)
        },
            {
                $set: { 'products.$.status': 'returned' }

            }).then(async (response) => {
                resolve(response)
                // console.log(response, 'astrrestrstertded');
                // let product=db.get().collection(collections.ORDER_COLLECTION)

                // console.log(product.offerPrice,"qqqqqqqqqqqqqqqqaaaaaaaaaaaaaaaqqqqqqqqqqqqqq");
                // db.get().collection(collections.WALLET_COLLECTION).updateOne({
                //     userId:ObjectId(userId)
                // }, {
                //     $inc: { walletBalance: (product.offerPrice) }
                // })

                let quantity =await db.get().collection(collections.ORDER_COLLECTION).aggregate([
                    {
                        '$match': {
                            '_id': new ObjectId(data.orderId)
                        }
                    }, {
                        '$unwind': {
                            'path': '$products'
                        }
                    }, {
                        '$match': {
                            'products.item': new ObjectId(data.prodId)
                        }
                    }, {
                        '$project': {
                            'quantity': '$products.quantity',
                            'price': '$products.product.offerPrice',
                            'userId': 1
                        }
                    }
                ]).toArray()
                console.log(quantity, '11122222233333333');
                let count=quantity[0].quantity
                let price=quantity[0].price
                
                

                console.log(count,'>>>>>>>><<<<<<<<<<<<<<<<<<>>>>>>>>>>><<<<<<<<<',price);
                db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id: ObjectId(data.prodId) }, { $inc: { stock:count } })
                db.get().collection(collections.WALLET_COLLECTION).updateOne({
                     userId:ObjectId(userId)
                 }, {
                     $inc: { walletBalance:price  }
                 })

            })

    })
}
}