const adminHelpers=require('../../helpers/admin-helpers')
const orderHelpers=require("../../helpers/order-helpers")
// const orderHelpers=require('../../helpers/order-helpers')


exports.getAllOrders=(req,res)=>{
    adminHelpers.getOrderDetails('placed').then((orders) => {
    //  console.log(orderItems,"hjkl;");
     res.render("admin/order",{orders,admin:true})

   })

}

exports.getProducts=async (req,res)=>{
    let orderId = req.params.id
    console.log(orderId, '0909090990900990990090099090900-900');
    let products = await orderHelpers.getAllOrderProducts(orderId)
    console.log(products, 'vanoooooooooooooooooooooooooooooooooooooooooooooooooooooootttttttttttooooooooooooooooooooo');
    res.render('admin/order-products', { products,admin:true })

}


exports.getOrderStatus=(req,res)=>{
    adminHelpers.getOrderDetails(req.params.status).then((response) => {
     res.json(response)
   })

}


exports.changeOrderStatus=(req,res)=>{
  console.log(req.body,'666666666666666666666666666666666');
    adminHelpers.changeOrderStatus(req.body.proId,req.body.orderId, req.body.status).then(() => {
     res.json({ status: true })
   })
}


exports.cancelOrder=(req,res)=>{
    orderHelpers.cancelOrder(req.params.orderId).then(() => {
     res.json({ status: true })
   })
}



// admin
exports.returnProduct = async (req, res) => {
  console.log(req.body, '111111111111111111111111111111111111111111111111111111111');
  let prodId = req.body.prodId
  // userId = req.session.user._id
  // console.log(userId, 'dasssssssssssssssssssssss');
  // let product=await orderHelpers.getProductDetails(prodId)
  let product = await orderHelpers.getOrderProducts(req.body.orderId)

  orderHelpers.returnOrderAdmin( req.body, product).then(async (response) => {
    res.json({ status: true })
  }).catch(() => {
    res.json({ status: false })
  })
}