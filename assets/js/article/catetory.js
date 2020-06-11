// 页面一打开获取表格页面
function renderCatetory() {
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            if (res.status == 0) {
                var tem = template('myTem', res);
                $('tbody').html(tem);
            }
        }
    })
}

$(function () {
    renderCatetory();


    //----------删除---------
    $('tbody').on('click', '.del', function () {
        //询问是否删除，点击确定，根据id删除信息，删除之后刷新
        var id = $(this).data('id');
        layer.confirm('确定要删除此项信息?', function (index) {
            //do something

            $.ajax({
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    // 不管有没有删除成功，都给一个提示
                    layer.msg(res.message);
                    if (res.status == 0) {
                        renderCatetory();
                    }
                }
            })
            layer.close(index);
        });
    })


    var delIndex;
    //---------添加---------------
    $('.add').on('click', function () {
        delIndex = layer.open({
            title: '添加类别',
            type: 1,
            content: $('#add').html(),
            area: ['500px', '260px']
        });
    })

    //----------添加框里的确认提交按钮，因为form表单是通过动态建立的，所以使用事件委托--------
    $('body').on('submit', '#add-form', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    layer.close(delIndex);
                    renderCatetory();
                }
            }
        })
    })

    var form = layui.form;
    var editIndex;
    // 点击编辑按钮   弹出编辑框    获取编辑这一栏的信息，让它显示在编辑框中
    $('body').on('click', '.edit', function () {
        // 获取属性    方法一：
        // var id = $(this).data('id');
        // var name = $(this).data('name');
        // var alias = $(this).data('alias');
        // h5有一个新增功能，可以一次性获取所有的具有data-的属性和值   是一个dom方法  方法二：
        var data = this.dataset;


        editIndex = layer.open({
            title: '添加类别',
            type: 1,
            content: $('#edit').html(),
            area: ['500px', '260px'],
            // 弹出框成功之后的函数
            success: function () {
                // 实现数据回显，使用layui中的val（）方法    第二个参数的键的值要和name的属性值对应
                // 方法一：
                // form.val('abc', {
                //     id: id,
                //     name: name,
                //     alias: alias
                // })
                //方法二：data是一个具有原型的对象，但是接口不需要原型，所以先（序列化）转换为字符串，就没有原型了。只保留属性，之后在转换成对象
                form.val('abc', JSON.parse(JSON.stringify(data)))
            }
        });
    })

    // 点击弹出框里面的确定按钮，发送ajax请求，更新数据
    $('body').on('submit', '#editForm', function (e) {
        e.preventDefault();
        //接口文档上面的id属性名首字母是大写的，所以data我们需要处理
        // 方法一： var data = $(this).serialize();
        //   data = 'I' + data.substr(1);
        // data = data.replace('id=','Id=')   防止其他位置有id字符串，所以加等号
        //方法二：是一个数组，每一项是一个对象
        var data = $(this).serializeArray();
        // jquery内部会自动把数组转换成字符串，所以可以直接使用
        data[0].name = 'Id';



        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: data,

            success: function (res) {
                layer.msg(res.message);
                if (res.status == 0) {
                    layer.close(editIndex);
                    renderCatetory();

                }
            }
        })
    })

})