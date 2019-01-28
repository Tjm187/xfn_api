/* 菜品类别的路由*/
const express = require("express");
const pool = require("../../pool.js");
const router = express.Router();

module.exports = router;

//客户端获取所有的菜品GET/admin/category，按编号升序排列，返回值[{cid: 1,cname: '..'},..]
router.get('/', (req, res) => {
    var sql = "SELECT * FROM xfn_category ORDER BY cid";
    pool.query(sql, (err, result) => {
        if (err) { throw err; }
        res.send(result);
    })
})

//删除 DELETE/admin/category/:cid 根据路由菜品编号的路由参数，返回{code: ,msg:"",cid: x}
//会出现两次请求，预取请求OPTIONS，询问是否支持接下来的请求方法
router.delete('/:cid', (req, res) => {
    //注意：删除菜品类别前必须先把属于该类别的菜品类别编号设置为null
    pool.query('UPDATE xfn_dish SET categoryId=NULL WHERE categoryId=?', req.params.cid, (err, result) => {
        if (err) { throw err; }
        //修改完毕
        var sql = "DELETE FROM xfn_category WHERE cid=?";
        pool.query(sql, req.params.cid, (err, result) => {
            if (err) { throw err; }
            if (result.affectedRows > 0) {
                res.send({ code: 200, msg: '1 category deleted' })
            } else {
                res.send({ code: 400, msg: '0 category deleted' })
            }
        })
    })
})

//添加  Post / admin/category  幂等  请求参数{cname:'xxx'}
//添加新的菜品类别 返回值形如 {code: 200,msg:"1category added" ,cid: x}
//json格式sql语句可以使用set进行简写  insert &update
router.post('/', (req, res) => {
    console.log(req.body)
    var data = req.body;
    //添加前应先查询是否存在

    var sql = "INSERT INTO xfn_category SET ?";
    pool.query(sql, data, (err, result) => {
        if (err) { throw err; }
        if (result.affectedRows > 0) { res.send({ code: 200, msg: "1 category added" }) } else { res.send({ code: 0, msg: "added failed" }) }
    })
})

//修改 PUT /admin/category {cid: xx,cname;"xxx",modified/not exists/no modification}
//json格式sql语句可以使用set进行简写  insert &update
router.put('/', (req, res) => {
    var data = req.body;//请求数据{cid:  ;cname: "xx"}
    var sql = "UPDATE xfn_category SET ? WHERE cid=?";
    pool.query(sql, [data, data.cid], (err, result) => {
        if (err) { throw err; }
        if (result.changedRows > 0) {
            res.send({ code: 200, msg: "1 category modified" })
        } else if (result.affectedRows == 0) {
            res.send({ code: 400, msg: "category not exists" })
        } else if (res.affectedRows == 1 && result.changedRows == 0) {
            res.send({ code: 401, msg: 'no category modified' })
        }
    })
})
//insertId affectedRows changedRows 增删改