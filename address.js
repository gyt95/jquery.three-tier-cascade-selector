;(function($, document, window, undefined){
    function Selector(element, opts) {
        this.sel = element;
        this.defaults = {
            backgroundColor: '#ccc',
            hoverColor: '#037ac3',
            multiple: false,    // 是否多选
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
            s.thirdName = ''
            s.fullAddress = []     // 地址全称，如：['1号楼','3楼','A室']
            
            s.sel.append('<div class="left-part"><ul></ul></div>')
            s.sel.append('<div class="right-part"><ul></ul></div>')

            // 将第一层地址存入ff
            for(var i = 0; i < this.settings.data.length; i++){
                s.first_floor.push(this.settings.data[i].label)
            }
            
            // 默认第一层第一个存入sf
            s.second_floor = this.settings.data[0].children

            s.insertData(s)

            s.bindClickEvent(s)
            s.bindMouseEvent(s)
        },
        insertData: function(s){
            // 创建html模板
            this.insertLeftData(s)
            $('.left-part ul li').eq(0).addClass('btn-active')
            s.fullAddress[0] = $('.left-part ul li').eq(0).text()
            this.insertRightData(s)

            if(s.currFloor == 1) $('.left-part .back-btn').hide()
        },
        bindClickEvent: function(s){
            s.sel.on('click', '.left-part .back-btn', function(){
                s.resetData(s)
            })
            s.sel.on('click', '.left-part ul li', function(){
                if(s.currFloor == 2){
                    console.log('当前第二层')

                    for(var i = 0; i < s.first_floor.length; i++){  
                        $(this).text() == s.first_floor[i] ? idx = i : $('.left-part ul li').eq(i).removeClass('btn-active')
                    }
                    $(this).addClass('btn-active')

                    s.sel.find('.right-part ul').html('')
                    for(var i = 0; i < s.tmpData.length; i++){
                        if($(this).text() == s.tmpData[i].label) {
                            s.second_floor = s.tmpData[i].children
                            s.insertRightData(s, 1)
                        }
                    }
                    s.fullAddress[1] = $(this).text()
                    
                    if(s.settings.multiple) s.fullAddress.splice(2)
                }else{
                    var idx = ''

                    s.fullAddress.push($(this).text())
                    // 找出对应的索引，存入sf，清空原html，插入新的数据
                    for(var i = 0; i < s.first_floor.length; i++){  
                        $(this).text() == s.first_floor[i] ? idx = i : $('.left-part ul li').eq(i).removeClass('btn-active')
                    }
                    $(this).addClass('btn-active')

                    s.second_floor = s.settings.data[idx].children
                    s.sel.find('.right-part ul').html('')
                    s.insertRightData(s)

                    s.fullAddress = []
                    s.fullAddress[0] = $(this).text()
                }
            })
            s.sel.on('click', '.right-part ul li', function(){
                console.log(s.currFloor)
                if(s.currFloor == 2) {
                    if(s.settings.multiple){ 
                        s.fullAddress.push($(this).text())

                        var idx = ''
                    
                        for(var i = 0; i < s.second_floor.length; i++){ // 获取对应索引
                            if($(this).text() == s.second_floor[i]) idx = i
                        }
                        $('.right-part ul li').eq(idx).addClass('btn-active')    // 选项高亮
                        
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
                    console.log(idx)
    
                    s.sel.find('.left-part ul').html('') // 清空左侧html和数据，并将右侧栏目内容存入左侧ff
                    s.first_floor = []
                    for(var i = 0; i < s.second_floor.length; i++){
                        s.first_floor.push(s.second_floor[i].label)
                    }
                    s.insertLeftData(s, 1)
                    
                    s.fullAddress[1] = $(this).text()   // 保存地址名
                    $('.left-part ul li').eq(idx).addClass('btn-active')    // 选项高亮

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
        },
        setScrollTop: function(s, idx){    // 左侧栏目定位到对应楼层的位置
            var ulHeight = $('.left-part ul')[0].clientHeight - 55,
                eHeight = $('.left-part ul li').eq(idx)[0].clientHeight,
                eTop = $('.left-part ul li').eq(idx)[0].offsetTop,
                speed = s.settings.speed,
                posi = s.settings.position

            console.log(7777)
            if(eTop > ulHeight){
                // var val = eTop - (eHeight * 5 + 5 * 5 + eHeight/2 + 5)
                // $('.left-part ul').scrollTop(val)
                var val;
                console.log(posi)
                switch(posi){
                    case 'top':
                        val = eTop;break;
                    default:
                        val = eTop - (eHeight * 4 + 5 * 4 + eHeight/2 + 5);break;
                }
                $('.left-part ul').animate({
                    'scrollTop': val
                }, speed)
            }
        },
        bindMouseEvent: function(s){
            s.sel.on('mouseover mouseout', '.left-part ul li, .left-part .back-btn, .right-part ul li', function(){
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

            // 将第一层地址存入ff
            for(var i = 0; i < s.settings.data.length; i++){
                s.first_floor.push(s.settings.data[i].label)
            }
            
            // 默认第一层第一个子地址存入sf
            s.second_floor = s.settings.data[0].children
            
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
                s.sel.find('.left-part .back-btn').css('background', '#cac9c9').addClass('mini-btn')
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
            $('.left-part ul li').css('backgroundColor', s.settings.backgroundColor)
            $('.right-part ul li').css('backgroundColor', s.settings.backgroundColor)
        },
        getFullAddress: function(s){
            s.settings.callback(s.fullAddress)

            if(!s.settings.multiple) s.resetData(s)
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
