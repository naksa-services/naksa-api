const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const multer = require('multer');
const path = require('path');
const Razorpay = require('razorpay');
var crypto = require("crypto");
var FCM = require('fcm-node');
var serverKey = 'AAAA9WWgaIo:APA91bEQcS6WddBslCIbVGTdVGXFY-xZYEqkLW0EcrNMpDEgAMHADzenEHmgnyvRO0ZJHXpKDciFm5fk5GxAF_W5fKxJzHhkn_9mbsIn5VgQuP4_jBAmmX9bHAoCfv4cYzGzjQDNl9IF';

router.post('/vendorSkills', (req, res) => {
    const data = req.body;
    res.type('json')
    mysqlConnection.query('select * from vendorSkills where id = ?', [data.id], (err, rows, fields) => {
        if (!err) {
            if (rows.length >= 1) {
                mysqlConnection.query('update vendorSkills set ? where id =  ?', [data, data.id], (err1, rows1, fields) => {
                    if (!err1) {
                        res.send({ status: true, data: "updated" });
                    }
                    else {
                        res.send({ status: false, data: "not updated" });
                    }
                })

            }
            else {
                mysqlConnection.query('insert into vendorSkills set?', data, (err, rows, fields) => {

                    if (!err)
                        res.send(JSON.stringify({ status: true, data: "inserted" }));
                    else
                        res.send(JSON.stringify({ status: err, data: "not inserted" }));

                });
            }
        }
    });
});








// payment gateway and order api
var instance = new Razorpay({ key_id: 'rzp_test_33SOqt1CkQpnYu', key_secret: 'xRqlzjPr1yffVCfhTWuUNZsT' })


// generate order api
router.post('/create/order', (req, res) => {
    const data = req.body;
    res.type('json')
    console.log(data);
    instance.orders.create({
        amount: data.amount,
        currency: data.currency,
        receipt: "receipt#1",

    }, (err, rows, fields) => {
        if (!err) {
            console.log("1");
            mysqlConnection.query('insert into payment_log set ?', data, (err1, rows1, fields1) => {
                if (!err1) {
                    console.log(rows["id"]);
                    mysqlConnection.query('update  payment_log set payment_id = ? where created_at =? and userid =?', [rows["id"], req.body.created_at, req.body.userid], (err2, rows2, fields1) => {
                        if (!err1) {
                            res.send(JSON.stringify({ sts: true, order: rows }));

                        }
                        else {
                            res.send(JSON.stringify({ sts: false, data: err1 }));
                        }
                    });
                }
                else {
                    res.send(JSON.stringify({ status: false, data: err1 }));
                }
            });


        }
        else {
            res.send(JSON.stringify({ status: false, data: "error" }));
        }

    });
});


// verify payment 
router.post("/payment/verify", (req, res) => {
    let body = req.body.order_id + "|" + req.body.payment_id;
    console.log(bpdy);


    var expectedSignature = crypto.createHmac('sha256', 'xRqlzjPr1yffVCfhTWuUNZsT')
        .update(body.toString())
        .digest('hex');
    console.log("sig received ", req.body.signature);
    console.log("sig generated ", expectedSignature);
    var response = { "signatureIsValid": "false" }
    if (expectedSignature === req.body.signature) {
        mysqlConnection.query('select * from payment_log  where payment_id = ?', [req.body.payment_id], (err2, rows2, fields1) => {
            if (!err2) {

                mysqlConnection.query('update  payment_log set updated_at = ?, orderid =?, status =?, signature =? where userid = ?', [req.body.updated_at, req.body.order_id, "success", req.body.signature, req.body.userid], (err1, rows1, fields1) => {
                    if (!err1) {
                        mysqlConnection.query('select * from user_wallet where userid = ?', [req.body.userid], (werr, wrows, fields1) => {
                            console.log("inside tyhis");
                            if (!werr) {

                                if (wrows.length >= 1) {
                                    mysqlConnection.query('update  user_wallet set walletamount =? where userid = ?', [req.body.updated_at, req.body.userid], (werr, wrows, fields1) => {
                                        if (!werr) {
                                            console.log("outside user")
                                            res.send(JSON.stringify({ "orderstatus": "success" }));
                                        }
                                        else {
                                            res.send(JSON.stringify({ "orderstatus": werr }));
                                        }
                                    });
                                }
                                else {
                                    mysqlConnection.query('insert into  user_wallet set ?', req.body, (werr, wrows, fields1) => {
                                        if (!werr) {
                                            console.log("inside user")
                                            res.send(JSON.stringify({ "orderstatus": "success" }));
                                        }
                                        else {
                                            res.send(JSON.stringify({ "orderstatus": werr }));
                                        }
                                    });
                                }
                            }
                            else {
                                res.send(JSON.stringify({ "orderstatus": "failure" }));
                            }
                        });


                    }
                    else {
                        res.send(JSON.stringify({ "orderstatus": "failure" }));
                    }
                });
            }
            else {
                res.send(JSON.stringify({ "orderstatus": "failure" }));
            }
        });


    }

    else
        res.send(JSON.stringify({ "orderstatus": "failure" }));

});

