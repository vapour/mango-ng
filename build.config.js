/**
 * This file/module contains all configuration for the build process.
 */
module.exports = {
    base: {
        dev: '/'
    },
    pkg: {
        debug: false,
        name: '<%= name %>',
        description: '<%= description %>',
        version: "1.0",
        module: '<%= module %>',
        //浏览器访问
        url: '/<%= url %>',
        //java页面访问地址
        htm: '/<%= url %>',

        /*
         * 如果不包含版本号，则默认使用最新版本
         * 建议指定版本号，避免未来组件变化引起错误
         *
         * layout中默认加载了alert/box/dialog/dropdown/tab
         *
         */
        require: [
            <% requires.forEach(function (mod, index) {
                if (index !== requires.length - 1) {
                    %>
            '<%= mod %>',
            <% } else { %>
            '<%= mod %>'
            <% }
            }) %>
        ]
    },

    build_dir: 'build',
    compile_dir: 'bin',

    location: {
        vapour: '/Users/vapour/Documents/work/mangoerp/src/main/webapp/WEB-INF/views/erp/index.jsp',
        wuyd: 'D:/Java_B_2016wuydjsp/src/main/webapp/WEB-INF/views/erp/index.jsp',
        chenxin: 'D:/myCode/asset/shippingTpte/20180424_wjb_jst/src/main/webapp/WEB-INF/views/erp/index.jsp'
    },

    //第三方框架
    vendor: {
        js: [
            <% 
            vendors.forEach(function (src, index) {
                if (index !== vendors.length - 1) {
            %>
            '<%= src %>',
            <% } else { %>
            '<%= src %>'
            <% }
            }) %>
        ],
        css: [
        ]
    }
};
