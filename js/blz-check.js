
/*
 * weui弹窗封装
 */
+function($){
	'use strict';
	
    $.weui={};
	var modelAlert='',
        modelConfirm='',
        modelWarn='',
        loading='';
	$.weui.alert=function(obj){
		obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
		if(modelAlert!==''){
			$(modelAlert).find('.weui_dialog_title').html(obj.title);
			$(modelAlert).find('.weui_dialog_bd').html(obj.article);
			$(modelAlert).fadeIn(300);
		}else{
			modelAlert='<div class="weui_dialog_alert" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
                            '<div class="weui_mask"></div>'+
                            '<div class="weui_dialog">'+
                                '<div class="weui_dialog_hd">'+
                                    '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                                '</div>'+
                                '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                                '<div class="weui_dialog_ft">'+
                                    '<a href="javascript:void(0);" class="weui_btn_dialog primary" data-blz-dismiss=".weui_dialog_alert">确定</a>'+
                                '</div>'+
                            '</div>'+
                       '</div>';
			modelAlert=$(modelAlert).appendTo(document.body);
		}
	};
    
	$.weui.confirm=function(obj){
		obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
        obj.cancelText=obj.cancelText||'取消';
        obj.sureText=obj.sureText||'确定';
		if(modelConfirm!==''){
			$(modelConfirm).find('.weui_dialog_title').html(obj.title);
			$(modelConfirm).find('.weui_dialog_bd').html(obj.article);
            $(modelConfirm).find('.weui_btn_dialog.default').html(obj.cancelText);
            $(modelConfirm).find('.weui_btn_dialog.primary').html(obj.sureText);
			$(modelConfirm).fadeIn(300);
		}else{
			modelConfirm='<div class="weui_dialog_confirm" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
                            '<div class="weui_mask"></div>'+
                            '<div class="weui_dialog">'+
                                '<div class="weui_dialog_hd">'+
                                    '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                                '</div>'+
                                '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                                '<div class="weui_dialog_ft">'+
                                    '<a href="javascript:void(0);" class="weui_btn_dialog default" data-blz-dismiss=".weui_dialog_confirm" data-blz-option="cancell">'+obj.cancelText+'</a>'+
                                    '<a href="javascript:void(0);" class="weui_btn_dialog primary" data-blz-dismiss=".weui_dialog_confirm" data-blz-option="sure">'+obj.sureText+'</a>'+
                                '</div>'+
                            '</div>'+
                         '</div>';
			modelConfirm=$(modelConfirm).appendTo(document.body);
		}
        
        
		if(obj.cancellCallback){
			$(document).one('tapBlzOptioncancell',function(e){
				obj.cancellCallback(e);
				$(document).off('tapBlzOptionsure');
			});
		}
		if(obj.sureCallback){
			$(document).one('tapBlzOptionsure',function(e){
				obj.sureCallback(e);
				$(document).off('tapBlzOptioncancell');
			});
		}
        
		// 确定取消按钮
		$(document).one('tap','[data-blz-option]',function(){
			var data=$(this).data('blz-option');
			setTimeout(function(){
				$(document).trigger('tapBlzOption'+data);
			},0);
		});
	};
    
    $.weui.loading=function(){
        if(loading!==''){
            $(loading).css('display','block');
        }else{
            loading='<div id="loadingToast" class="weui_loading_toast" style="display: none;">'+
                            '<div class="weui_mask_transparent"></div>'+
                            '<div class="weui_toast">'+
                                '<div class="weui_loading">'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_0"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_1"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_2"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_3"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_4"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_5"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_6"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_7"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_8"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_9"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_10"></div>'+
                                    '<div class="weui_loading_leaf weui_loading_leaf_11"></div>'+
                                '</div>'+
                                '<p class="weui_toast_content">数据加载中</p>'+
                            '</div>'+
                        '</div>';
             loading=$(loading).appendTo(document.body).css('display','block');
        }
        return loading;
    };
    
    $.weui.warn=function(string){
        string=string||'';
        if(modelWarn!==''){
            $(modelWarn).html(string).css('display','block');
            setTimeout(function(){
                $(modelWarn).css('display','none');
            },3000);
        }else {
            modelWarn='<div class="weui_toptips weui_warn js_tooltips">'+string+'</div>';
            modelWarn=$(modelWarn).appendTo(document.body).css('display','block');
            setTimeout(function(){
                $(modelWarn).css('display','none');
            },3000);
        }
        return modelWarn;
    }
	// dismiss交互
	$(document).on('tap','[data-blz-dismiss]',function(){
		var target=$(this).data('blz-dismiss');
		$(target).fadeOut(330);
	});
}(window.Zepto||window.jQuery);

