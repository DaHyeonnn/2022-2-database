import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
const router = express.Router();

router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', (req, res) => {
    console.log("logout");
    if (req.cookies.user) {
        res.clearCookie('user')     //쿠키 초기화
        res.redirect("/");          //홈으로 이동
    } else {
        res.redirect("/");          
    }
})

module.exports = router;