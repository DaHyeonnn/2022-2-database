import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { insertSql, selectSql, updateSql, deleteSql } from "../database/sql";
const router = express.Router();
let admin = "";
let sid = "";
let vin = "";
router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', async (req, res) => {
    
    if (req.cookies.user) {
        res.render('admin_home', { 'user': req.cookies.user });
        admin = req.cookies.user;
        try{
            const SID = await selectSql.getAdminSID(admin);
            console.log(SID);
            sid = SID[0].id;
        }
        catch(e){
            res.send("<script>alert('잘못된 접근입니다. 관리자가 맞는지 확인해주세요.'); location.href='/'; </script>");
        };
    }
    else {
        res.render('/');    //render('hbs 파일 이름')
    }
    
});


router.post('/', async (req, res) => {
    console.log("hi");
});

module.exports = router;