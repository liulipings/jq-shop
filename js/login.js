$('#btn').click(function() {
    let username = $('#uname').val()
    let password = $('#pwd').val()
    let check = $('#check')[0].checked
    if (!username || !password) {
        layer.msg('账号和密码不能为空', { icon: 5, time: 2000 })
    } else {
        $.ajax({
            url: '../php/login.php',
            method: 'post',
            data: {
                username,
                password
            },
            dataType: 'json',
            success: (res) => {
                // 结构赋值 ，拿到返回的数据
                let { meta: { status, msg } } = res
                // 登录成功
                if (status == 0) {
                    layer.msg(`${msg},即将跳转到首页`, { icon: 6, time: 1000 }, () => {
                            // 如果勾选了7天免登陆
                            if (check) {
                                // window.localStorage.setItem(username, password)
                                setCookie('username', username, 60 * 60 * 24 * 7)
                            } else {
                                setCookie('username', username)
                            }
                            location.href = '../views/index1.html'
                        })
                        // 登录失败
                } else {
                    layer.msg(msg, { icon: 5, time: 2000 })
                }
            }
        })
    }

})