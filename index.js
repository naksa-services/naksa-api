const { json } = require('body-parser');
const express = require('express');
const bodyparser = require('body-parser');
const cors =  require('cors');
var app = express();
app.use(cors());

console.log("working project ");

// image
app.use('/vendor-image', express.static('vendorProfile'));
app.use('/banner', express.static('banner'));
app.use('/vendor-work', express.static('vendorWork'));
app.use('/customer-image', express.static('customerProfile'));
app.use('/portfolio-image', express.static('expert_portfolio'));
//router
const admin = require('./src/admin/adminPost');
const vendor = require('./src/vendor/vendor');
const adminauth = require("./src/admin/adminAuth");
const vendorGet = require("./src/vendor/VendorGet");
const agoraconfig1 = require('./src/AgoraConfig/agoraToken');
const register = require('./src/customer/register');

app.use(bodyparser.json());
app.use('/api/v1',vendor);
app.use('/api/v1',admin);
app.use('/api/v1', adminauth);
app.use('/api/v1', vendorGet)
app.use('api/v1', agoraconfig1)
app.use('api/v1', register);


app.listen(3000);