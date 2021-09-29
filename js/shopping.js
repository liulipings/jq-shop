// 判断是不是登录后才进入的购物车
let username = getCookie('username')
if (!username) { //未登录时强制退出，并跳转到登录页面
    alert('非法进入，请登录后再查看购物车')
    location.href = '../views/login.html'
} else { // 已经登录，
    // 顶部左上角提示
    let yesStr = `<span>商城当前登录用户: <i>${username}</i></span> <span id='out'><a href="javascript:;">退出登录</a></span>`
    $('.t-left').html(yesStr)
        // 给退出登录 按钮绑定点击事件
    $('#out').click(() => {
        layer.confirm('您确定要退出登录吗?', {
            icon: 3,
            title: '提示'
        }, function(index) {
            // 点击确定执行这里
            // 删除cookie
            delCookie('username')
            $('.t-left').html('')
            layer.close(index);
            // 退出登录后跳转到登录页面
            location.href = '../views/login.html'
        }, function(index) {
            // 点击取消执行这里
            layer.close(index);
        });

    })

    // 获取本地local中的数据，转换成数组
    let data = JSON.parse(localStorage.getItem('data'))
        // console.log(data.length);
        // 判断local中是否有数据
    if (!data) {
        // 为空 则显示购物车空空如也的图片
        $('.m-top').hide()
        $('.m-closing').hide()
        $('.m-pay').hide()
        $('.emptyCart').show()

    } else { // local中有数据，可能含有别的用户数据
        var arr = data.filter(item => { // 拿到该登录用户的购物车数据
                return username === item.username
            })
            // 判断该用户的购物车为空
        if (!arr.length) {
            // 为空 则显示购物车空空如也的图片
            $('.m-top').hide()
            $('.m-closing').hide()
            $('.m-pay').hide()
            $('.emptyCart').show()
                // console.log('购物车是空的');
        } else { // 如果有数据，执行这里
            $('.m-top').show()
            $('.m-closing').show()
            $('.m-pay').show()
            $('.emptyCart').hide()
                // 用来存储用户的商品id、数量
            let idArr = []
            let numArr = []
            arr.forEach((item) => {

                // 拿到数据 购物车的商品id和数量
                idArr.push(item.id)
                numArr.push(item.num)
                    // kucunArr.push(item.price1)
                    // console.log(item.id, item.num);

            });
            // 请求数据
            let cartStr = ''
                // 根据local中的用户购物车商品id，请求响应的商品数据，并渲染
            for (let i = 0; i < idArr.length; i++) {
                $.ajax({
                    url: '../php/detail.php',
                    data: {
                        id: idArr[i]
                    },
                    dataType: 'json',
                    success: (res) => {

                        let { data } = res
                        // 因为这个数据库里面没有库存这个字段，所以我拿价格除以10向上取整作为库存
                        let kucun = Math.ceil(Number(data.price1) / 10)
                            // console.log(kucun);
                            // console.log(data);
                            // console.log(data.price1);
                        cartStr += `
                    <div class="m-goods" id=${idArr[i]} data-kucun=${kucun}>
                        <label><input type="checkbox" id="check"></label>
                        <img src="${data.img}">
                        <div class="msg1 fl">${data.title1}</div>
                        <div class="msg2 fl">
                            <p>颜色分类：黑色</p>
                            <p>尺码：均码</p>
                        </div>
                        <div class="price fl">￥${data.price1}.00</div>
                        <div class="num fl">
                            <button class="sub">－</button>
                            <button class="count">${numArr[i]}</button>
                            <button class="add">＋</button>
                        </div>
                        <div class="sum fl">￥${data.price1*numArr[i]}.00</div>
                        <div class="remove fl"><button class="del">删除</button></div>
                    </div>`

                        // console.log(cartStr);
                        $('.m-main').html(cartStr)
                            // 调用计算价格
                        all()
                    }
                })
            }
        }
    }
}

