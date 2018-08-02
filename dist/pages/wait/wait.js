Page({
    data: {

    },

    onlyShowMyWait(e) {
        console.log(e);
        this.getWaitSignList(e.detail.value);
    },

    getWaitSignList(my) {
        let loading = wx.showLoading({
            title: '加载中'
        });

        setTimeout(() => {
            wx.hideLoading(loading);

            wx.stopPullDownRefresh();

            let data = [{
                group: '广州',
                no: 33,
                num: 22
            }, {
                group: '广州',
                no: 13,
                num: -11
            }, {
                group: '上海',
                no: 5,
                num: 2
            }];

            let waitSigns = my ? data.slice(-1) : data;

            this.setData({
                waitSigns
            });
        }, 1000);
    },

    onShow() {
        this.getWaitSignList();
    },

    onPullDownRefresh() {
        this.getWaitSignList();
    }
})
