
const express = require('express');
const router = new express.Router();
const mysqlConnection = require("../../config/dbconfig");
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// basic_details_2
router.post('/adminlogin', (req, res) => {
    var phone = req.body.phone;
    var psw = req.body.password;
    res.type('json')

    mysqlConnection.query('SELECT * FROM admin WHERE phone =? and password =?', [phone, psw], (err, rows, fields) => {
        if (!err)
            if (rows.length > 0) {
                const token = jwt.sign({ id: rows[0].id }, 'the-super-strong-secrect', { expiresIn: '1h' });
                console.log(rows);
                res.send(JSON.stringify({ sts:true, Status: "Logged In", data: rows, token: token }));
            } else {
                res.send(JSON.stringify({ sts:false,res: 'user name or password is wrong' }));
            }
        else
            res.send(JSON.stringify({ sts:false,res: err }));

    });
});
// Banner Start
router.get('/banner', (req, res) => {
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
    mysqlConnection.query('Select * from banner', (err, rows, fields) => {
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
// });

router.delete('/banner/:id', (req, res) => {
    res.type('json')
    if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
    ) {
        return res.send(JSON.stringify({ status: "Error", data: "Please provide token" }));
    }
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect', (err, decoded) => {
        if(err){
            return res.send(JSON.stringify({ status: "Error", data: "Invalid token provided" }));
        }
        console.log(decoded.id);
    mysqlConnection.query('delete from banner where id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send({data : true, res:'Banner Deleted Succesfully'});
        else
            res.send({data:false, res:'Something went wrong! Please try again..'});
    });
    });
});
const bstorage = multer.diskStorage({
    destination: './banner/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const bupload = multer({
    storage: bstorage
})


router.post('/banner',bupload.single('banimage'),  (req, res) => {
    const data = { banimage: req.file.filename};
    console.log(data);
    mysqlConnection.query('insert into banner set?', [data], (err, rows, fields) => {
        res.type('json')

        if (!err)
            res.send(JSON.stringify({ res: 'success', data:true }));
        else
            res.send(JSON.stringify({ res: 'error', data:false }));

    });
});



const epstorage = multer.diskStorage({
    destination: './expert_portfolio/',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }


})

const epupload = multer({
    storage: epstorage
})


router.post('/expert-portfolio',epupload.single('eimage'),  (req, res) => {
    const data = { eimage: req.file.filename, ecategory : req.body.ecategory };
    console.log(data);
    mysqlConnection.query('insert into expert_portfolio set?', [data], (err, rows, fields) => {
        res.type('json')

        if (!err)
            res.send(JSON.stringify({ res: 'success', data:true }));
        else
            res.send(JSON.stringify({ res: 'error', data:false }));

    });
});


router.get('/expert_portfolio/:eid', (req, res) => {
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
    mysqlConnection.query('select * from expert_portfolio where ecategory =?',[req.params.eid], (err, rows, fields) => {
       
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
// });

const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
// const router = new express.Router();
const APP_ID="b61c6409413c4d2fbb7f4288e47aa8d6";
const APP_CERTIFICATE='d214ffc3304a407c85460924e6193e68';
const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, resp) => {
    // set response header
    resp.header('Access-Control-Allow-Origin', '*');
    // get channel name
    const channelName = req.params.channel;
    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
    }
    // get uid
    let uid = req.params.uid;
    if (!uid || uid === '') {
        return resp.status(500).json({ 'error': 'uid is required' });
    }
    // get role
    let role;
    if (req.params.role === 'publisher') {
        role = RtcRole.PUBLISHER;
    } else if (req.params.role === 'audience') {
        role = RtcRole.SUBSCRIBER
    } else {
        return resp.status(500).json({ 'error': 'role is incorrect' });
    }

    // get the expire token
    let expireTime = req.params.expiry;
    if (!expireTime || expireTime === '') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }
    // calculate privilage expire tiime
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;

    // build the token
    const token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    // return the token
    return resp.json({ 'token': token })
}

router.get('/rtc/:channel/:role/:expiry/:uid', nocache, generateAccessToken);

module.exports = router;