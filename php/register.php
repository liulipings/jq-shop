<?php
include('mysql.php');
//接收数据，进行注册
$username = $_POST['username'];
$password = $_POST['password'];
$tel = $_POST['tel'];
$email = $_POST['email'];
// 检查是用户名是否被占用 - 拿用户名到数据库中查询
$res = mysqli_query($link,"select * from user where username='$username'");
// 提取数据
$row = mysqli_fetch_assoc($res);
// 没有提取到数据是null
if($row){
    $arr = [
        "meta"=>[
            "status"=>2,
            "msg"=>"用户名被占用"
        ]
    ];
}else{ // 如果是null - 没有查到数据 - 用户名没有被占用
    // 将数据添加到数据库
    $res = mysqli_query($link,"insert into user(username,password,email,tel) values('$username','$password','$email',$tel)");
    // 增的结果是布尔值
    if($res){
        $arr = [
            "meta"=>[
                "status"=>0,
                "msg"=>"注册成功"
            ]
        ];
    }else{
        $arr = [
            "meta"=>[
                "status"=>1,
                "msg"=>"注册失败"
            ]
        ];
    }
}
echo json_encode($arr);