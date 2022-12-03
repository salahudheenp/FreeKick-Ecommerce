const adminHelpers = require('../../helpers/admin-helpers')


exports.getLogin=(req,res)=>{
  if(req.session.admin){
    res.redirect('/admin/home')

  }else{
    res.render("admin/login", { login: true, "loginErr": req.session.loginErr })

  }


}

exports.login=(req,res)=>{
    adminHelpers.doLogin(req.body).then((response) => {
     if(response.status){
      req.session.adminLoggedIn=true
      req.session.admin=response.admin
       req.session.admin = true
       res.render("admin/home",{admin:true})
     }
     else{
       req.session.loginErr = "Invalid Password or Email"
       res.redirect("/admin/login")
    }

})

}
exports.getLogOut=(req,res)=>{
  req.session.adminLoggedIn=false
  req.session.admin=null
  res.redirect('/admin/')
}




