
var form = layui.form;
//为了复用，把ajax请求放在一个函数中,发送ajax请求获取用户信息，达到数据回显
function renderUser() {
    $.ajax({
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        success: function (res) {
            if (res.status == 0) {
                //实现数据回显
                $('form input[name=username]').val(res.data.username);
                $('form input[name=nickname]').val(res.data.nickname);
                $('form input[name=email]').val(res.data.email);
            }
        },
        headers: {
            'Authorization': localStorage.getItem('token')
        },
        complete: function (xhr) {
            if (xhr.responseJSON.status == 1 && xhr.responseJSON.message === '身份认证失败！') {
                //假token和过期token返回登录页面
                window.parent.location.href = '/login.html';
                //清除token
                localStorage.removeItem('token');
            }

        }
    })
}

$(function () {
    renderUser();
})