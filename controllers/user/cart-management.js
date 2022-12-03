const cartHelpers=require('../../helpers/cart-helpers')
const userHelpers=require('../../helpers/user-helpers')

exports.getCart=async (req,res)=>{
    let usrId = req.session.user._id
    let products = await cartHelpers.getCartProducts(usrId)
    let totalValue = await cartHelpers.getTotalAmount(usrId)
    // let cartCount=await cartHelpers.getCartCount(usrId)
    console.log(products,'0000000000000000000000000000000000000000000');
    res.render("user/cart", { products,users:req.session.user,usrId ,user:true,totalValue})
}

exports.addtoCart=(req,res)=>{
    let prodId = req.params.id
   let usrId=req.session.user._id
   console.log(prodId)
   cartHelpers.addToCart(prodId,usrId).then(()=>{
     // res.redirect("/")
    //  res.json({status:true})
     // res.redirect("/")
   })

}

exports.productQuantity=(req,res)=>{
     cartHelpers.changeProductQuantity(req.body).then(async (response) => {
      console.log(response,'99999999999999999999999999999999999999990000000000000000000000000000000000');
      console.log(req.body);
     response.total=await cartHelpers.getTotalAmount(req.session.user._id)
     res.json(response)

   })

}
exports.deleteCartProduct=(req,res)=>{
   let id = req.params.id
   console.log(id);
   let userId = req.session.user._id
   cartHelpers.deleteProductInCart(id,userId).then((response)=>{
     res.json(response)
   })


}