function all() {
    // 数量， 价格， 小计. 总价格
    // nums, price, sum, allPrice

    // 点击加号，计算小计
    $('.add').click(function() { // 小计
        // 点加号，转换为数值,数量加1
        let nums = Number($(this).prev().text()) + 1
            // 获取库存
        let kucun = $(this).parent().parent().attr('data-kucun')
            // console.log(kucun);
            // 判断当前数量是否大于库存
        if (nums > kucun) {
            nums = kucun
            $(this).prev().text(nums)
            layer.msg("已达到库存最大值", {
                icon: 2,
                time: 800
            })
        } else {
            $(this).prev().text(nums)
                // 单价
            let price = $(this).parent().prev().text().substring(1, $(this).parent().prev().text().length)

            // 求和获得小计
            let sum = '￥' + (parseFloat(price) * nums).toFixed(2)
                // console.log(sum);
            $(this).parent().next().text(sum)
                // 调用计算总价函数
            totalPrice()
                // 修改本地local中购物车对应商品的数量  
            let username = getCookie('username')
            let id = $(this).parent().parent().prop('id')
            let data = JSON.parse(localStorage.getItem('data'))
                // console.log(data, username, id, nums);
            data.forEach(item => {
                if (username == item.username && id == item.id) {
                    item.num = nums
                }
            })
            localStorage.setItem('data', JSON.stringify(data))
        }
    })

    // 点击减号，计算小计
    $('.sub').click(function() { // 小计
        // 点加号，数量减1,并转换为数值
        let nums = Number($(this).next().text()) - 1
            // 数量最小为1
        if (nums < 1) {
            layer.msg("已达到商品最小值", {
                icon: 2,
                time: 800
            })
        } else {
            $(this).next().text(nums)
                // 单价
            let price = $(this).parent().prev().text().substring(1, $(this).parent().prev().text().length)
                // 求和获得小计
            let sum = '￥' + (parseFloat(price) * nums).toFixed(2)
            $(this).parent().next().text(sum)
                // 调用计算总价函数
            totalPrice()
                // 修改本地local中购物车对应商品的数量
            let username = getCookie('username')
            let id = $(this).parent().parent().prop('id')
            let data = JSON.parse(localStorage.getItem('data'))
                // console.log(data, username, id, nums);
            data.forEach(item => {
                if (username == item.username && id == item.id) {
                    item.num = nums
                }
            })
            localStorage.setItem('data', JSON.stringify(data))
        }
    })

    // 点击删除数据 
    $('.del').click(function() {
        // 保存点击的事件源 
        let _this = $(this)
            // 提示框
        layer.confirm('您确定要删除吗？', {
            btn: ['确定', '取消']
        }, (index) => { // 点击确定删除执行这里
            // 获取当前登录的用户名
            let username = getCookie('username')
                // 获取当前点击的要删除的商品id
            let id = _this.parent().parent().attr('id')
                // 获取本地购物车所有数据
            let data = JSON.parse(localStorage.getItem('data'))
                // console.log(data);
            let deldata
            deldata = data.find(item => { // 匹配数据
                    return item.username === username && item.id === id
                })
                // console.log(deldata);
                // 遍历，拿到当前点击的商品索引
            let delIndex
            data.forEach((item, index) => {
                    if (item.username === deldata.username && item.id === deldata.id) {
                        delIndex = index
                    }
                })
                // console.log(delIndex);
                // 删除对应id的商品数据
            data.splice(delIndex, 1)

            // 删除页面结构
            _this.parent().parent().remove()
                //   将移除之后的数据写入localStorage
            localStorage.setItem('data', JSON.stringify(data))
                // 删除之后判断购物车是否还有数据
            let arr = data.filter(item => { // 获取该登录用户的购物车数据
                    return username === item.username
                })
                // 判断该用户的购物车为空
            if (!arr.length) {
                // 为空 则显示购物车空空如也的图片
                $('.m-top').hide()
                $('.m-closing').hide()
                $('.m-pay').hide()
                $('.emptyCart').show()
            }
            // 重新计算总价
            totalPrice()
            layer.close(index);
            // 提示弹窗信息
            layer.msg("删除成功", {
                icon: 1,
                time: 800
            })
        })
    })

    // 单个勾选时
    $('.m-goods').click(function() {
        setColor()
        ggg()
            // 调用计算总价函数
        totalPrice()
            // 全选复选框
            // select()
    })

    // 全选1
    $('.all').click(function() {
        $('.m-goods input').prop('checked', 'true')
            // 调用变色
        setColor()
        ggg()
            // 调用计算总价函数
        totalPrice()
            // 全选复选框
            // select()
    })

    // 全选2
    // $('#checkAll').click(function() {
    //         // console.log($(this));
    //         if ($(this)[0].checked === true) {
    //             $('.m-goods input').prop('checked', 'true')
    //         } else {
    //             $('.m-goods input').removeProp('checked')
    //         }
    //         // 调用变色
    //         setColor()
    //         ggg()
    //             // 调用计算总价函数
    //         totalPrice()
    //             // 全选复选框
    //         select()
    //     })
    // 全不选
    $('.unall').click(function() {
            $('.m-goods input').removeProp('checked')
                // 调用变色
            setColor()
            ggg()
                // 调用计算总价函数
            totalPrice()
                // 全选复选框
                // select()
        })
        // 反选
    $('.fanxuan').click(function() {
            for (let i = 0; i < $('.m-goods input').length; i++) {
                // 遍历所有复选框，把拿到的元素重新转换为jquery对象，然后让他们的值取反
                if ($($('.m-goods input')[i]).prop('checked') === true) {
                    $($('.m-goods input')[i]).removeProp('checked')
                } else {
                    $($('.m-goods input')[i]).prop('checked', 'true')
                }
            }
            // 调用变色
            setColor()
            ggg()
                // 调用计算总价函数
            totalPrice()
                // 全选复选框
                // select()

        })
        // 删除勾选的商品
    $('.delAll').click(function() {
        let flag = false
        let iptArr = Array.from($('.m-goods input'))
        for (let i = 0; i < iptArr.length; i++) {
            if (iptArr[i].checked) {
                flag = true
            }
        }
        if (flag) {
            // 调用封装函数
            noMoney('删除成功')
                // 结算背景
            ggg()
        }
        // else {
        //     // 提示信息
        //     layer.msg('请先勾选商品', {
        //         icon: 5,
        //         time: 2000
        //     })
        // }
    })

    // 遍历所有复选框，查看是否已经全部勾选
    // function select() {
    //     let flags = false
    //     let iptArr = Array.from($('.m-goods input'))
    //     for (let i = 0; i < iptArr.length; i++) {
    //         if (iptArr[i].checked) {
    //             flags = true
    //         }
    //     }
    //     if (flags) {
    //         $('#checkAll').prop('checked', 'true')
    //     } else {
    //         $('#checkAll').removeProp('checked')
    //     }
    // }


    //  封装 复选框勾选时，添加背景颜色
    function setColor() {
        // 遍历所有复选框
        for (let j = 0; j < $('.m-goods input').length; j++) {
            // 如果复选框被勾选，添加背景颜色
            if ($($('.m-goods input')[j]).prop('checked') == true) {
                $($('.m-goods input')[j]).parent().parent().css('background', 'rgb(245, 238, 228)')
            } else {
                // 否则 移除背景颜色
                $($('.m-goods input')[j]).parent().parent().css('background', 'white')
            }
        }
    }

}
// 封装结算按钮
function ggg() {
    let flag = false
    let iptArr = Array.from($('.m-goods input'))
    for (let i = 0; i < iptArr.length; i++) {
        if (iptArr[i].checked) {
            flag = true
        }
    }
    // 至少有一个勾选了 flag才为true
    if (flag) {
        $('#ggg').css('background', 'red')
            // 点击结算按钮
        $('#ggg').click(() => {
            // 调用结算函数
            noMoney('恭喜您，支付成功')
        })
    } else {
        // 解绑事件
        $('#ggg').css('background', '#999').unbind()

    }

}

