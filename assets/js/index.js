$(function () {
    //页面一打开，通过ajax发送请求，获取用户的信息，并渲染到页面中
    rander();

    //退出部分
    $('#leave').on('click', function () {


        //    点击退出，弹出确认框，点击确认


        layer.confirm('你确定要退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            /*
               1.跳转到登录页面
                2.销毁token
            */
            localStorage.removeItem('token');
            location.href = '/login.html';
            layer.close(index);
        });

    })


})

//为了复用将ajax请求放在一个函数中
function rander() {
    $.ajax({
        // type: 'get',  不写的话默认就是get
        url: '/my/userinfo',
        // jquery中通过headers设置请求头，访问以my开开头的网址需要携带密钥，token，之前在登录页面将token存储在本地存储中

        success: function (res) {
            //登录成功之后将昵称或者用户名显示在欢迎句后面   有昵称先显示昵称，没有昵称显示用户名
            if (res.status == 0) {
                var name = res.data.nickname || res.data.username;

                $('.hyname').text(name);
                //判断是否有自己设置头像，没有头像的话使用原始头像（用户名首字母的大写）
                if (res.data.user_pic) {
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.touxiang').hide();
                } else {
                    $('.layui-nav-img').hide();
                    var t = name.substr(0, 1).toUpperCase();     //截取第一个字母大写
                    // 让之前隐藏的默认头像显示
                    $('.touxiang').text(t).css('display', 'inline-block');
                }
            }
        },
        // complete中接受结果是使用的xhr
        // 如果有人自己创造了一个token，这个时候就需要判断这个token的真假了，根据ajax返回结果判断
        //会出现一闪而过的首页，等待ajax请求完毕之后就会退出登录页面
        // 在公共js中设置了
    })
}