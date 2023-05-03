var express = require('express');
var ejs = require('ejs'); //which is gonna allow me pass data to HTML whenever I want
var bodyparser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');


mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project_laravel"
})


var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.listen(3000);   //port number
app.use(bodyparser.urlencoded({extended: true}));
app.use(session({secret:"secret"}));


function isProductInCart(cart, id) {
  
  for (let i=0; i<cart.length; i++) {
    if (cart[i].id == id) {
      return true;
    }
  }
  return false;
}


function calculateTotal(cart, id) {
  total = 0;
  for (let i=0; i<cart.length; i++) {
    //if we're offering a discounted price
    if (cart[i].sale_price) {
      total += (cart[i].sale_price * cart[i].quantity);
    } else {
      total += (cart[i].price * cart[i].quantity);
    }
  }

  req.session.total = total;
  return total;
}


//localhost:3000
app.get('/', function(req, res) {
  // res.render('pages/index');  // dont show whole name of the file like "index.ejs" - NO , just use it pages/index.
  
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project"
  })

  con.query("SELECT * FROM products",(err,result)=>{
    res.render('pages/index',{result:result});
  })

});

app.post('/add_to_post', function(req, res){

  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var sale_price = req.body.sale_price;
  var quantity = req.body.quantity;
  var image = req.body.image;
  // var description = req.body.description;
  var product = {id: id, name:name, price:price, sale_price:sale_price, quantity:quantity, image:image}

  if(req.session.cart) {
    var cart = req.session.cart;
    if (!isProductInCart()) {
      cart.push(product);
    } else {
      req.session.cart = [product];
      var cart = req.session.cart;
    }
  }

  //calculate total
  caculateTotal (cart, req);

  //return to cart page
  res.redirect('/cart');

});
app.get('/cart', function(req, res){

  var cart = req.session.cart;
  var total = req.session.total;

  res.render('/pages/cart',{cart, total:total});

});