/*
 * blz模块声明
 */
+function($){
    'use strict';
    $.blz={};
    $.blz.emptyFunciton=function(){};
    $.blz.getDataType=function(data){
        return Object.prototype.toString.call(data).slice(8,-1).toLowerCase();
    };
}(window.Zepto||window.jQuery);

/*
 * 表单验证小孩年龄
 */
+function($){
    'use strict';
    
    $.serverTime=$.serverTime||{};
    $.blz.getAge=function(obj){
        var age=0;
        var now=new Date();
        var year=$.serverTime.year||now.getFullYear();
        var month=$.serverTime.month||now.getMonth()+1;
        var date=$.serverTime.date||now.getDate();
        obj=obj||{};
        obj.year=parseInt(obj.year)||year;
        obj.month=parseInt(obj.month)||month;
        obj.date=parseInt(obj.date)||date;
        age=year-obj.year;
        if(obj.month>month){
            age=age-1<0?0:age-1;
        }else if(obj.month===month){
            if(obj.date>date){
                age=age-1<0?0:age-1;
            }else{
                age=age;
            }
        }else {
            age=age;
        }
        return age;
    };    
}(window.Zepto||window.jQuery);

/*
 * 表单验证插件
 */
+function($){
	'use strict';
    
    // 检验规则
	var checkRule={
		any:[[2,100]],
		name:[[2,15],'[\u4e00-\u9fa5]{1,}(·?)[\u4e00-\u9fa5]{1,}$'],
		id:[[15,18],false,function(val){
			var Validator = new IDValidator();
			return Validator.isValid(val);
		}],
		phone:[[11,11],'^1'],
		email:[[4,30],'^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'],
		check:[[4,6],false,function(val){
			return val===($(this).data('blz-pattern')?$(this).data('blz-pattern').toString():val);
		}],
		agreement:[false,false,function(){
			return $(this).prop('checked');
		}],
		custom:[false,false,function(val){
			return val!==($(this).data('blz-pattern')?$(this).data('blz-pattern').toString():val+'1');
		}],
        sync:[false,false,function(val){
            return val===$($(this).data('blz-sync')).val();
        }]
	};
    
    // 核心检验函数
	$.fn.check = function(obj) {
        obj=obj||{};
        obj.getVerificationCode=obj.getVerificationCode||$.blz.emptyFunciton;
        obj.canSubmit=obj.canSubmit||$.blz.emptyFunciton;
        
		if(this.length<=0){return false;}
		var $elems = this.find('[data-blz-type]'); // 获取要验证的表单元素
		var isCountStart=false;
    	var $Tel=$('input[type="tel"]');
		var tip=false;
		var isCheckSendClick=false;
		var isSubmit=false;
        
        // 检查表单值是否合法函数
		function check(event) {
			var val=$(this).val();
			var type=$(this).data('blz-type');
			var rule = false;
			var $elem=$($(this).closest('.weui_cell'));
			if(event){tip = true;}
			var tipLength=false;
			var customs=false;
			if(checkRule[type][0]){
				tipLength = val.length < checkRule[type][0][0] || val.length > checkRule[type][0][1];
			}
			if(checkRule[type][1]){
				rule = new RegExp( checkRule[type][1], 'g');
				rule=!rule.test($.trim(val));
			}
			if(checkRule[type][2]){customs=!checkRule[type][2].call(this,val);}
			if (rule||tipLength||customs) { // 输入非法验证
				$elem.addClass('warning')&& event&&event.preventDefault();
				tip=true;
				$(this).attr('data-blz-check','inpass');
				return false;
			} else { // 输入合法验证
				$elem.removeClass('warning');
				$(this).attr('data-blz-check','pass');
				for(var i=0,j=$elems.length-1;i<=j;i++){
					if($elems.eq(i).data('blz-check')==='inpass'){
						if(event){event.preventDefault();}
						break;
					}	
				}
			}
		}
		
        // 计数器函数
		function count(n,$target){
			if(n>=0){
				isCountStart=true;
				$target.addClass('grey');
				$target.find('input').val(n+' 秒');
				setTimeout(function(){
					count(--n,$target);
				},1000);
			}else {
				$target.removeClass('grey');
				$target.find('input').val('获取验证码');
				isCountStart=false;
			}
		}
		$('#glb-chec-send').off('tap');
		$('#glb-chec-send').on('tap',function(){
            if(isCountStart){return false;}
			isCheckSendClick=true;
			if(!isSubmit){tip=false;}
			if($Tel.val().length===11&&$Tel.val()[0]==='1'){
				obj.getVerificationCode($('input[data-blz-type="check"]'));
			}else{
			    return false;	
			}
			count(45,$('#glb-chec-send'));
		});
        
        
		this.off('submit');
		this.on('submit',function(event){
			isSubmit=true;
			$elems.each(function(){check.call(this,event);});
            obj.canSubmit(event);
		});
        
		clearInterval($.blz.timer1);
		clearInterval($.blz.timer2);
		$.blz.timer1=setInterval(function(){
			if(!tip){return false;}
			$elems.each(function(){check.call(this);});
		},1000);
		$.blz.timer2=setInterval(function(){
			if(!isCheckSendClick||isSubmit){return false;}
			check.call($Tel[0]);
			if(!isSubmit){tip=false;}
		},1000);
		return this;
	};
	
	//安卓bug修复
	if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });
    }
}(window.Zepto||window.jQuery);

