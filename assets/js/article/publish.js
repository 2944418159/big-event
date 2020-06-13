$(function () {
    var form = layui.form;
    // 实现富文本应用
    initEditor()
    // 点击下拉框，让它自动获取类名，利用模板
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            if (res.status == 0) {
                var str = template('stm', res);
                $('select').html(str);
                // 获取信息之后在重新渲染下拉框
                form.render('select');
            }
        }
    })


    // 剪裁区域处理
    //获取剪裁区
    var $img = $('#image');
    // 配置选项
    const option = {
        // 宽高比
        aspectRatio: 400 / 280,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 创建剪裁区
    $img.cropper(option);

    // 点击选择封面按钮，可以选择文件上传
    $('.img-btn').on('click', function () {
        $('#file').click();

    })

    // 更换裁剪区图片
    $('#file').on('change', function () {
        // 获取上传的图片
        var file = this.files[0];


        var url = URL.createObjectURL(file);


        $img.cropper('destroy').attr('src', url).cropper(option);

    })

    //文章状态用一个变量表示
    var s;
    // $(":contains('W3School')")	包含指定字符串的所有元素
    $('button:contains("发布")').on('click', function () {
        s = '已发布';
    })
    $('button:contains("存为草稿")').on('click', function () {
        s = '草稿';
    })

    // 提交表单
    $('form').on('submit', function (e) {
        e.preventDefault();
        // 文档接口要求是formdata格式
        var data = new FormData(this);
        // 追加点击的是哪个按钮，或者说是文章状态
        data.append('state', s);
        // 处理图片,将图片转变为blob二进制格式
        var blobURL = $img.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        });     //得到一个canvas画布


        blobURL.toBlob(function (blob) {
            // console.log(blob);
            // 利用canvas的方法将图片转换为二进制格式
            data.append('cover_img', blob);
            $.ajax({
                type: 'post',
                url: '/my/article/add',
                data: data,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status == 0) {
                        // 文章发布成功之后，跳转到文章列表
                        location.href = '/article/article.html';
                    }
                },
                processData: false, // 告诉jQuery，不要把data转成字符串。
                contentType: false
            })

        })



    })
})