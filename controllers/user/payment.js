const orderHelpers = require('../../helpers/order-helpers');
const paymentHelpers=require('../../helpers/payment')
var paypal = require('paypal-rest-sdk');
const cartHelpers = require('../../helpers/cart-helpers');
const session = require('express-session');


paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AWuoiGJQuw1T9cXa4MASbcJQBXE0Ie0ltHsn9p-Sj23t961rtXD11DJ5ci-O2WQqtvyuF12anPEpJiTK',
    'client_secret': 'EMRNgw7afetFx-4caCg5FzbXuc4TfAWd9vkiDGg1e3yCMrtzOhraVdH193YLpoTdkFkFxKsT2hhjX5fP'
});

exports.postverifyPayment=async (req,res)=>{
    // res.json({ status: true })
    console.log(req.body);
    let userId=req.session.user._id
    let products=await cartHelpers.getCartProducts(userId)
    paymentHelpers.verifyPayment(req.body).then(()=>{
        paymentHelpers.changePaymentStatus(req.body['order[receipt]'],userId,products).then(()=>{
            res.json({status:true})
        })


    }).catch((err)=>{
        res.json({status:'false',errMsg:''})
    })
}


exports.getPaypalSuccess=(req,res)=>{
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
   
    const execute_payment_json={
        "payer_id":payerId,
        'transactions':[{
            "amount":{
                "currency":'USD',
                "total":"25.00"
            }
        }]
    }
    paypal.payment.execute(paymentId,execute_payment_json,function(error,payment){
        if(error){
            console.log(error);
        }else{
            console.log(JSON.stringify(payment))
            res.send('Success')
        }
    })
    // paymentHelper.changePaymentStatus(req.session.orderId, req.session.user._id).then(() => {
    //     // delete req.session.cartCount
    //     // delete req.session.orderId
    //     res.redirect('/order-history')
    // })
}