/*
 * 表单验证
 */
+function($){
	'use strict';
	$('form').check();
    
	// agreement
	$(document).on('tap','.ii-checkbox-parent',function(){
		var isAgree=$(this).find('input').prop('checked');
		isAgree=!isAgree;
		$(this).find('input').prop('checked',isAgree);
		if(isAgree){
			$('#btnAlert').removeClass('weui_btn_disabled weui_btn_default')
						  .addClass('weui_btn_primary')
						  .prop('disabled',false);
		}else {
			$('#btnAlert').addClass('weui_btn_disabled weui_btn_default')
						  .removeClass('weui_btn_primary')
						  .prop('disabled',true);
		}
	});
    
    // 对隐藏的select设置
    $('.glb-form-select-btn').on('change',function(){
        $('#glb-form-select-btn-value').find('input').val($(this).val());
    });
    $('input[type="submit"]').prop('disabled',false);
	
}(window.Zepto||window.jQuery);

/*
 * 表单input自动聚焦功能
 * 表单响应go按键主动提交
 * 修改命名处close功能
 */
 +function($){
    'use strict';
    
    $(document).on('keyup',function(e){
        if(e.which===13){
            $('form').trigger('submit');
        }
    });
    if($('.gecu-9 input').length!==0){
        $(document).on('change','.gecu-9 input',function(){
            $(this).closest('.weui_cell_primary').addClass('no-weilei');
        }); 
    }
 }(window.Zepto||window.jQuery);
 
/*
 * 条款交互
 */
+function($){
	'use strict';
    
	// 预加载
	$.blz.cache=[];
	var $pdf=$('a[data-blz-pdf]');
	for(var i=0; i<$pdf.length;i++){
		var datas=$pdf.eq(i).data('blz-pdf');
		var data=datas.split(' ');
		var length=data.length;
		for(var j=0;j<length;j++){
			var img=new Image();
			img.src=data[j];
			$.blz.cache[$.blz.cache.length]=img;
		}
	}
	$(document).on('tap','[data-blz-pdf]',function(event){
		event.preventDefault();
        var loading=$.weui.loading();
        $.blz.timer3=setTimeout(function(){
            $.weui.alert({
                title:'抱歉',
                article:'条款加载失败，请稍后尝试'
            });
            $(loading).css('display','none');
        },6000);
		var datas=$(this).data('blz-pdf');
		var data=datas.split(' ');
		var length=data.length;
		var a=[];
        $('#wrapper').html('<ul><li id="img-box"></li></ul>');
		for(var i=0;i<length;i++){
			var img=new Image();
			img.onload=function(){
				a[a.length]=this;
				length--;
				if(length<=0){
					for(var i=0; i<a.length;i++){
						$(a[i]).appendTo($('#img-box'));
					}
                    $(loading).css('display','none');
                    clearTimeout($.blz.timer3);
					$('#glb_weui_mask').show(300);
					var myScroll = new IScroll('#wrapper', {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: 'scale',
						fadeScrollbars: true
					});
				}
			};
			img.src=data[i];
			
		}
	});
	$('#glb_weui_mask').on('tap',function(){
		$(this).hide();
	});
	$('#glb_weui_mask').on('touchend',function(event){
		event.preventDefault();
	});
}(window.Zepto||window.jQuery);

/*
 *Audi4s-5刷新交互
 */
+function($){
	'use strict';
	$(document).on('tap','[data-blz-refresh]',function(){
		var target=$(this).data('blz-refresh');
		target=$(target).addClass('animation');
		setTimeout(function(){
			target.removeClass('animation');
		},2000);
	});
}(window.Zepto||window.jQuery);

/*
 * 页面交互bug修复
 */
document.body.addEventListener('touchstart',function(){},false);