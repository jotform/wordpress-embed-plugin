function JotFormFormPicker () {
    this.url = "https://www.jotform.com/myforms/form-picker";
    this.closeWizard = function() {
        jQuery(this.wizard).remove();
        jQuery(this.modalBackgroundElement).fadeOut(100, function(){
            jQuery(this.modalBackgroundElement).remove();
        });
    };

    this.openWizard = function(callback) {
        $this = this;
        if(!window.wizardCallBackInit) {
            XD.receiveMessage(function(message){
                const { data } = message;
                if(data.closeModal) {
                    $this.closeWizard();
                } else if(data.id && data.title) {
                    callback(message.data);
                    $this.closeWizard();
                }
            }, 'https://www.jotform.com');
            window.wizardCallBackInit = true;
        }
        if(jQuery('#jotformFormWizard').length) {
            //console.log("wizard is already open");
        }
        else {
            var wizardStyles = {
                position : "absolute",
                background: "white",
                width: "700px",
                height : "500px",
                "z-index" : "100000",
                opacity: 1,
                boxShadow: "0px 0px 4px 0px rgba(0,0,0,0.45)",
                borderRadius: "4px"
            };


            var modalBackgroundStyles = {
                "position": "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                transition: "none",
                background: "#000",
                opacity: ".5",
                filter: "alpha(opacity=50)",
                zoom: 1,
                "z-index": 99999,
                display : "none"
            };

            this.wizard = document.createElement("div");
            this.wizardIFrame = document.createElement("iframe");
            this.modalBackgroundElement = jQuery(document.createElement("div"));

            jQuery(this.modalBackgroundElement).appendTo(jQuery("body")).attr("id", "modalBackground").css(modalBackgroundStyles).fadeIn(100);
            jQuery(this.wizardIFrame).appendTo(jQuery(this.wizard)).attr("src",this.url+'?ref=' + encodeURIComponent(document.location.href)).css({width : "100%", "height": "100%", borderRadius: "4px"});
            jQuery(this.wizard).appendTo(jQuery("body")).attr("id","jotformFormWizard").css(wizardStyles).on("click",function(){
                console.log("close wizard");
                $this.closeWizard();
            });

            var wizard = jQuery(this.wizard);
            wizard.css("top", ( jQuery(window).height() - wizard.height() ) / 2 + jQuery(window).scrollTop() + "px");
            wizard.css("left", ( jQuery(window).width() - wizard.width() ) / 2 + jQuery(window).scrollLeft() + "px");
        }
    }
}


// everything is wrapped in the XD function to reduce namespace collisions
var XD = function(){

    var interval_id,
        last_hash,
        cache_bust = 1,
        attached_callback,
        window = this;

    return {
        postMessage : function(message, target_url, target) {
            if (!target_url) {
                return;
            }
            target = target || parent;  // default to parent
            if (window['postMessage']) {
                // the browser supports window.postMessage, so call it with a targetOrigin
                // set appropriately, based on the target_url parameter.
                target['postMessage'](message, target_url.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));
            } else if (target_url) {
                // the browser does not support window.postMessage, so use the window.location.hash fragment hack
                target.location = target_url.replace(/#.*$/, '') + '#' + (+new Date) + (cache_bust++) + '&' + message;
            }
        },
        receiveMessage : function(callback, source_origin) {
            // browser supports window.postMessage
            if (window['postMessage']) {
                // bind the callback to the actual event associated with window.postMessage
                if (callback) {
                    attached_callback = function(e) {
                        if ((typeof source_origin === 'string' && e.origin !== source_origin)
                            || (Object.prototype.toString.call(source_origin) === "[object Function]" && source_origin(e.origin) === !1)) {
                            return !1;
                        }
                        callback(e);
                    };
                }
                if (window['addEventListener']) {
                    window[callback ? 'addEventListener' : 'removeEventListener']('message', attached_callback, !1);
                } else {
                    window[callback ? 'attachEvent' : 'detachEvent']('onmessage', attached_callback);
                }
            } else {
                // a polling loop is started & callback is called whenever the location.hash changes
                interval_id && clearInterval(interval_id);
                interval_id = null;
                if (callback) {
                    interval_id = setInterval(function() {
                        var hash = document.location.hash,
                            re = /^#?\d+&/;
                        if (hash !== last_hash && re.test(hash)) {
                            last_hash = hash;
                            callback({data: hash.replace(re, '')});
                        }
                    }, 100);
                }
            }
        }
    };
}();