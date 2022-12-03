var db = require("../config/connection");
const collections = require("../config/collections");
const { response } = require("../app");

const ObjectId = require("mongodb").ObjectID
var paypal = require('paypal-rest-sdk') 
const Razorpay = require('razorpay');
const productHelpers = require("./product-helpers");


paypal.configure({
    'mode': process.env.mode, //sandbox or live
    'client_id': process.env.client_id,
    'client_secret': process.env.client_secret
});

var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});

exports.generateRazorpay=(orderId,totalPrice)=>{
return new Promise((resolve, reject) => {
    

       var options={
        amount:totalPrice *100,
        currency: "INR",
        receipt: ""+ orderId,
    
    }
    instance.orders.create(options,function(err,order){
        if(err){
            console.log(err);
        }else{

        
        console.log(order,'33333333333333333333333333333333333333333333333333333');
        resolve(order)
        }
    })
    

    
})
}


exports.verifyPayment=(details)=>{
return new Promise((resolve, reject) => {
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256', 'tf3RYQGyO2CbQUx4lWjPNwYh');
    hmac.update(details['payment[razorpay_order_id]'] + '|' + details['payment[razorpay_payment_id]'])
    hmac = hmac.digest('hex')
    if (hmac == details['payment[razorpay_signature]']) {
        resolve()
    } else {
        reject()
    }
    
})
}


exports.changePaymentStatus=(orderId,userId,products) => {
    return new Promise((resolve, reject) => {
        products.forEach(async (item) => {
            let response = await db.get().collection(collections.ORDER_COLLECTION).updateOne({ _id: ObjectId(orderId), 'products.item':ObjectId(item.item) },
                {
                    $set: {
                        'products.$.status': 'placed'
                    }

                })
                await db.get().collection(collections.PRODUCT_COLLECTION).updateOne(
                    {
                        _id:ObjectId(item.item)
                    },{
                        $inc:{
                            stock: -(item.quantity)
                        }
                    }
                )
                
                
        })
        db.get().collection(collections.CART_COLLECTION).deleteOne({
            user:ObjectId(userId)
        })
        resolve()
        
    })

}
