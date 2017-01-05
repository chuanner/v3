if(window.jQuery===undefined){
    throw new Error('jin bang ti ming 3 need a jQuery version 3.0++');    
}


/*
 * weui对话框
 */
+function($){
	'use strict';
	
    $.weui={};
	var modelAlert={
            model:'',
            hidden:true,
            cache:[]
        },
        modelConfirm={
            model:'',
            hidden:true,
            cache:[]
        },
        modelWarn={
            model:'',
            cache:[]
        },
        loading='',
        modelTip={
            model:'',
            hidden:true,
            cache:[]
        };
        
	// 缓存的弹窗数据处理
    function bindCache(model,cache,callback,time){
        time=time||0;
        model.on('click.blz',function(){
            setTimeout(function(){
                callback(cache[0]);
                cache.shift();
                if(cache.length<=0){
                    model.off('click.blz');
                }
            },time);
        });
    }
    
    $.weui.alert=function(obj){
        var model=modelAlert.model;
        obj=obj||{};
		obj.title=obj.title||'';
		obj.article=obj.article||'';
		if(model!==''&&model.css('display')!=='none'){
            var cache=modelAlert.cache;
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=obj;
            
            model.off('click.blz');
            bindCache(model,cache,$.weui.alert,300);
            return model;
		}else if(model!==''){
            model.find('.weui_dialog_title').html(obj.title);
		    model.find('.weui_dialog_bd').html(obj.article);
		    model.fadeIn(300);
        }else{
			model='<div id="weui_dialog_alert" class="weui_dialog_alert" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
                  '<div class="weui_mask"></div>'+
                  '<div class="weui_dialog">'+
                      '<div class="weui_dialog_hd">'+
                          '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                      '</div>'+
                      '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                      '<div class="weui_dialog_ft">'+
                          '<a href="javascript:void(0);" class="weui_btn_dialog primary" data-blz-dismiss="#weui_dialog_alert">确定</a>'+
                      '</div>'+
                  '</div>'+
                  '</div>';
			modelAlert.model=model=$(model).appendTo(document.body);
		}
        if(obj.sureCallback){
            model.find('.weui_btn_dialog').on('click.blz',function(){
				obj.sureCallback();
				$(this).off('click.blz');
			});
        }
		return model;
	};
    
	$.weui.confirm=function(obj){
        var model=modelConfirm.model;
        obj=obj||{};
		obj.title=obj.title||'温馨提示';
		obj.article=obj.article||'';
        obj.cancelText=obj.cancelText||'取消';
        obj.sureText=obj.sureText||'确定';
        obj.sureHref=obj.sureHref||'javascript:void(0);';
        obj.cancelHref=obj.cancelHref||'javascript:void(0);';
		
        if(model!==''&&model.css('display')!=='none'){
            var cache=modelConfirm.cache;
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=obj;
            
            model.off('click.blz');
            bindCache(model,cache,$.weui.confirm,300);
            return model;
        }else if(model!==''){
			model.find('.weui_dialog_title').html(obj.title);
            model.find('.weui_dialog_bd').html(obj.article);
            model.find('.weui_btn_dialog.default').html(obj.cancelText).attr('href',obj.cancelHref);
            model.find('.weui_btn_dialog.primary').html(obj.sureText).attr('href',obj.sureHref);
			model.fadeIn(300);
		}else{
			model='<div id="weui_dialog_confirm" class="weui_dialog_confirm" style="position:fixed;top:0;bottom:0;left:0;right:0;z-index:9999">'+
                            '<div class="weui_mask"></div>'+
                            '<div class="weui_dialog">'+
                                '<div class="weui_dialog_hd">'+
                                    '<strong class="weui_dialog_title">'+obj.title+'</strong>'+
                                '</div>'+
                                '<div class="weui_dialog_bd">'+obj.article+'</div>'+
                                '<div class="weui_dialog_ft">'+
                                    '<a href="'+obj.cancelHref+'" class="weui_btn_dialog default" data-blz-dismiss="#weui_dialog_confirm" data-blz-option="cancell">'+obj.cancelText+'</a>'+
                                    '<a href="'+obj.sureHref+'" class="weui_btn_dialog primary" data-blz-dismiss="#weui_dialog_confirm" data-blz-option="sure">'+obj.sureText+'</a>'+
                                '</div>'+
                            '</div>'+
                         '</div>';
			modelConfirm.model=model=$(model).appendTo(document.body);
		}
        
        
		if(obj.cancelCallback){
            $(document).on('clickBlzOptioncancel',function(e){
				obj.cancelCallback(e);
				$(document).off('clickBlzOptionsure clickBlzOptioncancel click.sure.cancel');
			});
		}
		if(obj.sureCallback){
            $(document).on('clickBlzOptionsure',function(e){
				obj.sureCallback(e);
				$(document).off('clickBlzOptionsure clickBlzOptioncancel click.sure.cancel');
			});
		}
        
		// 确定取消按钮
		$(document).on('click.sure.cancel',function(){
			var data=$(this).data('blz-option');
			data=data?data:'cancel';
			setTimeout(function(){
				$(document).trigger('clickBlzOption'+data);
			},30);
		});
		return model;
	};
    
    $.weui.loading=function(string){
        if(!navigator.onLine){
            $.weui.tip('无网络');
            return null;
        }
        string=string||'数据加载中';
        if(loading!==''){
            loading.css('display','block').find('.weui_toast_content').html(string);
        }else{
            loading='<div id="loadingToast" class="weui_loading_toast" style="display: none;">'+
                        '<div class="weui_mask_transparent"></div>'+
                        '<div class="weui_toast">'+
                            '<i class="weui_loading weui_icon_toast"></i>'+
                            '<p class="weui_toast_content">'+string+'</p>'+
                        '</div>'+
                    '</div>';
            loading=$(loading).appendTo(document.body).css('display','block');
        }
        return loading;
    };
	
	$.weui.partLoading=function(elem,string){
		if(!navigator.onLine){
            $.weui.tip('无网络');
            return false;
        }
		string=string||'数据加载中';
		string='<div class="weui_toast model-part-loading">'+
					'<i class="weui_loading weui_icon_toast"></i>'+
				    '<p class="weui_toast_content">'+string+'</p>'+
				'</div>';
		return $(string).appendTo(elem);
	};
    
    $.weui.warn=function(obj){
        var model=modelWarn.model;
        var cache=modelWarn.cache;
        
        obj=obj||{};
		obj.article=obj.article||'';
        obj.title=obj.title||'警告';
        
        if(model!==''&&model.css('display')!=='none'){
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=obj;
            return model;
        }else if(model!==''){
            model.html(obj.title+'：'+obj.article).fadeIn();
        }else {
            model='<div class="weui_toptips weui_warn js_tooltips">'+obj.title+'：'+obj.article+'</div>';
            modelWarn.model=model=$(model).appendTo(document.body).fadeIn();
        }
        
        setTimeout(function(){
            model.fadeOut(0);
            
            // 小于零则关闭warn弹窗的反复调用大于0则开启
            if(cache.length>0){
                $.weui.warn(cache[0]);
                cache.shift();
            }
        },3000);
        
        return model;
    };
    
    $.weui.tip=function(string){
        var model=modelTip.model;
        var cache=modelTip.cache;
        
        string=string||'';
        if(model!==''&&model.css('display')!=='none'){
               
            // 假如弹窗已存在,将弹窗数据缓存；
            cache[cache.length]=string;
            return model;
        }else if(model!==''){
            model.html(string).fadeIn();
        }else {
            model='<div class="glb_weui_toast weui_toast" style="padding-top:1em;">'+string+'</div>';
            modelTip.model=model=$(model).appendTo(document.body);
        }
        setTimeout(function(){ 
           $(model).fadeOut(0);
           
           // 小于零则关闭tip弹窗的反复调用大于0则开启
           if(cache.length>0){
                $.weui.tip(cache[0]);
                cache.shift();
            }
        },3000);
        
        return model;
    };   
	// dismiss交互
	$(document).on('click.blz.dismiss','[data-blz-dismiss]',function(){
		var target=$(this).attr('data-blz-dismiss');
		$(target).fadeOut(0);
	});
    
    // show交互
	$(document).on('click.blz.show','[data-blz-show]',function(){
		var target=$(this).attr('data-blz-show');
		$(target).fadeIn(300);
	});
	
	// 组件卸载
	$.weuiOff=function(){
		$.weui=null;
		$(document).off('click.blz.dismiss click.blz.show');
		if(modelAlert.model!==''){modelAlert.model.remove();}
        if(modelConfirm.model!==''){modelConfirm.model.remove();}
        if(modelWarn.model!==''){modelWarn.model.remove();}
        if(loading!==''){loading.remove();}
        if(modelTip.model!==''){modelTip.model.remove();}
		$.weuiOff=null;
	};
}(window.jQuery||window.Zepto);

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
    $.blz.useragent=/Android/gi.test(navigator.userAgent);
	$.blz.checkBrowerKernel=function(){
		var o=document.createElement('div');
		var a=[['','transition',''],['webkit','Transition','-'],['ms','Transition','-'],['Moz','Transition','-'],['O','Transition','-']];
		for(var i=a.length-1;i>=0;i--){
			if(a[i][0]+a[i][1] in o.style){
				return a[i][2]+a[i][0].toLowerCase()+a[i][2];
			}else if(i===0){
				return '';
			}
		}
	};
}(window.jQuery);


