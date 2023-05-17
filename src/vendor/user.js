const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../helper/dbconfig");


router.get('/user', (req, res) => {
    mysqlConnection.query('Select * from m_executive', (err, rows, fields) => {
        res.type('json')
        if (!err)
            if (rows && rows.length) {
                res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ data: "No Rows Found" }));
            }
        else
            res.send(JSON.stringify({ data: "error" }));

    });
});


// Get an Employees
router.get('/user/:id', (req, res) => {
    mysqlConnection.query('Select * from m_executive where id = ?', [req.params.id], (err, rows, fields) => {
        res.type('json')

        if (!err)
            if (rows && rows.length) {
                res.send(JSON.stringify({ rowsCount: rows.length, data: rows }));
            } else {
                res.send(JSON.stringify({ data: "No Rows Found" }));
            }
        else
            res.send(JSON.stringify({ data: "error" }));

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

// Insert an basic_details
router.post('/user', (req, res) => {
    const data = req.body;
    console.log(data);
    mysqlConnection.query('insert into m_executive set?', data, (err, rows, fields) => {
        res.type('json')

        if (!err)
            res.send(JSON.stringify({ res: 'success' }));
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});

// basic_details_2
router.post('/userlogin', (req, res) => {
    var phone = req.body.phone;
    var psw = req.body.password;
    res.type('json')
    mysqlConnection.query('SELECT * FROM m_executive WHERE phone =? and password =?', [phone, psw], (err, rows, fields) => {
        if (!err)
            if (rows.length > 0) {
                res.send(JSON.stringify({ rowsCount: rows.length, Status: "Success", data: rows }));
            } else {
                res.send(JSON.stringify({ res: 'user name or password is wrong' }));
            }
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});


module.exports = router;