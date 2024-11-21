var express = require("express");
var mysql2 = require("mysql2");
var fileuploader = require("express-fileupload");
const http=require("http");
const nodemailer = require("nodemailer");
var cloudinary = require("cloudinary").v2;
const { resolve } = require("path");
let app = express();
app.listen(2001,function(req,resp){
    console.log("Server Started :-)😎");
})
app.use(express.urlencoded("true"));

app.use(fileuploader());
// let config = {
//     host : "127.0.0.1",
//     user :"root",
//     password :"nitjal@786",
//     database : "project",
//     dateStrings:true
// }

// let config = {
//     host : "b07oscxxxjpuv0m0rqyw-mysql.services.clever-cloud.com",
//     user :"uk6xuqt3rs1gdapb",
//     password :"k3P229OmaOeUbfCdHTHd",
//     database : "b07oscxxxjpuv0m0rqyw",
//     dateStrings:true,
//     keepAliveInitialDelay : 10000,
//     enabledKeepAlive : true,
// }
cloudinary.config({ 
    cloud_name: 'dkxtd1xta', 
    api_key: '325386151966969', 
    api_secret: '2Gk5T0eZCzrXIuoZb9Rexw1Ka5Y' // Click 'View Credentials' below to copy your API secret
});
  
let config = "mysql://avnadmin:AVNS__I576EyDe8P8isTsXf1@mysql-13e0121b-lovishbansal2005-4aad.e.aivencloud.com:12544/defaultdb"
 
var mysql = mysql2.createConnection(config);
mysql.connect(function(err){
    if(err==null)
        console.log("Connected to Database Sucessfully");
    else
    console.log(err.message + "###########");

})
app.get("/", function (req, resp) {
    let path = __dirname + "/public/index2.html";
    resp.sendFile(path);

})

app.get("/insert-values",function(req,resp){
    console.log(req);
   mysql.query("insert into users values (?,?,?,?)",[req.query.txtEmail,req.query.txtPwd,req.query.select,1],function(err){
    if(err==null)
        resp.send("Signup Successfully");
    else
    console.log(err.message);
   }) 
})

app.get("/login-process",function(req,resp)
{
  let emaill = req.query.txtEmaill;
  let pass = req.query.txtPass;

  mysql.query("select * from users where email =? and pwd = ?",[emaill,pass],function(err,result){
    if(err!=null)
    {
        resp.send(err.message);
        return;

    }
    if(result.length==0)
    {
        resp.send("INvalid Id or Password");
        return;
    }
    if(result[0].status==1)
    {
        resp.send(result[0].utype);
        return;
    }
    else
    {
        resp.send("U R Blocked");
        return;
    }
  }
  )
})


app.get("/infu-dash", function(req, resp) {
    let path = __dirname + "/public/infu-dash.html";
    resp.sendFile(path);
    console.log("page connected");
})
app.get("/admin-dash", function(req, resp) {
    let path = __dirname + "/public/admin-dash.html";
    resp.sendFile(path);
    console.log("page connected");
})

app.use(express.static(__dirname+"/public"));
app.get("/inf-profile", function(req, resp) {
    let path = __dirname + "/public/inf-profile.html";
    resp.sendFile(path);
    console.log("page connected");
})
app.use(express.static(__dirname+"/public"));
app.get("/events-manager", function(req, resp) {
    let path = __dirname + "/public/events-manager.html";
    resp.sendFile(path);
    console.log("page connected");
})
app.use(express.static(__dirname+"/public"));
app.get("/admin-users", function(req, resp) {
    let path = __dirname + "/public/admin-users.html";
    resp.sendFile(path);
    console.log("page connected");
})
app.use(express.static(__dirname+"/public"));
app.get("/admin-all-infl", function(req, resp) {
    let path = __dirname + "/public/admin-all-infl.html";
    resp.sendFile(path);
    console.log("page connected");
})
app.use(express.static(__dirname+"/public"));
app.get("/client-profile", function(req, resp) {
    let path = __dirname + "/public/client-profile.html";
    resp.sendFile(path);
    console.log("page connected");
})

app.post("/users-save-process",async function(req,resp){
    let fileName ="";
    if(req.files!=null)
    {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
         req.files.ppic.mv(path);

       await cloudinary.uploader.upload(path)
        .then(function(result){

            fileName = result.url;
        })
    }
    else
    fileName="nopic.jpg";

    mysql.query("insert into iprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[req.body.txtEmail,req.body.txtPwd,fileName,req.body.fname,req.body.lname,req.body.insta,req.body.select.toString(),req.body.txtaddress,req.body.city,req.body.combo,req.body.txtdob,req.body.gender,req.body.txtyoutube,req.body.txtfacebook,req.body.TextArea],function(err){
        if(err==null)
            resp.send("Saved Successfully...");
        else
        resp.send(err.message);
    })
})
app.post("/users-update",function(req,resp){
    console.log(req.body);
    let fileName ="";
    if(req.files!=null)
    {
        fileName = req.files.ppic.name;
        let path = __dirname + "/public/uploads/" + fileName;
        req.files.ppic.mv(path);
    }
    else
    {
        fileName=req.body.hdn;
    }
    mysql.query("Update iprofile set pwd=?,picpath=?,fname=?,lname=?,iname=?,fields=?,address=?,city=?,state=?,dob=?,gender=?,youtube=?,facebook=?,other=? where email=?",[req.body.txtPwd,fileName,req.body.fname,req.body.lname,req.body.insta,req.body.select,req.body.txtaddress,req.body.city,req.body.combo,req.body.txtdob,req.body.gender,req.body.txtyoutube,req.body.txtfacebook,req.body.TextArea,req.body.txtEmail],function(err,result){
        if(err==null)
        {
            if(result.affectedRows>=1)
                resp.send("Updated Successfulyy...");
            else
            resp.send("Invalid Email Id");
        }
        else
        resp.send(err.message);
    })
})

