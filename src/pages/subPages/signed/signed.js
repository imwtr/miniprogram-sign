let app = getApp();

Page({
    data: {

    },

    onUnload() {
        app.globalData.backToPageIndex = true;
    },

    onReady() {
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
                }]
            });
        }, 1000);
    }
})
