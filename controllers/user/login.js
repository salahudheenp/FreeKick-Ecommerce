 const userHelpers = require("../../helpers/user-helpers")

exports.getSignup=(req,res)=>{
  if (req.session.loggedIn){
    res.redirect('/user')
  }else{
    res.render('user/register', { login: true })

    
  }
  
 
    
 
  // if(req.session.signupErr){
  //   res.render('user/register', { login: true, 'msg': req.session.signupErr })
  // }else{
  //   res.render('user/register',{login:true})
  // }
  
} 

exports.userSignup=(req,res)=>{


     userHelpers.doSignup(req.body).then((data) => {
     console.log(data,'<         >>>>>>>>>>>             <<<<<<<<<<<<<<<<<              >>>>>>>>>>');
     req.session.loggedIn=true
     req.session.user=data
       res.render('user/login', {login:true})
    }).catch((msg)=>{
      console.log(msg,"pattoolamoneeeeeeeeeeeeeeeeeeeeeeeeee");
      // req.session.signupErr =msg
      res.render('user/register', {msg,login:true})
    })
}


exports.getLogin=(req,res)=>{
    if (req.session.loggedIn){

     console.log("ahssrthf")
     res.redirect("/user")
   }else{
    let loginErr = req.session.loginErr
     console.log("ooooooooooo",loginErr);
     res.render("user/login", { loginErr,  login: true});
  
     req.session.loginErr =false
   }
}


exports.userLogin=(req,res)=>{
   userHelpers.doLogin(req.body).then((response)=>{
     if (response.status) {
       req.session.loggedIn = true
       req.session.user = response.user

       res.redirect("/user")
      
    
     }else{
       req.session.loginErr="Invalid Password or Email"
       res.redirect("/user/login")
     }
   })
  
 }


//  logOut

exports.logOut = (req, res) => {
    delete req.session.user
    delete req.session.loggedIn
    res.redirect('/user')
}


    