// create-customer-order 
router.post('/new-order', (req, res) => {
    const data = req.body;
    res.type('json');
    mysqlConnection.query("insert into customer_order set ?", data, (err, rows, field) => {
        if (!err) {
            res.send(JSON.stringify({ "data": "created", status: true }))
        }
        else {
            res.send(JSON.stringify({ "data": "failed", status: false }))
        }
    });
});
router.post('/accept-order-vendor/:userid/:vid/:orderid', (req, res) => {
    const createdat = req.body.createdat;
    const orderstatus = req.body.orderstatus;
    const notificationtype = req.body.notificationtype;
    const channelName = req.body.channelName;
    const role = "publisher";
    console.log(createdat);
    res.type('json');
    mysqlConnection.query("select * from customer where id = ?", [req.params.userid], (uerr, [urows], ufields) => {
        if (!uerr) {
            if (urows) {

                try {
                    var fcm = new FCM(serverKey);
                    var notification = {
                        title: 'Order Accepted Successfully',
                        body: 'Your Order has been successfully accepted',

                    }

                    var message = {
                        'notification': notification,
                        'registration_ids': [urows["mob_notification"]],
                        "data": {
                            "notificationtype": notificationtype,
                            "vendorimage": req.params.vid,
                            "channelid": channelName,
                            "vtoken": null,
                            "orderid":req.params.order
                        }
                    };

                    fcm.send(message, function (err, response) {
                        if (!err) {
                            mysqlConnection.query("update customer_order set orderstatus =? where orderid = ?", [orderstatus, req.params.orderid], (err, rows, field) => {
                                if (!err) {
                                    res.send(JSON.stringify({ "data": "accepted", status: true }))
                                }
                                else {
                                    res.send(JSON.stringify({ "data": "failed1", status: false }))
                                }
                            });
                            // });
                        } else {
                            // showToast("Successfully sent with response");
                            res.send(JSON.stringify({ "data": "failed", "status": err }));
                        }
                    })

                } catch (err) {
                    throw err;
                }
            }
        } else {
            res.send(JSON.stringify({ "data": "failed", "status": false }));
        }
    })

});


// accept-order-customer
router.post('/accept-order-customer/:userid/:vid/:orderid', (req, res) => {
    res.type('json');
    const status = req.body.status;
    mysqlConnection.query("update customer_order set customerstatus =? where orderid = ?", [status, req.params.orderid], (err, rows, field) => {
        if (!err) {
            res.send(JSON.stringify({ "data": "received", status: true }))
        }
        else {
            res.send(JSON.stringify({ "data": "failed", status: false }))
        }
    });
});

    // complete-order-vendor
    router.post('/complete-order-vendor/:userid/:vid/:orderid', async (req, res) => {
        const calltime = req.body.calltime;
        const requesttype = req.body.ordertype;
        var a = calltime.split(':'); 
        var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 
        res.type('json');
       await  mysqlConnection.query("select * from vofficialdetails where vid =?", [ req.params.vid], (err, rows, field) => {
            if (!err) {
                let calltimenum = seconds/60;
                let callingamount = calltimenum * parseInt(rows[0]["chatprice"]);
                console.log(calltimenum, callingamount);
                mysqlConnection.query("update customer_order set orderstatus =?,completecalltime=?, callingamount =? where orderid = ?", ["completed",calltime, callingamount, req.params.orderid], (err, rows1, field) => {
                    if (!err) {
                        mysqlConnection.query("select * from vendorwallet where vid =?", [req.params.vid], (verr, vrows, vfields) =>{
                            if(!err){
                                let walletamount = parseInt(vrows[0]["walletamount"]) + callingamount;
                                console.log(walletamount);
                                mysqlConnection.query("update vendorwallet set walletamount =? where vid =?", [walletamount, req.params.vid], (werr, wrows, wfields) =>{
                                    if(!err){
                                        const vpldata = {transectiontype:"credit", vid:req.params.vid, userid:req.params.userid, transdate:Date.now(), amount:callingamount};
                                        mysqlConnection.query("insert into vendor_payment_log set ?", vpldata, (vperr, vprows, vpfileds) =>{
                                            res.send(JSON.stringify({ "data": "completed", status: true }))
                                        })
                                    }
                                    else{
                                        res.send(JSON.stringify({ "data": "failed", status: false }))
                                    }
                                })
                            }
                            else{
                                res.send(JSON.stringify({ "data": "failed", status: false }))
                            }
                        })
                        
                    }
                    else {
                        res.send(JSON.stringify({ "data": "failed", status: false }))
                    }
                });
            }
            else {
                res.send(JSON.stringify({ "data": "failed", status: false }))
            }
        });
    // });



});

