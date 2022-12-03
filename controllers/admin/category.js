const categoryHelpers=require("../../helpers/category")
const productHelpers=require("../../helpers/product-helpers")



exports.getCategoryDetails = (req, res) => {
    categoryHelpers.getCategory().then((category) => {
    res.render("admin/category", {category, admin: true })

     })

}

exports.postCategoryDetails = (req, res) => {
    categoryHelpers.addCategory(req.body).then((response) => {
        res.json({ status: true })
    }).catch(() => {
        res.json({ status: false })
    })
   }


exports.putCategoryDetails = (req, res) => {
    categoryHelpers.editCategory(req.body).then(async () => {
        console.log(req.body, 'INNNNNNnnnnnnnnnnnnnnnn');
        await productHelpers.updateProductCategory(req.body)
        res.json({ status: true })
    }).catch(() => {
        res.json({ status: false })
    })
}

exports.deleteCategoryDetails = (req, res) => {
     let ctgryId=req.params.id
   console.log("ihhhggoooooooooooooooooo00000000000000000000000",ctgryId);
    categoryHelpers.deleteCategory(ctgryId).then((response)=>{
    
     res.redirect("/admin/category")
   })
}