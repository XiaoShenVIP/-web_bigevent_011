$(function () {
    // 初始化分类
    var form = layui.form;
    var layer = layui.layer;
    initCate();
    function initCate() {

        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr)
                form.render();
            }
        })

    }
    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 4.点击按钮选择图片
    $("#btnChangeImage").on("click", function () {
        $("#coverFile").click();
    })

    // 5.设置图片
    $("#coverFile").on("change", function (e) {
        var file = e.target.files[0]

        if (file.length == 0) {
            return layer.msg('请选择图片')
        }

        var newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    // 6.设置状态

    var state = '已发布';
    $("#btnSave2").on("click", function () {
        state = '草稿'
    })

    // 7.添加文章
    $("#form-pub").on("submit", function (e) {
        e.preventDefault();

        var fd = new FormData(this);
        // console.log(...fd);
        fd.append("state", state)

        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 6. 发起 ajax 数据请求
                publishArticle(fd);
            })


    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('提交成功')
                // 跳转
                setTimeout(function () {
                    window.parent.document.querySelector("#btn_list").click();
                }, 500)
            }
        })
    }
})