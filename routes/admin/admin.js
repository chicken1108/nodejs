module.exports = function(app, passport) {
  var bcrypt = require('bcrypt-nodejs');
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "news"
  });
  var bodyParser = require('body-parser');
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  app.get('/login', function(req, res){
    res.render('admin/login.ejs', {message:req.flash('loginMessage')});
  });
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/checklevel',
    failureRedirect: '/login',
    failureFlash: true
  }),
  function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 15;
  }else{
    req.session.cookie.expires = false;
  }
  res.redirect('/login');
});
  app.get('/checklevel',isLoggedIn, checkAdmin, function(req, res){
      res.redirect('/admin');
  });

  app.get('/signup', urlencodedParser, function(req, res) {
   res.render('admin/signup.ejs', {message: req.flash('')});
 });
  app.post('/signup', urlencodedParser, function(req, res) {
    var username = req.body.username;
    var password =  req.body.password
    var re_password = req.body.re_password
    var level = req.body.level;
    if(password!=re_password){
      res.render('admin/signup.ejs',{message:'Mật khẩu không khớp'});
    }
    else{
      var sql = "SELECT * From accounts WHERE username ='"+username+"'";
      con.query(sql, function(err, result){
       if(err) throw(err)
        if(result!='')
        {
          res.render('admin/signup.ejs',{message:'Tài khoản đã tồn tại'});
        }
        else{
          sql = "INSERT INTO accounts_pending (username, password, level) VALUES ('"+username+"','"+password+"','"+level+"')";
          con.query(sql, function(err, result){
            res.redirect('/success');
          });
        }
      });
    }
  });
  //
  app.get('/success', function(req, res){
   res.render('user/success_user.ejs');
 });

  app.get('/admin/signupadmin',isLoggedIn, checkAdmin, function(req, res){
      res.render('admin/signup_admin.ejs', {message: req.flash('')});
  });
  app.post('/admin/signupadmin',isLoggedIn, urlencodedParser, checkAdmin, function(req, res) {
    var username = req.body.username;
    var password =  req.body.password
    var re_password = req.body.re_password
    var level = req.body.level;
    if(password!=re_password){
      res.render('admin/signup_admin.ejs',{message:'Mật khẩu không khớp'});
    }
    else{
      var sql = "SELECT * From accounts WHERE username ='"+username+"'";
      con.query(sql, function(err, result){
       if(err) throw(err)
        if(result!='')
        {
          res.render('admin/signup_admin.ejs',{message:'Tài khoản đã tồn tại'});
        }
        else{
          password =  bcrypt.hashSync(password);
          sql = "INSERT INTO accounts (username, password, level) VALUES ('"+username+"','"+password+"','"+level+"')";
          con.query(sql, function(err, result){
            res.redirect('/admin/success');
          });
        }
      });
    }
  });

  app.get('/admin/success', function(req, res){
   res.redirect('/login');
 });

  app.get('/admin', isLoggedIn, checkAdmin, function(req, res){
    res.render('admin/dashboard.ejs', {user:req.user});
  });
  app.get('/admin/confirmaccount',isLoggedIn, checkAdmin, function(req, res){
   var sql = "SELECT * from accounts_pending";
   con.query(sql, function(err, result){
     if(err) throw(err);
     res.render('admin/confirmacc.ejs',{list_account:result});
   });
 });

  app.get('/admin/addaccount/:id',isLoggedIn, checkAdmin, function(req, res){
   var id = req.params.id;
   con.query("SELECT * FROM accounts_pending WHERE id ='"+id+"'", function(err, result){
    if(err) throw(err);
    var data = result;
    data[0]['password'] = bcrypt.hashSync(data[0]['password']);
    var sql = "INSERT INTO accounts (username, password, level) VALUES ('"+data[0]['username']+"','"+data[0]['password']+"','"+data[0]['level']+"')";
    con.query(sql, function(err, result){
     if(err) throw(err); 
     con.query("DELETE FROM accounts_pending WHERE id ='"+id+"'", function(err, result){
      if(err) throw (err);
      res.redirect('/admin/confirmaccount');
    });
   });
  });
 });
  app.get('/admin/dismissaccount/:id', isLoggedIn, checkAdmin, function(req, res){

    var id = req.params.id;
    var sql = "DELETE FROM accounts_pending WHERE id ='"+id+"'";
    con.query(sql, function(err, result){
     if(err) throw(err);
     res.redirect('/admin/confirmaccount');
   });
});
  app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/login');
  })
};

function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();
res.redirect('/login');
}
function checkAdmin(req, res, next){
 if(req.user.level==1){
  return next();
 }
 res.redirect('/');
}