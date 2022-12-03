const cartHelpers=require('../../helpers/cart-helpers')
const userHelpers=require('../../helpers/user-helpers')
const checkoutHelpers=require('../../helpers/checkOut-helpers')
const paymentHelpers=require('../../helpers/payment')
var paypal = require('paypal-rest-sdk')



exports.getCheckOut=async (req,res)=>{
    let userId = req.session.user._id
   let products = await cartHelpers.getCartProducts(userId)
   let total=await cartHelpers.getTotalAmount(userId)
   let address = await userHelpers.getAddress(userId)
  
   console.log("**********",products)
   res.render("user/place-order", { products, users: req.session.user, user: true,total,address})

}

exports.postCheckOut=async (req,res)=>{

  try {
    let userId = req.session.user._id
    console.log(req.body, '000000000000000000000000000000000000000000////////////////////////////////////////////')
    let products = await cartHelpers.getCartProducts(userId)
    let totalPrice = await cartHelpers.getTotalAmount(userId)
    let address = await userHelpers.getUseraddress(req.body, userId)
    

    checkoutHelpers.placeOrder(req.body, products, totalPrice, userId, address).then((orderId) => {
      if (req.body['payment-method'] === 'cod') {
        res.json({ codSuccess: true })
      } else if (req.body['payment-method'] === 'paypal') {
        console.log('7777777777777777777777777777777777777777777777777777777777777777777777');

        req.session.orderId = orderId
        let amount = Math.floor(totalPrice / 81.77)
        var create_payment_json = {
          "intent": "sale",
          "payer": {
            "payment_method": "paypal"
          },
          "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
          },
          "transactions": [{
            "item_list": {
              "items": [{
                "name": "item",
                "sku": "item",
                "price": amount,
                "currency": "USD",
                "quantity": 1
              }]
            },
            "amount": {
              "currency": "USD",
              "total": amount
            },
            "description": "This is the payment description."
          }]
        };


        paypal.payment.create(create_payment_json, function (error, payment) {
          if (error) {
            throw error;
          } else {
            console.log("Create Payment Response");
            console.log(payment);
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                res.json({ paypal: true, link: payment.links[i].href })
              }
            }
          }
        });

        exports.getPaypalSuccess = (req, res) => {
          const payerId = req.query.PayerID;
          const paymentId = req.query.paymentId;

          const execute_payment_json = {
            "payer_id": payerId,
            'transactions': [{
              "amount": {
                "currency": 'USD',
                "total": "25.00"
              }
            }]
          }
          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
              console.log(error);
            } else {
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



        // razorpay
      } else if (req.body['payment-method'] === 'razorpay') {
        paymentHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
          console.log(response, '999999999999999999999999900000000000000000000000000000');
          res.json(response)

        })

      }


    })
    
  } catch (error) {
    res.redirect('/404')
    
  }
  
   console.log(req.body)
 

}

