const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../helper/dbconfig");

const multer = require('multer');
const path = require('path');


const stoarge = multer.diskStorage({
    destination: './farmer/image/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const upload = multer({
    storage: stoarge
})



router.get('/farmerVisit/:uid', (req, res) => {
    mysqlConnection.query('Select * from farmervisit WHERE uid= ?', [req.params.uid], (err, rows, fields) => {
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
router.get('/farmerVisit/:id/:uid', (req, res) => {
    mysqlConnection.query('Select * from farmervisit where id = ? and uid = ?', [req.params.id, req.params.uid], (err, rows, fields) => {
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
router.post('/farmerVisit', upload.single('image'), (req, res) => {
    console.log("inside function");
    const data = { farmerName: req.body.farmerName, address: req.body.address, phone: req.body.phone, dname: req.body.dname, fieldProduct: req.body.fieldProduct, remark: req.body.remark, image: req.file.filename, uid: req.body.uid, transdate: req.body.transdate };
    console.log(data);
    mysqlConnection.query('insert into farmervisit set ?', [data], (err, rows, fields) => {
        res.type('json')

        if (!err)
            res.send(JSON.stringify({ res: 'success' }));
        else
            res.send(JSON.stringify({ res: 'error' }));

    });
});



module.exports = router;