const productHelpers=require('../../helpers/product-helpers')

exports.getHomepage=(req,res)=>{
     let users = req.session.user
     console.log(users);
     productHelpers.getAllProducts().then((product) => {
     res.render("index", { user: true, product,users });
   })
    
}
 