const cartHelpers = require('../../helpers/cart-helpers')
const orderHelpers=require('../../helpers/order-helpers')

exports.getSuccess=(req,res)=>{
    res.render('user/order-success', { user: req.session.user })

}

exports.getOrders=async (req,res)=>{
    let userId = req.session.user._id
    let orders = await orderHelpers.getUserOrders(userId)
 
    // let userOrder=await orderHelpers.getOrders(userId,orderId)
    
//   // console.log(orders,'***********************************');
//   // let products=await userHelpers.getOrderProducts(req.params.id)
   res.render('user/orders',{orders,users:req.session.user,user:true})

}


exports.getOrderProducts=async (req,res)=>{
 let orderId=req.params.id
  console.log(orderId,'0909090990900990990090099090900-900');
  let products = await orderHelpers.getOrderProducts(orderId)
  let totalPrice = await orderHelpers.orderAmountDetails(orderId)
  let totalOfferPrice = await orderHelpers.getTotalOffer(orderId)
  let coupon = await orderHelpers.couponDetails(orderId)



  console.log(coupon,'vanoooooooooooooooooooooooooooooooooooooooooooooooooooooootttttttttttooooooooooooooooooooo');

  console.log(totalPrice,"***************************************()>>>>>>>>>>>>>>>>>>>",totalOfferPrice);
  res.render('user/order-products', { products, users: req.session.user, totalPrice, totalOfferPrice ,coupon})

}

exports.cancelOrder=(req,res)=>{
    // let id = req.params.id
  // console.log(id,'/*//////*/*/*/*/*/***********//////////////');
    orderHelpers.cancelOrder(req.body.orderId,req.body.prodId).then((response)=>{
     res.json({status:true})
   })

}


exports.returnProduct=async (req,res)=>{
  console.log(req.body,'111111111111111111111111111111111111111111111111111111111');
  let prodId=req.body.prodId
  userId = req.session.user._id
  console.log(userId, 'dasssssssssssssssssssssss');
  // let product=await orderHelpers.getProductDetails(prodId)
  let product =await orderHelpers.getOrderProducts(req.body.orderId)
 
  orderHelpers.returnOrder(userId,req.body,product).then(async(response)=>{
  res.json({status:true})
  }).catch(()=>{
    res.json({status:false})
  })
}


