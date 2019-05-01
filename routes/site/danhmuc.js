module.exports = function(app) {
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "news"
});

app.get("/admin/danhmuc",isLoggedIn, function(req, res) {
  if(req.user.level==1){

    var sql = "SELECT * from danhmuc";
    con.query(sql, function(err, result) {
      if (err) throw err;
        // lấy danh sách danh muc
        res.render("admin/danhmuc.ejs", { data: result });
      });
  }
  else{
    res.redirect('/');
  }
});

// thêm danh mục
// app.get('/admin/danhmuc/add', function(req, res) {
//     res.render('add_danhmuc');
// });
app.post("/admin/danhmuc/themdanhmuc",isLoggedIn, urlencodedParser, function(req, res) {
  if(req.user.level==1){
    var ten = req.body.ten;
    console.log(ten);
    var sql = "INSERT INTO danhmuc (ten) VALUES ('" + ten + "')";
    con.query(sql, function(err, result) {
        if (err) throw err;
        res.redirect('../../admin/danhmuc');
    });
  }
  else{
    res.redirect('/');
  }
});

// xóa danh mục 
app.post("/admin/danhmuc/xoadanhmuc",isLoggedIn, urlencodedParser, function(req, res) {
  if(req.user.level==1){
    var id = req.body.id;
    var sql = "DELETE  from danhmuc WHERE id ='" + id + "'";
    con.query(sql, function(err, result) {
        if (err) throw err;
        res.redirect('../../../admin/danhmuc');
    });
  }
  else{
    res.redirect('/');
  }
});

app.post("/admin/danhmuc/suadanhmuc",isLoggedIn, urlencodedParser, function(req, res) {
  if(req.user.level==1){
    var ten = req.body.ten;
    var id = req.body.id;
    var sql = "UPDATE danhmuc set ten = '" + ten + "' WHERE id ='" + id + "'";
    con.query(sql, function(err, result) {
        if (err) throw err;
        res.redirect('../../admin/danhmuc');
    });
  }
  else{
    res.redirect('/');
  }
});

};
function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
   {
    return next();
  }
  else
  {

   res.redirect('/login');
  }
 }