//全局设置
const express = require("express");
const pool = require("../../pool.js");
const router = express.Router();

module.exports = router;

//1. 获取全局设置
// GET /admin/settings 

//2. 设置
// PUT /admin/settings

//3.所有桌台详情
// GET /admin/tables

//4.预约桌台详情
// GET /admin/tables

//5.获取占用中的桌台详情
// GET /admin/table/inuse/:tid

//6.修改桌台状态
// PATCH 

//7.添加桌台
//POST /admin/table

//8.删除桌台
// DELETE /admin/table