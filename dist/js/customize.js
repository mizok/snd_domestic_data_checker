// 預防IE出錯
if (window.console == undefined) {var em = function() {};window.console = { log: em, debug: em, info: em, warn: em };}
if (typeof(console) == '') {var em = function() {};console = { log: em, debug: em, info: em, warn: em };}
if (console.log == undefined || console.log == 'undefined') {var em = function() {};console.log = em;}
if (console.debug == undefined || console.debug == 'undefined') {var em = function() {};console.debug = em;}
if (console.info == undefined || console.info == 'undefined') {var em = function() {};console.info = em;}
if (console.warn == undefined || console.warn == 'undefined') {var em = function() {};console.warn = em;}
// end : 預防IE出錯

var includeHTML = function(cb) {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            elmnt.removeAttribute("w3-include-html");
            w3.includeHTML(cb);
          }
        }      
        xhttp.open("GET", file, true);
        xhttp.send();
        return;
      }
    }
    if (cb) cb();
};

//===========   bindingEvent function     ===========//
function bindingEvent(){
var _isResize = false,
    _isScroll = false;
var _initial = [
    $menu,
    $entryUI,
    $content,
    $transitionMask
];
var _onResize = [],
    _onScroll = [],
    _onClick  = [];

//判斷手機為body新增class
if(isMobile){$('body').addClass('isMobile');}

// 填入shadowNull DOM
getShadowNull();

//初始所有initial function
$.each(_initial,function(i,o){
    o.keyDom = $(o.key);
    o.keyHas = o.keyDom.length >0;

    if(o.hasOwnProperty('initial')){
        o.initial();
    }
    //判斷此物件是否有要resize的function
    if(o.hasOwnProperty('onResize')){
        _onResize.push(o);
    }
    //判斷此物件是否有要scroll的function
    if(o.hasOwnProperty('onScroll')){
        _onScroll.push(o);
    }
    //判斷此物件是否有要body click的function
    if(o.hasOwnProperty('onClick')){
        _onClick.push(o);
    }
});

//套件 function
pluginFunction();
//end : 套件 function

//Resize動作
$(window).resize(function(){
    if(!_isResize) {
        _isResize = true;
        setTimeout(function(){
            $windowData.width = $(window).width();
            $windowData.inHeight = window.innerHeight;
            $.each(_onResize,function(i,o){
                o.onResize();
            });
            _isResize = false;
        },200);
    }
});
//scroll動作
$(window).scroll(function(){
    if(!_isScroll) {
        _isScroll = true;
        setTimeout(function(){
            $windowData.scrollTop = $(window).scrollTop();
            $.each(_onScroll,function(i,o){
                o.onScroll();
            });

            _isScroll = false;
        },200);
    }
});
//body click動作
$('body').on('click',function(){
    $.each(_onClick,function(i,o){
        o.onClick();
    });
});


}
//===========   bindingEvent function: end ===========//

var $windowData = {  width:     $(window).outerWidth()
                ,inHeight:    window.innerHeight
                ,scrollTop: $(window).scrollTop()
            };
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

//===========
// 全域變數群

var dataFileName = null;
//===========
// 版型類function初始化規則

// var $sampleFunction = {
//     key:'.elementSelect'
//     ,keyDom = $(this.key);            //自動產生
//     ,keyHas = this.keyDom.length > 0; //自動產生
//     ,initial:function(){
//         //初始需要執行的程式
//     }
//     ,onResize:function(){
//         //resize需要執行的程式
//     }
//     ,onScroll:function(){
//         //scroll需要執行的程式
//     }
//     ,onClick:function(){
//         //body click需要執行的程式
//     }
// }

