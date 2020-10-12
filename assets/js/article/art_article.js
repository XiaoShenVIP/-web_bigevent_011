$(function () {
    // 1.文章类别列表渲染
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                var str = template("tpl-art-cate", res);

                $("tbody").html(str);
            }
        })
    }


    // 2. 添加文章列表
    var layer = layui.layer;
    $("#btnAdd").on("click", function () {
        btnAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-add").html(),
        });
    })
    var btnAdd = null;
    // 3. post 文章分类  事件委托
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        // alert($(this).serialize())
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("添加失败！")
                }
                initArtCateList();
                layer.msg("添加成功！");
                layer.close(btnAdd);
            }
        })
    })

    // 4  edit 文章  
    var btnEdit = null;
    var form = layui.form;
    $("tbody").on("click", ".btn-edit", function () {
        //4.1 渲染一个弹出框
        btnEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '260px'],
            content: $("#dialog-edit").html(),
        });
        // 4.2 获取Id  ，发送ajax 渲染弹出框
        var Id = $(this).attr("data-id");
        // alert(Id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function (res) {
                form.val("form-edit", res.data)
            }
        })
        // 
    })

    // 5.submit  文章
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('编辑失败!')
                }
                initArtCateList();
                layer.msg('编辑成功!');
                layer.close(btnEdit);
            }
        })
    })

    // 6.delete 文章
    $("tbody").on("click", ".btn-delete", function () {
        // 6.4获取Id
        var Id = $(this).attr("data-id");
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!');
                    }
                    initArtCateList();
                    layer.msg('删除成功!')
                    layer.close(index);
                }
            })
        });
    })

})  