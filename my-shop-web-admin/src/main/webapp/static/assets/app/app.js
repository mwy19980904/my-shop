var App = function () {

    // ICheck
    var _masterCheckbox;
    var _checkbox;

    // 用户存放 ID 得数组
    var _idArray;

    /**
     * 私有方法
     */
    var handlerCheckbox = function () {
        // 激活
        $('input[type="checkbox"].minimal, input[type="radio"].minimal').iCheck({
            checkboxClass: 'icheckbox_minimal-blue',
            radioClass   : 'iradio_minimal-blue'
        });

        // 获取控制 Checkbox
        _masterCheckbox = $('input[type="checkbox\"].minimal.icheck_master');

        // 获取全部 Checkbox 集合
        _checkbox = $('input[type="checkbox\"].minimal');
    };

    /**
     *  checkbox 全选功能
     */
    var handlerCheckBoxAll = function () {
        _masterCheckbox.on("ifClicked", function (e) {
            // 返回 true 表示未选中
            if (e.target.checked){
                _checkbox.iCheck("uncheck");
            }

            // 选中状态
            else {
                _checkbox.iCheck("check");
            }
        });
    };

    /**
     * 批量删除
     */
    var handlerDeleteMulti = function (url) {
        _idArray = new Array();

        // 将选中元素得 ID 放入数组中
        _checkbox.each(function () {
            var _id = $(this).attr("id");
            if (_id != null && _id != "undefine" && $(this).is(":checked")) {
                _idArray.push(_id);
            }
        });

        // 判断用户是否选择了数据项
        if (_idArray.length === 0) {
            $("#modal-message").html("您还没有选中任何数据项, 请至少选中一项");
        } else {
            $("#modal-message").html("您确定删除数据项嘛?");
        }

        // 点击删除按钮时弹出模态框
        $("#modal-default").modal("show");

        // 如果用户选择了数据项则调用删除方法
        $("#btnModalOK").bind("click", function () {
            del();
        });

        /**
         * 当前私有函数得私有函数, 删除数据
         */
        function del() {
            $("#modal-default").modal("hide");

            // 如果没有选择数据项得处理
            if (_idArray.length === 0) {
                //..
                // $("#modal-default").modal("hide");
            }

            // 否则, 删除操作
            else {
                setTimeout(function () {
                    $.ajax({
                        "url": url,
                        "type": "POST",
                        "data": {"ids" : _idArray.toString()},
                        "dataType": "JSON",
                        "success": function (data) {
                            // 请求成功后, 无论是成功或是失败都需要弹出模态框进行提示, 所以这里需要解绑原来得 click 事件
                            $("#btnModalOK").unbind("click");

                            // 删除成功
                            if (data.status === 200) {
                                // 刷新页面
                                $("#btnModalOK").bind("click", function () {
                                    window.location.reload();
                                });
                            }

                            // 删除失败
                            else {
                                // 确定按钮得事件 改为隐藏模态框
                                $("#btnModalOK").bind("click", function () {
                                    $("#modal-message").modal("hide");
                                });
                            }

                            // 因为无论如何都需要提示信息, 所以这里得模态框是必须调用得
                            $("#modal-message").html(data.message);
                            $("#modal-default").modal("show");
                        }
                    })
                }, 500);
            }
        }
    };

    /**
     * 初始化 DataTables
     */
    var handlerInitDataTables = function (url, columns) {
        var _dataTable = $("#dataTable").DataTable({
            "paging": true,
            "info": true,
            "lengthChange": false,
            "ordering": false,
            "processing": true,
            "searching": false,
            "serverSide": true,
            "deferRender": true,
            "ajax": {
                "url": url,
            },
            "columns": columns,
            language: {
                "sProcessing": "处理中...",
                "sLengthMenu": "显示 _MENU_ 项结果",
                "sZeroRecords": "没有匹配结果",
                "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
                "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix": "",
                "sSearch": "搜索:",
                "sUrl": "",
                "sEmptyTable": "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands": ",",
                "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "上页",
                    "sNext": "下页",
                    "sLast": "末页"
                },
                "oAria": {
                    "sSortAscending": ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            },
            "drawCallback" : function (settings) {
                handlerCheckbox();
                handlerCheckBoxAll();
            }
        });

        return _dataTable;
    };

    /**
     * 查看详情
     * @param url
     */
    var hanlderShowDetail = function (url) {
        // 这里是通过 ajax 请求 html 得方式 将jsp 装载进模态框
        $.ajax({
            url: url,
            type: "get",
            dataType: "html",
            success: function (data) {
                $("#modal-detail-body").html(data);
                $("#modal-detail").modal("show");
            }
        });
    };

    return {
        /**
         * 初始化
         */
        init: function(){
            handlerCheckbox();
            handlerCheckBoxAll();
        },

        /**
         * 批量删除
         * @param url
         */
        deleteMulti: function (url) {
            handlerDeleteMulti(url);
        },

        /**
         * 初始化 DataTables
         * @param url
         * @param columns
         * @returns {jQuery}
         */
        initDataTables: function (url, columns) {
            return handlerInitDataTables(url, columns);
        },

        /**
         * 显示详情
         * @param url
         */
        showDatail: function (url) {
            hanlderShowDetail(url);
        }
    }
}();

$(document).ready(function () {
    App.init();
});