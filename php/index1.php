<?php
include('mysql.php');
// 获取所有的商品信息
$res = mysqli_query($link,"select * from etaolist");
$arr = [];
while($row = mysqli_fetch_assoc($res)){
    $arr[] = $row;
}
echo json_encode([
    "meta"=>[
        "status"=>0,
        "msg"=>"数据获取成功"
    ],
    "data"=>$arr
]);