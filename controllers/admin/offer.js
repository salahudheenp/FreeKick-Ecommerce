const categoryHelpers = require("../../helpers/category")
const productHelpers = require("../../helpers/product-helpers")
const offerHelpers=require('../../helpers/offer')


exports.getOfferDetails=async (req,res)=>{
    let products = await productHelpers.getAllProducts()
    let category = await categoryHelpers.getCategory()
    let productOffer = await offerHelpers.getProductOffer()
    let categoryOffer = await offerHelpers.getCategoryOffer()

    res.render('admin/offer',{products,category,admin:true,productOffer,categoryOffer})

}

//add product offer

exports.addProductOffer=(req,res)=>{
    offerHelpers.addProductOffer(req.body).then((response)=>{
        res.redirect('/admin/offer-management')

    })

}

//delete product Offer

exports.deleteProductOffer=async (req,res)=>{
    let products=await productHelpers.getAllProducts()
    offerHelpers.deleteProductOffer(req.params.id,products).then((response)=>{
        res.json({status:true})
    })
}

//add category offer

exports.addCategoryOffer=(req,res)=>{
    console.log(req.body,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<');
    offerHelpers.addCategoryOffer(req.body).then((response)=>{
        console.log(response,'8888888888888888888888888888888');
        res.redirect('/admin/offer-management')
    })
}

//delete category offer

exports.deleteCategoryOffer=(req,res)=>{
    offerHelpers.deleteCategoryOffer(req.body.category).then((respose)=>{
        res.json({status:true})
    })
}