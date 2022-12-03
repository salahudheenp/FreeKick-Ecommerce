var express = require('express');
const cloudinary=require('../utils/cloudinary')
const multer = require("multer");
const path = require("path");
const router = express.Router()



upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});


const login = require('../controllers/admin/login')
const home = require("../controllers/admin/home")
const productManagement=require("../controllers/admin/product-management")
const categoryManagement=require("../controllers/admin/category")
const userManagement=require('../controllers/admin/user-management')
const couponManagement=require('../controllers/admin/coupon')
const orderManagement=require('../controllers/admin/orders')
const offerManagement=require('../controllers/admin/offer')
const salesManagement=require('../controllers/admin/sales')
const dashbord=require('../controllers/admin/dashbord')


/* GET login page. */
router.get("/", login.getLogin);
router.post("/login", login.login);

router.get('/logOut',login.getLogOut)


// dashbord

router.get("/home", home.adminHome);



// admin category management
router.get('/category',  categoryManagement.getCategoryDetails);
router.post('/category', categoryManagement.postCategoryDetails);
router.put('/edite-category', categoryManagement.putCategoryDetails)
router.get('/delete-category/:id', categoryManagement.deleteCategoryDetails)


//admin product management
router.get('/products', productManagement.getProductDetails)
router.get('/delete-product/:id',productManagement.deleteProductDetails)
router.get('/add-product', productManagement.getAddProducts)
router.post('/add-product', upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]),productManagement.postAddProduct)

// edite product

router.get('/edit-product/:id',  productManagement.getEditProduct)
router.post('/edit-product/:id', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]), productManagement.postEditProduct)

// user management

router.get("/userslist", userManagement.getUserDetails)
router.get("/userstatus/:id",userManagement.changeUserStatus)



// coupon
router.get('/coupon',couponManagement.getCoupon)
router.post('/add-coupon',couponManagement.addCoupon)
router.post('/delete-coupon',couponManagement.deleteCoupon)

// orders
router.get('/order',orderManagement.getAllOrders)
router.get('/order-products/:id',orderManagement.getProducts)
router.get('/orders/:status',orderManagement.getOrderStatus)
router.post('/order-status',orderManagement.changeOrderStatus)
router.get('/cancel-order/:orderId',orderManagement.cancelOrder)


// return product

router.post('/return-product', orderManagement.returnProduct)

// sales report
router.get('/sales-report',salesManagement.getSalesReoport)

//dash bord

router.get('/dashboard',dashbord.getDashbord)
router.get('/dashboard/:days', dashbord.getDashbordDays)

//  router.get("/dashboard", dashbord.dashboardrender)
//  router.get("/dashboard/chart", dashbord.chart)
//  router.get("/dashboard/:days", dashbord.adminReport)


// offer management

router.get('/offer-management',offerManagement.getOfferDetails)
router.post('/offer-management/product-offer',offerManagement.addProductOffer)
router.post('/offer-management/delete-product-offer/:id',offerManagement.deleteProductOffer)

router.post('/offer-management/category-offer',offerManagement.addCategoryOffer)
router.post('/offer-management/delete-category-offer',offerManagement.deleteCategoryOffer)









// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.render("admin/login",{login:true})
 
// });

// router.get("/home",(req,res)=>{
//   res.render("admin/home",{admin:true})
// })


// router.get("/viewproducts", (req, res) => {
//   productHelpers.getAllProducts().then((products) => {
//     res.render("admin/view-products", { admin: true, products });
//   });
  
// })

// router.get("/add-product", (req, res) => {
//   res.render("admin/add-product",{admin:true});
// });
// router.post('/login',(req,res)=>{
//   adminHelpers.doLogin(req.body).then((response)=>{
//     if(response.status){
//       res.redirect("/admin/home")
//     }
//     else{
//       res.redirect("/admin/login")
//     }
//   })


// })


// router.post("/add-product", (req, res) => {
//   productHelpers.addproduct(req.body, (data) => {
//     console.log(data);
//     console.log("ooooooooooooooooooooooooooooooo");
//     let image = req.files.image;
//     image.mv("./public/product-images/" + data + ".jpg", (err) => {
//       if (!err) {
//         res.render("admin/add-product",{admin:true});
//       }
//     });
//   });
// });

// //delete product 

// router.get("/delete-product/:id",(req,res)=>{
//   let prodId=req.params.id
//   console.log(prodId)
//   productHelpers.deleteProducts(prodId).then((response)=>{
//     res.redirect("/admin/viewproducts")
//   })
// })

// // edit product


// router.get("/edit-product/:id",async(req, res)=> {
//   let proid = req.params.id
//     let product = await productHelpers.getProductDetails(proid);
//     console.log(product);
//     res.render("admin/edit-product",{product,admin:true});
//   })

//   router.post("/edit-product/:id",(req,res)=>{
//     let proid=req.params.id
//     productHelpers.updateProducts(proid,req.body).then(()=>{
//       res.redirect("/admin/viewproducts")
//       if(req.files?.image){
//         let image=req.files.image
//         image.mv("./public/product-images/" + proid + ".jpg")

//       }
//     })
//   })
//   // 
//   router.get("/userslist",(req,res)=>{
//    adminHelpers.getAllUsers().then((users)=>{
//      res.render("admin/users", { users ,admin:true})

//    })
//   })

//   // user block

//   router.get("/userstatus/:id",(req,res)=>{
//     let userId = req.params.id
    
//     adminHelpers.changeUserStatus(userId).then((response)=>{
//        res.redirect("/admin/userslist")
//       // res.send("Astg jtg")
//     })
    
//   })

//   // category

//    router.get("/category",(req,res)=>{
//     productHelpers.getCategory().then((category)=>{
//       res.render("admin/category", {category, admin: true })

//     })
    
//    })

// router.post("/category",(req,res)=>{
//   productHelpers.addCategory(req.body).then((response)=>{
//     res.redirect("/admin/category")
//     console.log(response)

//   })
// })

// router.get("/deletecategory/:id",(req,res)=>{
//   let ctgryId=req.params.id
//   console.log("ihhhggoooooooooooooooooo");
//   productHelpers.deleteCategory(ctgryId).then((response)=>{
    
//     res.redirect("/admin/category")
//   })
// })
// // order list

// router.get('/order',(req,res)=>{
//   console.log('****************************************************************');
//   adminHelpers.getOrderDetails('placed').then((orderItems)=>{
//     console.log(orderItems,"hjkl;");
//     res.render("admin/order",{orderItems,admin:true})

//   })
// })


// //ORDER STATUS
// router.get('/orders/:status', (req, res) => {
//   adminHelpers.getOrderDetails(req.params.status).then((response) => {
//     res.json(response)
//   })
// })

// router.post('/order-status', (req, res) => {
//   adminHelpers.changeOrderStatus(req.body.orderId, req.body.status).then(() => {
//     res.json({ status: true })
//   })
// })

// //CANCEL ORDER
// router.get('cancel-order/:orderId', (req, res) => {
//   userHelpers.cancelOrder(req.params.orderId).then(() => {
//     res.json({ status: true })
//   })
// })


module.exports = router;
