import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { insertSql, selectSql, updateSql, deleteSql } from "../database/sql";
const router = express.Router();
let cust = "";
let sid = "";
let vin = "";
router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))


router.get('/', async (req, res) => {
    if (req.cookies.user) {;
        cust = req.cookies.user;
        const SID = await selectSql.getcustSID(cust);
        console.log(SID);
        sid = SID[0].ssn;
        console.log("sid는", sid);
        const my_res = await selectSql.getMyCarRes(sid);
        const my_info = await selectSql.getMyInfo(sid);
        res.render('my_page', {
            title1: '개인 정보',
            title2: '나의 예약 목록 ',
            my_res,
            my_info,
            sid
        })
    } else {
        res.render('/');    //render('hbs 파일 이름')
    }

});

router.post('/', async (req, res) => {
    //예약 취소를 누르면 바뀌어야할것:
    //상태=>"예약가능", customer_ssn은 null, date도 null
    console.log("HI")
    console.log(req.body);
    const Cansel_vin = req.body.my_car_res;
    const CanselStatus = await updateSql.CanselStatus(Cansel_vin);
    const CanselSsn = await updateSql.CanselSsn(Cansel_vin);
    const CanselDate = await updateSql.CanselDate(Cansel_vin);

    res.redirect("/my_page");
});



module.exports = router;