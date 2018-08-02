import regeneratorRuntime from '../../assets/js/wxPromise.min.js';
import {showMsg} from '../../assets/js/util.js';

let app = getApp();

showMsg('hello');

Page({
    data: {
        group: ['广州', '西安', '武汉', '北京', '长沙'],
        telClearHidden: true,
        nameClearHidden: true,
        name: '',
        tel: '',
        groupSelected: '',
        dataStr: 'jack',
        dataArray: [1, 2, 3, 4],
        dataObject: [{
            id: 10,
            name: 'abc'
        }, {
            id: 100,
            name: 'edf'
        }],
        face: null
    },

    telChange(e) {
        console.log(e);

        this.setData({
            tel: e.detail.value,
            telClearHidden: !e.detail.value
        });
    },

    chooseFace() {
        wx.pro.chooseImage({
            count: 5
        }).then(rs => {
            this.setData({
                face: rs.tempFilePaths
            });

        }).catch(e => {
            console.log(e);
        });
    },

    previewFace() {
        wx.pro.previewImage({
            current: '',
            urls: this.data.face || []
        }).then(rs => {
            console.log(rs);
        }).catch(e => {
            console.log(e);
        });
    },

    resetFace() {
        this.setData({
            face: null
        });
    },

    onShow() {
        if (app.globalData.backToPageIndex) {
            app.globalData.backToPageIndex = false;

            this.setData({
                name: '',
                tel: '',
                groupSelected: '',
                telClearHidden: true,
                nameClearHidden: true,
                face: null
            });
        }

        // console.log(getCurrentPages().length);
    },

    onReady() {
        wx.pro.getLocation({
            type: 'wgs84'
        }).then(res => {
            console.log(res);

            // 获取当前位置
            app.globalData.qqmapsdk.reverseGeocoder({
                location: {
                    latitude: res.latitude,
                    longitude: res.longitude
                },
                success: (addressRes) => {
                    let city = addressRes.result.address_component.city;

                    console.log(addressRes.result.address_component, city);

                    // 匹配当前坐标，设置城市
                    if (city) {
                        let groupSelected = this.data.group.find(item => {
                            return city.includes(item);
                        });

                        groupSelected && this.setData({
                            groupSelected: groupSelected
                        });
                    }
                },
                fail: (e) => {
                    console.log(e);
                }
            });
        }).catch(e => {
            console.log(e);
        });
    },

    nameChange(e) {
        console.log(e);

        this.setData({
            name: e.detail.value,
            nameClearHidden: !e.detail.value
        });
    },

    clearTelField(e) {
        this.setData({
            tel: '',
            telClearHidden: true
        });
    },

    clearNameField(e) {
        this.setData({
            name: '',
            nameClearHidden: true
        });
    },

    groupChange(e) {
        console.log(e);

        this.setData({
            groupSelected: this.data.group[e.detail.value]
        });
    },

    formValidate(data) {
        if (!data.tel) {
            wx.showToast({
                title: '请填写手机号',
                icon: 'none'
            });

            return false;
        }

        if (!data.name) {
            wx.showToast({
                title: '请填写姓名',
                icon: 'none'
            });

            return false;
        }

        if (!data.group || data.group === '--请选择--') {
            wx.showToast({
                title: '请选择场次',
                icon: 'none'
            });

            return false;
        }

        if (!this.data.face) {
            wx.showToast({
                title: '需要刷脸哦~',
                icon: 'none'
            });

            return false;
        }

        return true;
    },

    async uploadFaces() {
        let p = [];

        (this.data.face || []).forEach(item => {
            p.push(new Promise((resolve, reject) => {
                wx.pro.uploadFile({
                    url: 'http://xxx',
                    filePath: item,
                    name: 'cover',
                    formData: {
                        _csrf: 'RktCQ3daWDJ3Sk1aSE9ucikRJRYcLhoFODo1Yx4AACgLBDsTBSwAYS59fGsxJ1of'
                    },
                    header: {
                        'Cookie': 'PHPSESSID=xxx',
                        'content-type': 'multipart/form-data'
                    }
                }).then(rs => {
                    let data = typeof rs.data === 'string' ? JSON.parse(rs.data) : rs.data;

                    if (!data.status) {
                        reject(rs);
                    } else {
                        resolve(rs);
                    }
                    console.log(rs);
                }).catch(e => {
                    reject(e);
                    console.log(e);
                });
            }));
        });

        await Promise.all(p);
    },

    submitData(data) {
        let that = this;

        console.log(data);

        this.setData({
            signing: true
        });

        wx.pro.request({
            url: 'http://xxx',
            data: {
                data: data,
                roundID: 2,
                timestamp: +new Date()
            },
            header: {
                Cookie: 'PHPSESSID=xxx'
            }
        }).then(rs => {
            console.log(rs);
        }).catch(e => {
            console.log(e);
        })

        setTimeout(() => {
            wx.showToast({
                title: '签到成功',
                icon: 'success',
                success() {
                    setTimeout(() => {
                        that.setData({
                            signing: false
                        });

                        wx.navigateTo({
                            url: '/pages/subPages/signed/signed'
                        });
                    }, 1500);
                }
            });
        }, 2000);
    },

    formSubmit(e) {
        let that = this;

        if (!this.formValidate(e.detail.value)) {
            return;
        }

        wx.showModal({
            title: '请确认签到信息',
            content: `
                场次：${e.detail.value.group}\r\n
                姓名：${e.detail.value.name}\r\n
                手机号：${e.detail.value.tel}\r\n
            `,
            success(rs) {
                if (rs.confirm) {
                    let uploadFaceloading = wx.showLoading({
                        title: '上传中'
                    });

                    that.uploadFaces()
                        .then((rs) => {
                            console.log('uploadSuccess', rs);
                            that.submitData(e.detail.value);
                        }).catch(e => {
                            wx.showToast({
                                title: '上传失败',
                                icon: 'none'
                            });

                            console.log('uploadFail', e);
                        }).finally(rs => {
                            wx.hideLoading(uploadFaceloading);
                        });
                } else if (rs.cancel) {

                }
            }
        });
    },


})
