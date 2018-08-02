import regeneratorRuntime from './assets/js/wxPromise.min.js';
let QQMapWX = require('./assets/js/qqmap-wx-jssdk.min.js');

App({
    onLaunch: function() {
        let userInfo = wx.getStorageSync('userInfo');

        this.globalData.qqmapsdk = new QQMapWX({
            // 输入腾讯地图的key
            key: ''
        });

        // 获取用户的登录状态
        // wx.pro.login({})
        //     .then(rs => {
        //         console.log(rs);
        //     }).catch(e => {
        //         console.log(e);
        //     });

        // // 打开授权设置窗口，进行手动授权
        // wx.pro.openSetting({})
        //     .then(rs => {
        //         console.log(rs);
        //     }).catch(e => {
        //         console.log(e);
        //     });

        // // 获取用户的授权状态列表
        // wx.pro.getSetting({})
        //     .then(rs => {
        //         console.log(rs);
        //         // 查询位置信息是否已允许授权
        //         if (!rs.authSetting['scope.userLocation']) {
        //             // 请求授权获取用户位置
        //             wx.pro.authorize({
        //                 scope: 'scope.userLocation'
        //             })
        //             .then(rs => {
        //                 console.log(rs);
        //             }).catch(e => {
        //                 console.log(e);
        //             });
        //         }
        //     }).catch(e => {
        //         console.log(e);
        //     });

        // // 获取用户基本信息，新版中不建议直接调用此API，需要使用 button组件
        // wx.pro.getUserInfo({
        //     //
        //     withCredentials: true
        // })
        // .then(rs => {
        //     console.log(rs);
        // }).catch(e => {
        //     console.log(e);
        // });
    },

    globalData: {
        userInfo: wx.getStorageSync('userInfo'),
        backToPageIndex: false,
        qqmapsdk: null
    }
});
