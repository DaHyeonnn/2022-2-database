import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { insertSql, selectSql, updateSql, deleteSql } from "../database/sql";
const router = express.Router();

router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', async (req, res) => {
    if (req.cookies.user) {
        res.render('home', { 'user': req.cookies.user});
    }
    else {
        res.render('login');    //render('hbs 파일 이름')
    }
});


module.exports = router;