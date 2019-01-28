/* 管理员相关的路由*/
const express = require("express");
const pool = require("../../pool.js");
const router = express.Router();

module.exports = router;

//1.登录 GET /admin/login  请求数据：{aname: 'xxx',apwd: 'xxx'} 返回数据：{code：200，msg: 'login success'}
router.get('/login/:aname/:apwd', (req, res) => {
    var aname = req.params.aname;
    var apwd = req.params.apwd;
    console.log(aname, apwd)
    var sql = "SELECT aid FROM xfn_admin WHERE aname=? and apwd=PASSWORD(?)";
    pool.query(sql, [aname, apwd], (err, result) => {
        if (err) { throw err; }
        if (result.length > 0) {
            res.send({ code: 200, msg: "login success" });
        } else {
            res.send({ code: 0, msg: "用户名或密码错误" });
        }
    })
})

//2.管理员修改密码 PATCH/admin 请求数据:{aname: "xxx",olPwd: 'xxx',newPwd: "xxx"} 返回数据：{code：200，msg: 'modified success'}
router.patch('/', (req, res) => {
    var data = req.body;
    console.log(data.aname, data.oldPwd);
    pool.query('SELECT aid FROM xfn_admin WHERE aname=? AND apwd=PASSWORD(?)', [data.aname, data.oldPwd], (err, result) => {
        if (err) { throw err; }
        console.log(result);
        if (result.length == 0) {
            res.send({ code: 400, msg: 'password err' });
            return;
        }
        var sql = "UPDATE xfn_admin SET apwd=PASSWORD(?)  WHERE aname=?";
        pool.query(sql, [data.newPwd, data.aname], (err, result) => {
            if (err) { throw err; }
            if (result.changedRows > 0) {
                //密码修改完成
                res.send({ code: 200, msg: "modify success" });
            } else {//新旧密码一样，未做修改
                res.send({ code: 401, msg: 'pwd not modified' })
            }
        })
    })
})