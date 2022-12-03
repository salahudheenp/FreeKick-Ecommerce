var express = require("express");
var router = express.Router();
const otp = require('../otp-token');
const client = require('twilio')(otp.accountSID, otp.authToken)

const homepage=require("../controllers/user/home-page")
const signup=require('../controllers/user/login')
const productManagement=require('../controllers/user/single-product')
const cartManagement=require('../controllers/user/cart-management')
const checkOutManagement=require('../controllers/user/check-out')
const orderManagement=require('../controllers/user/order-management')
const profileManagement=require('../controllers/user/user-profile')
const couponManagement=require('../controllers/user/coupon')
const middlewares=require('../middlewares/authentication')
const paymentManagement=require('../controllers/user/payment')
const wishlistManagement=require('../controllers//user/wishlist')
const userHelpers=require('../helpers/user-helpers')
const passwordManagement=require('../controllers/user/password')



//clear cache
router.use((req, res, next) => {
    res.set('Cache-Control',
        `no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0`)
    next();
})

// home page
router.get('/',homepage.getHomepage)


//user signup
router.get("/signup", signup.getSignup);
router.post("/signup", signup.userSignup);


//user login
router.get("/login", signup.getLogin);
router.post("/login", signup.userLogin);


//user logout
router.get("/logout",signup.logOut);


//single product
router.get('/products',productManagement.getAllProducts)
router.get("/product-details/:id",productManagement.getSingleProduct)


router.get('/category/:name' ,productManagement.findCategories)

// profile
router.get('/profile',profileManagement.getProfile)
router.post('/profile',profileManagement.editeDetails)
router.get('/address',profileManagement.getAddress)
router.post('/add-address',profileManagement.addAddress)
router.get('/delete-address/:id',profileManagement.deleteAddress)



// wishlist
router.get('/wishlist', middlewares.verifyLogin, wishlistManagement.getWishlist)
// add to wishlist
router.get('/add-to-wishlist/:id', middlewares.verifyLogin, wishlistManagement.addToWishlist)
// delete wishlist product
router.get('/delete-wish-product/:id',wishlistManagement.deleteWishlist)


// cart

router.get("/cart",middlewares.verifyLogin,cartManagement.getCart)

router.get("/add-to-cart/:id", middlewares.verifyLogin, cartManagement.addtoCart)

router.post('/change-product-quantity',cartManagement.productQuantity)

router.get('/delete-cart-product/:id',cartManagement.deleteCartProduct)


// checkout

router.get("/place-order", middlewares.verifyLogin,checkOutManagement.getCheckOut)
router.post('/place-order', checkOutManagement.postCheckOut)

// Add address in checkout
router.post('/add-address-checkout', profileManagement.addAddressCheckout)

// orders
router.get('/order-success', middlewares.verifyLogin,orderManagement.getSuccess)
router.get('/orders', middlewares.verifyLogin,orderManagement.getOrders)
router.get('/order-products/:id', middlewares.verifyLogin,orderManagement.getOrderProducts)
router.put('/cancel-order',orderManagement.cancelOrder)


// return product
router.post('/return-product',orderManagement.returnProduct)




// coupon
router.post('/redeem-coupon',couponManagement.redeemCoupon)


// verify payment

router.post('/verify-payment',paymentManagement.postverifyPayment)
router.get('/success',paymentManagement.getPaypalSuccess)

// wallet 

router.get('/wallet', profileManagement.getWallet)

// forgot password

router.get('/forgot-password',passwordManagement.getForgotPassword)
router.post('/forgot-otp-login',passwordManagement.postMobileNumber)
router.get('/forgot-otp-verification',passwordManagement.getVerify)
router.post('/forgot-otp-verification',passwordManagement.postOtp)

router.post('/new-Password',passwordManagement.postNewPassword)
router.get('/resendOtp/:phone',passwordManagement.resendOtp)







// var express = require("express");
// var router = express.Router();
// const productHelpers = require("../helpers/product-helpers");
// const otp = require('../otp-token');
// const client = require('twilio')(otp.accountSID, otp.authToken)

// const userHelpers = require("../helpers/user-helpers");


