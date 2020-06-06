$(function () {
    //点击按钮转换页面
    $('.go-reg').on('click', function () {
        $('#register').show().siblings().hide();
    })
    $('.go-login').on('click', function () {
        $('#login').show().siblings().hide();
    })


    //    完成注册的功能   使用form表单添加submit事件

    $('#register form').on('submit', function (e) {
        //阻止表单的默认跳转事件
        e.preventDefault();
        $.ajax({
            type: 'post',
            // 此处跨域，但是后台设置了响应头，所以我们不需要处理
            url: 'http://www.liulongbin.top:3007/api/reguser',
            // 表单序列化是根据name属性的，所以要查看文档里的参数，对应name属性的值
            data: $(this).serialize(),
            success: function (res) {
                //不管有没有注册成功，都应该给一个提示
                alert(res.message);
                if (res.status == 0) {
                    //如果注册成功，则显示登陆页面，让用户登陆
                    $('#register').hide().siblings().show();
                }
            }

        })
    })

    //在注册的时候规定用户名的格式，不能有空格，位数是6-12位，可以使用函数形式，也可以使用键值对的形式 规则：[判定条件,参数二是返回值]
    //使用layui内置模块，需要先加载模块
    var form = layui.form;
    form.verify({
        // len: [/^[\S]{6-12}&/, '密码不正确，请重新输入']   这个是使用数组方式验证，还可以使用函数

        //val的值来自于输入的值
        len: function (val) {
            // val表示使用这种验证方法的表单的值
            if (val.trim().length < 6 || val.trim().length > 12) {
                return '密码格式不对'
            }
        },
        //判断俩次输入的密码是否一致
        same: function (val) {
            var num = $('#one').val();
            if (num !== val) {
                return '请确认密码是否一致';
            }
        }
    })


    // 完成登录功能
    $('#login form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: 'http://www.liulongbin.top:3007/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 不管登录成功或者失败，都给一个提示
                layer.msg(res.message);
                //登录成功，跳转页面,并将token存储到本地
                if (res.status == 0) {
                    localStorage.setItem('token', res.token);
                    location.href = 'index.html';
                }
            }
        })
    })

})