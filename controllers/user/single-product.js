const productHelpers=require("../../helpers/product-helpers")


exports.getSingleProduct=(req,res)=>{
   let proId=req.params.id
   let users=req.session.user
   console.log("ihhhggoooooooooooooooooo");
   productHelpers.getProductDetails(proId).then((product)=>{
    
   res.render("user/product-details", { product,users,user:true})

   })
}

exports.getAllProducts=(req,res)=>{
   productHelpers.getAllProducts().then((products) => {
      // let category= await productHelpers.getCategory()
      // console.log(category,'77777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777777');
      res.render("user/shop", { user: true, products});
   })

   
}


exports.findCategories=(req,res)=>{
   
   let categoryName = req.params.name
   console.log(categoryName,'78888888888888888844444444444666666666444444666666666');
   productHelpers.findCategory(categoryName).then((products)=>{
      console.log(products, '8799999999999999999999999999999999999999999999999999999999999999999995');
      res.render('user/shop',{products}) 


   })

}