// const verifyLogin = (req, res, next) => {
//   if (req.session.loggedIn) {
//     next()
//   } else {
//     res.redirect("/login")
//   }

// }

// //clear cache
// router.use((req, res, next) => {
//   res.set('Cache-Control',
//     `no-cache, private,no-store,must-revalidate,max-stale=0,pre-check=0`)
//   next();
// })



// /* GET home page. */
// router.get("/", function (req, res, next) {
//   let users=req.session.user
//   console.log(users);
//   productHelpers.getAllProducts().then((product) => {
//     res.render("index", { user: true, product,users });
//   });
//   // res.render("user");
// });
 




// router.get("/login", (req, res) => {
//   console.log(req.session.loggedIn);
//   if (req.session.loggedIn){

//     console.log("ahssrthf")
//     res.redirect("/user")
//   }else{
//     let loginErr = req.session.loginErr
//     console.log("ooooooooooo",loginErr);
//     res.render("user/login", { loginErr,  login: true});
  
//     req.session.loginErr =false
//   }
// });
// router.get("/signup", (req, res) => {
//   res.render("user/signup", { signup: true });
// });

// router.post("/register", (req, res) => {
//   console.log(req.body);
//   userHelpers.doSignup(req.body).then((data) => {
//     console.log(data);
//     req.session.loggedIn=true
//     req.session.user=data
//     res.redirect("/user/login")
 
//   });
// })

// router.post("/login",(req,res)=>{
//   userHelpers.doLogin(req.body).then((response)=>{
//     if (response.status) {
//       req.session.loggedIn = true
//       req.session.user = response.user

//       res.redirect("/user")
      
    
//     }else{
//       req.session.loginErr="Invalid Password or Email"
//       res.redirect("/user/login")
//     }
//   })
  
// })

// router.get("/logout",(req,res)=>{
//   req.session.destroy()
//   res.redirect("/user")

// })



// /OTP LOGIN
router.get('/otp-login', (req, res) => {
  
   res.render('user/otp-login', { not: true })
 })

 router.post('/otp-login', (req, res) => {
   console.log("111111111111111111111111111111");
   userHelpers.otpLogin(req.body).then((response) => {
     let phone = response.user.phone
     client
       .verify
       .services(otp.serviceID)
       .verifications
       .create({
         to: `+91${phone}`,
         channel: 'sms'
       }).then((data) => {
        req.session.user = response.user;
         res.render('user/otp-verification', { phone, not: true })
       }).catch((err) => {
         console.log(err);
       })
   }).catch((response) => {
     req.session.loginErr = "Please check your mobile number";
     res.redirect('/login')
   })
 })

 //OTP VERIFICATION
 router.get('/otp-verification', (req, res) => {
   res.render('user/otp-verification', { not: true })
 })

 router.post('/otp-verification', (req, res) => {
   console.log(req.body.phone);
   client
     .verify
     .services(otp.serviceID)
     .verificationChecks
     .create({
       to: `+91${req.body.phone}`,
       code: req.body.otp
     }).then((data) => {
       console.log(data);
       if (data.valid) {
         req.session.loggedIn = true;
         res.redirect('/user')
       } else {
         delete req.session.user
         req.session.otpErr = "Enter valid OTP"
         res.redirect('/login')
       }
     }).catch((err) => {
       delete req.session.user
       res.redirect('/login')
     })
 })

// // product details

// router.get("/product-details/:id",(req,res)=>{
//   let proId=req.params.id
//   let users=req.session.user
//   console.log("ihhhggoooooooooooooooooo");
//   productHelpers.getProductDetails(proId).then((product)=>{
    
//     res.render("user/product-details", { product,users,user:true})

//   })

// })

// // cart

// router.get("/cart", verifyLogin, async(req,res)=>{
//   let usrId=req.session.user._id
//   let products=await userHelpers.getCartProducts(usrId)
//   let totalValue=await userHelpers.getTotalAmount(usrId)
//     res.render("user/cart", { products,users:req.session.user ,user:true,totalValue})
  
 
// })

// router.get("/add-to-cart/:id",verifyLogin,(req,res)=>{
//   let prodId=req.params.id
//   let usrId=req.session.user._id
//   console.log(prodId)
//   userHelpers.addToCart(prodId,usrId).then(()=>{
//     // res.redirect("/")
//     // res.json({status:true})
//     // res.redirect("/")
//   })
// })