/*
 * 表单验证插件
 */
+function($){
	'use strict';
    
    // 提示语
    var checkTip={
        any:'内容不能为空',
        name:'姓名格式错误',
        id:'身份证号码格式错误',
        phone:'手机号码格式错误',
        email:'邮箱格式错误',
        check:'验证码错误',
        agreement:'请同意协议',
        custom:'内容有误',
        price:'请输入消费金额',
        repeat:'密码输入不一致',
        childid:'孩子身份证号码格式错误',
        address:'省市区不能为空',
		bankcard:'银行卡号需为6-30位数字'
    };
    
    // 检验规则
	var checkRule={
		any:[[1,100]],
		anyname:[[1,30]],
		name:[[2,15],'[\u4e00-\u9fa5]{1,}(·?)[\u4e00-\u9fa5]{1,}$'],
		id:[[15,18],false,function(val){
			var Validator = new IDValidator();
			return Validator.isValid(val)&&getAge({
                    year:val.slice(6,10),
                    month:val.slice(10,12),
                    date:val.slice(12,14)
                })>0;
		}],
		phone:[[11,11],'^1'],
		email:[[4,30],'^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'],
		check:[[6,6],false,function(val){
			return val===($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val);
		}],
		agreement:[false,false,function(){
			return $(this).prop('checked');
		}],
		custom:[false,false,function(val){
			return val!==($(this).attr('data-blz-pattern')?$(this).attr('data-blz-pattern').toString():val+'1');
		}],
        price:[false,false,function(){
            return $(this).data('blz-value')>0;
        }],
        repeat:[false,false,function(val){
            return val===$($(this).attr('data-blz-same')).val();
        }],
        childid:[[18,18],false,function(val){
			var Validator = new IDValidator();
            var obj={
                    year:val.slice(6,10),
                    month:val.slice(10,12),
                    date:val.slice(12,14)
                };
			return Validator.isValid(val)&&getAge(obj)>0&&obj.year>=2010;
		}],
        address:[false,false,function(){
            return this[0].selectedIndex!==0;
        }],
		lengthcustom:[[6,6]],
		bankcard:[false,false,function(val){
			return val.replace(/ /g,'').length>=6&&val.replace(/ /g,'').length<=30;
		}],
		select:[false,false,function(val){
			return val>0;
		}]
	};
	$.blz.checkRule=checkRule;
	// 获取年龄函数
	function getAge(obj){
        var age=0;
        var now=new Date();
        var year=now.getFullYear();
        var month=now.getMonth()+1;
        var date=now.getDate();
        obj=obj||{};
        obj.year=parseInt(obj.year)||year;
        obj.month=parseInt(obj.month)||month;
        obj.date=parseInt(obj.date)||date;
        age=year-obj.year;
        if(age<0){return age;}
        if(obj.month>month){
            age=age-1;
        }else if(obj.month===month){
            if(obj.date>date){
                age=age-1;
            }else{
                age=age+1;
            }
        }else {
            age=age+1;
        }
        return age;
    }
    
 	// 自动验证
	function loop($elem,warnElemClass,warnClass,callback){
		$elem.data('blzTimer',setTimeout(function(){
			callback.call($elem,false,warnElemClass,warnClass);
			loop($elem,warnElemClass,warnClass,callback);
		},800));
	}
    
    // 检查表单值是否合法函数
    function check(event,warnElemClass,warnClass) {
        var $this=$(this);
        var val=$this.val();
        var type=$this.attr('data-blz-type').toLowerCase();
        var rule = false;
        var $elem=$this.closest(warnElemClass);
        var tipLength=false;
        var customs=false;
        if(checkRule[type][0]){
            tipLength = val.length < checkRule[type][0][0] || val.length > checkRule[type][0][1];
        }
        if(checkRule[type][1]){
            rule = new RegExp( checkRule[type][1], 'g');
            rule=!rule.test($.trim(val));
        }
        if(checkRule[type][2]&&(type!=='check'?true:event?true:false)){
            customs=!checkRule[type][2].call($this,$.trim(val));
        }
        
        // 输入非法验证
        if (rule||tipLength||customs) { 
            $elem.addClass(warnClass.slice(1));
            
            // 对于非法输入开启自动验证
            if($this.attr('data-blz-auto-check')!=='yes'){
                $this.attr('data-blz-auto-check','yes');
				loop($this,warnElemClass,warnClass,check);
            }
            if(event&&event.type==='submit'){
                if(val.length>0){
					$.weui.tip($this.attr('data-blz-alert')||checkTip[type]);
				}else {
					$.weui.tip($this.attr('placeholder')||checkTip[type]);
				}
            }
			
            $this.attr('data-blz-check','inpass');
        } else { 
            
            // 输入合法验证
            $elem.removeClass(warnClass.slice(1));
            $this.attr('data-blz-check','pass');
			$this.attr('data-blz-auto-check','no');
			clearInterval($this.data('blzTimer'));
        }
    }
	
	// 计数器函数
	function count(n,$target){
		if(n>=0){
			$target.data('isCountStart',true);
			$target.addClass('grey');
			$target.val(n+' 秒后重发');
			setTimeout(function(){
				count(--n,$target);
			},1000);
		}else {
			$target.removeClass('grey');
			$target.val('获取验证码');
			$target.data('isCountStart',false);
		}
	}
    
    // 检验函数
	$.fn.check=function(obj){
		
		obj=obj||{};
		obj.getVerificationCode=obj.getVerificationCode||$.blz.emptyFunciton;
		obj.canSubmit=obj.canSubmit||$.blz.emptyFunciton;
		
		return this.each(function(){
			var $this=$(this).checkOff(),
			    
				//获取要验证的表单元素
				$elems=$this.find(obj.checkElemClass||'[data-blz-type]:not([disabled])');

			$this.data('warnElemClass',obj.warnElemClass||'.weui_cell')
			     .data('warnClass',obj.warnClass||'.weui_cell_warn')
			     .data('agreementClass',obj.agreementClass||'.blz-agreement')
			     .data('verificationCodeClass',obj.verificationCodeClass||'.blz-verification-code')
			     .data('checkElemClass',obj.checkElemClass||'[data-blz-type]:not([disabled])');
			
			$this.find($this.data('verificationCodeClass')).on('click.verificationCode',function(){
				var $this=$(this),
				    $target=$($this.attr('data-blz-target'));
				if($this.data('isCountStart')){
					
				}else{
					if($target.val().length===11&&$target.val()[0]==='1'){
						obj.getVerificationCode($target,$this);
						count(60,$this);
					}else{
							
					}
				}
			});

			// 协议
			$this.find($this.data('agreementClass')).on('change.agreement',function(){
				if(this.checked){
					$this.find('input[type="submit"]').prop('disabled',false);
				}else {
					$this.find('input[type="submit"]').prop('disabled',true);
				}
			});

			// 失去焦点时验证
			$elems.on('blur.check blurSimulation',function(e){
				check.call(e.target,event,$this.data('warnElemClass'),$this.data('warnClass'));
			});

			$this.on('submit.check',function(event){
				var i=0;

				// 对于模拟的键盘触发的元素失焦事件晚于表单提交，固表单提交时对其进行重新验证
				if($this.find('.price').val()>0){
					$this.find('.price').attr('data-blz-check','pass');
				}
				// 依据检测合法的表单元素个数是否等于要验证的表单元素个数来决定是否提交表单； 
				if($this.find('[data-blz-check="pass"]').length!==$elems.length){
					event.preventDefault();
					for(i=0;i<$elems.length;i++){
						check.call($elems[i],event,$this.data('warnElemClass'),$this.data('warnClass'));
						if($elems.eq(i).attr('data-blz-check')!=='pass'){
							$elems[i].scrollIntoViewIfNeeded();
							break;
						}
					}
				}else{
					obj.canSubmit.call(this,event);
				}
			});
		});
	};
    
	//安卓bug修复
	if (/Android/gi.test(navigator.userAgent)) {
        $(window).on('resize.check', function () {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        });
    }

	// 关闭表单验证
	$.fn.checkOff=function(){
		return this.each(function(){
			var $this=$(this);
			$this.find($this.data('verificationCodeClass')).off('click.verificationCode');
			$this.find($this.data('agreementClass')).off('change.agreement');
			$this.find($this.data('checkElemClass')).off('blur.check blurSimulation');
			$this.off('submit.check');
		});
	};
	
	// 表单验证组件卸载
	$.checkOff=function(selector){
		$(selector?selector:'form').checkOff();
		$.fn.checkOff=null;
		$.fn.check=null;
		$(window).off('resize.check');
		$.checkOff=null;
	};
}(window.jQuery);

