/*小肥牛扫码点餐子系统 */
const PORT = 8090;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


const categoryRouter = require("./routes/admin/category");
const adminRouter = require("./routes/admin/admin");
const dishRouter = require("./routes/admin/dish");

//创建并启动主服务器
var app = express();
app.listen(PORT, ()=>{
    console.log("Server Listening:"+PORT+'...')
});
//使用中间件cors body-parser
app.use(cors({}));
app.use(bodyParser.json());//把json格式的请求的主体数据解析出来放回req.body属性中 application/json
//挂载路由器
app.use("/admin/category",categoryRouter);
app.use("/admin",adminRouter);
app.use("/admin/dish",dishRouter);