angular.module('erp.wish.fbworder', ['mg.bootstrap.dropdown', 'mg.bootstrap.dialog', 'mg.bootstrap.tab', 'mg.widget.box', 'app.service', 'mg.widget.notify'])

    .config(['ajaxPageCfgProvider', 'paginationCfgProvider', function (ajaxPageCfgProvider, paginationCfgProvider) {
        //localStorage保存id
        paginationCfgProvider.storageId = ajaxPageCfgProvider.storageId = 'pagesize.erp.wishfbworder';
        //默认分页数量
        paginationCfgProvider.pageSize = ajaxPageCfgProvider.pageSize = 30;
        paginationCfgProvider.extraPageSize = [300, 500];
    }])

    .controller('rootCtrl', ['$scope', '$http', 'kit', 'bindSearch', function ($scope, $http, ajaxPage, kit, bindSearch) {
        var vm = this;
        //ajax分页
        vm.page = ajaxPage({
            url: '/erp/order/data/wishFBW/list',
            method: 'post'
        });

        vm.filters = [{
            _selectinput: true,
            name: 'orderId',
            label: '订单号',
            data: []
        }, {
            _selectinput: true,
            name: 'traceId',
            label: '跟踪号',
            data: []
        }, {
            _selectinput: true,
            name: 'productIds',
            label: '产品ID',
            data: []
        }, {
            _selectinput: true,
            name: 'sku',
            label: '线上sku',
            data: []
        }, {
            _selectinput: true,
            name: 'goodsCodes',
            label: '本地sku',
            data: []
        }, {
            _selectinput: true,
            name: 'buyer',
            label: '买家',
            data: []
        }, {
            name: 'shops',
            label: '店铺',
            method: 'arrayOfValues',
            options: [],
            data: []
        }, {
            name: 'country',
            label: '国家',
            method: 'arrayOfValues',
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
            name: 'isRefunded',
            label: '退款',
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

        vm.search.post = function () {
            var arr;
            var filter = this.getFilter(this.key);
            if (filter && this.value) {
                var v = kit.ctoH(this.value);
                switch (this.key) {
                    case 'orderId':
                    case 'traceId':
                    case 'productIds':
                        arr = v.match(/([a-z0-9\-@]+)/gi);
                        _.each(arr, function (str) {
                            filter.add(str);
                        });
                        break;
                    case 'buyer':
                        arr = v.split(/\s*[;,，。]\s+/);
                        _.each(arr, function (str) {
                            filter.add(str);
                        });
                        break;
                    default:
                        filter.add(v);
                        break;

                }
                //搜索完成后, 置空
                this.value = '';
            }
        };
    }])
    ;
