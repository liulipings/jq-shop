// 验证的正则表达式
let regs = {
        userNameReg: /^(([\u4e00-\u9fa5])|[a-zA-Z0-9-_]){4,20}$/,
        pwdReg: /^.{6,20}$/,
        emailReg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        phoneReg: /^[1][3,4,5,7,8][0-9]{9}$/,
    }
    // 封装 获取焦点时执行的操作
    // ele:操作的对象 ，str：提示文本
function focusFn(ele, str) {
    ele.parent().next().text(str)
        .removeClass('red').addClass('current')
}

// 封装 失去焦点时执行的操作
// ele:操作的对象 ，str：提示文本 ，reg：使用的正则表达式
function blurFn(ele, str, reg) {
    ele.parent().next().text('')
        // 隐藏绿色提示图片
    ele.next().css('opacity', 0)
        // 当输入为空时
    if (!$.trim(ele.val())) {
        // 显示红色提示文本 并return
        ele.parent().next().text(str + '不能为空').removeClass('current').addClass('red')
        return
    }
    // 符合正则时
    if (reg.test(ele.val())) {
        ele.next().css('opacity', 1)
    } else {
        ele.parent().next().text(str + '不符合格式').addClass('red')
    }
}

// 验证账号 username
let unameStr1 = '支持汉字、字母、数字、下划线的组合，4-20个字符'
let unameStr2 = '用户名'
$('#user').focus(function() {
    // 获取焦点时，调用封装函数
    focusFn($('#user'), unameStr1)
}).blur(function() {
    // 失焦时，调用封装函数
    blurFn($('#user'), unameStr2, regs.userNameReg)
})

// 验证密码1
let pwdStr1 = '建议使用字母、数字和符号两种以上的组合,6-20个字符'
let pwdStr2 = '密码'
$('#pwd1').focus(function() {
    // 获取焦点时，调用封装函数
    focusFn($('#pwd1'), pwdStr1)
}).blur(function() {
    // 失焦时，调用封装函数
    blurFn($('#pwd1'), pwdStr2, regs.pwdReg)
})

// 比对两次密码
$('#pwd2').focus(function() {
    // 显示提示文本
    focusFn($('#pwd2'), '请再次输入密码')
}).blur(function() {
    // 输入为空时
    if (!$(this).val()) {
        $(this).parent().next().text('密码不能为空').removeClass('current').addClass('red')
        return
    }
    // 判断两次密码是否相等
    if ($.trim($('#pwd1').val()) != $.trim($(this).val())) {
        // 不相等时，提示密码不一致
        $(this).next().css('opacity', 0)
        $(this).parent().next().text('两次密码不一致').removeClass('current').addClass('red')
            // return
    } else {
        // 密码一致时，清空提示文本，显示绿色正确图片
        $(this).parent().next().text('')
        $(this).next().css('opacity', 1)
    }
})

// 验证邮箱 (可以不填)
let emailStr1 = '请输入您的邮箱'
let emailStr2 = '邮箱'
$('#email').focus(function() {
    // 获取焦点时，调用封装函数
    focusFn($('#email'), emailStr1)
}).blur(function() {
    // 失去焦点时，调用封装函数
    blurFn($('#email'), emailStr2, regs.emailReg)
})

// 验证手机号
let phoneStr1 = '请输入您的电话号码'
let phoneStr2 = '电话号码'
$('#phone').focus(function() {
    // 获取焦点时，调用封装函数
    focusFn($('#phone'), phoneStr1)
}).blur(function() {
    // 失焦，调用封装函数
    blurFn($('#phone'), phoneStr2, regs.phoneReg)
})


// 注册按钮
$('.submit').click(function() {
    // 信息没填写完整
    if (!$('#user').val() || !$('#pwd1').val() || !$('#pwd2').val() || !$('#email').val() || !$('#phone').val()) {
        layer.msg('请填写完整信息后再注册', {
            icon: 5,
            time: 2000
        })
        return
    } // 未勾选协议 提示
    if (!$('.checked')[0].checked) {
        layer.msg('请勾选用户注册协议', {
            icon: 5,
            time: 2000
        })
        return
    }

    // 信息填写完整后
    let username = $('#user').val()
    let password = $('#pwd1').val()
    let email = $('#email').val()
    let tel = $('#phone').val()
    console.log(username, password, email, tel);
    $.ajax({
        url: '../php/register.php',
        type: 'post',
        data: {
            username,
            password,
            email,
            tel
        },
        dataType: 'json',
        success: (res) => {
            // 登录成功
            let { meta: { status, msg } } = res
            if (status === 0) {
                layer.msg(`${msg},即将跳转到登录页面，请登录`, { icon: 6, time: 1500 }, () => {
                    setTimeout(() => {
                        location.href = '../views/login.html'
                    })
                })
            } else {
                // 注册失败
                layer.msg(`${msg}`, { icon: 5, time: 1000 })
            }
        }
    })
})