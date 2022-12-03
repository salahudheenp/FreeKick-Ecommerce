var db = require("../config/connection");
var collection = require("../config/collections");
const collections = require("../config/collections");
const { response } = require("../app");
const coupon=require('../helpers/coupon')

const ObjectId = require("mongodb").ObjectID
const moment = require('moment')



// place order
module.exports={


    placeOrder: (order, products, totalPrice, userId, address) => {
    console.log(order, '//////////////////////??????????????????????////???????????????????');
    // console.log('ppppppppp',order,'9999999', products, totalPrice,'88888888888888888888888');
    return new Promise((resolve, reject) => {
        let status = order['payment-method'] === 'cod' ? 'placed' : 'pending'
        console.log(order['paymen-tmethod']);
        products.forEach(element => {
            element.status = status
        })
        let orderObj = {
            address: address,
            userId: ObjectId(userId),
            paymentMethod: order['payment-method'],
            
            products: products,
            
            totalAmount: totalPrice,
            // status: status,
            // date: new Date(),
            displayDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
            date: new Date(),
            coupon:order.coupon,
            couponOffer:order.couponOffer,
            fainalAmount:order.fainalAmount,
            return:false

        }
        // console.log(orderObj, '121212121212121212121112222222222222');
        db.get().collection(collections.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
            if (order.coupon != undefined || order.coupon != null) {
                // changeCouponQuantity(couponCode.couponCode)
                coupon.redeemUser(order.coupon, userId)
            }
            if (status === 'placed') {
                db.get().collection(collections.CART_COLLECTION).deleteOne({ user:ObjectId(userId) })
                products.forEach(element => {
                    // console.log('innnnnnnnnnnnnnnnnnnnnnn');

                    db.get().collection(collections.PRODUCT_COLLECTION).updateOne({ _id:ObjectId(element.item) }, { $inc: { stock: -(element.quantity) } })
                })
                resolve(response.insertedId)
            } else {
                console.log('ooouttttttttttttttttttttt',response);
                resolve(response.insertedId)
            }

           
               
            // resolve()
        })

    })
 }
} 