var $entryUI = {
    key:'.entry'
    ,initial:function(){
        //初始需要執行的程式
        var _this = this;
        if(this.keyHas){
            var $keyDom = this.keyDom;
            $keyDom.find('.input-block .comfirm').on('click',function(e){
                e.preventDefault();
                dataFileName = $(this).siblings('input').val();
                $(this).parents('.input-block').find('.error-msg').hide();
                $.ajax({
                    url:'../snd_domestic_data_checker/src/json/'+dataFileName+'.json',
                    type:'HEAD',
                    error: function()
                    {
                        _this.showError();
                    },
                    success: function()
                    {
                        $keyDom.find('.input-block').addClass('blocked').delay(2000).queue(function(){
                            $(this).removeClass('blocked').dequeue();
                        })
                        $content.formUp();
                        $keyDom.delay(350).fadeOut();
                        $menu.showUp();
                        $transitionMask.refresh();
                    }
                });
            })
        }
    }
    ,showError:function(){
        var $keyDom = this.keyDom;
        $keyDom.find('.input-block').find('.error-msg').html('無效的檔名或json檔案不存在');
        $keyDom.find('.input-block').find('.error-msg').fadeIn();
    }
    ,showUp:function(){
        var $keyDom = this.keyDom;
        $keyDom.delay(350).fadeIn();
    }
}

var $transitionMask = {
    key:'.transition-mask'
    ,refresh :function(callback){
        if(this.keyHas){
            
            this.keyDom.addClass('animated').queue(function(){
                if(callback){
                    callback.apply();
                }
                $(this).dequeue();
            })
            .delay(1000).queue(function(){
                $(this).removeClass('animated').dequeue();
                
                
            })
           
        }
            
            
    
        
    }
}

var $menu = {
    key:'.menu-wrapper'
    ,initial:function(){
        var _this=this;
        //初始需要執行的程式
        //bind hamburger-click
        if(this.keyHas){
            // var onTransition = false;
            this.keyDom.find('.hamburger').click(function(){
                _this.hide();
                if(!$(this).hasClass('blocked')){
                    $transitionMask.refresh(function(){
                        $entryUI.showUp();
                        setTimeout(function(){
                            $content.deform();
                        },500)
                      
                        
                        
                        
                    });
                }
                
                
                
                
                // var $menu  = $(this).parent().siblings('.menu').removeClass('animated');
                // if(!$(this).hasClass('is-active')&&!onTransition){
                //     $(this).addClass('is-active');
                //     $menu.addClass('show animated');
                //     setTimeout(function(){
                //         onTransition = true;
                //     },1000)
                // }
                // else if($(this).hasClass('is-active')&&onTransition){
                //     $(this).removeClass('is-active');
                //     setTimeout(function(){
                //         $menu.addClass('animated reverse');
                //         setTimeout(function(){
                //             $menu.removeClass('animated reverse show');
                //             onTransition = false;
                //         },1000)
                //     })
                // }
            })
            this.hide();
        }
    }
    ,showUp:function(){
        if(this.keyHas){
            this.keyDom.fadeIn();
        }
    }
    ,hide:function(){
        if(this.keyHas){
            this.keyDom.hide();
        }
    }
};