// get-vendor-order 

router.get('/get-order/:vid/:status/:date', (req, res) => {
    res.type('json')
    // if (
    //     !req.headers.authorization ||
    //     !req.headers.authorization.startsWith('Bearer') ||
    //     !req.headers.authorization.split(' ')[1]
    // ) {
    //     return res.send(JSON.stringify({ status: "Error", data: "Please provide token" }));
    // }
    // const theToken = req.headers.authorization.split(' ')[1];
    // const decoded = jwt.verify(theToken, 'the-super-strong-secrect', (err, decoded) => {
    //     if(err){ 
    //         return res.send(JSON.stringify({ status: "Error", data: "Invalid token provided" }));
    //     }
    //     console.log(decoded.id);
    mysqlConnection.query('select customer_order.orderid, customer_order.userid, customer_order.vid, customer_order.orderfor, customer_order.createdat, customer_order.orderstatus, customer_order.customerstatus, customer_order.waittime, customer_order.completecalltime, customer_order.callingamount, customer.name, customer.photo,vofficialdetails.audicallprice, vofficialdetails.videocallprice, vofficialdetails.chatprice from customer_order INNER join customer on customer_order.userid = customer.id INNER join vofficialdetails on customer_order.vid = vofficialdetails.vid where customer_order.vid=? and customer_order.orderstatus=? and customer_order.createdat=?', [req.params.vid, req.params.status, req.params.date], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: rows }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({
                status: false, data: err
            }));
    });
});


// get-customer-order
router.get('/get-order-customer/:uid', (req, res) => {
    res.type('json')
    // if (
    //     !req.headers.authorization ||
    //     !req.headers.authorization.startsWith('Bearer') ||
    //     !req.headers.authorization.split(' ')[1]
    // ) {
    //     return res.send(JSON.stringify({ status: "Error", data: "Please provide token" }));
    // }
    // const theToken = req.headers.authorization.split(' ')[1];
    // const decoded = jwt.verify(theToken, 'the-super-strong-secrect', (err, decoded) => {
    //     if(err){ 
    //         return res.send(JSON.stringify({ status: "Error", data: "Invalid token provided" }));
    //     }
    //     console.log(decoded.id);
    mysqlConnection.query('select customer_order.orderid, customer_order.userid, customer_order.vid, customer_order.orderfor, customer_order.createdat, customer_order.orderstatus, customer_order.customerstatus, customer_order.waittime, customer_order.completecalltime, customer_order.callingamount, customer.name, customer.photo,vofficialdetails.audicallprice, vofficialdetails.videocallprice, vofficialdetails.chatprice from customer_order INNER join customer on customer_order.userid = customer.id INNER join vofficialdetails on customer_order.vid = vofficialdetails.vid where customer_order.userid=?', [req.params.uid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({
                status: false, data: err
            }));
    });
});





// get-user-wallet 