/*
 * 条款交互
 */
+function($){
	'use strict';
    
	var modelAgreement='<div class="weui_mask blz-mask" id="blz-mask" data-blz-dismiss="#blz-mask">'+
							'<span class="close"></span>'+
							'<div id="blz-wrapper">'+
								'<ul>'+
									'<li id="blz-img-box">'+
									'</li>'+
								'</ul>'+
							'</div>'+
						'</div>';
	
	$(document).on('click.pdf','[data-blz-pdf]',function(event){
		event.preventDefault();
		
        var loading=$.weui.loading(),
		    datas=$(this).data('blz-pdf'),
		    data=datas.split(' '),
		    length=data.length,
			l=length,
			b=[],
			frag=document.createDocumentFragment();
		
		for(var i=0;i<length;i++){
			b[i]=new Image();
			b[i].onload=function(){
				l--;
				if(l<=0){
					for(var i=0; i<b.length;i++){
						frag.appendChild(b[i]);
					}
					modelAgreement=$(modelAgreement).appendTo(document.body);
					$('#blz-img-box').html('').append(frag);
                    loading.hide();
					$('#blz-mask').show();
				}
			};
			b[i].src=data[i];
			
		}
	});
	
	$('#blz-img-box').on('scroll',function(e){
		e.preventDefault();
	});
	
	// 组件卸载
	$.clauseOff=function(){
		$('#blz-img-box').off('scroll');
		$(document).off('click.pdf');
		$(modelAgreement).remove();
		$.clauseOff=null;
	};
	// 开启表单验证
	$(document.forms).check();
}(window.jQuery||window.Zepto);


