var index = layer.load(1, { shade: [0.5, '#fff'] });
// 请求数据 渲染页面
$.ajax({
    url: '../php/index1.php',
    // data: {
    //     id: 2
    // },
    dataType: 'json',
    success(res) {
        let str = ''
        let { data } = res
        data.forEach(item => {
            // console.log(item.id);
            str += `
                <div id='${item.id}'>
                <img src="${item.img}">
                <article class="g-text">
                    <p>${item.title1}</p>
                    <p><span>${(Math.random())<0.5 ? '淘宝' : '天猫' }</span><span>包邮</span></p>
                    <p><span>￥${item.price1}</span><span>${item.renqi}</span><span>领券</span></p>
                </article>
            </div>
                `
        });
        $('#goods').html(str)
            // 给每个div绑定一个点击事件,并在路径后面拼接商品id
        $('#goods>div').click(function() {
                // console.log(this.id);
                location.href = `../views/detail.html?${this.id}`

            })
            // 关闭加载层
        layer.close(index);
    }

})

// 回到顶部
$(window).scroll(function() {
        // 当滚动条滚动距离达到600时，显示回到顶部按钮
        if ($(this).scrollTop() > 600) {
            $('.calltop').show()
        } else {
            // 否则隐藏回到顶部按钮
            $('.calltop').hide()
        }
    })
    // 点击回到顶部按钮，回到顶部
$('.calltop').click(function() {
    $('body,html').animate({
        scrollTop: 0
    }, 'normal')
})