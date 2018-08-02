let app = getApp();

console.log(app.globalData)

Page({
    data: {
        hasUserInfo: app.globalData.userInfo.hasUserInfo,
        avatar: app.globalData.userInfo.avatar,
        nickName: app.globalData.userInfo.nickName
    },

    onReady() {
        let that = this;

    },

    getUserInfo(e) {
        console.log(e.detail.userInfo);

        if (!e.detail.userInfo) {
            return;
        }

        app.globalData.userInfo = {
            hasUserInfo: true,
            avatar: e.detail.userInfo.avatarUrl,
            nickName: e.detail.userInfo.nickName
        }

        wx.setStorage({
            key: 'userInfo',
            data: app.globalData.userInfo
        });

        this.setData({
            hasUserInfo: app.globalData.userInfo.hasUserInfo,
            avatar: app.globalData.userInfo.avatar,
            nickName: app.globalData.userInfo.nickName
        });
    },

    showMyHistorySign() {
        let loading = wx.showLoading({
            title: '获取中'
        });

        setTimeout(() => {
            wx.hideLoading(loading);

            this.setData({
                historySigns: [{
                    group: '广州',
                    name: '王德',
                    tel: '12344218549',
                    time: '2016-12-12 11:00:00'
                }, {
                    group: '北京',
                    name: '刘小贝',
                    tel: '12344218549',
                    time: '2018-12-12 11:00:00'
                }, {
                    group: '上海',
                    name: '王德',
                    tel: '12344218549',
                    time: '2016-12-16 11:00:00'
                }]
            });
        }, 1000);
    }
});
