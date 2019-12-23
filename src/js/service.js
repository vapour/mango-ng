angular.module('app.service', ['ngMessages'])
    .factory('kit', ['$q', 'mgAlert', 'mgWidgetNotify', function ($q, mgAlert, mgWidgetNotify) {
        var exports = {
            notify: function (msg, option) {
                option = angular.extend({ position: 'top' }, option);
                mgWidgetNotify.set(msg, option);
            },
            bridge: function (options) {
                var id = options.id;
                var fn = options.fn;
                if (id) {
                    return $q.when(fn([id], options));
                } else {
                    return options.page.getCheckedIds(options).then(function (ids) {
                        return fn(ids, options);
                    });
                }
            },
            /*
             * options.response  ajax返回数据
             * options.modal    modal
             * options.success    function
             *
             */
            handleResult: function (options) {
                var res = options.response;
                var errorArr = [];
                if (res.data) {
                    errorArr = res.data.error;
                } else {
                    errorArr = res.error;
                }
                var page = options.page;
                if (res.success) {
                    page.reload().then(function () {
                        showError();
                    });
                    if (options.success) {
                        options.success();
                    }
                } else {
                    page.box = { type: 'close' };
                    if (showError()) {
                        /*
                         * 如果批量操作有错误
                         */
                        if (options.modal) {
                            options.modal.cancel();
                        }
                        return;
                    }
                    if (options.modal) {
                        options.modal.box = { type: 'danger', msg: res.msg };
                    } else {
                        mgAlert.error({
                            title: '系统错误',
                            description: res.msg
                        });
                    }
                }

                function showError() {
                    if (errorArr && errorArr.length) {
                        angular.forEach(errorArr, function (errorItem) {
                            var findItem = _.find(page.list, function (item) {
                                if (item.id === parseInt(errorItem.id, 10) || item.orderId === errorItem.id) {
                                    return true;
                                }
                            });
                            if (findItem) {
                                findItem._status = false;
                                findItem._msg = (errorItem.code ? '[' + errorItem.code + ']' : '') + errorItem.msg;
                            }
                        });
                        return true;
                    }
                }
            },
            //全角转半角
            ctoH: function (str) {
                var result = '', code, ss;
                str = (str || '').replace(/\s+/, ' ');
                for (var i = 0, len = str.length; i < len; i++) {
                    code = str.charCodeAt(i);
                    if (code === 12288) {
                        //全角空格转换
                        result += String.fromCharCode(code - 12256);
                        continue;
                    }
                    if (code > 65280 && code < 65375) {
                        /*
                         *  "！", "＂", "＃", "＄", "％", "＆", "＇", "（", "）",
                         *  "＊", "＋", "，", "－", "．", "／", "０", "１", "２",
                         *  "３", "４", "５", "６", "７", "８", "９", "：", "；", 
                         *  "＜", "＝", "＞", "？", "＠", "Ａ", "Ｂ", "Ｃ", "Ｄ",
                         *  "Ｅ", "Ｆ", "Ｇ", "Ｈ", "Ｉ", "Ｊ", "Ｋ", "Ｌ", "Ｍ",
                         *  "Ｎ", "Ｏ", "Ｐ", "Ｑ", "Ｒ", "Ｓ", "Ｔ", "Ｕ", "Ｖ",
                         *  "Ｗ", "Ｘ", "Ｙ", "Ｚ", "［", "＼", "］", "＾", "＿",
                         *  "｀", "ａ", "ｂ", "ｃ", "ｄ", "ｅ", "ｆ", "ｇ", "ｈ",
                         *  "ｉ", "ｊ", "ｋ", "ｌ", "ｍ", "ｎ", "ｏ", "ｐ", "ｑ",
                         *  "ｒ", "ｓ", "ｔ", "ｕ", "ｖ", "ｗ", "ｘ", "ｙ", "ｚ", 
                         *  "｛", "｜", "｝", "～"]
                         *
                         */
                        result += String.fromCharCode(code - 65248);
                    } else {
                        ss = String.fromCharCode(code);
                        switch (ss) {
                            case '。':
                                ss = '.';
                                break;
                            case '“':
                            case '”':
                                ss = '"';
                                break;
                            case '‘':
                            case '’':
                                ss = '\'';
                                break;
                            case '【':
                                ss = '[';
                                break;
                            case '】':
                                ss = ']';
                                break;

                        }
                        result += ss;
                    }
                }
                return result;
            }
        };
        // 通用回调数据处理方法
        function _handle(response, key) {
            var res = response.data;
            if (res.success) {
                return $q.when(res.data[key]);
            } else {
                mgAlert.error(res.msg);
                return $q.reject();
            }
        }
        return exports;
    }])
    ;
