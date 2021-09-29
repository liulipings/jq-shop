<?php
// 获取到城市的id
$cid = $_GET['cid'];
include('./connect.php');
$sql = "SELECT * FROM `area` WHERE `city_id`='$cid'";
// 执行sql
$res = mysqli_query($link,$sql);
// 解析结果
$arr = [];
while($row = mysqli_fetch_assoc($res)){
  array_push($arr,$row);
}

echo json_encode($arr);