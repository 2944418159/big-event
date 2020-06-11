$(function () {
    // ajax在发送请求的时候会被$.ajaxPrefilter()拦截，可以利用option来得到ajax的列表，还可以修改
    $.ajaxPrefilter(function (option) {
        option.url = 'http://www.liulongbin.top:3007' + option.url;
        option.headers = {
            'Authorization': localStorage.getItem('token')
        };
        option.complete = function (xhr) {
            if (xhr.responseJSON.status == 1) {
                //删除假的token
                localStorage.removeItem('token');
                location.href = '/login.html'
            }

        }
    })
})