// 封装计算总数量、总价函数
function totalPrice() {
    let allPrice = 0
    let allNum = 0
        // 遍历所有复选框
    for (let j = 0; j < $('.m-goods input').length; j++) {
        // 如果复选框被勾选，就加上对应的价格
        if ($($('.m-goods input')[j]).prop('checked') == true) {
            // 拿到每个勾选商品的价格
            let pre = $($('.m-goods input')[j]).parent().siblings('.sum').text().substr(1)

            // 拿到每个勾选商品的数量
            let numb = $($('.m-goods input')[j]).parent().siblings('.num').children('.count').text()

            // 累加
            allNum += Number(numb)
            allPrice += parseInt(pre)
        }
    }
    // console.log(allPrice);
    // 拿到总数量 总价
    $('#allNum').text(allNum)
    $('.allPrices').text('￥' + allPrice.toFixed(2))
}

// 封装 模糊匹配查询函数
function Search() {
    // 拿到输入框的内容
    let vStr = $.trim($('#search').siblings().val())
        // 创建正则
    let reg = new RegExp(vStr)
        // 遍历获取所有商品的标题
    for (let i = 0; i < $('.m-goods').length; i++) {
        // 如果输入为空时，全部商品显示
        if (!vStr) {
            $($('.m-goods')[i]).show()
        }
        // 当正则匹配为true时，让他显示
        else if (reg.test($($('.m-goods')[i]).children('.msg1').text())) {
            $($('.m-goods')[i]).show()
        } else {
            $($('.m-goods')[i]).hide()
        }
    }
}

