module.exports = function(app, passport) {
  var bodyParser = require('body-parser');
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
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

  app.get('/user/info',isLoggedIn, function(req, res){
    var id = req.user.id;
    var sql = "SELECT * FROM accounts WHERE id ='"+id+"' ";
    con.query(sql, function(err, result){
     if(err) throw(err);
     res.render('user/info_user.ejs',{info_user:result,user:req.user});
   });
  });
  app.post('/user/info',isLoggedIn, urlencodedParser, function(req, res){
    var id = req.user.id;
    var hoten = req.body.hoten;
    var email = req.body.email;
    var sdt = req.body.sdt;
    var gioitinh = req.body.gioitinh;
    var sql ="UPDATE accounts SET hoten ='"+hoten+"', email ='"+email+"', gioitinh ='"+gioitinh+"', sdt ='"+sdt+"' WHERE id='"+id+"'";
    con.query(sql, function(err, result){
      if(err) throw(err);
      res.redirect('/user/info');
    });
  });

  app.get('/user/changepassword',isLoggedIn, function(req, res){
   res.render('user/changepassword.ejs',{message: req.flash('')});
 });

  app.post('/user/changepassword',isLoggedIn, urlencodedParser, function(req, res){
    var id = req.user.id;
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var renewpassword = req.body.renewpassword;
    var sql = "SELECT * FROM accounts WHERE id = '"+id+"'";
    con.query(sql, function(err, result){
     if(err) throw(err);
     if(!bcrypt.compareSync(oldpassword, result[0]['password'])){
       res.render('user/changepassword.ejs',{message:'Mật khẩu không đúng!'});
     }
     else{
      if(newpassword!=renewpassword){
        res.render('user/changepassword.ejs',{message:'Mật khẩu nhập lại không khớp!'});
      }
      else{
        newpassword = bcrypt.hashSync(newpassword);
        con.query("UPDATE accounts SET password ='"+newpassword+"' WHERE id='"+id+"'" , function(err, result){
          if(err) throw(err);
          res.redirect('/logout');
        });
      }
    }
  });
  });
};
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();
res.redirect('/login');
}