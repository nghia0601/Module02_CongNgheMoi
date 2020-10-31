const http = require('http');
const url = require('url');
const port = 3000;
const FORM = require('./writeform');
const DATA = require('./aws');
const session = require('express-session');
const express = require('express');
const app=express();
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret',
    cookie: { maxAge: 60000 }}));

var nameUserHT;
app.get('/',(req,res) =>{
    FORM.PageDangNhap(res);
    res.end();
})
app.get('/login',function(req,res){
    var InfoLogin= req.query.InfoLogin;
    var MatKhau= req.query.MatKhau;
    DATA.KiemTraDangNhap(req,res,InfoLogin,MatKhau);
})
app.get('/User',(req,res) =>{
    // if(req.session.User)
    // {
    //     nameUserHT = req.session.User.name_HT;
    // }
   // console.log(nameUser);
    // FORM.PageUser(req,res,nameUserHT);
    DATA.LayDanhSachBanBe(res,req,req.session.User.name_DN, req.session.User.name_HT);
})
app.listen(port,function(){
    console.log(`Server starting at port ${port} `);
})
