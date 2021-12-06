// ambition.js

const util = require('../../utils/util.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
      'goodList': [
        {
          'name': '甜品',
          'author': '听说吃甜食会让人心情变好哦',
          'isbn': '9787535482051',
          'cover': '/images/cover_1.png',
          'desc': '若是美好，叫做精彩，若是糟糕，叫做经历。',
          'press': '',
          'price': 39,
          'count': 1,
          'checked': false
        },
        {
          'name': '烤肉',
          'author': '吃饱了有力气干活',
          'isbn': '9787540455958',
          'cover': '/images/cover_2.png',
          'desc': '学习太累，隔段时间需要补充能量。',
          'press': '',
          'price': 88,
          'count': 1,
          'checked': false
        },
        {
          'name': '电影',
          'author': '看场电影放松心情',
          'isbn': '9787539982830',
          'cover': '/images/cover_3.png',
          'desc': '我们终此一生，就是要摆脱他人的期待，找到真正的自己。',
          'press': '',
          'price': 60,
          'count': 1,
          'checked': false
        },
        {
          'name': '购物',
          'author': '买买买有更多动力努力赚钱',
          'isbn': '9787550013247',
          'cover': '/images/cover_4.png',
          'desc': '或许，命运就是一条孤独的河流，我们都会遇见灵魂的摆渡人。',
          'press': '',
          'price': 36,
          'count': 1,
          'checked': false
        },
        {
          'name': '游戏',
          'author': '游戏一小时放松一下',
          'isbn': '9787208061644',
          'cover': '/images/cover_5.png',
          'desc': '人一生中最可怕是无所事事，最可恨是无所追求，最可悲是无所作为。',
          'press': '',
          'price': 10,
          'count': 1,
          'checked': false
        }
      ],
      'checkAll': false,
      'totalCount': 0,
      'totalPrice': 0,

      "remain_credit_ambition": 0,

      //存放购买的各项物品的信息，用于历史统计
      "buy_list_name": [], 
      "buy_list_credit": [],

    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
  
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.calculateTotal();
  
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
  
        //加载当前剩余专注积分

        var logs = wx.getStorageSync('logs') || [];
        var consumed = wx.getStorageSync('consumed') || [];
        var remain_credit = 0;
        var all_credit = 0;
        var consumed_credit = 0;

        if(logs.length > 0){
            for(var i = 0;i < logs.length;i++){
              all_credit += logs[i].credit;
            } 
        };

        if(consumed.length > 0){
          for(var i = 0;i < consumed.length;i++){
            consumed_credit += consumed[i].credit;
          } 
        };

        remain_credit = all_credit - consumed_credit;

        this.setData({
            remain_credit_ambition: remain_credit,
        })
    },
  
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
  
    },
  
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
  
    },
  
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
  
    },
  
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
  
    },
  
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
  
    },
  
    /**
     * 计算商品总数
     */
    calculateTotal: function () {
      var goodList = this.data.goodList;
      var totalCount = 0;
      var totalPrice = 0;
      for (var i = 0; i < goodList.length; i++) {
        var good = goodList[i];
        if (good.checked) {
          totalCount += good.count;
          totalPrice += good.count * good.price;
        }
      }
      totalPrice = totalPrice.toFixed(2);
      this.setData({
        'totalCount': totalCount,
        'totalPrice': totalPrice
      })
    },
  
    /**
     * 用户点击商品减1
     */
    subtracttap: function (e) {
      var index = e.target.dataset.index;
      var goodList = this.data.goodList;
      var count = goodList[index].count;
      if (count <= 1) {
        return;
      } else {
        goodList[index].count--;
        this.setData({
          'goodList': goodList
        });
        this.calculateTotal();
      }
    },
  
    /**
     * 用户点击商品加1
     */
    addtap: function (e) {
      var index = e.target.dataset.index;
      var goodList = this.data.goodList;
      var count = goodList[index].count;
      goodList[index].count++;
      this.setData({
        'goodList': goodList
      });
      this.calculateTotal();
    },
    /**
     * 用户选择购物车商品
     */
    checkboxChange: function (e) {
      console.log('checkbox发生change事件，携带value值为：', e.detail.value);
      var checkboxItems = this.data.goodList;
      var values = e.detail.value;
      for (var i = 0; i < checkboxItems.length; ++i) {
        checkboxItems[i].checked = false;
        for (var j = 0; j < values.length; ++j) {
          if (checkboxItems[i].isbn == values[j]) {
            checkboxItems[i].checked = true;
            break;
          }
        }
      }
  
      var checkAll = false;
      if (checkboxItems.length == values.length) {
        checkAll = true;
      }
  
      this.setData({
        'goodList': checkboxItems,
        'checkAll': checkAll
      });
      this.calculateTotal();
    },
  
    /**
     * 用户点击全选
     */
    selectalltap: function (e) {
      console.log('用户点击全选，携带value值为：', e.detail.value);
      var value = e.detail.value;
      var checkAll = false;
      if (value && value[0]) {
        checkAll = true;
      }
  
      var goodList = this.data.goodList;
      for (var i = 0; i < goodList.length; i++) {
        var good = goodList[i];
        good['checked'] = checkAll;
      }
  
      this.setData({
        'checkAll': checkAll,
        'goodList': goodList
      });
      this.calculateTotal();
    },

    settlement: function(e){
      var that = this;

      //够积分
      if(that.data.totalPrice <= that.data.remain_credit_ambition){
        console.log("够钱")
        var goodList = that.data.goodList;

        for(var i = 0; i < goodList.length; i++){
          var good = goodList[i];
          
          if(good.checked){
            var consumed = wx.getStorageSync('consumed') || [];
            consumed.unshift({
              date:util.formatTime(new Date),
              cate:good.name,
              number:good.count,
              credit:good.count*good.price,
            });
            console.log(consumed.name)
            wx.setStorageSync('consumed',consumed);
          }
        };
        this.onShow();
      }else{
        console.log("不够钱");
        this.onShow();
      }
    
    },

  })