// 定义构造函数
function Page(classname, options = {}) {
    // 创建一个放所有分页内容的大盒子
    this.box = document.createElement("div");
    // 不让box中的内容选中
    this.box.onselectstart = function() {
        return false;
    }
    // 鼠标移入变手指状态
    this.box.onmouseover = () => {
        this.box.style.cursor = 'pointer'
    }
    // 给大盒子设置样式
    this.setStyle(this.box, {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    })
    // 将创建好的大盒子放到页面中准备好的容器中
    document.querySelector("." + classname).appendChild(this.box)
    // 将用户传进来的options作为对象的属性
    this.options = options
    // 设置默认的配置参数
    this.default = {
        language: {
            first: "首页",
            prev: "上一页",
            list: null,
            next: "下一页",
            last: "尾页"
        },
        pageData: {
            total: 1000,
            pageSize: 12
        }
    }
    // 设置配置参数
    this.setDefault()
    // 设置show方法
    this.show = this.options.show || function() {}
    // 计算总页数
    this.totalPage = Math.ceil(this.default.pageData.total / this.default.pageData.pageSize)
    // 定义属性 - 用来放页码的那个div
    this.list = null
    // 定义当前页默认为1
    this.currentPage = 1
    // 创建标签
    this.createDiv()
    // 创建文本框和按钮
    this.createGo()
    // 调用初始化方法
    this.init()
}
// 设置初始化方法
Page.prototype.init = function() {
    // 创建页码
    this.createPage()
    // 点击翻页
    this.click()
    // 设置禁用项
    this.setDisabled()
    // 调用传入的show方法
    this.show(this.currentPage)
}
// 创建文本框和按钮
Page.prototype.createGo = function() {
    var input = document.createElement("input");
    input.setAttribute('type', 'number')
    this.setStyle(input, {
        width: "50px",
        height: "29px",
        border: "none",
        border: '1px solid #000',
        outline: "none",
        margin: "5px",
        paddingLeft: "8px"
    })
    this.box.appendChild(input)

    // 创建按钮
    var btn = document.createElement("button");
    btn.innerText = "GO"
    this.box.appendChild(btn)
    this.setStyle(btn, {
        width: "50px",
        height: "33px",
        border: "none",
        border: '1px solid #000',
        outline: "none",
        margin: "5px",
        backgroundColor: "skyblue"
    })
}
// 设置禁用项
Page.prototype.setDisabled = function() {
    // 判断当前页是否是1
    if (this.currentPage === 1) {
        this.box.children[0].style.backgroundColor = '#ccc'
        this.box.children[1].style.backgroundColor = '#ccc'
        this.box.children[0].setAttribute('disabled', true)
        this.box.children[1].setAttribute('disabled', true)
    } else {
        this.box.children[0].style.backgroundColor = 'transparent'
        this.box.children[1].style.backgroundColor = 'transparent'
        this.box.children[0].setAttribute('disabled', false)
        this.box.children[1].setAttribute('disabled', false)
    }
    // 判断当前页是否是最后一页
    if (this.currentPage === this.totalPage) {
        this.box.children[3].style.backgroundColor = '#ccc'
        this.box.children[4].style.backgroundColor = '#ccc'
        this.box.children[3].setAttribute('disabled', true)
        this.box.children[4].setAttribute('disabled', true)
    } else {
        this.box.children[3].style.backgroundColor = 'transparent'
        this.box.children[4].style.backgroundColor = 'transparent'
        this.box.children[3].setAttribute('disabled', false)
        this.box.children[4].setAttribute('disabled', false)
    }
}
// 点击翻页
Page.prototype.click = function() {
    // 每个子标签都要点击 - 就将所有的点击事件委托给大盒子
    this.box.onclick = e => {
        // 获取事件对象
        var e = e || window.event;
        // 根据事件对象获取目标元素
        var target = e.target || e.srcElement;
        // 判断目标元素是哪个标签，处理不同的点击事件
        if (target.className === 'first' && target.getAttribute('disabled') !== 'true') {
            // 将当前页设置为1
            this.currentPage = 1
            // 调用初始化方法
            this.init()
        } else if (target.className === 'last' && target.getAttribute('disabled') !== 'true') {
            // 将当前页设置为最后一页
            this.currentPage = this.totalPage
            // 调用初始化方法
            this.init()
        } else if (target.className === 'prev' && target.getAttribute('disabled') !== 'true') {
            // 将当前页自减
            this.currentPage--
                if (this.currentPage <= 1) {
                    this.currentPage = 1
                }
            // 调用初始化方法
            this.init()
        } else if (target.className === 'next' && target.getAttribute('disabled') !== 'true') {
            // 将当前页自减
            this.currentPage++
                if (this.currentPage >= this.totalPage) {
                    this.currentPage = this.totalPage
                }
            // 调用初始化方法
            this.init()
        } else if (target.nodeName === 'P') {
            // 将当前页自减
            this.currentPage = target.innerText - 0
            // 调用初始化方法
            this.init()
        } else if (target.nodeName === 'BUTTON') {
            this.currentPage = target.previousElementSibling.value - 0
            // 调用初始化方法
            this.init()

        }
    }
}
// 创建页码
Page.prototype.createPage = function() {
    this.list.innerHTML = '';
    // 判断总页数是否小于等于5
    if (this.totalPage <= 5) {
        // 创建1~总页数的页码
        for (var i = 1; i <= this.totalPage; i++) {
            // 创建p标签
            var p = document.createElement('p')
            // 放入页码数字
            p.innerText = i
            // 给p标签设置样式
            this.setStyle(p, {
                margin: '5px',
                padding: "5px",
                border: '1px solid #000'
            })
            if (i === this.currentPage) {
                p.style.backgroundColor = 'orange';
            }
            // 将p标签放到list放页码的div中
            this.list.appendChild(p)
        }
    } else { // 如果当前页大于5
        if (this.currentPage <= 3) { // 如果当前页<=3
            // 页码应该是1~5
            // 创建1~总页数的页码
            for (var i = 1; i <= 5; i++) {
                // 创建p标签
                var p = document.createElement('p')
                // 放入页码数字
                p.innerText = i
                // 给p标签设置样式
                this.setStyle(p, {
                    margin: '5px',
                    padding: "5px",
                    border: '1px solid #000'
                })
                if (i === this.currentPage) {
                    p.style.backgroundColor = 'orange';
                }
                // 将p标签放到list放页码的div中
                this.list.appendChild(p)
            }
        } else if (this.currentPage >= this.totalPage - 2) { // 如果当前页是最后3个页码
            // 创建1~总页数的页码
            for (var i = this.totalPage - 4; i <= this.totalPage; i++) {
                // 创建p标签
                var p = document.createElement('p')
                // 放入页码数字
                p.innerText = i
                // 给p标签设置样式
                this.setStyle(p, {
                    margin: '5px',
                    padding: "5px",
                    border: '1px solid #000'
                })
                if (i === this.currentPage) {
                    p.style.backgroundColor = 'orange';
                }
                // 将p标签放到list放页码的div中
                this.list.appendChild(p)
            }
        } else { // 其余情况，当前页-2~当前页+2
            // 创建1~总页数的页码
            for (var i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
                // 创建p标签
                var p = document.createElement('p')
                // 放入页码数字
                p.innerText = i
                // 给p标签设置样式
                this.setStyle(p, {
                    margin: '5px',
                    padding: "5px",
                    border: '1px solid #000'
                })
                if (i === this.currentPage) {
                    p.style.backgroundColor = 'orange';
                }
                // 将p标签放到list放页码的div中
                this.list.appendChild(p)
            }
        }

    }
}
// 创建标签
Page.prototype.createDiv = function() {
    // 遍历language，创建div
    for (var attr in this.default.language) {
        // 创建div
        var div = document.createElement("div");
        if (attr !== 'list') {
            // 放内容
            div.innerText = this.default.language[attr]
            // 设置样式
            this.setStyle(div, {
                margin: "5px",
                padding: "5px",
                border: "1px solid #000"
            })
        } else { // 如果创建好的div是list
            this.list = div
            // 设置样式
            this.setStyle(this.list, {
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            })
        }
        // 给div设置类名
        div.className = attr
        // 将创建好的div放在大盒子中
        this.box.appendChild(div)
    }
}
// 设置配置参数
Page.prototype.setDefault = function() {
    // 如果用户传进来的options数据中有language
    if (this.options.language) {
        // 遍历用户传进来的language
        for (var attr in this.options.language) {
            this.default.language[attr] = this.options.language[attr]
        }
    }
    // 如果用户传进来的options中有pageData
    if (this.options.pageData) {
        // 遍历用户传进来的pageData
        for (var attr in this.options.pageData) {
            this.default.pageData[attr] = this.options.pageData[attr]
        }
    }
}
// 设置样式的方法
Page.prototype.setStyle = function(ele, styleObj) {
    for (var attr in styleObj) {
        ele.style[attr] = styleObj[attr]
    }
}

