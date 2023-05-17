const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
const jwt = require('jsonwebtoken');


router.get('/vendorpDetails', (req, res) => {
    mysqlConnection.query('Select * from vpersonaldetails', (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {
                res.send(JSON.stringify({ status: "Success", rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ status: "Error", data: "No Rows Found" }));
            }
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});


// Get an Employees
router.get('/vendorpDetails/:id', (req, res) => {
    mysqlConnection.query('Select * from vpersonaldetails where id = ?', [req.params.id], (err, rows, fields) => {
        res.type('json')

        if (!err)
            if (rows && rows.length) {
                res.send(JSON.stringify({ status: "Success", rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ status: "Error", data: "No Rows Found" }));
            }
        else
            res.send(JSON.stringify({ status: "Error", data: "error" }));

    });
});

// // Delete an Employees
// router.delete('/persons/:id', (req, res) => {
//     mysqlConnection.query('delete from persons where PersonID = ?', [req.params.id], (err, rows, fields) => {
//         if (!err)
//             res.send('Person Deleted Succesfully');
//         else
//             console.log(err);

//     });
// });



// basic_details_2
router.post('/vendorLogin', (req, res) => {
    var phone = req.body.phone;
    var psw = req.body.password;
    res.type('json')
    mysqlConnection.query('SELECT * FROM vpersonaldetails WHERE phone =? and password =?', [phone, psw], (err, rows, fields) => {
        if (!err)
            if (rows.length > 0) {
                const token = jwt.sign({ id: rows[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
                res.send(JSON.stringify({ sts: true, token: token, rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ res: 'user name or password is wrong' }));
            }
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});


module.exports = router;