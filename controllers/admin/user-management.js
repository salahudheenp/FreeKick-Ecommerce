const userHelpers=require('../../helpers/user-helpers')

const adminHelpers=require('../../helpers/admin-helpers')


exports.getUserDetails=(req,res)=>{
     adminHelpers.getAllUsers().then((users) => {
     res.render("admin/users", { users, admin: true })

     })
} 
   

exports.changeUserStatus=(req,res)=>{
    let userId = req.params.id
    adminHelpers.changeUserStatus(userId).then((response)=>{
     res.redirect("/admin/userslist")
    })
}



