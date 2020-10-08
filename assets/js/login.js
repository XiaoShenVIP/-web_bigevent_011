$(function () {
    // 1.点击注册模块
    $("#link_reg").on("click", function () {
        $(".login_box").hide();
        $(".reg_box").show();
    });
    // 2.点击登录模块
    $("#link_login").on("click", function () {
        $(".login_box").show();
        $(".reg_box").hide();
    });
    // 3.自定义校验规则
    // var form = layui.form;
    var form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) {
            var pwd = $(".reg_box [name=password]").val();
            // console.log($(".reg_box [name=password]"));
            // 判断
            if (value !== pwd) {
                return "两次输入不一致！"
            }
        }
    })

    // 4.注册功能
    var layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("注册成功")
                $("#link_login").click();
            }

        })
    })

    // 5.登录功能
    var layer = layui.layer;
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg("登录成功")
                localStorage.setItem("token", res.token);
                location.href = '/index.html';
            }


        })
    })
})