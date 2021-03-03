function SliderEffect(){
    /**
      * 动态添加导航下方的滑动条
      */
    var navul = document.getElementsByClassName('navul');
    //创建div元素
    var navBtn = document.createElement('div');
    //设置css样式,注意transition:all
    navBtn.style.cssText = 'position:absolute;width:0;bottom:3px;left:0;z-index:998;height:5px;background-color:#4486d4;' +
    'box-shadow:0 0 3px #fff;transition:all .5s ease;'
    //把创建的这个div添加到ul中
    navul[0].appendChild(navBtn);
    //获取里面的a元素
    var nav_a = document.getElementsByClassName('nav_a');
    var len = nav_a.length;
    for (var i = 0; i < len; i++) {
        //currentStyle:IE的选中样式。 getComputedStyle:FF的计算后样式
        var style = nav_a[i].currentStyle || getComputedStyle(nav_a[i]);
        //style.paddingLeft得到的值是带有'px'的，所以转换成Number类型
        var pL = parseInt(style.paddingLeft, 10);
        var pR = parseInt(style.paddingRight, 10)
        //样式初始化
        navBtn.style.width = (nav_a[0].offsetWidth - pL - pR) + 'px';
        navBtn.style.left = (nav_a[0].offsetLeft + pL) + 'px';
        //给当前对象添加事件。
        nav_a[i].addEventListener('mouseenter', function () {
            //this指的是当前的这个对象
            navBtn.style.width = (this.offsetWidth - pL - pR) + 'px';
            navBtn.style.left = (this.offsetParent.offsetLeft + pL) + 'px';
        }, false);
        nav_a[i].addEventListener('mouseleave', function () {
            navBtn.style.width = (nav_a[0].offsetWidth - pL - pR) + 'px';
            navBtn.style.left = (nav_a[0].offsetLeft + pL) + 'px';
        }, false);
    }
}
function Carousel() {
    var wrap = document.querySelector(".wrap");
    var next = document.querySelector(".arrow_right");
    var prev = document.querySelector(".arrow_left");
    next.onclick = function(){
        next_pic();
    }
    prev.onclick = function(){
        prev_pic();
    }
    function showCurrentDot() {
        for (var i = 0, len = dots.length; i < len; i++) {
            dots[i].className = "";
        }
    }
    function next_pic() {
        var newLeft;
        if (wrap.style.left === "-3360px") {
            newLeft = -1120;
        } else {
            newLeft = parseInt(wrap.style.left) - 560;
        }
        wrap.style.left = newLeft + "px";
        index++;
        if (index > 4) {
            index = 0;
        }
    }
    function prev_pic() {
        var newLeft;
        if (wrap.style.left === "0px") {
            newLeft = -2240;
        } else {
            newLeft = parseInt(wrap.style.left) + 560;
        }
        wrap.style.left = newLeft + "px";
        index--;
        if (index < 0) {
            index = 4;
        }
        showCurrentDot();
    }
    var timer = null;
    function autoPlay() {
        timer = setInterval(function () {
            next_pic();
        }, 1500);
    }
    autoPlay();
    var carousel = document.querySelector(".carousel");
    carousel.onmouseenter = function () {
        clearInterval(timer);
    }
    carousel.onmouseleave = function () {
        autoPlay();
    }
    var index = 0;
    var dots = document.getElementsByTagName("span");
    for (var i = 0, len = dots.length; i < len; i++) {
        (function (i) {
            dots[i].onclick = function () {
                var dis = index - i;
                if (index == 4 && parseInt(wrap.style.left) !== -2800) {
                    dis = dis - 5;
                }
                //和使用prev和next相同，在最开始的照片5和最终的照片1在使用时会出现问题，导致符号和位数的出错，做相应地处理即可
                if (index == 0 && parseInt(wrap.style.left) !== -560) {
                    dis = 5 + dis;
                }
                wrap.style.left = (parseInt(wrap.style.left) + dis * 560) + "px";
                index = i;
                showCurrentDot();
            }
        })(i);
    }
}
function CurveChart() {
    var myChart = echarts.init(document.getElementById('curve'));
    myChart.setOption({
        title: {
            text: '曲线图数据展示',
            x: 'center'
        },
        tooltip: {},
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'line',
            smooth:true,
            data: []
        }]
    });
    myChart.showLoading();    //数据加载完之前先显示一段简单的loading动画
    $.get('https:/edu.telking.com/api/?type=month').done(function (data) {
        myChart.hideLoading();
        myChart.setOption({
            xAxis: {
                data: data.data.xAxis
            },
            series: [{
                name: '销量',
                data: data.data.series
            }]
        });
    });
}
function PieChart() {
    var myChart = echarts.init(document.getElementById('pie'));
    $.get('https:/edu.telking.com/api/?type=week').done(function (data) {
        myChart.setOption({
            title: {
                text: '饼状图数据展示',
                x: 'center'
            },
            series: [{
                name: '数量小计',
                type: 'pie',    // 设置图表类型为饼图
                radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                data: (function () {
                    var res = [];
                    var len = data.data.series.length;
                    while (len--) {
                        res.push({
                            name: data.data.xAxis[len],
                            value: data.data.series[len]
                        });
                    }
                    return res;
                })()
            }]
        });
    });
}
function BarChart() {
    var myChart = echarts.init(document.getElementById('bar'));
    myChart.setOption({
        title: {
            text: '柱状图数据展示',
            x: 'center'
        },
        tooltip: {},
        xAxis: {
            data: []
        },
        yAxis: {
            name:'商品数'
        },
        series: [{
            name: '销量',
            type: 'bar',
            data: []
        }]
    });
    myChart.showLoading();    //数据加载完之前先显示一段简单的loading动画
    $.get('https:/edu.telking.com/api/?type=week').done(function (data) {
        myChart.hideLoading();
        myChart.setOption({
            xAxis: {
                data: data.data.xAxis
            },
            series: [{
                name:'销量',
                data: data.data.series
            }]
        });
    });
}


    