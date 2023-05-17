const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const multer = require('multer');
const path = require('path');

const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');



// Vendor phone authentictaion
router.post('/vendorReg', (req, res) => {
    const data = req.body;
    console.log(data);
    const otp1 = otpGenerator.generate(4, { upperCaseAlphabets: false, digits: true, lowerCaseAlphabets: false, specialChars: false });
    var otp = data.otp;
    mysqlConnection.query('insert into vendorphone  set?', data, (err, rows, fields) => {
        res.type('json')

        if (!err) {
            mysqlConnection.query("select * from vendorphone where phone=? ", [data.phone], (err1, rows, fields) => {
                if (!err1) {

                    mysqlConnection.query('update vendorphone set otp =? where phone = ?', [otp1, [data.phone]], (err2, rows, fields) => {
                        if (!err2) {
                            res.send(JSON.stringify({ status: true, otp: otp1 }));
                        }
                        else {
                            res.send(JSON.stringify({ status: false, res: err }));
                        }

                    })
                }
            })
        }
        else
            res.send(JSON.stringify({ status: false }));

    });
});
// varify otp
router.post('/vendor-verify_otp', (req, res) => {
    var otp = req.body.otp;
    var phone = req.body.phone;
    res.type('json')
    mysqlConnection.query("select * from vendorphone where otp = ? and phone =? ", [otp, phone], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                res.send(JSON.stringify({ status: true, data: "success" }))
            }
            else
                res.send(JSON.stringify({ status: false, data: "error" }));
        }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));

    })
})

// vendor experience details

router.post('/vendorexp', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from vexperience where vid = ?', [data.vid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update vexperience set ? where vid =  ?', [data, data.vid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into vexperience set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});

// vendor official details

router.post('/vendorofcdtl', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from vofficialdetails where vid = ?', [data.vid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update vofficialdetails set ? where vid =  ?', [data, data.vid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into vofficialdetails set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: false, data: "not inserted" }));

                });
            }
        }
    });
});

// vendor other details
router.post('/vendorotherdtl', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from votherdetails where vid = ?', [data.vid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update votherdetails set ? where vid =  ?', [data, data.vid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into votherdetails set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});

// vendor personal details

router.post('/vendorpsldtl', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from vpersonaldetails where id = ?', [data.id], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update vpersonaldetails set ? where id =  ?', [data, data.id], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated", resp: rows[0].id });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into vpersonaldetails set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted", resp: rows.insertId }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});
// Vendor educational details



router.post('/vendoreducation', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from veducationaldetails where vid = ?', [data.vid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update veducationaldetails set ? where vid =  ?', [data, data.vid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into veducationaldetails set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});


// vendor documents 

router.post('/vendordoc', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from vendordoc where vid = ?', [data.vid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update vendordoc set ? where vid =  ?', [data, data.vid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into vendordoc set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});
router.post('/vendorablty', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from veablty where vid = ?', [data.vid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update veablty set ? where vid =  ?', [data, data.vid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into veablty set ?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});


// Vendor follower

router.post('/vendor-follower', (req, res) => {
    const customerid = req.body.customerid;
    const vendorid = req.body.vendorid;
    const follow = 'true';
    res.type('json')
    mysqlConnection.query('select * from vendorfollower where vendorid = ? and customerid =?', [vendorid, customerid], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update vendorfollower set follow=? where vendorid = ? and customerid =?', [rows[0].follow === 'true' ? 'false' : 'true', vendorid, customerid], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                var sqlquery = "insert into  vendorfollower (customerid, vendorid, follow) values (" + customerid + "," + vendorid + ",'true')";
                mysqlConnection.query(sqlquery, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});



// vendor follower checker

router.get('/customer-following/:vid/:cid/:follow', (req, res) => {
    res.type('json');
    mysqlConnection.query("select * from vendorfollower where vendorid =? and customerid =? and follow = ?", [req.params.vid, req.params.cid, req.params.follow], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ rowsCount: rows.length, data: rows, status: true }));
        }
        else {
            res.send(JSON.stringify({ rowsCount: rows.length, data: rows, status: false }));
        }
    })
})



