const mysql=require('mysql2');
const express=require('express');
var app=express();
const path = require('path');
const parser=require('body-parser');
var fs=require('fs');
app.use(parser.json());
app.use(express.urlencoded());
app.use(express.static('/'));
app.use(express.static(__dirname+'/public'));

var currentdate = new Date(); 
var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();

var Id;

var connection=mysql.createConnection(
    {
        host:'127.0.0.1',
        user:'root',
        password:'mysql@gauri16',
        database:'blockchainhackathon'
});
connection.connect((err)=>
    {
        if(!err)
        console.log('DB Connected...');
        else
        console.log('Error1');
})

app.listen(5800,()=>console.log('Server Startred...'));



app.post('/reg',(req,res)=>
{
    console.log("hii");
    //console.log(req.body);
    
    var creator = req.body.creator;
    var cname = req.body.name;
   var phone = req.body.phone;
   var email = req.body.email;
   var cryptId = req.body.cryptId;
   var pswd = req.body.pswd;

   var sql;
    if(creator=="yes")
     sql=`insert into creatorinfo (name, phone, email, cryptId, pswd) values ("${cname}", "${phone}", "${email}", "${cryptId}", "${pswd}") `;
    else
     sql=`insert into userinfo (name, email, pswd, cryptId, phone) values ( "${cname}", "${email}", "${pswd}", "${cryptId}", "${phone}")`;

    
    connection.query(sql, function(err, result) {
          if (err) throw err;
          else{
          
          console.log('record inserted');

          if(creator=="yes")
          res.redirect("http://127.0.0.1:5800/content");
          else
          res.redirect("http://127.0.0.1:5800/index");

          }
       
        })
   
})

app.post('/con',(req,res)=>
{
    console.log("hii");
    var profilepic=req.body.profilepic;
    var weblink=req.body.weblink;
    var insta=req.body.insta
    var facebook=req.body.facebook
    var twitter=req.body.twitter
    var youtube=req.body.youtube
    

    sql=`insert into content (creatorId, profilepic, weblink, insta, facebook, twitter, youtube) values ( "${Id}", "${profilepic}", "${weblink}", "${insta}", "${facebook}", "${twitter}", "${youtube}")`;

    
    connection.query(sql, function(err, result) {
          if (err) throw err;
          else{          
          console.log('record inserted');
          res.redirect("http://127.0.0.1:5800/content");

          }
       
        })
   
})

app.post('/log',function(req,res){

    var creator = req.body.creator;
    var email = req.body.email;
    var password = req.body.pswd;

    if(creator=="yes"){
        
    var sql = connection.query('Select * from creatorinfo where email = ? and pswd = ?',[email,password],function(err,results,fields){
        if (err) throw err;
        
        if(results.length > 0){
            console.log('Logged In successfully');
            connection.query("select creatorId from creatorinfo where email = ?",[email], function(err, id){
                if(err) {
                  throw err;
                } else {
                  setValuecreator(id);
                }
              });
            res.redirect('http://127.0.0.1:5800/content');
        }
        else{
            console.log("User doesn't exist");
        }
    })
}

else{

    var sql = connection.query('Select * from userinfo where email = ? and pswd = ?',[email,password],function(err,results,fields){
        if (err) throw err;
        
        if(results.length > 0){
            console.log('Logged In successfully');
            connection.query("select userId from userinfo where email = ?",[email], function(err, id){
                if(err) {
                  throw err;
                } else {
                  setValueuser(id);
                }
              });
            res.redirect('http://127.0.0.1:5800/index');
        }
        else{
            console.log("User doesn't exist");
        }
    })

}
    });

async function setValuecreator(value) {
    var someVar = value;
    Id= someVar[0].creatorId;
    console.log(Id);
    }

async function setValueuser(value) {
    var someVar = value;
    Id= someVar[0].userId;
    console.log(Id);
    }    

app.get('/index',(req,res)=>
{
    res.sendFile(__dirname +'/index.html');
});

app.get('/content',(req,res)=>
{
    res.sendFile(__dirname +'/Content.html');
});

app.get('/lsg',(req,res)=>
{
    res.sendFile(__dirname +'/loginSignup.html');
});

app.get('/tran',(req,res)=>
{
    res.sendFile(__dirname +'/Transaction.html');
});

app.get('/alltrans',(req,res)=>
{
    res.sendFile(__dirname +'/alltrans.html');
});

app.get('/creatorprofile', function(req, res) {
    //var usrid=req.session.usrid;
      var sql='SELECT ci.name, ci.cryptId, c.profilepic, c.weblink from creatorinfo as ci inner join content as c on ci.creatorId = c.creatorId';
      connection.query(sql, function (err, rows, fields) {
        if(!err)
        res.send(rows);
        else
        console.log('Error in Displaying')
    });
  });


  app.get('/alltransactions', function(req, res) {
    //var usrid=req.session.usrid;
    //transactionId, amount, dateTime, userCryptadd, creatorCryptadd, userId, creatorId


    var sql = connection.query('SELECT transactionId, amount, dateTime, creatorCryptadd from transactions where userId =?',[Id],function(err,rows,fields){    

        if (err) throw err;
        res.send(rows);      
        
    });
  });

  app.get('/transfer/:cryptId',(req,res)=>
    {   
        
       var cryptId = req.params.cryptId;    
       console.log(cryptId);
       res.sendFile(__dirname +'/Transaction.html');
        
    })

//   app.get('/creatorprofile',(req,res)=>
//     {
//         connection.query("SELECT count(*) as totalTrans, date,day, sum(amount) as totalAmount from expenses where userId = ? group by date;",[Id],(err,rows,fields)=>
//         {
//             if(!err)
//             res.send(rows);
//             else
//             console.log('Error in Displaying')

//         })
//     })
