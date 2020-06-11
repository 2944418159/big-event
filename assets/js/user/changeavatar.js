$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');

    // 1.2 配置选项     const定义的变量是不可以修改的，而且必须初始化
    const options = {
        // 纵横比   剪裁框的宽高比
        aspectRatio: 1,
        // 指定预览区域   是一个dom元素，必须通过querySelect可以获取到
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    //-------------点击上传按钮，上传图片-----------
    /*
       在js中，只有一种类型的可以上传文件，那就是input-file，可以通过点击上传事件按钮触发input这个按钮的事件
    */
    $('.goto').on('click', function () {

        $('input[type=file]').click();


    })



    //---------------有问题----------------

    //----------上传图片之后，获取url地址，改变剪裁框中的图片-----------
    $('input[type=file]').on('change', function () {
        // 获取上传的文件对象

        var file = this.files[0];

        // 得到上传文件对象的url地址
        var url = URL.createObjectURL(file);

        // 将图片显示在剪裁框中，剪裁框一旦确定了图片就无法改变，只有销毁了之后在重新创建才可以
        $image.cropper('destroy').attr('src', url).cropper(options);
    })

    //----------点击确定按钮，裁剪图片，提交ajax，改变头像----------
    $('.sure').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/.png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    // 更换成功，刷新页面，父页面的
                    window.parent.rander();
                }
            },
        })
    })
})