// router.post('/change-product-quantity',(req,res,next)=>{
  
//   userHelpers.changeProductQuantity(req.body).then(async(response)=>{
//     response.total=await userHelpers.getTotalAmount(req.body.user)
//     res.json(response)

//   })

// })
// // delete product from cart

// router.get('/delete-cart-product/:id',(req,res)=>{

//   let id=req.params.id

//   console.log(id);
//   let userId = req.session.user._id
//   userHelpers.deleteProductInCart(id,userId).then((response)=>{
//     res.json(response)
//   })
// })

// router.get("/place-order",async(req,res)=>{
//   let userId = req.session.user._id
//   let products = await userHelpers.getCartProducts(userId)
//   let total=await userHelpers.getTotalAmount(userId)
//   let address = await userHelpers.getAddress(userId)
  
//   console.log("**********",address)
//   res.render("user/place-order", { products, users: req.session.user, user: true,total,address})
// })
// router.post('/place-order',async(req,res)=>{
//   let userId = req.session.user._id
//   console.log(req.body,'000000000000000000000000000000000000000000')
//   let products=await userHelpers.getCartProductList(userId)
//   let totalPrice=await userHelpers.getTotalAmount(userId)
//   let address=await userHelpers.getUseraddress(req.body,userId)
//   console.log(address);

//   userHelpers.placeOrder(req.body,products,totalPrice,userId,address).then((response)=>{
//     res.json({status:true})
    

//   })
//   console.log(req.body)
// })

// router.get('/order-success',(req,res)=>{
//   res.render('user/order-success',{user:req.session.user})
// })

// router.get('/orders',async(req,res)=>{
//   let userId = req.session.user._id
//   let orders=await userHelpers.getUserOrders(userId)
//   // console.log(orders,'***********************************');
//   // let products=await userHelpers.getOrderProducts(req.params.id)
//   res.render('user/orders',{orders,user:req.session.user,user:true})
// })

// // cancel order

// router.get('/cancel-order/:id',(req,res)=>{
//   let id=req.params.id
//   // console.log(id,'/*//////*/*/*/*/*/***********//////////////');
//   userHelpers.cancelOrder(id).then((response)=>{
//     res.json({status:true})
//   })
// })

// // user profile

// router.get('/profile',(req,res)=>{
//   let user = req.session.user
//   // console.log(user,'////////////////************************///////////////////*******************///////////*********');
//   res.render("user/profile",{user})
  
// })
// // edite profile

// router.post('/profile',(req,res)=>{
  
//   let user = req.session.user._id
//  userHelpers.editeProfile(user,req.body).then(()=>{
//   res.redirect('/profile')

//  })
// })


// // address

// router.get('/address',async(req,res)=>{
//   let user=req.session.user._id
//   let address=await userHelpers.getAddress(user)
//   // console.log(address,'00000000000000000000000000000');
//   res.render("user/address",{user,address})

// })


// // add address in profile

// router.post('/add-address',(req,res)=>{
//   let user = req.session.user._id
//   console.log(req.body);
//   userHelpers.addAddress(req.body,user).then(()=>{
//     res.redirect('/user/address')
//   })

// })

// // add address in checkoutpage

// router.post('/add-address-checkout',(req,res)=>{
//   let user=req.session.user._id
//   userHelpers.addAddress(req.body,user).then(()=>{
//     res.redirect('/place-order')
//   })
// })


// // delete Address

// router.get('/delete-address/:id',(req,res)=>{
//   let user = req.session.user._id
// console.log(req.params.id,'////////////////////////////////////////////////////////////////////////////////////')

//   userHelpers.deletAddress(user,req.params.id).then(()=>{
//     res.redirect('/user/address')
//   })
// })

// // category finding

// router.get('/category/:name',(req,res)=>{
//   console.log(req.params.name);
//   let categoryName=req.params.name
//   productHelpers.findCategory(categoryName).then((products)=>{
//     console.log(products,'*********************');
//     res.render('user/view-products',{products})
//   })
// })





module.exports = router;
