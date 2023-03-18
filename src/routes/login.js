import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { insertSql } from "../database/sql";
import { selectSql } from "../database/sql";

const router = express.Router();
console.log("aaaaaa");


// 쿠키 및 세션 설정
router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', (req, res) => {
    if (req.cookies.user) {
        res.render('home', { 'user': req.cookies.user }); //로그인에 성공하면 home으로 이동
    } else {
        res.render('login');    //실패하면 다시 login페이지로 이동
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


router.post('/', async (req, res) => {
    const vars = req.body;
    const customer = await selectSql.getCustomer();
    const admin = await selectSql.getAdmin();
    console.log(req.body);
    let checkLogin_customer = false;
    let checkLogin_admin = false;
    let whoAmI = "";

    const data = {
        option : vars.option,
        id : vars.id,
        password : vars.password,
    };
    
    if (data.option == 1){ //고객일 경우
        customer.map((user) => {
            if (data.id == user.id && data.password == user.password) {
                checkLogin_customer = true;
                
                whoAmI = vars.id; //학번을 보낸다
            }
        })
        if (checkLogin_customer) {
            res.cookie('user', whoAmI, {
                expires: new Date(Date.now() + 3600000), // ms 단위 (3600000: 1시간 유효)
                httpOnly: true
            })
            res.redirect('/cust_home');
        } else {
           console.log('login failed!');
           res.send("<script>alert('로그인에 실패하였습니다. 정보를 제대로 기입했는지 다시 확인해보세요.'); location.href='/login'; </script>");
           
        }
    }
    else if (data.option == 2){
        admin.map((user) => {
            if (data.id == user.id && data.password == user.password) {
                checkLogin_admin = true;
                whoAmI = vars.id; //학번을 보낸다
            }
        })
        if (checkLogin_admin) {
            res.cookie('user', whoAmI, {
                expires: new Date(Date.now() + 3600000), // ms 단위 (3600000: 1시간 유효)
                httpOnly: true
            })
            res.redirect('/admin_home');
        } else {
            console.log('login failed!');
            res.send("<script>alert('로그인에 실패하였습니다.정보를 제대로 기입했는지 다시 확인해보세요.'); location.href='/login'; </script>");
           
        }
    }
    else {
        res.send("<script>alert('관리자 혹은 손님 하나의 항목만 체크해주세요.'); location.href='/login'; </script>");
           
    }

})

module.exports = router;