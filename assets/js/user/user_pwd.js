$(function () {
    // 1.定义校验规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 1.1 password
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 1.2  samePwd
        samePwd: function (value) {
            if (value == $("[name=oldPwd]").val()) {
                return '新旧密码不能一样！'
            }
        },
        // 1.3  rePwd
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 2.修改密码
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("密码修改失败！");
                }
                layer.msg("密码修改成功！");
                $(".layui-form")[0].reset();
            }
        })
    })


})
