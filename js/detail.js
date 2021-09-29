// 四级联动
let province = document.querySelector('#province')
    // ajax请求首先获取省份数据
ajax({
    url: '../city-liandong/province.php',
    dataType: 'json',
    fn: function(res) {
        // console.log(res);
        // 处理数据
        let proStr = '<option value="请选择省份">请选择省份</option>'
        res.forEach(item => {
                proStr += `
                <option value="${item.province_id}">${item.name}</option>
                `
            })
            // 将数据添加到页面
        province.innerHTML = proStr
    }
})

// 当省份下拉框改变时,添加事件 change, 获取点击省份对应的城市数据
province.onchange = function() {
    // console.log(this.value)
    var pid = this.value
        // ajax 获取点击省份对应的城市数据
    ajax({
        url: '../city-liandong/city.php',
        // data: {pid:pid} // es6当key和value相等时，可以缩写为1个
        data: {
            pid
        },
        dataType: 'json',
        fn: function(res) {
            // console.log(res);
            // 处理数据 
            let city = document.querySelector('#city')
            let cityStr = '<option value="请选择城市">请选择城市</option>'
            res.forEach(item => {
                cityStr += `
                    <option value="${item.city_id}">${item.name}</option>
                    `
            })
            city.innerHTML = cityStr
        }
    })
}


// 当城市下拉框改变时,添加事件 change, 获取点击城市对应的城区数据
city.onchange = function() {
    // console.log(this.value)
    let cid = this.value
        // ajax 获取点击城市对应的城区数据
    ajax({
        url: '../city-liandong/area.php',
        data: {
            cid
        },
        dataType: 'json',
        fn: function(res) {
            // console.log(res);
            // 处理数据 
            var area = document.querySelector('#area')
            let areaStr = '<option value="请选择城区">请选择城区</option>'
            res.forEach(item => {
                areaStr += `
                    <option value="${item.area_id}">${item.name}</option>
                    `
            })
            area.innerHTML = areaStr
        }
    })
}


// 当城区下拉框改变时,添加事件 change, 获取点击城区对应的城镇数据
area.onchange = function() {
        // console.log(this.value)
        let aid = this.value
            // ajax 获取点击城区对应的城镇数据
        ajax({
            url: '../city-liandong/town.php',
            data: {
                aid
            },
            dataType: 'json',
            fn: function(res) {
                // console.log(res);
                // 处理数据 
                var town = document.querySelector('#town')
                let townStr = '<option value="请选择城区">请选择城区</option>'
                res.forEach(item => {
                    townStr += `
                    <option value="${item.town_id}">${item.name}</option>
                    `
                })
                town.innerHTML = townStr
            }
        })
    }
    // 加载层
var index = layer.load(1, { shade: [0.5, '#fff'] });

// 请求分页数据
let arr = []
let brr = []
$.ajax({
    url: '../php/index1.php',
    data: {
        id: 2
    },
    dataType: 'json',
    success: (res) => {
        let { data } = res
        // console.log(data);
        data.forEach(item => {
            // console.log(item.img);
            arr.push(item.img)
            brr.push(item.id)
        })

        // 分页
        var pageSize = 5
        var page = new Page('pagiantion', {
            pageData: {
                // 数据总条数
                // total: 50,
                total: data.length,
                pageSize
            },
            // 展示数据方法
            show: (currentPage) => {
                let str = ''
                var res = arr.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                for (var i = 0; i < pageSize; i++) {
                    // console.log(brr[i]);
                    str += `
                        <div class="p-box" id=${brr[(currentPage-1)*5+i]}>
                            <div class="p-img">
                            <img src="${res[i]}">
                            </div>
                        <span >查看详情</span>
                        </div>
                        `
                }
                $('#page').html(str)
                $('#page').append(`<div class="pagiantion"></div>`)
                    // 给每个图片绑定点击事件
                $('#page>div').click(function() {
                    location.href = `../views/detail.html?${this.id}`
                        // console.log();
                })
            }
        })
    }
})
if (location.search.length < 2) {
    alert('非法进入')
    location.href = '../views/index1.html'
}


