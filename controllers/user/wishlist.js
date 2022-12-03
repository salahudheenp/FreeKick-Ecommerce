const { response } = require("../../app")
const wishlistHelpers=require('../../helpers/wishlist')

module.exports={

    getWishlist:async (req,res)=>{
        let userId = req.session.user._id
        let products = await wishlistHelpers.getWishProducts(userId)
        // let cartCount = await userHelpers.getCartCount(userId)
        // let wishCount = await userHelpers.getWishCount(userId)
        let user = req.session.user
        res.render('user/wishlist', { user,userId,products })
    },
    // add to wish list
    addToWishlist:(req,res)=>{
        let prodId=req.params.id
        let user=req.session.user._id
        console.log(prodId,"s<S<>S<>S<>S<>S<>S<>S<>S<>S<S><S>S<>S<>S<>S<>S<>S<>S<>S<");
        wishlistHelpers.addToWishlist(prodId,user).then((response)=>{
            console.log(response,'***<>****<>****<>****<>****<>****<>*****<>****<>*****<>*****');
            res.json({ status: true })
        }).catch((response) => {
            res.json({ status: false })
        })
    },

    // delete wishlist product

    deleteWishlist:(req,res)=>{
        let prodId = req.params.id
        let userId = req.session.user._id
        wishlistHelpers.deleteProductFromWish(prodId,userId).then(() => {
            res.redirect('/user/wishlist')
        })
    }

}