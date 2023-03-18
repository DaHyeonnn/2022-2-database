import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql,insertSql } from "../database/sql";

const router = express.Router();
router.get('/', (_req, res) => {
    res.render('createid'); //hbs파일
})


router.post('/', async (req, res) => {
    const vars = req.body;
    console.log(vars);
    //create id 데이터 
    const data = {
        id: vars.UserID,
        password: vars.PW,
        u_name: vars.u_name,
        address_city: vars.address_city,
        address_country: vars.address_country,
        address_road: vars.address_road,
        
    };

    console.log(data.id, data.password, data.u_name, data.address_city, data.address_country,data.address_road);
    try{
        await insertSql.insertCustomer(data);
        res.send("<script>alert('회원가입 성공'); location.href='/login'; </script>");
     
    }
    catch(e){
        console.log("아이디 중복 예외처리");   
        res.send("<script>alert('중복된 아이디입니다. 새로운 아이디를 생성해주세요.'); location.href='/createid'; </script>");
     
    }
    })


module.exports = router;