var $content = {
    key :'.content'
    ,formUp:function(){
        var $keyDom = this.keyDom;
        $keyDom.data('originalForm',$keyDom.html());
        $.getJSON('../snd_domestic_data_checker/src/json/'+dataFileName+'.json',
            function (data) {
                if(data){
                    var info = data.Info;
                    var years = data.Years;
                    var $profile = $keyDom.find('.profile');
    
                    $profile.find('.AgentName .value').html(info.AgentName);
                    $profile.find('.OBMonth .value').html(info.OBMonth);
                    $profile.find('.Gender .value').html(info.Gender);
                    $profile.find('.OfficeName .value').html(info.OfficeName);
    
                    var $timeline = $keyDom.find('.timeline');
                    years.forEach(function(element){
                        var yearComp = $(
                            '<div class="yearComp">'+
                            '<div class="Year">'+
                            '<h1>'+element.Year+'</h1>'+
                            '</div>'+
                            '<div class="YearData">'+
                            
                            '</div>'+
                            '</div>'
                        ).clone();
                        function _plainObjectToJQObj(objectName,targetObject){
                            if(targetObject){
                                if(!Array.isArray(targetObject)){
                                    var targetArray = Object.keys(targetObject).map(function(key) {
                                        return [String(key), targetObject[key]];
                                    });
                                }
                                else {
                                    var targetArray = targetObject;
                                }
                               
                                var targetComp = $(
                                    '<div class="'+
                                    objectName+' '+'plainObject'+
                                    '">'+
                                    '<h1>'+objectName+
                                    '</h1>'+
                                    '<div class="'+
                                    objectName.toLowerCase()+'Comp'+' '+'plainObjectComp'+
                                    '">'+
                                    '</div>'+
                                    '</div>'
                                    ).clone();
                                targetArray.forEach(function(property){
                                    if(Array.isArray(property[1])){
                                        var propertyArray = [];
                                        property[1].forEach(function(ele){
                                            if(Array.isArray(ele)){
                                                propertyArray.push(ele.toString());
                                            }
                                            else{
                                                var propertyItemValue = Object.keys(ele).map(function(key){
                                                    return [String(key), ele[key]];
                                                })
                                                var propertyString = '';
                                                var item =$(
                                                    '<div class="propertyItem"></div>'
                                                    ).clone();
                                                propertyItemValue.forEach(function(ele){
    
                                                    var eleString = ele.toString().replace(',',':');
    
                                                    var itemInner =$(
                                                        '<div class="propertyItemInner">'+eleString+'</div>'
                                                        ).clone();
                                                    
                                                    item.append(itemInner);
                                                });
                                                
                                                propertyArray.push(item);
                                            }
                                        })
                                        var propertyEle = $(
                                            '<div class="property">'
                                            +'<table class="propertyTable" border="1">'
                                            +'<tr>'
                                            +'<td class="key">'
                                            + property[0]
                                            +'</td>'
                                            +'<td class="value">'
                                            +'</td>'
                                            +'</tr>'
                                            +'</table>'
                                            +'</div>'
                                            ).clone();
                                        propertyArray.forEach(function(element){
                                            if(typeof(element)=='string'){
                                                propertyEle.find('.value').append('<div class="item">'+element+'</div>');
                                            }
                                            else{
                                                propertyEle.find('.value').append(element);
                                            }
                                        })
                                    }
                                    else if(Array.isArray(targetObject)){
                                        targetComp.find('.plainObjectComp').addClass('flex');
                                        var item =$(
                                            '<div class="propertyItem"></div>'
                                            ).clone();
                                        
                                        var propertyItemArray = Object.keys(property).map(function(key) {
                                            return [String(key), property[key]];
                                        });
    
                                        propertyItemArray.forEach(function(ele){
    
                                            var eleString = ele.toString().replace(',',':');
    
                                            var itemInner =$(
                                                '<div class="propertyItemInner">'+eleString+'</div>'
                                                ).clone();
                                            
                                            item.append(itemInner);
                                        });
    
                                        var propertyEle = $(
                                            '<div class="property">'
    
                                            +'<div class="value">'
                                            +'</div>'
                                            +'</div>'
                                            ).clone();
    
                                            propertyEle.find('.value').append(item);
                                            
                                    }
                                    else{
                                        var propertyEle = $(
                                            '<div class="property">'
                                            +'<div class="key">'
                                            + property[0]
                                            +'</div>'
                                            +'<div class="value">'
                                            + property[1]
                                            +'</div>'
                                            +'</div>'
                                            ).clone();
                                    }
                                    targetComp.find(
                                        '.'+objectName.toLowerCase()+'Comp'
                                    ).append(propertyEle);
                                    targetComp.wrap('<div class="'+objectName+'"></div>');
                                });
                                return targetComp;
                            }
                            
                            
                        }
                       
                        var configurationBundle =  _plainObjectToJQObj('Configuration',element.Configuration);
                        var approveGoalVersionBundle =  _plainObjectToJQObj('ApproveGoalVersion',element.ApproveGoalVersion);
                        var currentGoalVersionBundle =  _plainObjectToJQObj('CurrentGoalVersion',element.CurrentGoalVersion);
                        var personalActualBundle =  _plainObjectToJQObj('PersonalActual',element.PersonalActual);
                        var teamActualBundle =  _plainObjectToJQObj('TeamActual',element.TeamActual);
                        var expectedBundle =  _plainObjectToJQObj('Expected',element.Expected);
    
                        yearComp.find('.YearData').append(configurationBundle);
                        yearComp.find('.YearData').append(approveGoalVersionBundle);
                        yearComp.find('.YearData').append(currentGoalVersionBundle);
                        yearComp.find('.YearData').append(personalActualBundle);
                        yearComp.find('.YearData').append(teamActualBundle);
                        yearComp.find('.YearData').append(expectedBundle);
                        $timeline.append(yearComp);
                        $timeline.find('.plainObject>h1').off('click').on('click',function(e){
                            e.preventDefault();
                            $(this).siblings('.plainObjectComp').slideToggle();
                        })
                    })
    
                }
            }   
        );
    }
    ,deform:function(){
        var $keyDom = this.keyDom;
        $keyDom.html($keyDom.data('originalForm'));
    }
}



