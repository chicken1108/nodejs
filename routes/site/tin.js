module.exports = function(app) {
  var bodyParser = require('body-parser');
  var multer  = require('multer');
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/upload')
    },
    filename: function (req, file, cb) {
      cb(null,file.originalname);
    }
  });

  var upload = multer({ storage: storage });
  var urlencodedParser = bodyParser.urlencoded({ extended: false });
  var mysql = require('mysql');
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "news"
  });
// lấy tất cả dữ liệu trong table danhmuc hiển thị ra index.
app.get('/', function(req, res){
  var sql1 = "SELECT * from danhmuc";
  con.query(sql1, function(err, result) {
    if (err) throw err;
    data_danhmuc = result;
    var id_danhmuc =[];
    data_danhmuc.forEach(function(item){
     id_danhmuc.push(item.id)
   });
    //
    var sql2 = "SELECT * from tin ORDER BY ngaydang DESC limit 12";
    con.query(sql2, function(err, result) {
      if (err) throw err;
      tin_moi = result;
      //
      var danhmuc = [];
      con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[0]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
        if(err) throw err;
        danhmuc.push(result);

        con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[1]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
          if(err) throw err;
          danhmuc.push(result);

          con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[2]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
            if(err) throw err;
            danhmuc.push(result);

            con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[3]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
              if(err) throw err;
              danhmuc.push(result);

              con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[4]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                if(err) throw err;
                danhmuc.push(result);

                con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[5]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                  if(err) throw err;
                  danhmuc.push(result);

                  con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[6]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                    if(err) throw err;
                    danhmuc.push(result);

                    con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[7]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                      if(err) throw err;
                      danhmuc.push(result);

                      con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[8]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                        if(err) throw err;
                        danhmuc.push(result);

                        con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[9]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                          if(err) throw err;
                          danhmuc.push(result);

                          con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[10]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                            if(err) throw err;
                            danhmuc.push(result);

                            con.query("SELECT * from tin WHERE id_danhmuc = '"+id_danhmuc[11]+"' ORDER BY ngaydang DESC limit 3", function(err, result){
                              if(err) throw err;
                              danhmuc.push(result);
                              res.render('home/index.ejs',{data_danhmuc:data_danhmuc,tin_moi:tin_moi,danhmuc:danhmuc,user:req.user});
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// lấy tất cả dữ liệu trong table tin theo id danh mục.
app.get('/tinbydanhmuc/:id', function(req,res){
  var id_danhmuc = req.params.id;
  var sql1 = "SELECT * from tin WHERE id_danhmuc ='"+ id_danhmuc+"'";
  con.query(sql1, function(err, result) {
    if (err) throw err;
    var data1 = result;
    var sql2 = "SELECT * from danhmuc";
    con.query(sql2, function(err, result) {
      if (err) throw err;
      var data2 = result;
      var sql3 = "SELECT ten from danhmuc WHERE id = '"+id_danhmuc+"'";
      con.query(sql3, function(err, result) {
        if (err) throw err;
        var data3 = result;
        res.render('site/tinbydanhmuc.ejs',{data_tin_by_danhmuc:data1,data_danhmuc:data2,ten_danhmuc:data3,user:req.user});
      });
    });
  });
});
// lấy tất cả dữ liệu trong table tin theo id.
app.get('/chitiettin/:id', function(req,res){
  var id_tin = req.params.id;
  // lấy tin theo id
  var sql1 = "SELECT * FROM tin WHERE id = '"+id_tin+"'";
  con.query(sql1, function(err, result) {
    if (err) throw err;
    var data_tin_by_id = result;
    var id_danhmuc = data_tin_by_id[0]['id_danhmuc'];
    //
    var sql2 = "SELECT * from tin WHERE id_danhmuc='"+id_danhmuc+"' and id !='"+id_tin+"' limit 4";
    con.query(sql2, function(err, result){
      if (err) throw err;
      var tin_lien_quan = result;
      //
      var sql3 = "SELECT * from danhmuc";
      con.query(sql3, function(err, result) {
        if (err) throw err;
        var data_danhmuc = result;
        //
        var sql4 = "SELECT * from comment WHERE id_tin='"+id_tin+"'";
        con.query(sql4, function(err, result) {
          if (err) throw err;
          var data_comment = result;
          res.render('site/chitiettin.ejs',{data_tin_by_id:data_tin_by_id,data_danhmuc:data_danhmuc,data_comment:data_comment,data_tin_lien_quan:tin_lien_quan,user:req.user});
        });
      });
    });
  });
});
app.get("/admin/tin",isLoggedIn, checkAdmin, function(req, res, next) {
  var sql1 = "SELECT * from danhmuc";
  con.query(sql1, function(err, result) {
    if (err) throw err;
    var data1 = result;
    var sql2 = "SELECT * from tin";
    con.query(sql2, function(err, result) {
      if (err) throw err;
      var data2 = result;
      res.render('admin/qltin.ejs',{data_danhmuc:data1, data_tin:data2});
    });

  });
});

// chức năng thêm tin của admin
app.post("/admin/tin/themtin",isLoggedIn, urlencodedParser, checkAdmin, upload.single('anh'), function(req, res, next) {
    var tieude = req.body.tieude;
    var trichdan = req.body.trichdan;
    var noidung = req.body.noidung;
    var tacgia = req.body.tacgia;
    var ngaydang = req.body.ngaydang;
    var anh = 'upload/'+req.file.filename;
    var id_danhmuc = req.body.danhmuc_id;
    var sql = "INSERT INTO tin (tieude, trichdan, noidung, anh, tacgia, ngaydang, id_danhmuc) VALUES ('" + tieude + "','" + trichdan + "','" + noidung + "','" + anh + "','" + tacgia + "','" + ngaydang + "','"+ id_danhmuc +"' )";
    con.query(sql, function(err, result) {
      if (err) throw err;
      res.redirect('../../admin/tin');
    });
});
// chức năng xóa tin của admin.
// lấy id tin từ url.
// thực hiện xóa tin theo id.
app.get("/admin/tin/xoatin/:id",isLoggedIn, checkAdmin, function (req, res, next) {
    var id = req.params.id;
    var sql = "DELETE from tin WHERE id ='"+ id +"' ";
    con.query(sql, function(err, result) {
      if (err) throw err;
      res.redirect('../../../admin/tin');
    });
});
// chức năng sửa tin của admin.
// lấy id tin từ url.
// truy vấn dữ liệu lấy toàn bộ dữ liệu theo id tin.
// hiển thị tất cả thông tin trong table bài đăng theo id ra view sua_tin.
app.get("/admin/tin/suatin/:id", isLoggedIn, checkAdmin, function (req, res, next) {
  var id = req.params.id;
  var sql1 = "SELECT * from tin WHERE id ='"+ id +"' ";
  con.query(sql1, function(err, result) {
    if (err) throw err;
    var data1 = result;

    var sql2 = "SELECT * from danhmuc";   
    con.query(sql2, function(err, result) {
      if (err) throw err;
      var data2 = result;
      res.render('admin/sua_tin.ejs',{data_tin:data1,data_danhmuc:data2});
    });
  });
});
// lấy dữ liệu từ form nhập vào 
// tiến hành update dữ liệu lên CSDL
app.post("/admin/tin/suatin", isLoggedIn, urlencodedParser, checkAdmin, upload.single('anh'), function(req, res){ 
    var id = req.body.id;
    var tieude = req.body.tieude;
    var trichdan = req.body.trichdan;
    var noidung = req.body.noidung;
    var tacgia = req.body.tacgia;
    if(req.file!=null)
    {
     var anh = 'upload/'+req.file.filename;
   }
   else
   {
     var anh = req.body.anhcu;
   }
   var id_danhmuc = req.body.id_danhmuc;
   var sql = "UPDATE tin SET tieude ='"+ tieude +"',trichdan ='"+ trichdan +"',noidung ='"+ noidung +"',tacgia ='"+ tieude +"',anh ='"+ anh +"',id_danhmuc ='"+ id_danhmuc +"',tacgia='"+tacgia+"' WHERE id ='"+ id +"' ";
   con.query(sql, function(err, result) {
    if (err) throw err;
    res.redirect('../../../admin/tin');
  });
});
};
// hàm check login 
function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
  return next();
 }
 res.redirect('/login');
}
function checkAdmin(req, res, next){
 if(req.user.level==1){
  return next();
 }
 res.redirect('/');
}