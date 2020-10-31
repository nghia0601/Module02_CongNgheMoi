const { Console } = require('console');
const fs = require('fs');
const session = require('express-session');
const express = require('express');
const app=express();
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'somesecret',
    cookie: { maxAge: 60000 }}));
    
function PageDangNhap(res,obj) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(data);
}
function PageUser(req,res,obj, nameUser) {
  let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  let strInputNameUser = '<span class="menu-collapsed"></span>';
  let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
  data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);

  let strInputBanBe = '<div class="control-group" id="tu"></div>';
  let indexBanBe = data.indexOf(strInputBanBe)+ strInputBanBe.length - 6;
  let str = "";
  str += "<table>";
  str += "<tbody>";
    obj.data.Items.forEach((DanhBa) => {
      str = str + `<div class="ds" style="padding-top: 10px;border-bottom: 1px solid rgb(134, 134, 125);">
      <a id="dskb" style="color: black;"><div> <i class="fa fa-user fa-2x"></i> <span style="color: black;margin:10px;">${DanhBa.BietDanh}</span></div></a>
   </div>`;
    });
    str += "</tbody>";
    str += "</table>";
    data=data.substr(0, indexBanBe)+str+data.substr(indexBanBe); 
  res.write(data);
}
// function PageUser(req,res,nameUser) {
//   let data = fs.readFileSync('Views/PageUser.html', 'utf-8');
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   let strInputNameUser = '<span class="menu-collapsed"></span>';
//   let indexNameUser = data.indexOf(strInputNameUser) + strInputNameUser.length - 7;
//   data = data.substr(0, indexNameUser)  + nameUser +  data.substr(indexNameUser);
//   res.write(data);
// }
function insertDangNhapLoi(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Sai thông tin đăng nhập, vui lòng kiểm tra lại</h5> ` + data.substr(indexName);
}
function PageDangNhapSaiMatKhau(res) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertDangNhapSaiMatKhau(data);
  res.write(data);
}
function PageDangNhapSaiThongTin(res) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertDangNhapSaiEmailHoacSDT(data);
  res.write(data);
}
function insertDangNhapSaiMatKhau(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Mật khẩu sai vui lòng kiểm tra lại</h5> ` + data.substr(indexName);
}
function insertDangNhapSaiEmailHoacSDT(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Thông tin đăng nhập sai vui lòng kiểm tra lại</h5> ` + data.substr(indexName);
}
function PageDangNhapChuaKichHoat(res) {
  let data = fs.readFileSync('Views/PageDangNhap.html', 'utf-8');
  res.writeHead(200, {'Content-Type': 'text/html'});
  data = insertDangNhapChuaKichHoat(data);
  res.write(data);
}
function insertDangNhapChuaKichHoat(data) {
  let strInputName = '<button type="submit" class="loginhny-btn btn">Đăng Nhập</button>';
  let indexName = data.indexOf(strInputName);
  return data.substr(0, indexName) + ` <h5 style="color:red;">Tài khoản chưa được kích hoạt</h5> ` + data.substr(indexName);
}
function WriteTable_DanhSachBanBe(obj, res) {
  console.log(obj.length);
  res.write('<table>');
  //res.write('<table class="table table-striped table-bordered table-list" border="1px solid black" style="margin-left:250px;width:80%;"><thead> <tr> <th>Họ tên</th><th style="width:auto;">Số Điện Thoại</th> <th style="width:auto;">Giới Tính</th><th style="width:auto;">Gmail</th><th style="width:auto;">Quyền</th><th style="width:auto;">Trạng Thái</th><th colspan="2" style="width:auto;"></th> </tr></thead> ');
  if (obj.err) {
    res.write(`<h5 style="color:red;">Error:: ${obj.err}</h5>`);
    res.write('<tr><td colspan="5">Nothing to show</td></tr>');
  } else {
    if (obj.data.Items.length === 0) {
      res.write('<tr><td colspan="5">Nothing to show</td></tr>');
    }
    obj.data.Items.forEach((user) => {
      res.write(`
      <td>${user.TenKhach}</td>`);   
    });
  }
  res.write('</table>' );
  res.end();
}
module.exports = {
  PageDangNhap: PageDangNhap,
  PageUser:PageUser,
  insertDangNhapChuaKichHoat:insertDangNhapChuaKichHoat,
  PageDangNhapSaiThongTin:PageDangNhapSaiThongTin,
  PageDangNhapSaiMatKhau:PageDangNhapSaiMatKhau,
  PageDangNhapChuaKichHoat:PageDangNhapChuaKichHoat,
  insertDangNhapLoi:insertDangNhapLoi,
  WriteTable_DanhSachBanBe:WriteTable_DanhSachBanBe,

};
