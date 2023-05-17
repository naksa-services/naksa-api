const express = require('express')
const { RtcTokenBuilder, RtcRole } = require('agora-access-token')
const router = new express.Router();
const APP_ID = process.env.APP_ID;
const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
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
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
    // return the token
    return resp.json({ 'token': token })
}

router.get('/rtc/:channel/:role/:expiry/:uid', nocache, generateAccessToken);

module.exports = router;