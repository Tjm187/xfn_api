/* 菜品管理的路由*/
const express = require("express");
const pool = require("../../pool.js");
const router = express.Router();

module.exports = router;
//1. get 返回所有菜品{cid:1,cname:'菜类'，dishList:[{..},{..},{..}]}
//必须先查询类别
router.get('/', (req, res) => {
    var sql = 'SELECT cid,cname FROM xfn_category ORDER BY cid';
    pool.query(sql, [], (err, result) => {
        if (err) { throw err; }
        //res.send(result); 
        //循环遍历每个菜品类别，查询该类别下的菜品
        var finishCount = 0;
        var categoryList = result;
        for (let c of categoryList) {
            pool.query('SELECT * FROM xfn_dish WHERE categoryId=? ORDER BY did DESC', c.cid, (err, result) => {
                if (err) { throw err }
                c.dishList = result;
                finishCount++
                //全部查询完才能res.send,查询是异步的
                if (finishCount == categoryList.length) {
                    res.send(categoryList);
                }
            })
        }

    })
})

//2. 接收客户端上传的菜品图片，保存在服务器上，返回该图片在服务器上的随机文件名
//POST admin/dish/image
const multer = require('multer');
const fs = require('fs');
var upload = multer({
    dest: 'tmp/' //指定客户端上传文件临时存储路径
})
//定义路由，使用文件上传中间件
router.post('/image', upload.single('dishImg'), (req, res) => {
    //console.log(req.file); //客户端上传的文件
    //console.log(req.body); //客户端随图片一起提交的字符
    //把客户端上传的文件从临时目录转移到永久的图片路径下
    var tmpFile = req.file.path;
    var suffix = req.file.originalname.substring(req.file.originalname.lastIndexOf('.'));
    var newFile = randFileName(suffix);
    fs.rename(tmpFile, 'img/dish/' + newFile, () => {
        res.send({ code: 200, msg: 'upload succ', fileName: newFile })
    })

})
//生成一个随机文件名
//suffix 表示要生成的文件名中的后缀
//形如：46546465-4156.png     f.substring(f.lastIndexOf('.'))
function randFileName(suffix) {
    var time = new Date().getTime();
    var num = Math.floor(Math.random() * (10000 - 1000) + 1000);
    return time + '-' + num + suffix;

}

//3. 添加新菜品
// POST /admin/dish  {title:'xx',imgUrl:'..jpg',price:xx,detail:'xx',categoryId:xx}
//{code:200,msg:'dish added succ',dishId:xx}
router.post('/',(req,res)=>{
    pool.query('INSERT INTO xfn_dish SET ?',req.body,(err,result)=>{
        if(err){throw err}
        res.send({code:200,msg:"dish added succ",dishId:result.insertId})
    })
})

//4. 根据id删除菜品 
// DELETE /admin/dish/:did  {}
//{code:200,msg:'dish deleted succ'}{code:400,msg:'dish not esists'}

//5.根据指定id修改菜品
// PUT /admin/dish  {did:xx,title:'xx',img:'..jpg',price:'xx',detail:'xx',categoryId:xx}
//{code:200,msg:'dish updated succ'}{code:400,msg:'dish not exists'}