router.get('/wallet-amount/:userid', (req, res) => {
    res.type('json')
    // if (
    //     !req.headers.authorization ||
    //     !req.headers.authorization.startsWith('Bearer') ||
    //     !req.headers.authorization.split(' ')[1]
    // ) {
    //     return res.send(JSON.stringify({ status: "Error", data: "Please provide token" }));
    // }
    // const theToken = req.headers.authorization.split(' ')[1];
    // const decoded = jwt.verify(theToken, 'the-super-strong-secrect', (err, decoded) => {
    //     if(err){ 
    //         return res.send(JSON.stringify({ status: "Error", data: "Invalid token provided" }));
    //     }
    //     console.log(decoded.id);
    mysqlConnection.query('select * from user_wallet where userid = ?', [req.params.userid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ walletdata: rows, status: true }));
            } else {
                res.send(JSON.stringify({
                    status: false, walletdata: rows
                }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({
                status: false, data: err
            }));
    });
});



// get-payment-log
router.get('/payment-logs/:userid', (req, res) => {
    res.type('json')
    // if (
    //     !req.headers.authorization ||
    //     !req.headers.authorization.startsWith('Bearer') ||
    //     !req.headers.authorization.split(' ')[1]
    // ) {
    //     return res.send(JSON.stringify({ status: "Error", data: "Please provide token" }));
    // }
    // const theToken = req.headers.authorization.split(' ')[1];
    // const decoded = jwt.verify(theToken, 'the-super-strong-secrect', (err, decoded) => {
    //     if(err){ 
    //         return res.send(JSON.stringify({ status: "Error", data: "Invalid token provided" }));
    //     }
    //     console.log(decoded.id);
    mysqlConnection.query('select * from payment_log where userid = ?', [req.params.userid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ paymentlog: rows, rowsCount: rows.length }));
            } else {
                res.send(JSON.stringify({
                    status: false, paymentlog: rows
                }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({
                status: false, data: err
            }));
    });
});



// get-customer-details by phone  

router.get('/customer-details/:phone', (req, res) => {
    res.type('json')
    // if (
    //     !req.headers.authorization ||
    //     !req.headers.authorization.startsWith('Bearer') ||
    //     !req.headers.authorization.split(' ')[1]
    // ) {
    //     return res.send(JSON.stringify({ status: "Error", data: "Please provide token" }));
    // }
    // const theToken = req.headers.authorization.split(' ')[1];
    // const decoded = jwt.verify(theToken, 'the-super-strong-secrect', (err, decoded) => {
    //     if(err){ 
    //         return res.send(JSON.stringify({ status: "Error", data: "Invalid token provided" }));
    //     }
    //     console.log(decoded.id);
    mysqlConnection.query('select * from customer where id = ?', [req.params.phone], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ data: rows, status: true }));
            } else {
                res.send(JSON.stringify({
                    status: false, data: rows
                }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({
                status: false, data: err
            }));
    });
});
// for customer 



