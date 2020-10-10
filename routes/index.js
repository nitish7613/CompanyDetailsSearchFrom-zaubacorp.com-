var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
const MongoClient=require('mongodb').MongoClient;
const assert=require('assert');
var router = express.Router();

const url1='mongodb://localhost:27017/';
/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Search Your Company' });
});

router.post('/company', function(req, res){
    var ani= [];
	cname = (req.body.cname);
	url = 'https://www.zaubacorp.com/companysearchresults/' + JSON.stringify(cname);
	console.log(url);
	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			var title;

   

	    if($('#results').length != 0){
    	console.log("inif");
    	$('#results').filter(function(){
    	var data = $(this);
    	console.log("here");
    	url = data.find("a").first().attr("href");
    	console.log("hahf");
    	console.log(url);
    	request(url, function(error, response, html){
    		if(!error){
    			var $ = cheerio.load(html);
    			var table;
    			$('html').filter(function(){
    				var html = $(this);
    				title = html.find('title').first().html();
    				cin = (html.find('thead').first().html());
    			})
           
   MongoClient.connect(url1, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  var myobj = { cname: cname, cin: cin };

  dbo.collection("company-data").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
});
 dbo.collection("company-data").find({}, function(err, result) {
    if (err) throw err;
    result.forEach((doc,err)=>{
        assert.equal(null,err);
        var abs= "<tr><td>Company</td><td>"+doc.cname+"</td></tr>"+doc.cin;
        ani.push(abs);
        },()=>{
            db.close();
                res.render('data',{title: title,items:ani});
        });
    

    
});

  
});
    
       

               console.log(table);
    			
    		}            
    	})
       // json.title = title;
       // json.release = release;
   })
    }
    else
    	res.status(404).send('Company Not Found!');

    }
})
});

	module.exports = router;


      //<tr>
        //  <td><p>Foreign Company Registration Number</p></td>
          //<td><p><a href="https://www.zaubacorp.com/company/TATA-LIMITED/F02452">F02452</a></p></td>
        //</tr>