/*
 * 表单响应go按键主动提交
 */
 +function($){
    'use strict';
    
    $(document).on('keyup',function(e){
        if(e.which===13){
            $('form').submit();
        }
    }); 
 }(window.jQuery);


/*
 * 键盘
 */
+function($,hack){
    'use strict';
    
    if($('.glb-keyboard').length<=0){return false;}
    
    var $keyboard=$('.glb-keyboard');
    var $sync={
        length:0,
        elems:null,
        selector:''};
    var $targetInput=$('哈哈');
    var $targetTwinkle=$('哈哈');
    var $targetElem=$('哈哈');
    var $Inputs=$('[data-blz-keyboard="true"][data-blz-input="true"]').find('input');
    var $targetInputPrev=$targetInput;
	var $form=$('.model-form');
    
    // 获取window高度
    var h1=window.innerHeight;
    var h2=h1;
	var h3=$keyboard.height();
    
    // 差值
    var dy=0;
    
    // 是否可以提交
    function canSubmit($elem){
        var a=false;
        for(var i=0;i<$Inputs.length;i++){
            if($Inputs.eq(i).val()<=0){
                a=false;
                break;
            }else {
                a=true;
            }
        }
        if(a){
            $elem.closest('.glb-keyboard').addClass('glb-submit-available');
        }else {
            $elem.closest('.glb-keyboard').removeClass('glb-submit-available');
        }
    }
    
    //金额美化函数
    function lookBetter(val){
        if(val===''){return '';}
        val=val.toString();
        var betterVal='';
        var a=[];
        var index=val.indexOf('.');
        var l=parseInt(val).toString().length;
        for(var i=l;i>=3;i-=3){
            a[a.length]=val.slice(i-3,i);
        }
        if(l%3!==0){
            a[a.length]=val.slice(0,l%3);
        }
        for(i=a.length-1;i>0;i--){
            betterVal+=a[i]+',';
        }
        betterVal+=a[0];
        if(index!==-1){
            betterVal+=val.slice(index,val.length);
        }
        return betterVal;
    }
    
    // input值键入时自身属性检测
    function toMyValue(val,$target,tip){
        var index=-1;
        if($target.data('blz-max')){
            val=val<=$target.data('blz-max')?val:$target.data('blz-max').toString();
        }
        if($target.data('blz-min')){
            val=val>=$target.data('blz-min')?val:$target.data('blz-min').toString();
        }
        if($target.data('blz-sync-map')&&tip){
            val=val*$target.data('blz-sync-map');
            val=''+val;
        }
        if($target.data('blz-tofixed')&&val.indexOf('.')!==-1&&val.length-val.indexOf('.')>$target.data('blz-tofixed')){
            index=val.indexOf('.');
            val=val.slice(0,index+3);
        }
        
        return val;
    }
    
    // 模拟键盘输入
    function input($elem,$target){
        var val=$target.data('blz-value')?$target.data('blz-value').toString():'';
        var text=$elem.text();
        var val1='';
        if(!isNaN(parseInt(text))){
            if(val.length===1&&val==='0'){
                val=text;
            }else{
                val=val+text;
            }
            
        }else if(text==='.'){
            if(val.indexOf('.')===-1&&val.length>0){
                val=val+'.';
            }
        }else if($elem.is('.glb-keyb-delete')){
            val=val.slice(0,-1);
        }else if($elem.is('.glb-keyb-confirm')&&$elem.closest('.glb-keyboard').is('.glb-submit-available')){
            $('.model-form').trigger('submit');
            return;
        }else {
            return false;
        }
        val=toMyValue(val,$target,false);
        val1=lookBetter(val);
		$target.val(val1);
		$target.data('blz-value',val);
        if($sync.length!==0&&$sync.selector===$target.data('blz-sync')){
            $sync.elems.each(function(index, element) {
                if('value' in element){
                    element.value=toMyValue(val,$(element),true);
                    if($(element).data('blz-sync')){
                        setTimeout(function(){
                            $(element).trigger('blzChangeBindData');
                        },0);
                    }
                }else{
                    element.textContent=val1;
                }
            });
        }
        
        // canSubmit($elem);
        setTimeout(function(){
            $target.trigger('blzkeyup');
        },0);
    }
    
    // 被动触发数据互联，互动
    $(document).on('blzChangeBindData',function(e){
        var $target=$($(e.target).data('blz-sync'));
        var val=e.target.value;
        var val1=lookBetter(val);
        $target.each(function(index, element) {
            if('value' in element){
                element.value=toMyValue(val,$(element),true);
            }else{
                element.textContent=val1;
            }
        });
    });
    
    // 当点击带有data-blz-keyboard的元素聚焦时弹出此键盘，并显示光标
    // 失去焦点时，隐藏键盘，光标
    $(document).on('click.blz.keyboard',function(event){
        
        $targetElem=$(event.target).closest('[data-blz-keyboard]');
        
        // 根据h2的高度来决定程序是否继续执行
        if(h2<h1){return false;}
        
        if($targetElem.is('[data-blz-keyboard="true"][data-blz-input="true"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $targetInput=$targetElem.is('input')?$targetElem:$targetElem.find('input[readonly]');
            
			// 交互优化删除多余的0
			var val=parseFloat($targetInput.data('blz-value'));
			$targetInput.data('blz-value',val);
			$targetInput.val(lookBetter(isNaN(val)?'':val));
			setTimeout(function(){
				$targetInput.trigger('blzChangeBindData');
			},30);
			
            // blur focus事件模拟
            if($targetInputPrev[0]!==$targetInput[0]){
               setTimeout(function(){
                   $targetInputPrev.trigger('blurSimulation');
                   $targetInput.trigger('focusSimulation');
                   $targetInputPrev=$targetInput;
               },0);         
            }
            
            if($targetInput.data('blz-sync')){
                $sync.elems=$($targetInput.data('blz-sync'));
                $sync.length=$sync.elems.length;
                $sync.selector=$targetInput.data('blz-sync');
            }
            $targetTwinkle=$targetElem.closest('.weui_cell').find('.glb-twinkle').addClass('glb-show').removeClass('glb-hide');
            $keyboard.addClass('glb-slide-up').removeClass('glb-slide-below')
                     .off('click')
                     .on('click','td',function(){
                         input($(this),$targetInput); 
                     });
			
			// 判断input的位置，键盘激活后是否对其位置进行调整
           dy=$targetInput[0].getBoundingClientRect().bottom+60-window.innerHeight+h3;
           if(dy>0){
                $form.css(hack+'transform','translateY('+(-dy)+'px)');
           }
           
           // 增加等于键盘高度的padding值，
           $form.css('padding-bottom',h3);
			
        }else if($targetElem.length===0||$targetElem.is('[data-blz-keyboard="false"]')){
            $targetTwinkle.removeClass('glb-show').addClass('glb-hide');
            $keyboard.addClass('glb-slide-below').removeClass('glb-slide-up').off('click');
            setTimeout(function(){
                $targetInputPrev.trigger('blurSimulation');
                $targetInputPrev=$('空元素');
            },0);
			
			$form.css(hack+'transform','translateY(0px)');
            
            // 键盘消失时去除之前添加的padding值
            $form.css('padding-bottom',0);
        }
    });
    
    // resize ios下原生键盘弹出不会触发resize事件而安卓则会，此事件只针对安卓
    if($.blz.useragent){
        $(window).on('resize',function(){
            h2=window.innerHeight;
            $('#text').text(h2);
            if(h2>=h1){
                setTimeout(function(){
                    $targetElem.trigger('click.blz.keyboard');
                },30);
            }
        });   
    }
   
   // 呼起模拟键盘
   if(window.innerHeight>=480&&!document.getElementById('ol-form')){
        $Inputs.eq(0).trigger('click'); 
   }
}(window.jQuery,$.blz.checkBrowerKernel());

/*
 * tab选项卡
 */
+function($){
   'use strict';
   
   if($('[data-blz-toggle="blz-tab"]').length<=0){return false;}
   
   var tab=function(element){
	     this.element=element;
		 this.tip={};
	   };
   
   // 切换函数	
   tab.prototype.tab=function(e){
	 e.preventDefault();  
	 var $this=$(this);
	 if($this.hasClass('active')){return false;}  
     var target=$this.attr('href');
	 var targetParent=$this.closest('.model-tab-nav');
	 targetParent.find('a[data-blz-toggle="blz-tab"]').removeClass('active');
	 $this.addClass('active');
	 $(target).addClass('glb-fade-in').siblings().removeClass('glb-fade-in');
   };
   $(document).on('click.blz.tab','[data-blz-toggle="blz-tab"]',tab.prototype.tab);
}(window.jQuery);

/*
 * 页面交互bug修复
 */
document.body.addEventListener('touchstart',function(){},false);


/*
 *了解金榜题名保交互
 */
+function($){
    'use strict';
    $(document).on('click','[data-blz-show="#glb-weui-mask-2"]',function(event){
        event.preventDefault();
        var src=$(this).attr('href');
        var string='<span class="close" data-blz-empty="#glb-weui-mask-2" style="point-events:auto !important;"></span>'+
                   '<iframe class="glb-full-screen" style="border:0;z-index:-1;" src="'+src+'">'+
                   '</iframe>';
        $('#glb-weui-mask-2').html(string);
    });
    
    // 解决添加iframe后事件不会冒泡的bug,但是iframe仍然无法响应冒泡
    $('#glb-weui-mask-2').on('click',function(){
        
    });
    
    // 分享好友页面隐藏
    $('#glb-share').on('click',function(){
        this.style.display='none';
    });
}(window.jQuery);