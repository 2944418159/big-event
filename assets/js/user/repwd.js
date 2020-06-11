$(function () {
    /*
       原密码不能和新密码相同
       长度在6-12之间
       俩次输入新的密码一致
    */
    // --------------使用表单模板验证----------------
    var form = layui.form;
    form.verify({
        len: [/^[\S]{6,12}$/, '密码长度必须在6-12位'],
        dif: function (val) {
            if (val == $('.oldPwd').val()) {
                return '原密码和新密码不可以一致'
            }
        },
        same: function (val) {
            if (val !== $('.newPwd').val()) {
                return '俩次密码不一致'
            }
        }

    })

    //------------------完成密码重置功能-------------
    $('.layui-card form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            // 接口以my开头，所以需要设置响应头
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                //不管是否修改成功，都要给一个提示
                layer.msg(res.message);
                if (res.status == 0) {
                    //登录成功之后，清空表单
                    $('form')[0].reset();
                }
            },

        })
    })
})