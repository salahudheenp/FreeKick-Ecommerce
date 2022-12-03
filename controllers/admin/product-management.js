const productHelpers=require("../../helpers/product-helpers") 
const categoryHelpers=require("../../helpers/category")
const multer = require('multer')
const cloudinary = require('../../utils/cloudinary');



// view product
exports.getProductDetails = (req, res) => {
    productHelpers.getAllProducts().then((products) => {
        
        res.render('admin/view-products', {products, admin: true })
    })
}

exports.getAddProducts = (req, res) => {
    categoryHelpers.getCategory().then((category) => {
        res.render('admin/add-product', { category, admin: true })
    })
}

exports.postAddProduct = async (req, res) => {
    const cloudinaryImageUploadMethod = (file) => {
        return new Promise((resolve) => {
            cloudinary.uploader.upload(file, (err, res) => {
                if (err) return res.status(500).send("upload image error");
                resolve(res.secure_url);
            });
        });
    };

    const files = req.files;
    let arr1 = Object.values(files);
    let arr2 = arr1.flat();

    const urls = await Promise.all(
        arr2.map(async (file) => {
            const { path } = file;
            const result = await cloudinaryImageUploadMethod(path);
            return result;
        })
    );
    console.log(urls);
    productHelpers.addproduct(req.body, urls, (id) => {
        res.redirect('/admin/products')
    })
}



exports.deleteProductDetails = (req, res) => {
    let prodId = req.params.id
    console.log(prodId)
    productHelpers.deleteProducts(prodId).then(()=>{
     res.redirect("/admin/products")
   })
}  



exports.getEditProduct=(req, res) => {
    let proid = req.params.id
    console.log(proid,"ivideeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    productHelpers.getProductDetails(proid).then((product)=>{
    categoryHelpers.getCategory().then((category) => {
    console.log(product, '////////////////////////////////////////////////////////////',category);
    res.render("admin/edit-product",{product,category,admin:true})
    
        })
    })
    }


exports.postEditProduct = async (req, res) => {
    // var oldImages = await productHelpers.getProductImage(req.params.id)
    // oldImages = oldImages.images
    // if (req.files.length > 0) {

        const cloudinaryImageUploadMethod = async (file) => {
            return new Promise((resolve) => {
                cloudinary.uploader.upload(file, (err, res) => {
                    if (err) return res.status(500).send("upload image error");
                    resolve(res.secure_url);
                });
            });
        };

        // const urls = [];
        const files = req.files;
        let arr1 = Object.values(files)
        let arr2 = arr1.flat()
        const urls=await Promise.all(
            arr2.map(async(file)=>{
                const {path}=file
                const result = await cloudinaryImageUploadMethod(path)
                return result
            })
        )
        // if (files) {
        //     for (const file of files) {
        //         const { path } = file;
        //         const newPath = await cloudinaryImageUploadMethod(path);
        //         urls.push(newPath);
        //     }
        // }

        // oldImages.splice(0, urls.length, ...urls);
    productHelpers.updateProducts(req.params.id, req.body, urls).then((id) => {
        res.redirect('/admin/products')
    })
    }

    

