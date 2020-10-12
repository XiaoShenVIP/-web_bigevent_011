$(function () {

    // art-template 
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data)

        var y = dt.getFullYear()
        var m = zero(dt.getMonth() + 1)
        var d = zero(dt.getDate())


        var hh = zero(dt.getHours())
        var mm = zero(dt.getMinutes())
        var ss = zero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    function zero(n) {
        return n > 9 ? n : '0' + n
    }
    // 1.定义提交参数
    var q = {
        pagenum: 1,    //是	int	    页码值
        pagesize: 2,	//是	int	    每页显示多少条数据
        cate_id: "",    //否	string	文章分类的 Id
        state: "",    //否	string	文章的状态，可选值有：已发布、草稿
    }

    // 2.初始化文章列表
    var layer = layui.layer;
    initTable();
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                var str = template("tpl-table", res);
                $("tbody").html(str);
                // 分页
                renderPage(res.total);
            }
        })
    }

    // 3.初始化分类
    var form = layui.form;
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值 渲染form
                var datas = template("tpl-cate", res);
                $("[name=cate_id]").html(datas);
                form.render();
            }

        })
    }

    // 4.筛选
    $("#form-search").on("submit", function (e) {
        e.preventDefault();

        var stats = $("[name=state]").val()
        var cate_id = $("[name=cate_id]").val()

        q.cate_id = cate_id;
        q.state = stats;
        initTable();

    })

    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,

            // layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],

            limits: [2, 3, 4, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable();
                }
            }
        });
    }


    // 6.删除

    $("tbody").on("click", '.btn-delete', function () {
        var id = $(this).attr("data-id");

        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg(res.message)
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }

            })
            layer.close(index);
        });

    })

})