//=============== tool ====================//

var $childToggleActive = {
    key:'[childToggleActive]'
    ,_toogleFunction: function(dom){
        var _this = this;
        var thisDom = $(dom),
            thisChild = thisDom.attr('childToggleActive');
        var childDom = thisDom.find(thisChild);
        childDom.on('click',function(e){
            var thisBtn = $(this);
            e.preventDefault();
            childDom.removeClass('active');
            thisBtn.addClass('active');
            if(thisDom.attr('childToggleActive-Collapse') == 'true'){
                var hasCollapse = thisBtn.attr('data-toggle');
                var collpaseId = thisBtn.attr('data-target') == undefined? thisBtn.attr('href'):thisBtn.attr('data-target');
                _this._handleCollapse(childDom,collpaseId);
                if(hasCollapse == "collapse"){
                    e.stopPropagation();
                }
            }
        });
    }
    ,_handleCollapse:function(dom,nowBtn){
        var thisDom = $(dom);
        thisDom.each(function(i,o){
            var thisBtn = $(this);
            if(thisBtn.attr('data-toggle')=="collapse"){
                var collpaseId = thisBtn.attr('data-target') == undefined? thisBtn.attr('href'):thisBtn.attr('data-target');
                if(collpaseId != nowBtn){
                    $(collpaseId).collapse('hide');
                }
                else{
                    $(nowBtn).collapse('show');
                }
            }
        });
    }
    ,_eachFunciton:function(){
        if(this.keyHas){
            var _this = this;
            this.keyDom.each(function(i,o){
                _this._toogleFunction(o);
            });
        }
    }
    ,initial:function(){
        this._eachFunciton();
    }
}
var $inputToggleBlock = {
    key:'[effact-input-toggle-block]'
    ,initial:function(){
        if(this.keyHas){
            this.keyDom.each(function(){
                var thisInputDom = $(this);
                var thisChangeId = thisInputDom.attr('effact-input-toggle-block');
                var thisInputName = thisInputDom.attr('name');
                function innerFunction(){
                    $('[effact-input-toggle-block-id="'+thisChangeId+'"]').each(function(){
                        var thisDomId = $(this);
                        if(thisInputDom.prop('checked')){
                            thisDomId.addClass('active');
                        }
                        else{
                            thisDomId.removeClass('active');
                        }
                    });
                }
                innerFunction();
                $('[name="'+thisInputName+'"]').change(function(){
                    innerFunction();

                });
            });
        }
    }
}
var $bootstrapPopupEvent = {
    key:'.modal'
    ,windowtop:0
    ,windowFixed: function(boolean,top){
        var htmlDom = $('html');
        if(boolean){
            htmlDom.addClass('html-fixed');
            htmlDom.css('top', '-'+top+'px');
            this.windowtop = top;
        }
        else{
            htmlDom.removeClass('html-fixed');
            htmlDom.css('top', '');
            $(window).scrollTop(top);
            this.windowtop = 0;
        }
    }
    ,modalOpen: function(){
        var _this = this;
        this.keyDom.on('show.bs.modal',  function (e) {
            var testText = e.namespace;
            if(testText === 'bs.modal'){
                var scrolltop = _this.windowtop == 0? $windowData.scrollTop:_this.windowtop;
                _this.windowFixed(true,scrolltop);
                if($(this).find('.mega-comp-table-close').length){
                    $(window).trigger('resize');
                }
            }
        });
        this.keyDom.on('shown.bs.modal', function (e) {
            var testText = e.namespace;
            var thisPopup = $(this);
            if(testText === 'bs.modal'){
                if(thisPopup.find('.mega-comp-table-close').length){
                    $(window).trigger('resize');
                }
            }
        });
        this.keyDom.on('hide.bs.modal',  function (e) {
            var testText = e.namespace;
            if(testText === 'bs.modal'){
                _this.windowFixed(false,_this.windowtop);
                _this.windowtop = 0;
            }
        });
    }
    ,modalToMadal:function(){
        var thisModalBtn = this.keyDom.find('[effect-modal-to-madal]');
        if(thisModalBtn.length){
            thisModalBtn.on('click',function(e){
                e.preventDefault();
                var thisdom = $(this),
                    thisid = thisdom.parents('.modal').attr('id'),
                    thisParentDom = $("#"+thisid);
                    thisgoto = thisdom.attr('effect-modal-to-madal');
                thisParentDom.modal('hide');
                thisParentDom.one('hidden.bs.modal', function (e) {
                    $(thisgoto).modal('show');
                });
            });
        }
    }
    ,initial:function(){
        this.modalOpen();
        this.modalToMadal();
    }
}
var $collapseHeight = {
    key:'[effect-collapse-height]'
    ,windowSize:{
         'effect-collapse-height-m': 480
        ,'effect-collapse-height-pad': 992
    }
    ,_getArray:function(){
        return Object.keys(this.windowSize);
    }
    ,_getCloseHeight:function(dom){
        var windowSizeName = this._getArray();
        var fnSize = 'effect-collapse-height';
        for(var i = 0; i < windowSizeName.length; i++){
            if($windowData.width <= this.windowSize[windowSizeName[i]]){
                fnSize = windowSizeName[i];
                break;
            }
        }
        return fnSize;
    }
    ,_initialClose:function(){
        var _this = this;
        var windowSizeName = this._getArray();
        if(this.keyHas){
            this.keyDom.each(function(){
                var thisDom = $(this),
                    domWindowSize = {
                        'effect-collapse-height':thisDom.attr('effect-collapse-height')+'px'
                    };
                for(var i = 0; i < windowSizeName.length; i++){
                    var thisAttr = windowSizeName[i];

                    if(thisDom.attr(thisAttr) != undefined){
                        domWindowSize[thisAttr] = thisDom.attr(thisAttr)+'px';
                    }
                }
                thisDom.data('effectCollapseSize',domWindowSize);
                thisDom.data('effectCollapseBindingBtn',[]);

                if(!thisDom.hasClass('show')){
                    _this.hide(thisDom);
                }
                else{
                    _this.show(thisDom);
                }
            });
        }
    }
    ,_btnEvent: function(){
        var btn = $('[effect-collapse-btn]');
        if(btn.length){
            var _this = this;
            btn.each(function(i,o){
                _this.binding(o);
            });
        }
    }
    ,binding:function(dom){
        var _this = this;
        var thisDom = $(dom);
        var isClick = false;
        var bindingId = thisDom.attr('effect-collapse-btn');
        var bindingContent = $(bindingId);
        bindingContent.data('effectCollapseBindingBtn').push(thisDom);
        thisDom.on('click',function(e){
            e.preventDefault();
            if(!isClick){
                isClick = true;
                _this.toggle(bindingId);
                setTimeout(function(){isClick = false;},510);
            }
        });
    }
    ,show:function(dom){
        var openDom = $(dom),
            finalH = openDom.children('.effect-collapse-content').height();
        openDom.css('transition','.5s');
        openDom.css('height',finalH+'px');
        openDom.trigger('UT.collapse.show');
        $.each(openDom.data('effectCollapseBindingBtn'),function(i,o){
            $(o).attr('effect-collapse-open','true');
        });
        setTimeout(function(){
            openDom.css('transition','');
            openDom.css('height','auto');
            openDom.addClass('show');
            openDom.trigger('UT.collapse.shown');

        },510);
    }
    ,hide:function(dom){
        var closeDom = $(dom),
            finalH = closeDom.data('effectCollapseSize')[this._getCloseHeight(dom)];
            closeDom.css('transition','.5s');
        closeDom.css('height',closeDom.height()+'px');
        closeDom.trigger('UT.collapse.hide');
        setTimeout(function(){
            closeDom.css('height',finalH);
            $.each(closeDom.data('effectCollapseBindingBtn'),function(i,o){
                $(o).attr('effect-collapse-open','false');
            });
        },0);
        setTimeout(function(){
            closeDom.css('transition','');
            closeDom.removeClass('show');
            closeDom.trigger('UT.collapse.hidden');
        },510);
    }
    ,toggle:function(dom){
        if($(dom).hasClass('show')){
            this.hide(dom);
            $('html, body').scrollTop(scrollTop_t);

        }
        else{
            this.show(dom);
            scrollTop_t = document.documentElement.scrollTop;
        }
    }
    ,initial:function(){
        this._initialClose();
        this._btnEvent();
    }
    ,onResize:function(){
        if(this.keyHas){
            var _this = this;
            this.keyDom.each(function(i,o){
                var thisDom = $(o);
                if(!thisDom.hasClass('show')){
                    thisDom.css('height',thisDom.data('effectCollapseSize')[_this._getCloseHeight(o)]);
                }
            });
        }
    }
}
var $handleInput = {
    key:'[effect-handle-input="true"]'
    ,binding:function(dom,data){
        var thisDom = $(dom);
        var thisData = thisDom.data('effectHandleInput');
        if(thisDom.data('effectHandleInput') != undefined){
            Object.assign(thisData, data);
        }
        else{
            thisDom.data('effectHandleInput',data);
            this._changeEvent(thisDom);
        }
    }
    ,_maxLength:function(changeInput,nowVal,max){
        if(nowVal.length > max){
            var output = {
                 val:nowVal
                ,max:max
            }
            changeInput.trigger('UT.handleInput.maxLength.false',[output]);
        }
    }
    ,_minLength:function(changeInput,nowVal,min){
        if(nowVal.length < min){
            var output = {
                 val:nowVal
                ,min:min
            }
            changeInput.trigger('UT.handleInput.minLength.false',[output]);
        }
    }
    ,_maxNum:function(changeInput,nowVal,max){
        var num = parseFloat(nowVal);
        if(num != NaN && num > max){
            var output = {
                 val:nowVal
                ,max:max
            }
            changeInput.trigger('UT.handleInput.maxNum.false',[output]);
        }
    }
    ,_minNum:function(changeInput,nowVal,min){
        var num = parseFloat(nowVal);
        if(num != NaN && num < min){
            var output = {
                 val:nowVal
                ,min:min
            }
            changeInput.trigger('UT.handleInput.minNum.false',[output]);
        }
    }
    ,_checkNumType:function(changeInput,nowVal,val){
        var num = parseFloat(nowVal);
        if(num != NaN){
            var type = num>0?'pos':(num=0?'zreo':'nega');
            changeInput.trigger('UT.handleInput.minNum.'+type,[num]);
        }
    }
    ,_changeEvent:function(thisInput){
        var _this = this;
        var isChange = false;
        thisInput.change(function(){
            if(!isChange){
                isChange = true;
                var changeInput = $(this);
                var nowVal = changeInput.val();
                var thisData = changeInput.data('effectHandleInput');
                $.each(thisData,function(key,val){
                    if(_this.hasOwnProperty('_'+key)){
                        _this['_'+key].apply(null,[changeInput,nowVal,val]);
                    }
                });
                isChange = false;
            }
        });
    }
    ,_eachEvent:function(){
        var _this = this;
        if(this.keyHas){
            this.keyDom.each(function(i,o){
                var thisInput    = $(o);
                var maxLength    = parseInt(thisInput.attr('effect-handle-input-maxLength')),
                    minLength    = parseInt(thisInput.attr('effect-handle-input-minLength')),
                    maxNum       = parseInt(thisInput.attr('effect-handle-input-maxNum')),
                    minNum       = parseInt(thisInput.attr('effect-handle-input-minNum')),
                    checkNumType = thisInput.attr('effect-handle-input-checkNumType') == 'true';

                var effectHandleInput = {};

                if(maxLength != NaN){
                    effectHandleInput['maxLength'] = maxLength;
                }
                if(minLength != NaN){
                    effectHandleInput['minLength'] = minLength;
                }
                if(maxNum != NaN){
                    effectHandleInput['maxNum'] = maxNum;
                }
                if(minNum != NaN){
                    effectHandleInput['minNum'] = minNum;
                }
                if(checkNumType){
                    effectHandleInput['checkNumType'] = checkNumType;
                }

                thisInput.data('effectHandleInput',effectHandleInput);
                _this._changeEvent(thisInput);
            });
        }
    }
    ,initial:function(){
        this._eachEvent();
    }
}
var $inLinkHref = {
    key: '[in-link-href]'
    ,initial:function(){
        if(this.keyHas){
            this.keyDom.each(function(i,o){
                $(o).on('click',function(e){
                    e.preventDefault();
                    window.location = $(this).attr('in-link-href');
                });
            });
        }
    }
}
var $backHistoryPage = {
    key:'.mega-comp-btn-content'
    ,initial:function(){
        if(this.keyHas){
            this.keyDom.each(function(i,o){
                $(o).find('[go-back-fun="back_history"]').on('click',function(){
                    // if (/(iPhone|iPad|iPod)/i.test(navigator.userAgent)) {    
                    //     window.history.go("-1");
                    //     //window.location.href = window.document.referrer;
					// } else { window.history.go("-1"); }
					window.history.go("-1");
                });
            });
        }
    }
}
//=============== tool: end ===============//
//===========   tool function     ===========//

