// timing.js
// 获取应用实例
const app = getApp()
const util = require('../../utils/util.js')

//目前的一个bug：如果直接按左上角的返回键，返回到navigateto的跳转前页面的话，原本的画图进程不会结束，会导致后面一闪一闪的

Page({
  data: {
    counting_seconds: null, //该次任务总时长

    circle_size: 400, 
    countdown_seconds: null, //当前倒计时（秒为单位）
    countdown_min: null, //当前倒计时（剩余分钟）
    counting_sec: null, //当前倒计时（剩余秒钟）

    rate_of_progress: 0, //记录当前计时进度百分比

    pause_status: false, //是否暂停计时
    end_status: false, //是否完成本次任务

    Timer: '',

    cateArr:[
      {
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: '学习'
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'write',
        text: '写作'
      },
      {
        icon: 'sport',
        text: '运动'
      },
      {
        icon: 'read',
        text: '阅读'
      }
    ],
    cateActive:'0',

  },

  onLoad: function (options) {
    this.setData({
      counting_seconds: options.timing_time*60,
      countdown_seconds: options.timing_time*60,
      countdown_min: options.timing_time*60/60,
      countdown_sec: options.timing_time*60%60,

      cateActive: options.cateActive,
      rate_of_progress: 0,
    }),

    // console.log(this.data.cateActive)

    this.drawBkdg();
  },

  drawBkdg: function () {
    
    //获取全局变量“比例”
    // var app = getApp()
    const ratee = app.globalData.rate;
    var line_width = 15/ratee; 
    
    //画圆
    var ctx = wx.createCanvasContext('bkgd_circle');
    ctx.setLineWidth(line_width);
    ctx.setStrokeStyle("#000000");
    ctx.setLineCap('round');
    ctx.beginPath();
    // ctx.arc(400/ratee/2,400/ratee/2,400/ratee/2-line_width,1.5*Math.PI,2*Math.PI);
    ctx.arc(400/ratee/2,400/ratee/2,400/ratee/2-line_width,2*Math.PI);
    ctx.closePath();
    // ctx.fill();//填充
    ctx.stroke();//边缘
    ctx.draw();
  },

  drawDnmc: function () {
    
    //获取全局变量“比例”
    // var app = getApp()
    const ratee = app.globalData.rate;
    var line_width = 15/ratee; 

    //画圆
    var ctx = wx.createCanvasContext('dnmc_circle');
    ctx.setLineWidth(line_width);
    ctx.setStrokeStyle("#FFFFFF");
    ctx.setLineCap('round');
    ctx.beginPath();
    // ctx.arc(400/ratee/2,400/ratee/2,400/ratee/2-line_width,1.5*Math.PI,1.5*Math.PI+this.data.rate_of_progress*2*Math.PI);
    ctx.arc(400/ratee/2,400/ratee/2,400/ratee/2-line_width,1.5*Math.PI,(1.5+this.data.rate_of_progress*2)*Math.PI);
    
    // ctx.fill();//填充
    ctx.stroke();//边缘
    ctx.draw();
  },

  onShow: function() {
    this.countDown();
  },

  countDown: function () {
    var that = this;
    var countDownNum = that.data.countdown_seconds;//获取倒计时初始值

    that.setData({
      Timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量

        if(!that.data.pause_status){
          //每隔一秒countDownNum就减一，实现同步
          countDownNum--;
          //然后把countDownNum存进data，好让用户知道时间在倒计着
          that.setData({
            countdown_seconds: countDownNum,
            countdown_min: Math.floor(countDownNum/60),
            countdown_sec: countDownNum%60,
            rate_of_progress: 1-countDownNum/that.data.counting_seconds,
          })
          //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来

          that.drawDnmc();

          if (countDownNum <= 0 || that.data.rate_of_progress>=1) {
            //关闭定时器
            that.drawDnmc();
            clearInterval(that.data.Timer);
            that.setData({
              end_status: true,
            })
          }
        }

        

      }, 10)  //*记得改回1000
    })

  },

  onHide(){
    var that = this
    clearInterval(that.data.Timer);
  },

  suspend_timing: function() {
    this.setData({
      pause_status: 1,
    })
  },

  resume_timing: function() {
    this.setData({
      pause_status: 0,
    })
  },

  abort_timing: function() {
    var that = this;
    clearInterval(that.data.Timer);

    app.globalData.gained_credit += Math.floor((that.data.counting_seconds-that.data.countdown_seconds)/60/2); //*若是提前结束，只能获得已专注时间的一半的积分。
    app.globalData.remain_credit += Math.floor((that.data.counting_seconds-that.data.countdown_seconds)/60/2);

    // console.log(app.globalData.gained_credit)

    var logs = wx.getStorageSync('logs') || [];
    logs.unshift({
      date: util.formatTime(new Date),
      cate: that.data.cateActive,
      time: Math.floor((that.data.counting_seconds-that.data.countdown_seconds)/60),
      credit: Math.floor((that.data.counting_seconds-that.data.countdown_seconds)/60/2),
    })
    wx.setStorageSync('logs', logs);

    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  finish_timing: function() {
    var that = this;
    clearInterval(that.data.Timer);

    app.globalData.gained_credit += that.data.counting_seconds/60;
    app.globalData.remain_credit += that.data.counting_seconds/60;

    console.log(app.globalData.gained_credit)

    var logs = wx.getStorageSync('logs') || [];
    logs.unshift({
      date: util.formatTime(new Date),
      cate: that.data.cateActive,
      time: that.data.counting_seconds/60,
      credit: that.data.counting_seconds/60,
    });
    console.log(logs.cate)
    wx.setStorageSync('logs', logs);

    wx.switchTab({
      url: '/pages/index/index',
    })
  }


})
