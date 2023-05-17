const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
const jwt = require('jsonwebtoken');


router.get('/veducationalDetails', (req, res) => {
    mysqlConnection.query('Select * from veducationaldetails', (err, rows, fields) => {
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





module.exports = router;