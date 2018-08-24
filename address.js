;(function($, document, window, undefined){
    function Selector(element, opts) {
        this.sel = element;
        this.defaults = {
            backgroundColor: '#ccc',
            hoverColor: '#037ac3',
            multiple: false,    
            position: 'default',
            speed: 0,
            size: 'default'
        }
        this.settings = $.extend({}, this.defaults, opts)

        this.init()
    }

    Selector.prototype = {
        init: function(){
            console.log('get data successfully!')
            var s = this;

            s.first_floor = []
            s.second_floor = []
            s.third_floor = []
            s.currFloor = 1
            s.tmpData = []
            s.fullAddress = []     // 地址全称，如：['1号楼','3楼','A室']
            
            s.sel.html('')
            
            s.sel.append('<div class="left-part"><ul></ul></div>')
            s.sel.append('<div class="right-part"><ul></ul></div>')
            
            for(var i = 0; i < this.settings.data.length; i++){     // 将第一层地址存入ff
                s.first_floor.push(this.settings.data[i].label)
            }
            
            s.second_floor = this.settings.data[0].children     // 默认第一层第一个存入sf

            s.insertData(s)

            s.bindClickEvent(s)
            s.bindMouseEvent(s)
        },
        insertData: function(s){    // 创建html模板
            this.insertLeftData(s)

            s.sel.find('.left-part ul li').eq(0).addClass('btn-active')
            s.fullAddress[0] = s.sel.find('.left-part ul li').eq(0).text()
            this.insertRightData(s)

            if(s.currFloor == 1) s.sel.find('.left-part .back-btn').hide()
        },
        bindClickEvent: function(s){
            $(s.sel.selector).off('click', '.left-part ul li').on('click', '.left-part ul li', function(){

                s.sel.find('.left-part ul li').removeClass('btn-active')
                $(this).addClass('btn-active')
                
                if(s.currFloor == 2){
                    if(s.settings.multiple) s.fullAddress.splice(2, s.fullAddress.length - 2)   // 左侧二层栏目切换时，先清空所有科室地址，避免多个二层地址的科室push在一起

                    // for(var i = 0; i < s.first_floor.length; i++){   // 由于这个循环只是要移除class名，而且严重影响IE7性能，所以想到用jQuery API代替
                    //     $(this).text() == s.first_floor[i] ? idx = i : s.sel.find('.left-part ul li').eq(i).removeClass('btn-active')
                    // }
                    // $(this).addClass('btn-active')

                    s.sel.find('.right-part ul').html('')
                    for(var i = 0; i < s.tmpData.length; i++){
                        if($(this).text() == s.tmpData[i].label) {
                            s.second_floor = s.tmpData[i].children
                            s.insertRightData(s, 1)
                        }
                    }
                    s.fullAddress[1] = $(this).text()
                }else{
                    var idx = ''

                    s.fullAddress.push($(this).text())
                    
                    for(var i = 0; i < s.first_floor.length; i++){  // 找出对应的索引，存入sf，清空原html，插入新的数据
                        if($(this).text() == s.first_floor[i]) idx = i
                    }

                    s.second_floor = s.settings.data[idx].children
                    s.sel.find('.right-part ul').html('')
                    s.insertRightData(s)

                    s.fullAddress = []
                    s.fullAddress[0] = $(this).text()
                }
            })
            $(s.sel.selector).off('click', '.right-part ul li').on('click', '.right-part ul li', function(){
                if(s.currFloor == 2) {
                    if(s.settings.multiple){ 
                        s.fullAddress.push($(this).text())

                        var idx = ''
                    
                        for(var i = 0; i < s.second_floor.length; i++){ // 获取对应索引
                            if($(this).text() == s.second_floor[i]) idx = i
                        }
                        s.sel.find('.right-part ul li').eq(idx).addClass('btn-active')    // 选项高亮
                        
                        s.getFullAddress(s)
                    }else{
                        s.fullAddress.push($(this).text())
                        s.currFloor++
                        s.getFullAddress(s)
                    }
                }else{
                    var idx = ''
                    
                    for(var i = 0; i < s.second_floor.length; i++){ // 获取对应索引
                        if($(this).text() == s.second_floor[i].label) idx = i
                    }
    
                    s.sel.find('.left-part ul').html('') // 清空左侧html和数据，并将右侧栏目内容存入左侧ff
                    s.first_floor = []
                    for(var i = 0; i < s.second_floor.length; i++){
                        s.first_floor.push(s.second_floor[i].label)
                    }
                    s.insertLeftData(s, 1)
                    
                    s.fullAddress[1] = $(this).text()   // 保存地址名
                    s.sel.find('.left-part ul li').eq(idx).addClass('btn-active')    // 选项高亮

                    s.tmpData = s.second_floor
                    s.sel.find('.right-part ul').html('') // 清空右侧，将第三层栏目内容存入右侧
                    
                    for(var i = 0; i < s.second_floor[idx].children.length; i++){
                        s.third_floor.push(s.second_floor[idx].children[i])
                    }
                    s.second_floor = s.third_floor
                    s.insertRightData(s, 1)

                    console.log(s.fullAddress)
                    s.currFloor++   // 改变当前楼层标记
                    s.setScrollTop(s, idx) // 调整左侧滚动条高度
                }
            })
            $('body').on('click', s.sel.selector + ' .left-part .back-btn', function(){
                s.resetData(s)
            })
        },
        setScrollTop: function(s, idx){    // 左侧栏目定位到对应楼层的位置
            var ulHeight = s.sel.find('.left-part ul')[0].clientHeight - 55,
                eHeight = s.sel.find('.left-part ul li').eq(idx)[0].clientHeight,
                eTop = s.sel.find('.left-part ul li').eq(idx)[0].offsetTop,
                speed = s.settings.speed,
                posi = s.settings.position

            if(eTop > ulHeight){
                var val;
                switch(posi){
                    case 'top':
                        val = eTop;break;
                    default:
                        val = eTop - (eHeight * 4 + 5 * 4 + eHeight/2 + 5);break;   // 该选项距离顶部的高度 - 4个该选项高度 - 4个选项间隙5px - 半个选项，反正最后要在中间
                }
                s.sel.find('.left-part ul').animate({
                    'scrollTop': val
                }, speed)
            }
        },
        bindMouseEvent: function(s){
            s.sel.on('mouseover mouseout', '.left-part ul li, .right-part ul li', function(){
                if(event.type == "mouseover"){      //鼠标悬浮
                    $(this).css('backgroundColor', s.settings.hoverColor)
                }else if(event.type == "mouseout"){  //鼠标离开
                    $(this).css('backgroundColor', s.settings.backgroundColor)
                }
            })
        },
        resetData: function(s){     // 重置
            s.currFloor = 1
            s.second_floor = []
            s.first_floor = []
            s.third_floor = []
            s.tmpData = []
            s.fullAddress = []
            
            for(var i = 0; i < s.settings.data.length; i++){     // 将第一层地址存入ff
                s.first_floor.push(s.settings.data[i].label)
            }
            
            s.second_floor = s.settings.data[0].children        // 默认第一层第一个子地址存入sf
            
            s.sel.find('.left-part ul').html('')
            s.sel.find('.right-part ul').html('')

            s.insertData(s)
        },
        insertLeftData: function(s, num){      // 左侧栏目插入
            for(var i = 0; i < s.first_floor.length; i++){
                s.sel.find('.left-part ul').append('<li><span>' + s.first_floor[i] +'</span></li>')
            }
            if(num == 1){   // 1: 需要返回按钮
                if(s.sel.find('.left-part .back-btn').length == 0) { // 判断是否有返回上一层按钮，如没有则添加。否则，show()
                    s.sel.find('.left-part').append('<div class="back-btn"><span>返回上一层</span></div>')
                }else{
                    s.sel.find('.left-part .back-btn').show()
                }
                s.sel.find('.left-part .back-btn').addClass('mini-btn')
            }
            if(s.settings.size == 'mini') this.addMiniClassName(s)
            this.addBackgroundColor(s)
        },
        insertRightData: function(s, num){     // 右侧栏目插入
            for(var i = 0; i < s.second_floor.length; i++){
                var address = num == 1 ? s.second_floor[i] : s.second_floor[i].label
                s.sel.find('.right-part ul').append('<li><span>' + address +'</span></li>')
            }
            this.addBackgroundColor(s)
        },
        addMiniClassName: function(s){
            s.sel.addClass('mini-container')
            s.sel.find('.left-part').addClass('mini-lp')
            s.sel.find('.right-part').addClass('mini-rp')
        },
        addBackgroundColor: function(s){
            s.sel.find('.left-part ul li').css('backgroundColor', s.settings.backgroundColor)
            s.sel.find('.right-part ul li').css('backgroundColor', s.settings.backgroundColor)
        },
        getFullAddress: function(s){
            var result = []
            result = s.unique(s.fullAddress)
            s.settings.callback(result)

            if(!s.settings.multiple) s.resetData(s) // 当不为多选，重置界面和数据
        },
        unique: function (arr) {
            var ret = []
            var hash = {}
        
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i]
                var key = typeof(item) + item
                if (hash[key] !== 1) {
                    ret.push(item)
                    hash[key] = 1
                }
            }
            return ret
        }
    }

    // $.fn.selector = function(opts){
        // return this.each(function(){
        //     new Selector($(this), opts)
        // })
    // }

    $.fn.picker = function(opts){
        new Selector($(this), opts)
        // 想立即回调则在这里用 opts.callback(result)
        // 想在某次操作后再回调，例如我在getFullAddress()里执行回调，则在该方法内调用
    }

})(jQuery, document, window)


// 小结
// 1.如何将插件中的变量或方法返回出去（加回调函数）
// 2.如何用js修改hover样式（$().hover()方法)
// 3.如何防止事件委托触发多次（$().off().on()，先解绑事件再重新绑定）