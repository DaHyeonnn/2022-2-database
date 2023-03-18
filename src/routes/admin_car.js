import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { insertSql, selectSql, updateSql, deleteSql, transcation } from "../database/sql";
const router = express.Router();
let admin = "";
let sid = "";
let vin = "";
let v_type = ""
let add_vin = 0;
router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', async (req, res) => {
    if (req.cookies.user) {
        res.render('admin_car', { 'user': req.cookies.user });
        admin = req.cookies.user;
        const SID = await selectSql.getAdminSID(admin);
        console.log(SID);
        sid = SID[0].sid;
    } else {
        res.render('/');    //render('hbs 파일 이름')
    }

});
router.get('/logout', (req, res) => {
    if (req.cookies.user) {
        res.clearCookie('user')
        res.redirect("/");
    } else {
        res.redirect("/");
    }
})

// *******************트랜잭션 설계 1********************
router.post('/', async (req, res) => {
    const vars=req.body;
    v_type = vars.v_type; //car,suv,truck에 따라 relation 테이블에 insert해야하므로 필요
    
    //트랜잭션 시작
    await transcation.start();
    const insertVehicle = await insertSql.insertVehicle(vars, sid);
    insertVehicle;
    //다른 관리자가 동시에 추가(입고)할 수 있으니 판매자 본인의 sid로 입고차량의 식별번호를 찾는다
    const newVin = await selectSql.getVin(sid); //관리자가 추가한 차량식별번호 추출
    add_vin = newVin[0].vin; // 막 추가한 차량식별번호   
    let title4 = "";
    const  title4_id = "id";
    const title4_op = "Option";
    const title4_opid = "원하는 옵션의 id를 적어주세요.";
    
    if (v_type == "car"){
        title4 = "Car의 engine size(CC) 선택"
        const ve_op = await selectSql.selCarOp();
        
        res.render('admin_car', {
            title4,
            admin,
            ve_op:ve_op,
            title4_id,
            title4_op,
            title4_opid,
    
        })
       
    }
    else if (v_type == "suv"){
        title4 = "Suv의 num seat(인용) 선택"
        const ve_op = await selectSql.selSuvOp();
        res.render('admin_car', {
            title4,
            admin,
            ve_op:ve_op,
            title4_id,
            title4_op,
            title4_opid,
    
        })
       
    }
    else {
        title4 = "Truck의 tonnage(톤) 선택"
        const ve_op = await selectSql.selTrOp();
        res.render('admin_car', {
            title4,
            admin,
            ve_op:ve_op,
            title4_id,
            title4_op,
            title4_opid,
    
        })
       
    }

});


router.post('/addop', async (req, res) => { //차량 추가를 누른 경우
    const OpID=req.body.op_id;
    console.log("aaa", v_type, "bbb",  add_vin, "ccc",  OpID);
    let type_id = "";
    if (add_vin != 0){
        if (v_type == "car") {
            type_id = "car_id"
        } 
        else if(v_type == "suv"){
            type_id = "suv_id"
        }
        else{
            type_id = "truck_id"   
        }
        const insRelation = await insertSql.insRelation(type_id,v_type, add_vin, OpID);
        await transcation.commit();
        //트랜잭션 완료
        res.send("<script>alert('성공적으로 입고되었습니다.'); location.href='/admin_car'; </script>");
        
         }
    else{
        await transcation.rollback();
        res.send("<script>alert('차량 추가부터 진행해주세요.'); location.href='/admin_car'; </script>");
    }

});

// *******************트랜잭션 설계 1********************


router.post('/update', async (req, res) => {
    await transcation.commit();
    const vars=req.body; //수정하려는 차량식별번호
    vin = vars.car_num; 
    const s_Vehicle = await selectSql.getshowVehicle(vars.car_num);
    res.render('admin_car', {
        title5: '차량 정보 ',
        s_Vehicle
    })
});

router.post('/update/up', async (req, res) => {
    const data = {
        price : req.body.new_price,   //할인을 적용한 수정 가격
    }
    const updatePrice = await updateSql.updatePrice(vin, data.price);
    updatePrice;
    res.send("<script>alert('성공적으로 수정되었습니다.'); location.href='/admin_car'; </script>");

});

router.post('/delete', async (req, res) => {
    await transcation.commit();
    console.log(req.body);
    let vin = req.body.car_dlt_num;
    console.log(vin);
    const dltrel = await deleteSql.delete_rel(vin);
    const dltve = await deleteSql.delete_vin(vin);
    dltrel;
    dltve;
    res.send("<script>alert('성공적으로 삭제되었습니다.'); location.href='/admin_car'; </script>");

});



module.exports = router;