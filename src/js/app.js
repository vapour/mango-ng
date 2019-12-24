angular.module('erp.wish.fbworder', ['mg.bootstrap.dropdown', 'mg.bootstrap.dialog', 'mg.bootstrap.tab', 'mg.widget.box', 'app.service', 'mg.widget.notify'<%- injectModule %>])
    <% if (useAjaxPage) { %>
    .config(['ajaxPageCfgProvider', 'paginationCfgProvider', function (ajaxPageCfgProvider, paginationCfgProvider) {
        //localStorage保存id
        paginationCfgProvider.storageId = ajaxPageCfgProvider.storageId = 'pagesize.erp';
        //默认分页数量
        paginationCfgProvider.pageSize = ajaxPageCfgProvider.pageSize = 30;
        paginationCfgProvider.extraPageSize = [300, 500];
    }])
    <% } %>
    .controller('rootCtrl', ['$scope', '$http', 'kit'<%- injectServiceName %>, function ($scope, $http, ajaxPage, kit<%- injectServiceVar %>) {
        var vm = this;
        <% if (useAjaxPage) { %>
        //ajax分页
        vm.page = ajaxPage({
            url: '/erp/order/data/wishFBW/list',
            method: 'post'
        });
        <% } %>
        <% if (useSearch) { %>
        vm.filters = [{
            _selectinput: true,
            name: 'orderId',
            label: '订单号',
            data: []
        }, {
            name: 'shops',
            label: '店铺',
            method: 'arrayOfValues',
            options: [],
            data: []
        }, {
            name: 'orderStatus',
            label: '线上状态',
            method: 'arrayOfValues',
            data: [],
            add: function (text, value, label) {
                this.data.push({
                    label: label,
                    name: text,
                    value: value
                });
            }
        }, {
            name: 'hasIssue',
            label: '纠纷',
            method: 'singleValue',
            data: []
        }, {
            _date: true,
            name: 'datetime',
            label: '下单时间',
            data: [],
            add: function (start, end) {
                //目前只允许出现一个时间
                this.clear();
                this.data.push({
                    start: start,
                    end: end
                });
            }
        }];

        bindSearch({
            vm: vm,
            key: 'orderId',
            beforePost: function (data) {
                data.history = vm.history;
            }
        });
        <% } %>
    }])
    ;