// customer-following-record
router.get('/customer-following-vendor/:cid/:follow', (req, res) => {
    res.type('json');
    mysqlConnection.query("select vendorfollower.vendorid, vendorfollower.follow,vendorfollower.customerid, vendorfollower.id, vpersonaldetails.name, vpersonaldetails.photo, vofficialdetails.language, vexperience.startdate, vexperience.enddate, votherdetails.primaryskills from vendorfollower INNER Join vpersonaldetails on vpersonaldetails.id = vendorfollower.vendorid INNER JOIN vofficialdetails on vofficialdetails.vid = vendorfollower.vendorid inner join vexperience on vexperience.vid = vendorfollower.vendorid INNER JOIN  votherdetails on votherdetails.vid = vendorfollower.vendorid where vendorfollower.customerid = ? and vendorfollower.follow = ?;", [req.params.cid, req.params.follow], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ rowsCount: rows.length, data: rows, status: true }));
        }
        else {
            res.send(JSON.stringify({ rowsCount: rows.length, data: rows, status: false }));
        }
    })
})


// vendor profile 
const vstorage = multer.diskStorage({
    destination: './vendorProfile/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const vupload = multer({
    storage: vstorage
})
router.post('/vendor-pic/:phone', vupload.single('photo'), (req, res) => {
    var profilepic = req.file.filename;
    res.type('json')
    mysqlConnection.query("update vpersonaldetails set photo =? where phone=? ", [profilepic, req.params.phone], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "success" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));

    })
})

const wstorage = multer.diskStorage({
    destination: './vendorWork/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const wupload = multer({
    storage: wstorage
})
router.post('/vendor-workportfolio', wupload.single('photo'), (req, res) => {
    var profilepic = req.file.filename;
    // res.type('json')
    mysqlConnection.query("insert into vworkportfolio(photo, vid) values(?,?)", [profilepic, req.body.vid], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "success" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));

    })
})

// update vendor profile 
router.post('/vendor-profile/:phone', (req, res) => {
    var data = [req.body.name, req.body.email, req.body.address, req.body.city, req.body.state, req.body.pincode, req.body.distric, req.body.password];
    res.type('json')
    mysqlConnection.query("update vpersonaldetails set name =?, email=?, address=?, city=?, state=?, distric=?,pincode=?, password=? where phone=? ", [data.name, data.email, data.address, data.city, data.state, data.distric, data.pincode, data.password, req.params.phone], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "updated" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "failed" }));

    })
})
// request Money vendor

router.post('/vendor-money-request', (req, res) => {
    var data = req.body;
    res.type('json')
    mysqlConnection.query("insert into requestmoneyvendor set ?", data, (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "inserted" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "failed" }));

    })
})

// update vendor money request 
router.post('/vendor-money-request/:vid', (req, res) => {

    res.type('json')
    mysqlConnection.query("update requestmoneyvendor set reqstatus =?, amountstatus =? where vid=?", [req.body.reqstatus, req.body.amountstatus, req.params.vid], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "updated" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "failed" }));

    })
})
// update vendor money request 
router.post('/naksa-support', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query("insert into  supportnaksa set ?", data, (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "inserted" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: err }));

    })
})
// / initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        host: 'mail.babylionstore.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'info@babylionstore.com',
            pass: '*-4IVKV?cHA?'
        }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))


var mailOptions = {
    from: '"info" <info@babylionstore.com>', // sender address
    to: 'rakleservice@gmail.com', // list of receivers
    subject: 'Welcome!',
    template: 'email', // the name of the template file i.e email.handlebars
    context: {
        name: "Rohit", // replace {{name}} with Adebola
    }
};

// trigger the sending of the E-mail

router.get('/send-mail', (req, res) => {
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
})
module.exports = router;