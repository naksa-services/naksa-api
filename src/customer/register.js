const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
// const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
// const multer = require('multer');
// const path = require('path');



// Customer phone authentictaion
// Vendor phone authentictaion
router.post('/vendorReg1',  (req, res) => {
          const data = req.body;
          console.log(data);
          const otp1 = otpGenerator.generate(4, { upperCaseAlphabets: false,digits:true, lowerCaseAlphabets:false, specialChars: false });
          var otp = data.otp;
          mysqlConnection.query('insert into customer  set?', data, (err, rows, fields) => {
              res.type('json')
      
              if (!err){
              mysqlConnection.query("select * from customer where phone=? ", [data.phone],(err1, rows, fields) => {
                  if(!err1){
      
                  mysqlConnection.query('update customer set otp =? where phone = ?', [otp1, [data.phone]], (err2, rows, fields) => {
                      if(!err2){
                          res.send(JSON.stringify({ status: true, otp : otp1 }));
                      }
                      else{
                          res.send(JSON.stringify({ status: false, res:err }));
                      }
                      
                  })
                  }
              } )
              } 
              else
              res.send(JSON.stringify({ status: false }));
      
          });
      });
      // varify otp
          router.post('/vendor-verify_otp', (req, res) =>{
          var otp = req.body.otp;
          var phone = req.body.phone;
          res.type('json')
          mysqlConnection.query("select * from vendorphone where otp = ? and phone =? ", [otp, phone], (err, rows, fields) => {
              if(!err){
                  if(rows.length >=1){
                      res.send(JSON.stringify({status : true, data:"success"}))
                  }
                  else
                  res.send(JSON.stringify({status : false, data:"error"}));
              }
              else
                  res.send(JSON.stringify({status : false, data:"error"}));
              
          })
          })
module.exports = router;