function listChinese(){
    var domList = $('[effect-list-chinese]');
    if(domList.length > 0){
        domList.each(function(){
            var thisList = $(this);
            // var thisListAttr = thisList.attr('effect-list-chinese').split(/[^\\](?=\+)/);
            var thisListAttr = thisList.attr('effect-list-chinese').split(/\+/);
            var thisListAttrLength = thisListAttr.length;
            var listType = [];

            var spanStyle  = thisListAttrLength >= 2?'<span class="effact-list-span">'+thisListAttr[0]:'<span class="effact-list-span">';
            var addSpanEnd = thisListAttrLength == 3?addSpanEnd = thisListAttr[2]:'';
            var endSign = thisList.attr('effect-list-chinese-end-sign');
            function _isEmpty(val){
                var status ='';
                var _boolean = (val === undefined || val == null) ? true : false;
                if(val === undefined){
                    status = 'string-undefined';
                }
                else if(val == null){
                    status = 'string-null';
                }
                else if(val.length <= 0){
                    status = 'string-no-length';
                }
                else{
                    status = 'string-not-empty';
                    
                }
                
                return [_boolean,status];
            }

            // 將字串轉為array並逐字判斷全半形並賦予class以調整長度
            function _getLength(ele){
                var eleSpanArray = ele.text().split("");
                var eleSpanLength = 0;
                // console.log(numSpanArray);
                eleSpanArray.forEach(function(character){
                    if(character.match(/[\x00-\xff]/g)){
                        eleSpanLength+=0.5;
                        // console.log(i+':0.5');
                    }
                    else if(character.match(/[^\x00-\xff]/g)){
                        eleSpanLength+=1;
                        // console.log(i+':1');
                    }
                });
                if(Math.ceil(eleSpanLength)-eleSpanLength!=0){
                    
                    eleSpanLength = Math.floor(eleSpanLength)+'-half';
                }
                return eleSpanLength;
            }

            if(_isEmpty(endSign)[0]){
                endSign = '、';
            }
            if(endSign=='noSign'){
                endSign = ''
            }

            var thisType = thisListAttr[Math.floor(thisListAttrLength/2)];
            if(thisType == 'big' || thisType == 'small'){
                
                if(thisType == 'big'){
                    listType = ["零","壹","貳","參","肆","伍","陸","柒","捌","玖","拾","佰","仟"];
                }
                else{
                    listType = ["○","一","二","三","四","五","六","七","八","九","十","百","千"];
                }
                thisList.children('li').each(function(i,o){

                    var thisObj = $(o);
                    var indexNum = i+1;
                    var indexArray = (indexNum+'').split('');
                    var indexArrayLength = indexArray.length;
                    var spanText = '';
                    var textTen = listType[10];
                    var texthundred = listType[11];
                    // console.log(indexArray );
                    if(indexArrayLength < 2){
                        spanText = listType[indexNum];
                    }
                    else{
                        var oneNumNum = parseInt(indexArray.pop());
                        var tenNumNum = parseInt(indexArray.pop());
                        var hundredNumNum = parseInt(indexArray.pop());
                        var oneNem =  oneNumNum === 0? '':listType[oneNumNum];
                        if(indexArrayLength < 3){
                            var tenNum = tenNumNum === 0? '':( tenNumNum === 1?'':listType[tenNumNum] )+textTen;
                            spanText = tenNum + oneNem;
                        }
                        else{
                            var tenNum = tenNumNum === 0? listType[tenNumNum]:listType[tenNumNum]+textTen;
                            if(indexNum%100===0){tenNum =''}
                            spanText = listType[hundredNumNum] +texthundred+ tenNum +oneNem;
                        }
                    }
                    thisObj.prepend(spanStyle+ spanText+addSpanEnd+endSign+"</span>");
                    var numSpan = thisObj.find('span').first();
                    thisObj.addClass("effact-list-chinese-"+_getLength(numSpan));
                    // console.log(numSpan.text().length);
                });
            }
            else if(thisType === 'number'){
                // 全形數字專用
                String.prototype.halfToFull = function () {
                    var temp = "";
                    for (var i = 0; i < this.toString().length; i++) {
                        var charCode = this.toString().charCodeAt(i);
                        if (charCode <= 126 && charCode >= 33) {
                            charCode += 65248;
                        } else if (charCode == 32) { // 半形空白轉全形
                            charCode = 12288;
                        }
                        temp = temp + String.fromCharCode(charCode);
                    }
                    return temp;
                };
                thisList.children('li').each(function(i,o){
                    var thisObj = $(o);
                    var str = (i+1)+'';
                    var indexNum = str.halfToFull();
                    console.log(indexNum);
                    thisObj.prepend(spanStyle+ indexNum+addSpanEnd+endSign+"</span>");
                    var numSpan = thisObj.find('span').first();
                    thisObj.addClass("effact-list-chinese-"+_getLength(numSpan));
                });
            }
        });
    }
}

function getdataObject(id){
    
}

function getShadowNull(){
    var body = $('body');
    var shadow_existence = $('.shadow-null').length;
	if(!shadow_existence){
		var shadow_null=$('<div class="shadow-null"></div>').css({
            'position': 'fixed',
            'pointer-events':'none',
    		'width': '100%',
    		'height': '100%',
    		'z-index': '-9999999999999999999999999999999'
		}).clone();
		body.prepend(shadow_null);
	}
	else if(shadow_existence){
        var size = {
            x:$('.shadow-null').width(),
            y:$('.shadow-null').height()
        }
		return size;
	}
}

//===========   tool function: end===========//


//===========   plugin function ============//
function pluginFunction(){

}
//===========   plugin function: end =======//















