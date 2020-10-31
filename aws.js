const AWS = require('aws-sdk');
const FORM = require('./writeform');
AWS.config.update({
  "region": "us-east-2",
  "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
  "accessKeyId": "", "secretAccessKey": ""
});
const session = require('express-session');
const express = require('express');
const app=express();
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret',
    cookie: { maxAge: 60000 }}));

let docClient = new AWS.DynamoDB.DocumentClient();
function KiemTraDangNhap(req,res,ThongTinNhapVao, MatKhau) {
  let params = {
    TableName: 'Users'
  };
  let loginPerson = {};
  if (ThongTinNhapVao) {
    if (MatKhau) {
      params.FilterExpression = '#em = :EmailKT';
      params.ExpressionAttributeNames = {'#em': 'Email'};
      params.ExpressionAttributeValues = {':EmailKT': String(ThongTinNhapVao)};
      docClient.scan(params, function onScan(err,data){
        if (err) {
          FORM.PageDangNhapSaiThongTin(res);
          console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
        } 
        else {
          if(data.Items.length>0){
            loginPerson=data;
            if(loginPerson.Items[0].MatKhau===MatKhau){
              if(loginPerson.Items[0].TrangThai==="Kích Hoạt"){
                req.session.User = {
                  name_HT: loginPerson.Items[0].HoTen.toString(),
                  name_DN: loginPerson.Items[0].TenDN.toString()
              }
                if(loginPerson.Items[0].Quyen==="Admin"){     
                  var temp=loginPerson.Items[0].HoTen.toString();               
                  res.writeHead(302, {'Location': '/User'});
                  res.end();
                }
                else{
                  var temp=loginPerson.Items[0].HoTen.toString();
    
                  res.writeHead(302, {'Location': '/User'});
                  res.end();
                }
              }
              else{
                FORM.PageDangNhapChuaKichHoat(res);
              }
              
            }
            else{
              FORM.PageDangNhapSaiMatKhau(res);
            }
          }
          else{
            params.FilterExpression = '#sdt = :SDTDK';
            params.ExpressionAttributeNames = {'#sdt': 'SDT'};
            params.ExpressionAttributeValues = {':SDTDK': String(ThongTinNhapVao)};
            docClient.scan(params, function onScan(err,data){
              if (err) {
                FORM.PageDangNhapSaiThongTin(res);
                console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
              } else {
                if(data.Items.length>0){
                  loginPerson=data;
                  var temp=loginPerson.Items[0].HoTen.toString();
                  if(loginPerson.Items[0].MatKhau===MatKhau){
                    if(loginPerson.Items[0].TrangThai==="Kích Hoạt"){
                      req.session.User = {
                        name_HT: loginPerson.Items[0].HoTen.toString(),
                        name_DN: loginPerson.Items[0].TenDN.toString()
                    }
                      if(loginPerson.Items[0].Quyen==="Admin"){
                        var temp=loginPerson.Items[0].HoTen.toString();
           
                        res.writeHead(302, {'Location': '/admin'});
                        res.end();
                      }
                      else{
                        var temp=loginPerson.Items[0].HoTen.toString();
                 
                        res.writeHead(302, {'Location': '/user'});
                        res.end();
                      }
                    }
                    else{
                      FORM.PageDangNhapChuaKichHoat(res);
                    }
                  }
                  else{
                    FORM.PageDangNhapSaiMatKhau(res);
                  }
                }
                else{
                    FORM.PageDangNhapSaiThongTin(res);
                }
              }
            });
          }
          if (typeof data.LastEvaluatedKey !== 'undefined') {
            console.log('Scanning for more...');
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
          }
        }
      });
    }
  }
  else {
    FORM.PageDangNhapSaiThongTin(res);
  }
}

function LayDanhSachBanBe(res,req,tenChu, tenHT) {
  console.log(tenChu);
  let params = {
    TableName: "DanhBa",
    FilterExpression : '#tt = :TrangThaiKT and #tc = :TenDNKT',
    ExpressionAttributeNames : {'#tt': 'TrangThai', '#tc': 'TenDN' },
    ExpressionAttributeValues : {':TrangThaiKT': String("Đã Chấp Nhận"), ':TenDNKT': String(tenChu)}
    // FilterExpression : '#tt = :TrangThaiKT',
    // ExpressionAttributeNames : {'#tt': 'TrangThai'},
    // ExpressionAttributeValues: {':TrangThaiKT': String("Đã Chấp Nhận")}
  };
  let scanObject = {};
  docClient.scan(params, (err, data) => {
    if (err) {
      scanObject.err = err;
    } else {
      scanObject.data = data;
      FORM.PageUser(req,res,scanObject,tenHT);
    }
  });
}
function TimKiemUser(ThongTinNhapVao,res){
  let params = {
    TableName: 'Users'
  };
  let scanObject = {};
  if (ThongTinNhapVao) {
      params.FilterExpression = '#em = :EmailKT';
      params.ExpressionAttributeNames = {'#em': 'Email'};
      params.ExpressionAttributeValues = {':EmailKT': String(ThongTinNhapVao)};
      docClient.scan(params, function onScan(err,data){
        if (err) {
          FORM.PageDangNhapSaiThongTin(res);
          console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
        } 
        else {
          if(data.Items.length>0){
            scanObject.data = data;
            FORM.writeItemTable(scanObject, res);
          }
          else{
            params.FilterExpression = '#sdt = :SDTDK';
            params.ExpressionAttributeNames = {'#sdt': 'SDT'};
            params.ExpressionAttributeValues = {':SDTDK': String(ThongTinNhapVao)};
            docClient.scan(params, function onScan(err,data){
              if (err) {
                FORM.PageDangNhapSaiThongTin(res);
                console.error('Unable to scan the table. Error JSON:', JSON.stringify(err, null, 2));
              } 
              else {
                if(data.Items.length>0){
                  scanObject.data = data;
                  FORM.writeItemTable(scanObject, res);
                }
              }
          });
        }
      }
    });
  }
}
module.exports = {
  KiemTraDangNhap:KiemTraDangNhap,
  TimKiemUser:TimKiemUser,
  LayDanhSachBanBe:LayDanhSachBanBe
};