// 获取传入的id 渲染对应的商品详情
let id = location.search.match(/(\d+)$/)[1]
$.ajax({
    url: '../php/detail.php',
    data: { id },
    dataType: 'json',
    success: (res) => {
        let { data } = res
        // console.log(data);

        //   大图
        $('.bigBox').css('backgroundImage', `url(${data.liimg1})`)
            //   中图
        $('.middleBox>img').prop('src', data.liimg1)
            // 小图
        let s_img = `
        <img src="${data.liimg1}" middleImg='${data.liimg1}' bigImg='${data.liimg1}' class="active">
                <img src="${data.liimg2}" middleImg='${data.liimg2}' bigImg='${data.liimg2}'>
                <img src="${data.liimg3}" middleImg='${data.liimg3}' bigImg='${data.liimg3}'>
                <img src="${data.liimg4}" middleImg='${data.liimg4}' bigImg='${data.liimg4}'>`
        $('.smallBox').html(s_img)
            // 标题
        $('.xq-tittle').text(data.title1)
            // 价格
            // $('#price').text(data.gwcs1 + ' - ' + (data.price1 * 2).toFixed(2))
        $('#price').text(data.gwcs2)
            // Tab栏
        let pStr1 = `<h2>${data.title1}</h2>
            <img src="${data.liimg1}"><img src="${data.liimg2}"><img src="${data.liimg3}">`
        let pStr2 = `<h2>${data.gwcbp1}</h2><h3>${data.price1}</h3>`
        $('#p1').html(pStr1)
        $('#p2').html(pStr2)
            // $('#p3')

        // 关闭加载层
        layer.close(index);
        // 构造函数Enlarge实例化对象  放大镜
        let enlarge = new Enlarge();
        // 实例对象调用bind方法，给元素绑定事件
        enlarge.bind()
    }
})

// 数量加减
function jisuan() {
    let num = 1
        // 减
    $('.prev').click(function() {
            if (num <= 1) {
                layer.msg('已达到商品最小数量', {
                    icon: 2,
                    time: 500
                })
                return
            }
            num--
            $(this).next().text(num)
        })
        // 加
    $('.add').click(function() {
        if (num >= 10) {
            layer.msg('已达到最大数量', {
                icon: 2,
                time: 500
            })
            return
        }
        num++
        $(this).prev().text(num)
    })
}
jisuan()

// 加入购物车
$('#cart').click(() => {
    // 判断是否登录
    let username = getCookie('username');
    if (!username) {
        layer.msg('请先登录，再加入购物车', {
            icon: 2,
            time: 1500
        }, () => {
            // 跳转登录页面
            location.href = '../views/login.html'

        })
        return false

    }
    // 用户已经登录 加入购物车
    // 获取数量
    let num = Number($('.xq-numbers>.nums').text())
        // 获取并查看localstrage中是否已经存在该数据
    let data = localStorage.getItem('data')
        // console.log(data);
    if (data) {
        // 本地购物车中数据
        // 判断购物车中是否有当前要添加的商品的id,
        // 判断id与用户名
        data = JSON.parse(data);
        // console.log(data);
        let arr = data.filter(item => {
            return username === item.username && id === item.id;
        })
        if (arr.length) {
            // 之前的购物车中有这个商品的数据,只需要在之前的数量上累加
            //  console.log((arr[0].num-0) + num);
            data.forEach(item => {
                if (username === item.username && id === item.id) {
                    item.num = (arr[0].num - 0) + num
                }
            })
        } else {
            // console.log(arr);
            // 之前的购物车中没有这个商品的数据，将当前数据追加
            data.push({ username, id, num })
        }
        localStorage.setItem('data', JSON.stringify(data))
    } else {
        // 本地购物车localStorage中没有数据
        // 则将这个的购物车数据添加  [{username,id,num}]  // 用户名，商品id，选购的数量
        localStorage.setItem('data', JSON.stringify([{ username, id, num }]));
    }
    layer.msg('加入购物车成功', {
        icon: 1,
        time: 1000
    })
})


// 点击我的购物车，判断是否已经登录
$('#header>.cart').click(() => {
    // 获取用户名
    let username = getCookie('username')
        // 判断是否已经登录
    if (!username) { // 未登录执行这里
        layer.msg('您还未登录，请登录后再查看购物车', {
            icon: 5,
            time: 2000
        })
    } else { // 已经登录执行这里
        // console.log('登录了');
        // 跳转到购物车页面
        location.href = `../views/shopping.html`
    }
})