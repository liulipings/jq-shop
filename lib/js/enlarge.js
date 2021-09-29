// 创建放大镜Enlarge构造函数
function Enlarge() {
    // 获取要操作的元素，并放到实例对象的属性中
    this.box = document.querySelector('.box');
    this.middleBox = document.querySelector('.middleBox');
    this.middleImg = document.querySelector('.middleBox > img');
    this.shade = document.querySelector('.shade');
    this.bigBox = document.querySelector('.bigBox');
    this.smallImgs = document.querySelectorAll('.smallBox > img');
}
// 给原型添加一个bind方法，实现元素的事件绑定(小图片的点击事件，中盒子的鼠标移入移出移动事件)
Enlarge.prototype.bind = function() {
    // 遍历this.smallImgs 给每一个图片绑定点击事件
    for (let i = 0; i < this.smallImgs.length; i++) {
        this.smallImgs[i].onclick = () => {
            // 调用tab方法 点击小图片实现样式切换
            this.tab(this.smallImgs[i]);
        }
    }

    // 中盒子的鼠标移入移出移动事件
    this.middleBox.onmouseenter = () => {
        // 鼠标移入显示遮罩层
        this.shade.style.display = 'block';
        this.bigBox.style.display = 'block';
        this.middleBox.onmousemove = (e) => {
            e = e || window.event;
            // 调用move方式实现 鼠标在中盒子中移动,遮罩层跟随移动
            this.move(e)
        }
    }
    this.middleBox.onmouseleave = () => {
        // 鼠标移入隐藏遮罩层
        this.shade.style.display = 'none';
        this.bigBox.style.display = 'none';
        // 将中盒子的鼠标移动事件清除
        this.middleBox.onmousemove = null;
    }
}

// 在原型中添加一个tab方法，实现（点击小图片）样式的切换(小图片边框样式切换，中盒子和大盒子的图片切换)
Enlarge.prototype.tab = function(ele) {
    // 切换小图片的边框样式
    // 清除所有的小图片的边框样式
    for (let i = 0; i < this.smallImgs.length; i++) {
        this.smallImgs[i].className = '';
    }
    // 将点击的图片添加样式
    ele.className = 'active';
    // 切换中盒子和大盒子的图片
    // 获取到大图片和中图片
    let bigImg = ele.getAttribute('bigImg');
    let middleImg = ele.getAttribute('middleImg');
    // 改变中盒子和大盒子中的图片
    this.middleImg.setAttribute('src', middleImg);
    this.bigBox.style.backgroundImage = `url(${bigImg})`;
}

// 原型添加一个move方法，实现鼠标在盒子中移动，遮罩层跟随移动
Enlarge.prototype.move = function(e) {
    // 获取鼠标相对于页面左上角的坐标
    let x = e.pageX;
    let y = e.pageY;
    // 获取遮罩层的一半宽高
    let shadeWidthBan = this.shade.clientWidth / 2;
    let shadeHeightBan = this.shade.clientHeight / 2;
    // 获取中盒子到上和左边的距离
    let boxLeft = this.box.offsetLeft;
    let boxTop = this.box.offsetTop;
    // 判断鼠标在中盒子中移动的最小最大值
    if (x < shadeWidthBan + boxLeft) {
        x = shadeWidthBan + boxLeft;
    }
    if (y < shadeHeightBan + boxTop) {
        y = shadeHeightBan + boxTop;
    }
    if (x > boxLeft + this.middleBox.clientWidth - shadeWidthBan) {
        x = boxLeft + this.middleBox.clientWidth - shadeWidthBan;
    }
    if (y > boxTop + this.middleBox.clientHeight - shadeHeightBan) {
        y = boxTop + this.middleBox.clientHeight - shadeHeightBan;
    }
    // 将计算好的坐标赋值遮罩层
    this.shade.style.left = x - boxLeft - shadeWidthBan + 'px';
    this.shade.style.top = y - boxTop - shadeHeightBan + 'px';
    // 调用bigImgMove方法实现 遮罩层移动，大盒子中的背景图也移动
    this.bigImgMove()
}

// 原型中添加一个bigImgMove方法，实现大盒子中图片的移动
Enlarge.prototype.bigImgMove = function() {
    // 获取遮罩层相对中盒子的坐标
    let shadeX = parseInt(getStyle(this.shade, 'left'));
    let shadeY = parseInt(getStyle(this.shade, 'top'));

    // 获取大盒子背景图的尺寸
    let bigImgSize = getStyle(this.bigBox, 'background-size');
    // console.log(bigImgSize.split(' ')[0]);
    let bigImgWidth = parseInt(bigImgSize.split(' ')[0]);
    let bigImgHeight = parseInt(bigImgSize.split(' ')[1]);

    /* 遮罩层移动的距离/中盒子的尺寸 = 大盒子图片移动的距离/大盒子背景图尺寸 */

    // 获取水平和垂直的百分比
    let xPercent = shadeX / this.middleBox.clientWidth;
    let yPercent = shadeY / this.middleBox.clientHeight;

    // 根据百分比计算大盒子中背景图移动的距离
    let bigImgMoveX = bigImgWidth * xPercent;
    let bigImgMoveY = bigImgHeight * yPercent;
    // 将计算好的值赋值给大盒子
    this.bigBox.style.backgroundPosition = `-${bigImgMoveX}px -${bigImgMoveY}px`;
}


// 构造函数Enlarge实例化对象
// let enlarge = new Enlarge();
// 实例对象调用bind方法，给元素绑定事件
// enlarge.bind()


// 获取元素的样式函数
function getStyle(ele, style) {
    try {
        return window.getComputedStyle(ele)[style];
    } catch (error) {
        return ele.currentStyle[style];
    }
}