app.get("/search-details",function(req,resp)
{
    let email = req.query.txtEmail;
    mysql.query("select * from iprofile where email = ?",[email],function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);

        resp.send(resultJsonAry);
    })
})
app.get("/post-event",function(req,resp){
    console.log(req);
   mysql.query("insert into events values (null,?,?,?,?,?,?)",[req.query.txtEmail,req.query.txtEvent,req.query.txtdate,req.query.time,req.query.city,req.query.venue],function(err){
    if(err==null)
        resp.send("Succesfully Event Posted");
    else
    console.log(err.message);
   }) 
})

app.get("/update-pwd",function(req,resp){
    console.log(req);
    mysql.query("Update users set pwd=? where email =? ",[req.query.txtNew,req.query.txtemail],function(err,result){
        if(err==null)
        {
            if(result.affectedRows>=1)
            {
                resp.send("Updated Successfully");
            }
            else
            resp.send("Invalid Email ID");
        }
        else
        resp.send(err.message);
    })
})
var mail;
app.get("/forgot-pwd",function(req,resp)
{
    console.log(req);
    let retPwd;
    mail=req.query.Email;
    mysql.query("select pwd from users where email=?",[req.query.mail],function(err,result){
        if(err==null)
        {
            console.log(result[0].pwd);
            retPwd=result[0].pwd;
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "lovishbansal2005@gmail.com",
                    pass: 'fdmk kewi ikdh jzmu'
                }
            });
            var mailOptions = {
                from: 'lovishbansal.com',
                to: req.mail,
                subject: 'Sending Email using Node.js',
                html: "Thank you For placing your order <br>Visit again "+retPwd,
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            resp.send("password retrieved");
        }
        else
        resp.send(err.message);      
    })
})

app.get("/fetch-all",function(req,resp){
    mysql.query("select * from users",function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message)
            return;
        }
        resp.send(resultJsonAry);
    })
})

app.get("/del-one",function(req,resp){
    mysql.query("delete from users where email =?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("Deleted");
    })
})

app.get("/block-one",function(req,resp){
    console.log(req);
    mysql.query("Update users set status =? where email =?",[0,req.query.email],function(err,result){
        
        if(err==null)
        {
            if(result.affectedRows>=1)
                resp.send("Blocked");
            else
            resp.send("Invalid Email Id");
        }
        else
        resp.send(err.message);
    })
})

app.get("/Unblock-one",function(req,resp){
    console.log(req);
    mysql.query("Update users set status =? where email =?",[1,req.query.email],function(err,result){
        
        if(err==null)
        {
            if(result.affectedRows>=1)
                resp.send("UnBlocked");
            else
            resp.send("Invalid Email Id");
        }
        else
        resp.send(err.message);
    })
})

app.get("/show-all",function(req,resp)
{
    mysql.query("select * from iprofile",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/do-find",function(req,resp)
{
    mysql.query("select * from iprofile where fields like ? && city=?",["%"+req.query.fields+"%",req.query.city],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);  
    })
})
app.get("/do-findbyfname",function(req,resp){
    console.log("heyy");
    mysql.query("select*from iprofile where fname like ?",["%"+req.query.fname+"%"],function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/find-influ",function(req,resp){
    mysql.query("select * from iprofile where fields like ?",["%"+req.query.fields+"%"],function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})
app.get("/influ-finder",function(req,resp){
    let path =__dirname +"/public/influ-finder.html";
    resp.sendFile(path);
})

app.get("/fetch-event",function(req,resp)
{
    mysql.query("select * from events where doe>=current_date()",function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        resp.send(resultJsonAry);
    })
})

app.get("/del-one-event",function(req,resp){
    mysql.query("delete from events where email =?",[req.query.email],function(err,resultJsonAry){
        if(err!=null)
        {
            resp.send(err.message);
            return;
        }
        resp.send("Deleted");
    })
})
app.post("/client-save-process",function(req,resp){

    mysql.query("insert into cprofile values(?,?,?,?,?,?)",[req.body.txtEmail,req.body.state,req.body.txtname,req.body.city,req.body.org,req.body.mobile],function(err){
        if(err==null)
            resp.send("Saved Successfully...");
      if(err)
      {
        console.log(err.message);
      }
      else
      {
        resp.redirect("client-dash.html");
      }
    })
})

app.post("/client-update",function(req,resp){
    
    mysql.query("Update cprofile set state=?,name=?,city=?,org=?,mobile=? where email=?",[req.body.state,req.body.txtname,req.body.city,req.body.org,req.body.mobile,req.body.txtEmail],function(err,result){
        if(err==null)
        {
            if(result.affectedRows>=1)
                resp.send("Updated Successfulyy...");
            else
            resp.send("Invalid Email Id");
        }
        else
        resp.send(err.message);
    })
})
app.get("/search-client",function(req,resp)
{
    let cemail=req.query.txtEmail;
    mysql.query("select * from cprofile where email=?",[cemail],function(err,resultJsonAry){
        if(err!=null){
            resp.send(err.message);
            return;
        }
        console.log(resultJsonAry);
        resp.send(resultJsonAry);
    })
})
