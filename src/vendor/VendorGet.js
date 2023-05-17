const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
const jwt = require('jsonwebtoken');

router.get('/vendor/:vid', (req, res) => {
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
    mysqlConnection.query('SELEct vpersonaldetails.id, vpersonaldetails.name,vpersonaldetails.email, vpersonaldetails.photo, vofficialdetails.language, vofficialdetails.aboutus, vofficialdetails.audicallprice, vofficialdetails.videocallprice, vexperience.startdate, vexperience.enddate, votherdetails.primaryskills from vpersonaldetails INNER join vofficialdetails on vpersonaldetails.id = vofficialdetails.vid INNER join vexperience on vpersonaldetails.id = vexperience.vid INNER JOIN votherdetails on vpersonaldetails.id = votherdetails.vid where vpersonaldetails.id =?', [req.params.vid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ vendorCount: rows.length, status: true, vdata: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendorpsldtl/:vid', (req, res) => {
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
    mysqlConnection.query('SELECT * from vpersonaldetails where id = ?', [req.params.vid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendoreducation/:id', (req, res) => {
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
    mysqlConnection.query('SELECT * from veducationaldetails where vid =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendorother/:id', (req, res) => {
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
    mysqlConnection.query('SELECT * from votherdetails where vid =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendorofficial/:id', (req, res) => {
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
    mysqlConnection.query('SELECT * from vofficialdetails where vid =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendorexperience/:id', (req, res) => {
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
    mysqlConnection.query('SELECT * from vexperience where vid =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vavailability/:id', (req, res) => {
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
    mysqlConnection.query('SELECT * from veablty  where vid =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendordoc/:id', (req, res) => {
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
    mysqlConnection.query('SELECT * from vendordoc where vid =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/allvendor', (req, res) => {
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
    mysqlConnection.query('select vpersonaldetails.name,vpersonaldetails.photo, vpersonaldetails.id, vofficialdetails.language, votherdetails.primaryskills, vexperience.startdate, vexperience.enddate, vofficialdetails.audicallprice from vpersonaldetails INNER join votherdetails on vpersonaldetails.id = votherdetails.vid INNER join vofficialdetails on vpersonaldetails.id = vofficialdetails.vid inner join vexperience on vpersonaldetails.id = vexperience.vid', (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/venderByCat/:cat', (req, res) => {
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
    mysqlConnection.query('select vpersonaldetails.name, vpersonaldetails.id, vofficialdetails.language, votherdetails.primaryskills, vexperience.startdate, vexperience.enddate, vofficialdetails.audicallprice from vpersonaldetails INNER join votherdetails on vpersonaldetails.id = votherdetails.vid INNER join vofficialdetails on vpersonaldetails.id = vofficialdetails.vid inner join vexperience on vpersonaldetails.id = vexperience.vid where votherdetails.primaryskills = ?', [req.params.cat], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendor/:id', (req, res) => {
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
    mysqlConnection.query('select vpersonaldetails.name,vpersonaldetails.photo,vpersonaldetails.email, vpersonaldetails.id, vofficialdetails.language, votherdetails.primaryskills, vexperience.startdate, vexperience.enddate, vofficialdetails.audicallprice, vofficialdetails.audicallprice, vofficialdetails.videocallprice, vofficialdetails.aboutus from vpersonaldetails INNER join votherdetails on vpersonaldetails.id = votherdetails.vid INNER join vofficialdetails on vpersonaldetails.id = vofficialdetails.vid inner join vexperience on vpersonaldetails.id = vexperience.vid where vpersonaldetails.id =?', [req.params.id], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
// router.get('/rating_review/:vid', async (req, res) => {
//     const vid = req.params.vid;
//     res.type('json')
//     mysqlConnection.query("select * from ratingreview where vid =?", [vid], (err, rows, fields) =>{
//         var data = rows;
//         var onerating;
//         mysqlConnection.query("SELECT COUNT(*) AS onecount FROM ratingreview WHERE vid = ? and rating =?", [vid, '1'],(err1, rows1, fields1) => {
//             onerating = rows1[0].onecount;
//         });
//         mysqlConnection.query("SELECT COUNT(*) AS onecount FROM ratingreview WHERE vid = ? and rating =?", [vid, '2'],(err1, rows1, fields1) => {
//             console.log(rows1[0].onecount);
//         });
//         mysqlConnection.query("SELECT COUNT(*) AS onecount FROM ratingreview WHERE vid = ? and rating =?", [vid, '3'],(err1, rows1, fields1) => {
//             console.log(rows1[0].onecount);
//         });
//         mysqlConnection.query("SELECT COUNT(*) AS onecount FROM ratingreview WHERE vid = ? and rating =?", [vid, '4'],(err1, rows1, fields1) => {
//             console.log(rows1[0].onecount);
//         });
//         mysqlConnection.query("SELECT COUNT(*) AS onecount FROM ratingreview WHERE vid = ? and rating =?", [vid, '5'],(err1, rows1, fields1) => {
//             console.log(rows1[0].onecount);
//         });
//         console.log(onerating + "one rating");
//     })

// });


router.get('/vendor-workportfolio/:vid', (req, res) => {
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
    mysqlConnection.query('select * from vworkportfolio where vid=?', [req.params.vid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/rating-review/:vid', (req, res) => {
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
    mysqlConnection.query('select ratingreview.id, ratingreview.customerid, ratingreview.review, ratingreview.rating, ratingreview.transdate, ratingreview.vid, customer.name, customer.photo from ratingreview INNER join customer on ratingreview.customerid = customer.id where vid =?', [req.params.vid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {
                let sum = 0;
                let i = 0
                for (let item in rows) {
                    // console.log(rows[item].rating)
                    sum = sum + rows[item].rating
                    i = i + 1
                }
                let average = sum / i
                // console.log(average)

                res.send(JSON.stringify({ rowsCount: rows.length, avgrating: average, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});

router.get('/recharge', (req, res) => {
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
    mysqlConnection.query('select * from recharge', (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/gift', (req, res) => {
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
    mysqlConnection.query('select * from gift', (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});
router.get('/vendor-follower/:vid/:follow', (req, res) => {
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
    mysqlConnection.query('select * from vendorfollower where vendorid =? and follow=? ', [req.params.vid, req.params.follow], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});

router.get('/vendor-wallet/:vid', (req, res) => {
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
    mysqlConnection.query('select * from vendorwallet where vid =? ', [req.params.vid], (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {

                res.send(JSON.stringify({ rowsCount: rows.length, status: true, data: rows }));
            } else {
                res.send(JSON.stringify({ status: false, data: "No Rows Found" }));




                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            }
        else
            res.send(JSON.stringify({ status: false, data: "error" }));
    });
});

router.get('/all-vendor', (req, res) => {
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
    mysqlConnection.query('select * from vpersonaldetails ',(err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {
                
                    res.send(JSON.stringify({ rowsCount: rows.length,status:true, data: rows }));
                } else {
                    res.send(JSON.stringify({ status:false,data: "No Rows Found" }));
                            
                       
                    
                
                // res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            } 
        else
            res.send(JSON.stringify({ status:false,data: "error" }));
        });
    });





module.exports = router;