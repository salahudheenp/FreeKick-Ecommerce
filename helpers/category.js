var db = require("../config/connection");
var collections = require("../config/collections")
const bcrypt = require("bcrypt");
const { Collection, ObjectId, ObjectID } = require("mongodb");


// category
module.exports = {

    addCategory: (categoryData) => {
        return new Promise(async (resolve, reject) => {
            categoryData.category = categoryData.category.toUpperCase()
            categoryData.date = new Date();
            let categoryCheck = await db.get().collection(collections.CATEGORY_COLLECTION).findOne({ category: categoryData.category })
            if (categoryCheck == null) {
                db.get().collection(collections.CATEGORY_COLLECTION).insertOne(categoryData).then((response) => {
                    resolve(response.insertedId)
                })
            } else {
                reject()
            }
        })
},

    getCategory: () => {
        return new Promise((resolve, reject) => {
            let category = db.get().collection(collections.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
    },

        deleteCategory: (ctgryId) => {
            return new Promise((resolve, reject) => {
                db.get().collection(collections.CATEGORY_COLLECTION).deleteOne({ _id: ObjectId(ctgryId) }).then((response) => {
                    resolve(response)

                })

            })
        },
    editCategory: (categoryData) => {
        return new Promise(async (resolve, reject) => {
            categoryData.inputValue = categoryData.inputValue.toUpperCase()
            let categoryCheck = await db.get().collection(collections.CATEGORY_COLLECTION).findOne({ category: categoryData.inputValue })
            if (categoryCheck == null) {
                db.get().collection(collections.CATEGORY_COLLECTION).updateOne(
                    {
                        // _id: objectId(categoryData.categoryId),
                        category: categoryData.categoryName
                    }, {
                    $set: {
                        category: categoryData.inputValue
                    }
                }
                ).then((response) => {
                    resolve(response.insertedId)
                })
            } else {
                reject()
            }
        })
    },
 }
