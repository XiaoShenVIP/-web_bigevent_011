var baseURL = "http://ajax.frontend.itheima.net";


$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;
    // console.log(params);

    // 2.权限接口  配置头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem("token" || "")
        }
    }
    // 3.身份认证判断
    params.complete = function (res) {
        // console.log(res);
        // 权限认证
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 1.删除本地 token
            localStorage.removeItem("token");
            // 2.页面跳转
            location.href = '/login.html';
        }
    }
})