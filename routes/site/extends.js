module.exports = function (app) {
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "news"
});
app.post('/comment',urlencodedParser, function(req, res){
	var name = req.body.name;
	var content = req.body.content;
	var id_tin = req.body.id;
	var sql = "INSERT INTO comment (name, content, id_tin) VALUES ('"+name+"','"+content+"','"+id_tin+"')";
	con.query(sql, function(err, result) {
		if (err) throw err;
	});
});
app.post('/search',urlencodedParser, function(req, res){
	var key = req.body.key;
	var sql1 = "SELECT * FROM tin WHERE (noidung LIKE '%"+key+"%') or (tacgia LIKE '%"+key+"%') or (ngaydang LIKE '%"+key+"%') or (tieude LIKE '%"+key+"%') or (trichdan LIKE '%"+key+"%')";
	con.query(sql1, function(err, result){
		if (err) throw err;
		var data_search = result;
		var num_result = data_search.length;
		res.render('site/search.ejs',{data_search:data_search,key:key,num_result:num_result,user:req.user});
	});
});
app.get('/contact', function(req, res){

});
app.get('/introduce', function(req, res){

});
};