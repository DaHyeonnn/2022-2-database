import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { insertSql, selectSql, updateSql, deleteSql, transcation } from "../database/sql";
const router = express.Router();
let cust = "";
let ssn = "";
let vin = "";
router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', async (req, res) => {
    if (req.cookies.user) {
        res.render('CarReservation', { 'user': req.cookies.user });
        cust = req.cookies.user;
        const SID = await selectSql.getcustSID(cust);
        ssn = SID[0].ssn;
    } else {
        res.render('/');    //render('hbs 파일 이름')
    }

});

router.post('/', async (req, res) => { //조회 버튼을 누른 경우
    console.log(req.body);
    const vars = req.body;
    const data = {
        v_type : vars.v_type,
        fuel : vars.fuel,
        option1 : vars.option[0],
        option2 : vars.option[1],
        price_st : vars.price_st,
        price_ed : vars.price_ed,
        year_st : vars.year_st,
        year_ed : vars.year_ed   
    }
    //예약 시간(5일)이 지나거나 예약이 반려되어 "판매실패"로 바뀐 차량은 다시 고객들에게 예약 가능한 차량으로 바뀌어야 함
    const updateSsnCansel = await updateSql.updateDateCansel();
    const updatedateCansel = await updateSql.updateSsnCansel();
    const updateStatusCansel = await updateSql.updateStatusCansel();
    updateSsnCansel;
    updatedateCansel;
    updateStatusCansel;

    if (data.v_type == "car"){
        if (data.option1 ==1 && data.option2 == 2){ //중고차와 신차 모두 체크한 경우
            let allCar = await selectSql.getCar_all(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                allCar
            })
        }
        else if (data.option1 == 1){//신차만 체크한 경우
            let newCar = await selectSql.getCar_new(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                newCar
            })
        }
        else if (data.option1 == 2){//중고차만 체크한 경우
            let oldCar = await selectSql.getCar_old(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                oldCar
            })
        }
    }

    if (data.v_type == "suv"){
        if (data.option1 ==1 && data.option2 == 2){
            let allSuv = await selectSql.getSuv_all(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                allSuv
            })
        }
        else if (data.option1 == 1){
            let newSuv = await selectSql.getSuv_new(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                newSuv
            })
        }
        else if (data.option1 == 2){
            let oldSuv = await selectSql.getSuv_old(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                oldSuv
            })
        }
    }

    if (data.v_type == "truck"){
        if (data.option1 ==1 && data.option2 == 2){
            let allTr = await selectSql.getTr_all(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                allTr
            })
        }
        else if (data.option1 == 1){
            let newTr = await selectSql.getTr_new(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                newTr
            })
        }
        else if (data.option1 == 2){
            let oldTr = await selectSql.getTr_old(data);
            res.render('CarReservation', {
                title: '차량 목록 ',
                oldTr
            })
        }
    }
});

// *******************트랜잭션 설계 2********************
// router.post('/res', async (req, res) => { //예약 버튼을 누른 경우
//     let vin = req.body.insBtn;
//     let now = new Date();
//     let t_year = now.getFullYear();   // 연도
//     let t_month = now.getMonth()+1;   // 월    
//     let t_day = now.getDate();        // 일

//     const count_reservation = await selectSql.count_re(ssn); //예약 개수 확인/ 고객 당 5개 넘어가지 않도록 제약
//     let c_res = count_reservation[0].c; //현재 로그인한 고객의 예약 수

//     //트랜잭션 시작
//     await transcation.start();
//     if (c_res <= 5){
//         const now_status = await selectSql.now_status(vin);
//         let now_stat = now_status[0].status;
//         if (now_stat == "예약가능"){
//             const today = String(t_year)+"-"+String(t_month)+"-"+String(t_day);
//             const insertdate = await updateSql.update(vin, today);
//             const insertssn = await updateSql.upssn(vin, ssn);
//             const insertstatus = await updateSql.upstatus(vin);
//             res.send("<script>alert('예약 완료됐습니다. 마이페이지에서 예약을 확인해주세요.'); location.href='/CarReservation'; </script>");

//         }
//         else{
            
//             res.send("<script>alert('이미 예약된 차량입니다. 다른 차량을 선택해주세요.'); location.href='/CarReservation'; </script>");

//         }
//     }
//     else {
//         res.send("<script>alert('정해진 예약 개수를 초과합니다. 예약 조회 페이지에서 예약 취소를 진행해주세요.'); location.href='/cust_home'; </script>");
//     }

//     await transcation.commit();
//     //트랜잭션 완료
// });


// *******************트랜잭션 설계 2********************
router.post('/res', async (req, res) => { //예약 버튼을 누른 경우
    let vin = req.body.insBtn;
    let now = new Date();
    let t_year = now.getFullYear();   // 연도
    let t_month = now.getMonth()+1;   // 월    
    let t_day = now.getDate();        // 일

    const count_reservation = await selectSql.count_re(ssn); //예약 개수 확인/ 고객 당 5개  않도록 제약
    let c_res = count_reservation[0].c; //현재 로그인한 고객의 예약 수

    //트랜잭션 시작
    await transcation.start();
    if (c_res < 5){
        const now_status = await selectSql.now_status(vin);
        let now_stat = now_status[0].status;
        if (now_stat == "예약가능"){
           
            const today = String(t_year)+"-"+String(t_month)+"-"+String(t_day);
            const insertdate = await updateSql.update(vin, today);
            const insertssn = await updateSql.upssn(vin, ssn);
            const insertstatus = await updateSql.upstatus(vin);
            await transcation.commit();
            //트랜잭션 완료
            res.send("<script>alert('예약 완료됐습니다. 마이페이지에서 예약을 확인해주세요.'); location.href='/CarReservation'; </script>");
            
        }
        else{
            await transcation.rollback();
            res.send("<script>alert('이미 예약된 차량입니다. 다른 차량을 선택해주세요.'); location.href='/CarReservation'; </script>");

        }
    }
    else {
        await transcation.rollback();
        res.send("<script>alert('정해진 예약 개수를 초과합니다. 예약 조회 페이지에서 예약 취소를 진행해주세요.'); location.href='/cust_home'; </script>");
    }

 
});
module.exports = router;