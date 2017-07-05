export default (function () {
    var isMoile = (function() {
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return true;
        } else {
            return false;
        }
    })(); 
    function $$(id){
        return document.getElementById(id);
    };
    var dftOpt= {};
    var timer = null,timerC = null;
    function showPop(opt){
        dftOpt = {
            title:opt&&opt.title||"操作提示",           //弹框 title
            content:opt&&opt.content||"显示hintPop弹框",//弹框 内容
            activebg:opt&&opt.activebg||"#dedede",      //弹框 确定/取消 背景active颜色
            bg:opt&&opt.bg||"rgba(255,255,255,0.9)",    //弹框 确定/取消 背景颜色
            use_a:false,                                //弹框 按钮是否使用a标签
            url:opt&&opt.url|| "javascript:;",          //弹框 点击确定 链接跳转
            target:opt&&opt.target||"_self",            //弹框 连接跳转方式
            confirm:opt&&opt.confirm||function(){       //弹框 点击确认回调函数
                showHint("您点击了confirm");
            },
            cancel:opt&&opt.cancel||function(){         //弹框 点击取消回调函数 
                showHint("您点击了confirm");
            }
        };
        var btnHtml = '';
        if(dftOpt.use_a){
            btnHtml += 
                '<a href="'+dftOpt.url+'" id="_confirm" class="_confirm _btn" target="'+dftOpt.target+'">确定</a>'
                    +'<i class="line"></i>'
                +'<a href="javascript:;" id="_cancel" class="_cancel _btn">取消</a>';
        }else{
            btnHtml += 
                '<span id="_confirm" class="_confirm _btn" ">确定</span>'
                    +'<i class="line"></i>'
                +'<span id="_cancel" class="_cancel _btn">取消</span>';
        }
        var popCon ='<div class="_pop">'
                        +'<div class="_pop-top">'
                            +'<div class="_pop-title">'+dftOpt.title+'</div>'  
                            +'<div class="_pop-con">'+dftOpt.content+'</div>'         
                        +'</div>'
                        +'<div class="_pop-button">'
                            +btnHtml
                        +'</div>'
                    +'</div>';
        if($$("popBox")){
            $$("popBox").style.display = "block";
            $$("popBox").className = "_popBox";
            $$("popBox").innerHTML = popCon;
        }else{
            var div = document.createElement("div");
            div.setAttribute("id", "popBox");
            div.setAttribute("class", "_popBox");
            div.innerHTML = popCon;
            document.body.appendChild(div);
        }
        bindClick(dftOpt);
    };
    function popHide(event){
        if(event.target.id==="_confirm"){
            if(typeof(dftOpt.confirm)=="function"){
                dftOpt.confirm();
            }
        }else if(event.target.id==="_cancel"){
            if(typeof(dftOpt.cancel)=="function"){
                dftOpt.cancel();
            }
        }else{
            return false;
        }
        $$("popBox").className += " hide";
        setTimeout(function(){$$("popBox").style.display = 'none'}, 300);
        event.target.style.backgroundColor = dftOpt.bg;
    };
    function bindClick(opt){  
        if(isMoile){
            $$("popBox").addEventListener('touchstart', function(event){
                if(event.target.id === "_confirm" || event.target.id === "_cancel"){
                    event.target.style.backgroundColor = opt.activebg;
                    $$("popBox").addEventListener('touchend', popHide);
                }
            });
            $$("popBox").addEventListener('touchmove', function(event){
                if(event.target.id === "_confirm" || event.target.id === "_cancel"){
                    $$(event.target.id).style.backgroundColor = opt.bg;
                    $$("popBox").removeEventListener("touchend",popHide);
                }
            });
            $$("popBox").addEventListener('touchend', popHide);
        }else{
            $$("popBox").addEventListener("mousemove",function(event){
                if(event.target.id === "_confirm" || event.target.id === "_cancel"){
                    $$("_confirm").style.backgroundColor = opt.bg;
                    $$("_cancel").style.backgroundColor = opt.bg;
                    event.target.style.backgroundColor = opt.activebg;
                    $$("popBox").addEventListener('click', popHide);
                }else{
                    $$("_confirm").style.backgroundColor = opt.bg;
                    $$("_cancel").style.backgroundColor = opt.bg;
                }
            });
        }
    };
    function popFn(opt){
        showPop(opt);
    };
    function showHint(str){
        var hintCon = '<div class="_hint">'+(str||"hint show~")+'</div>';
        if($$("hintBox")){
            $$("hintBox").className = "_hintBox";
            $$("hintBox").style.display = "block";
            $$("hintBox").innerHTML = hintCon;
        }else{
            var div = document.createElement("div");
            div.setAttribute("id", "hintBox");
            div.setAttribute("class", "_hintBox");
            div.innerHTML = hintCon;
            document.body.appendChild(div);
        }
        clearTimeout(timer);
        clearTimeout(timerC);
        timer = null;
        timerC = null;
        timer = setTimeout(function(){//显示1s后消失
            $$("hintBox").className = "_hintBox hide";
            timerC = setTimeout(function(){$$("hintBox").style.display = "none";}, 300);
        }, 1000);
    };
    function hintFn(str){
        showHint(str);
    };
    return {
        hint : hintFn, //hint方法
        pop : popFn   //pop方法
    };
})();