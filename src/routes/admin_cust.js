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
    admin = req.cookies.user; 
    const SID = await selectSql.getAdminSID(admin);
    console.log(SID);
    sid = SID[0].sid;
    const slt_reservation = await selectSql.select_reservation(sid);
    res.render('admin_cust', {
        title: '고객이 예약한 차량 정보 ',
        slt_reservation,
        admin,
    })
});

router.post('/', async (req, res) => {
    console.log("hi");
});
router.post('/companion', async (req, res) => {
    //예약 반려를 누르면, 바뀌어야할 것들
    //status : 예약중 -> 판매실패
    const vin = req.body.insBtn;
    const reservation_c = await updateSql.upState_NO(vin);
    const slt_reservation_result = await selectSql.getReservationResult(vin);
    const slt_reservation = await selectSql.select_reservation(sid);
    res.render('admin_cust', {
        title: '고객이 예약한 차량 정보 ',
        slt_reservation_result,   
        admin,
        slt_reservation
    })
});

function betweenDay(firstDate, secondDate)
{
     
    var firstDateObj = new Date(firstDate.substring(0, 4), firstDate.substring(4, 6) - 1, firstDate.substring(6, 8));
    var secondDateObj = new Date(secondDate.substring(0, 4), secondDate.substring(4, 6) - 1, secondDate.substring(6, 8));
    var betweenTime = Math.abs(secondDateObj.getTime() - firstDateObj.getTime());
    return Math.floor(betweenTime / (1000 * 60 * 60 * 24));
}


router.post('/approve', async (req, res) => {
    //예약 승인를 누르면, 바뀌어야할 것들
    //status : 예약중 -> 판매 완료
    //그런데 이때 (if문으로) 예약 날짜로부터 예약중 상태가 5일 지나면? 승인을 눌렀음에도 불구하고 판매 실패가 떠야함
    const vars = req.body;
    let vin = vars.insBtn;  //재할당 가능
 
    let slt_reservation = await selectSql.select_reservation(sid);
    //현재날짜 추출하기
    let now = new Date();
    var t_year = now.getFullYear();   // 연도
    var t_month = now.getMonth()+1;   // 월    
    var t_day = now.getDate();        // 일
    //reservation_date 예약 날짜 추출하기
    let r_year = await selectSql.getyear(vin); 
    let r_month = await selectSql.getmonth(vin);
    let r_day = await selectSql.getday(vin);
    let rr_year = r_year[0].year;
    let rr_month = r_month[0].month;
    let rr_day = r_day[0].day;
    const t_date = String(t_year)+String(t_month)+String(t_day);
    const r_date = String(rr_year)+String(rr_month)+String(rr_day);
    //날짜 차이 계산
    const diffDay = betweenDay(t_date, r_date);
    console.log("몇 일 차이가 나는가?", diffDay);
 
    if (diffDay >= 5) { //예약 중 상태가 5일 이상 지속되었으면 판매 실패 상태로 변경
        console.log("판매실패");
        const reservation_no = await updateSql.upState_NO(vin);
        reservation_no;
    }
    else if(diffDay < 5 ) {  //5일 지속되지 않았다면 판매 완료로 변경
        console.log("판매완료");
        const reservation_ok = await updateSql.upState_OK(vin);
        reservation_ok;
  
    }

    const slt_reservation_result = await selectSql.getReservationResult(vin);
    slt_reservation_result;
    slt_reservation;
    // res.render('admin_cust');
    res.render('admin_cust', {
        title: '고객이 예약한 차량 정보 ',
        slt_reservation,
        slt_reservation_result,
        
        admin,
    })
    
});




module.exports = router;