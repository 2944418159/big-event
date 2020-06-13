$(function () {
    // 面板中下拉框不显示，使用下拉框需要加载form模块，并且更新渲染
    var form = layui.form;
    form.render('select');

    var data = {
        pagenum: 1,     //页码值    通过更改页码值可以控制页面显示的内容
        pagesize: 2,     //每页显示多少条数据
        // cate_id    文章分类的id
        // state   文章的状态
    }

    function renderActical() {
        $.ajax({
            url: '/my/article/list',
            data: data,
            success: function (res) {

                if (res.status == 0) {
                    var str = template('page', res);
                    $('tbody').html(str);
                    // 代表当前所有的数据条数   res.total  不可以设置全局，因为是异步的
                    // 请求完成执行分页，为了获取后台的数据总数
                    showPage(res.total)
                }

            }
        })
    }
    renderActical();





    // 点击删除按钮，弹出询问框，点击确定发送ajax到后台，删除数据，更新页面
    // 因为是动态添加的，所以使用事件委托

    $('tbody').on('click', '.del', function () {
        var id = $(this).data('id');
        // console.log(id);

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    layer.msg(res.message);
                    if (res.status == 0) {
                        renderActical();
                    }
                }
            })
            layer.close(index);
        });
    })


    var laypage = layui.laypage;
    // 使用分页
    function showPage(t) {

        laypage.render({
            elem: 'showPage',   //指向存放分页容器的id
            count: t, //数据总数，从服务端得到
            limit: data.pagesize,
            limits: [5, 10, 15],
            curr: data.pagenum,         //curr意思是当前页
            layout: ['limit', 'prev', 'page', 'next', , 'skip', 'count'],  //自定义排版    控制排版的顺序
            jump: function (obj, first) {

                //obj包含了当前分页的所有参数，比如：

                // console.log(obj.curr);
                //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行  first表示这个函数第一次执行，后续点击之后first是undefined 作用是让页面刷新的时候只执行一次
                if (!first) {
                    //do something
                    data.pagenum = obj.curr;
                    data.pagesize = obj.limit;
                    renderActical();
                }
            }
        });
    }


    // 获取分类
    $.ajax({
        url: '/my/article/cates',
        success: function (res) {
            var tem = template('classify', res);
            $('.classify').html(tem);
            // 因为是动态创建之后，需要更新页面
            form.render('select');
        }
    })

    //表单提交事件
    $('form').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中的name属性的值   为了更好判断，此处可以选择数组的形式
        var p = $(this).serializeArray();
        console.log(p);

        // 判断分类是否有选中
        if (p[0].value) {
            data.cate_id = p[0].value;
        } else {
            // 也可以使用delete删除对象的属性
            data.cate_id = null;
        }

        // 判断状态
        if (p[1].value) {
            data.state = p[1].value;
        } else {
            data.state = null;
        }

        // 搜索之后默认查看第一页
        data.pagenum = 1;
        // 设置好data所有需要修改的内容之后，在重新渲染页面，让想要的结果展示
        renderActical();
    })

})