router.post('/customer-reg', (req, res) => {
    const data = req.body;
    console.log(data);
    const otp1 = otpGenerator.generate(4, { upperCaseAlphabets: false, digits: true, lowerCaseAlphabets: false, specialChars: false });
    var otp = data.otp;
    mysqlConnection.query("select * from customer where phone=? ", [data.phone], (err1, rows, fields) => {
        if (!err1) {
            if (rows.length >= 1) {


                mysqlConnection.query('update customer set otp =? where phone = ?', [otp1, [data.phone]], (err2, rows, fields) => {
                    if (!err2) {
                        res.send(JSON.stringify({ status: true, otp: otp1 }));
                    }
                    else {
                        res.send(JSON.stringify({ status: false, res: err2 }));
                    }
                });


            }
            else {
                mysqlConnection.query('insert into customer  set?', data, (err, rows, fields) => {
                    res.type('json')

                    if (!err) {
                        mysqlConnection.query("select * from customer where phone=? ", [data.phone], (err1, rows, fields) => {
                            if (!err1) {

                                mysqlConnection.query('update customer set otp =? where phone = ?', [otp1, [data.phone]], (err2, rows, fields) => {
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
            }
        }
    });
});


// varify otp
router.post('/customer-verify_otp', (req, res) => {
    var otp = req.body.otp;
    var phone = req.body.phone;
    res.type('json')
    mysqlConnection.query("select * from customer where otp = ? and phone =? ", [otp, phone], (err, rows, fields) => {
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

// varify otp
router.post('/customer-profile/:phone', (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var transdate = req.body.transdate;
    res.type('json')
    mysqlConnection.query("update customer set name =?, email=?, dob=?, gender=?, transdate=? where phone=? ", [name, email, dob, gender, transdate, req.params.phone], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "success" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));

    })
})

router.get('/customer-profile/:phone', (req, res) => {

    res.type('json')
    mysqlConnection.query("select * from customer where phone = ?", [req.params.phone], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ rowsCount: rows.length, data: rows }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));

    })
})

const cstorage = multer.diskStorage({
    destination: './customerProfile/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const cupload = multer({
    storage: cstorage
})
router.post('/customer-pic/:phone', cupload.single('photo'), (req, res) => {
    var profilepic = req.file.filename;
    res.type('json')
    mysqlConnection.query("update customer set photo =? where phone=? ", [profilepic, req.params.phone], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ status: true, data: "success" }))

        }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));

    })
})
router.post('/vendorLogin', (req, res) => {
    var phone = req.body.phone;
    var psw = req.body.password;
    res.type('json')
    mysqlConnection.query('SELECT * FROM vpersonaldetails WHERE phone =? and password =?', [phone, psw], (err, rows, fields) => {
        if (!err)
            if (rows.length > 0) {
                const token = jwt.sign({ id: rows[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
                res.send(JSON.stringify({ sts: true, Status: "Logged In", token: token, rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ res: 'user name or password is wrong' }));
            }
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});
// FAQ Type Section


// Add || Update FAQ
router.post('/faqtype', (req, res) => {
    var data = req.body;
    res.type('json');
    mysqlConnection.query("select * from faqtype where id =?", [data.id], (serr, srows, sfields) => {
        if (!serr) {
            if (srows.length >= 1) {
                mysqlConnection.query('update faqtype set faqtypename =? where id =?', [data.faqtypename, data.id], (err, rows, fields) => {
                    if (!err) {
                        res.send(JSON.stringify({ sts: true, data: "updated" }));
                    }
                    else {
                        res.send(JSON.stringify({ sts: false, data: "failed" }));
                    }
                });
            }
            else {
                mysqlConnection.query('insert into faqtype set?', data, (err, rows, fields) => {
                    if (!err) {
                        res.send(JSON.stringify({ sts: true, data: "inserted" }));
                    }
                    else {
                        res.send(JSON.stringify({ sts: false, data: "failed" }));
                    }
                });
            }
        }
    })
});

// Get FAQTYpe 
router.get('/faqtype', (req, res) => {
    res.type('json');
    mysqlConnection.query("select * from faqtype", (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ sts: true, data: rows }));
        }
        else {
            res.send(JSON.stringify({ sts: false, data: rows }));
        }
    })
})

// Delete FAQTYPE
router.delete('/faqtype/:id', (req, res) => {
    res.type('json');
    mysqlConnection.query("delete  from faqtype where id =?", [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ sts: true, data: "deleted" }));
        }
        else {
            res.send(JSON.stringify({ sts: false, data: "failed" }));
        }
    })
})
// FAQ Section


// Add || Update FAQ
router.post('/faq', (req, res) => {
    var data = req.body;
    res.type('json');
    mysqlConnection.query("select * from faq where id =?", [data.id], (serr, srows, sfields) => {
        if (!serr) {
            if (srows.length >= 1) {
                mysqlConnection.query('update faq set faqtypeid =?, faqname=?, faqdesc=?, transdate=? where id =?', [data.faqtypeid, data.faqname, data.faqdesc, data.transdate, data.id], (err, rows, fields) => {
                    if (!err) {
                        res.send(JSON.stringify({ sts: true, data: "updated" }));
                    }
                    else {
                        res.send(JSON.stringify({ sts: false, data: "failed" }));
                    }
                });
            }
            else {
                mysqlConnection.query('insert into faq set?', data, (err, rows, fields) => {
                    if (!err) {
                        res.send(JSON.stringify({ sts: true, data: "inserted" }));
                    }
                    else {
                        res.send(JSON.stringify({ sts: false, data: "failed" }));
                    }
                });
            }
        }
    })
});

// Get FAQT 
router.get('/faq/:id', (req, res) => {
    res.type('json');
    mysqlConnection.query("select * from faq where faqtypeid=?", [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ sts: true, data: rows }));
        }
        else {
            res.send(JSON.stringify({ sts: false, data: rows }));
        }
    })
})

// Delete FAQTYPE
router.delete('/faq/:id', (req, res) => {
    res.type('json');
    mysqlConnection.query("delete  from faq where id =?", [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(JSON.stringify({ sts: true, data: "deleted" }));
        }
        else {
            res.send(JSON.stringify({ sts: false, data: "failed" }));
        }
    })
})

module.exports = router;