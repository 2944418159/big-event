
var form = layui.form;
//为了复用，把ajax请求放在一个函数中,发送ajax请求获取用户信息，达到数据回显
function renderUser() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            if (res.status == 0) {
                //实现数据回显
                // $('form input[name=username]').val(res.data.username);
                // $('form input[name=nickname]').val(res.data.nickname);
                // $('form input[name=email]').val(res.data.email);
                // 使用layui的的表单赋值方法，前提是表单有lay-filter=""值
                form.val('abc', res.data);
            }
        },
    })
}

$(function () {
    //-------------数据回显---------------
    renderUser();

    //-----------点击修改按钮----------
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            // 不获取被禁用的属性值
            data: $(this).serialize(),

            success: function (res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    //修改成功之后要重新加载index页面，让更改的内容显示在侧栏中，之前加载页面的被封装成一个函数，在index页面中，也就是当前页面的父页面
                    window.parent.rander();
                }
            },
        })

    })


    //-----------点击重置按钮----------------
    $('button[type=reset]').on('click', function (e) {
        //重置按钮的默认行为就是清空所有数据，所以要阻止
        e.preventDefault();
        // 此处的重置是回复到之前的页面，相当于用户信息重新回显
        renderUser();

    })
})