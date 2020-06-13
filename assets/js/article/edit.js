$(function () {

    var form = layui.form;
    var id = location.search;    //这个方法是获取参数的，结果是?id=1417
    id = id.substr(4);   //通过截取获取到id
    // console.log(id);



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
            // 实现富文本应用
            initEditor()
            //保证分类获取成功之后，在渲染页面
            $.ajax({
                url: '/my/article/' + id,
                success: function (res) {
                    // 获取文章分类成功之后渲染页面
                    if (res.status == 0) {
                        form.val('edit-form', res.data)
                        // 图片需要我们自己修改
                        $img.cropper('destroy').attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img).cropper(option);
                    }

                }
            })

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
        preview: '.img-preview',
        // 让剪裁区和图片一样大
        autoCropArea: 1
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
        // 文档接口要求是formdata格式    这里可以获取到表单中所有具有name属性的值，但是有一个bug，富文本编辑器的内容不能实时更新，所以需要我们单独修改
        var data = new FormData(this);
        // 获取富文本编辑器的内容
        data.set('content', tinyMCE.activeEditor.getContent());
        // 追加点击的是哪个按钮，或者说是文章状态
        data.append('state', s);
        // 处理图片,将图片转变为blob二进制格式
        var blobURL = $img.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        });     //得到一个canvas画布


        blobURL.toBlob(function (blob) {
            console.log(blob);
            // 利用canvas的方法将图片转换为二进制格式
            data.append('cover_img', blob);
            data.append('Id', id);
            $.ajax({
                type: 'post',
                url: '/my/article/edit',
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