// /***************************** 使用示例 ************************ */
// // 创建数据
// var arr = [];
// var firstnameStr = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨';
// var secondnameStr = '甲乙丙丁戊己庚辛壬癸';
// var thirdnameStr = '子丑寅卯辰巳午未申酉戌亥';
// for(var i=0;i<1000;i++){
//     var obj = {
//         name:firstnameStr[Math.floor(Math.random()*firstnameStr.length)] + secondnameStr[Math.floor(Math.random()*secondnameStr.length)] + thirdnameStr[Math.floor(Math.random()*thirdnameStr.length)],
//         age:Math.floor(Math.random()*100),
//         sex:'男女'[Math.floor(Math.random()*2)]
//     }
//     arr.push(obj)
// }
// console.log(arr);
// // 
// var pageSize = 12
// var page = new Page('pagiantion',{
//     pageData:{
//         total:arr.length,
//         pageSize
//     },
//     show:function(currentPage){ // 这个形参是当前页
//         // 截取数组加载页面 - 需要当前页
//         /*
//         1   前12条      arr.slice(0,12)
//         2               arr.slice(12,24)
//         3               arr.slice(24,36)
//         */
//         //    console.log(currentPage);
//         var res = arr.slice((currentPage-1)*pageSize,currentPage*pageSize)
//         document.querySelector("tbody").innerHTML = '';
//         for(var i=0;i<res.length;i++){
//             var tr = document.createElement("tr");
//             for(var attr in res[i]){
//                 var td = document.createElement("td");
//                 td.innerText = res[i][attr]
//                 tr.appendChild(td)
//             }
//             document.querySelector("tbody").appendChild(tr)
//         }
//     }
// })