// 点击查询按钮时，模糊匹配查询
$('#search').click(
        function() {
            Search()
        }
    )
    // 当敲回车时，也进行模糊匹配
$('#sea').on('keyup', function(e) {
    if (e.which == 13) {
        Search()
    }
})

// 封装删除结算功能
// function noMoney(txt) {
//     let username = getCookie('username')
//     $('.m-goods input').each(function(index, item) {
//         if (item.checked === true) {
//             // 拿到勾选商品的id
//             let id = $('.m-goods input').eq(index).parent().parent().prop('id')
//             console.log(id);
//             // 获取本地所有数据
//             let data = JSON.parse(localStorage.getItem('data'))
//                 // console.log(id, username);
//             let deldata
//             deldata = data.find(item => { // 匹配数据
//                     return item.username === username && item.id === id
//                 })
//                 // 拿到勾选的商品在local中的索引
//             let delNum
//             data.forEach((ele, index) => {
//                     if (ele.username === deldata.username && ele.id === deldata.id) {
//                         // console.log(i);
//                         delNum = index
//                     }
//                 })
//                 // console.log(delNum);
//                 // 删除页面结构
//             $('.m-goods input').eq(index).parent().parent().remove()
//                 // 删除local数据 
//             data.splice(delNum, 1)
//             localStorage.setItem('data', JSON.stringify(data))

//             // 删除之后判断购物车是否还有数据
//             let arr = data.filter(item => { // 获取该登录用户的购物车数据
//                     return username === item.username
//                 })
//                 // 判断该用户的购物车为空
//             if (!arr.length) {
//                 // 为空 则显示购物车空空如也的图片
//                 $('.m-top').hide()
//                 $('.m-closing').hide()
//                 $('.m-pay').hide()
//                 $('.emptyCart').show()
//             }
//             // 重新计算总价
//             totalPrice()
//                 // 提示信息
//             layer.msg(txt, {
//                 icon: 6,
//                 time: 2000
//             })
//         }
//     })
// }

function noMoney(txt) {
    let username = getCookie('username')
    let arr1 = []
        // 遍历所有复选框
    $('.m-goods input').each(function(index, item) {
            if (item.checked === true) {
                // 拿到勾选商品的id
                let id = $('.m-goods input').eq(index).parent().parent().prop('id')
                arr1.push(id)
            }
        })
        // console.log(arr1);
        // 获取本地所有数据
    let data = JSON.parse(localStorage.getItem('data'))
        // console.log(data);
    let deldata
    let delNum
        // 遍历所有商品id
    for (let i = 0; i < arr1.length; i++) {
        deldata = data.find(item => { // 匹配数据
                // console.log(item);
                return item.username === username && item.id === arr1[i]
            })
            // console.log(deldata);
            // 拿到商品id对应在local中的索引
        data.forEach((ele, index) => {
                if (ele.username === deldata.username && ele.id === deldata.id) {
                    delNum = index
                }
            })
            // 删除页面结构
        $(`#${arr1[i]}`).remove()
            // 删除local数据 
        data.splice(delNum, 1)
        localStorage.setItem('data', JSON.stringify(data))
    }
    // console.log(deldata);
    // 删除之后判断购物车是否还有数据
    let arr = data.filter(item => { // 获取该登录用户的购物车数据
            return username === item.username
        })
        // 判断该用户的购物车为空
    if (!arr.length) {
        // 为空 则显示购物车空空如也的图片
        $('.m-top').hide()
        $('.m-closing').hide()
        $('.m-pay').hide()
        $('.emptyCart').show()
    }
    // 重新计算总价
    totalPrice()
        // 提示信息
    layer.msg(txt, {
        icon: 6,
        time: 2000
    })
}