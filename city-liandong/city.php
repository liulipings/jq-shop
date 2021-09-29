<?php
// 获取到省份的id
$pid = $_GET['pid'];
include('./connect.php');
$sql = "SELECT * FROM `city` WHERE `province_id`='$pid'";
// 执行sql
$res = mysqli_query($link,$sql);
// 解析结果
$arr = [];
while($row = mysqli_fetch_assoc($res)){
  array_push($arr,$row);
}
// print_r($arr);
// ajax.responseText 获取到的都是字符串
// 所以后端在返回响应的时候，只用echo
// 如果返回的数据中会有对象或数组，则可以转为json个是的字符串，再返回响应

echo json_encode($arr);
