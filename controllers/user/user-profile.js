const userHelpers=require('../../helpers/user-helpers')

exports.getProfile=(req,res)=>{
let user = req.session.user
   // console.log(user,'////////////////************************///////////////////*******************///////////*********');
   res.render("user/profile", { users: req.session.user ,user})
}

exports.editeDetails=(req,res)=>{
   let user = req.session.user._id
  userHelpers.editeProfile(user,req.body).then(()=>{
   res.redirect('user/profile')
  })
}

exports.getAddress=async (req,res)=>{
let userId = req.session.user._id
let user = req.session.user
   let address=await userHelpers.getAddress(userId)
   // console.log(address,'00000000000000000000000000000');
   res.render("user/address", { users: req.session.user,user,address,user:true})
}

exports.addAddress=(req,res)=>{
let user = req.session.user._id
    console.log(req.body);
   userHelpers.addAddress(req.body,user).then(()=>{
     res.redirect('/user/address')
   })
}

exports.addAddressCheckout=(req,res)=>{
   let user = req.session.user._id
   console.log(req.body,'(*****)(******)(******)******)********()()()(()');
   userHelpers.addAddress(req.body, user).then(() => {

      res.redirect('/user/place-order')
   })
}

exports.deleteAddress=(req,res)=>{
     let user = req.session.user._id
      console.log(req.params.id,'////////////////////////////////////////////////////////////////////////////////////')

   userHelpers.deletAddress(user,req.params.id).then(()=>{
     res.redirect('/user/address')
   })

}

exports.getWallet=async (req,res)=>{
   let userId = req.session.user._id
   let user=req.session.user
   // let cartCount = await userHelpers.getCartCount(user._id)
   // let wishCount = await userHelpers.getWishCount(req.session.user._id)
   let wallet = await userHelpers.getWallet(userId)
   res.render('user/wallet', { user, wallet, users: req.session.user })
}



