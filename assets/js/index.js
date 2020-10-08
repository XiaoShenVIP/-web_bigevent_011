$(function () {
    // 1.获取用户信息
    getUserInfo();
    // 2.退出 
    var layer = layui.layer;
    $("#btnLogout").on("click", function () {
        // alert(111)
        layer.confirm('是否确认退出?', { icon: 3, title: '提示' }, function (index) {
            // 1.清空本地token
            localStorage.removeItem("token")
            // 2.页面跳转
            location.href = "/login.html";
            // 关闭询问框
            layer.close(index);
        });
    })
})
// 1.获取用户信息
function getUserInfo() {
    $.ajax({
        mothod: 'GET',
        url: '/my/userinfo',

        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 渲染头像
            renderAvatar(res.data)
        }
    })
}
// 渲染用户的头像
function renderAvatar(user) {

    console.log(user);
    // 1. 获取用户的名称
    var name = user.nickname || user.username
    // 2. 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3. 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img')
            .attr('src', user.user_pic)
            .show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar')
            .html(first)
            .show()
    }
}