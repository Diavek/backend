var express = require('express');
var server = express();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardsModel =mongoose.model('cards', new Schema({
  title: String,
  body: String,
  date: Date,

}, {collection: 'cards'}));


var dburl ="mongodb://dbadmin1:password@localhost:27017/astrolabsdb";
mongoose.connect(dburl, {useMongoClient:true});
mongoose.connection.once('open',function(){
  console.log("DB is connected");

});

server.use('/lib', express.static(__dirname + '/lib')); //whatever is within lib, do not give me 404 error



server.set('view engine', 'ejs');
server.set('port', 3000);
server.listen(3000, function(){
    console.log("Server is running!")
});


server.get('/', function(req, res) {
    res.send("Homepage");
});

server.get('/about', function(req, res) {
    res.send("about us page");
});

server.get('/car', function(req, res) {
    res.send('car')
});

server.get('/car/:brand', function(req, res) {
    res.render('page', {"pageName": req.params.brand});
});

server.get('/app',function(req,res){
  res.render('app')

}
);

server.get('/get-cards', function(req, res){
  cardsModel.find({}, function(err,result){
    if (err) res.send({error:err});
    res.send(result);
  })
})

server.post('/add-card', function(req,res){
  cardsModel.create({
    title:'',
    body:'',
    date: new Date().toLocaleDateString("en-US",{
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour:"2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
      hour12: false
    })
  }, function(err, result){
    res.send(result);
  });
});

server.put('/change-card', function(req,res){
  cardsModel
  .findByIdAndUpdate({
    _id: req.body._id
  }, {
    $set: {
      title: req.body.title,
      body: req.body.body
    }
  }, function(err, result){
    if(err) res.send({error:err})
    res.send(result);
  })
});

server.delete('/delete-card', function(req,res){
  cardsModel
  .findByIdAndRemove({
    _id: req.body._id
  }, function(err, result){
    if(err) res.send({error:err});
    res.send(result);
  })
})



//Catch all
server.get('/*', function(req, res) {
    res.send('404! The page does not exist');
});
