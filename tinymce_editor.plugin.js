/*
    Plugin Name: JotForm Wordpress Embed Plugin
    Plugin URI: http://www.jotform.com/labs/wordpress
    Description: JotForm's Wordpress Feedback Plugin
    Version: 0.1
    Author: Ertugrul Emre Ertekin
    Author URI: http://ee.ertek.in
    License: MIT
*/

/* 
 * a backwards compatable implementation of postMessage
 * by Josh Fraser (joshfraser.com)
 * released under the Apache 2.0 license.  
 *
 * this code was adapted from Ben Alman's jQuery postMessage code found at:
 * http://benalman.com/projects/jquery-postmessage-plugin/
 * 
 * other inspiration was taken from Luke Shepard's code for Facebook Connect:
 * http://github.com/facebook/connect-js/blob/master/src/core/xd.js
 *
 * the goal of this project was to make a backwards compatable version of postMessage
 * without having any dependency on jQuery or the FB Connect libraries
 *
 * my goal was to keep this as terse as possible since my own purpose was to use this 
 * as part of a distributed widget where filesize could be sensative.
 * Project URL : http://onlineaspect.com/uploads/postmessage/postmessage.js
 */

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
                // the browser does not support window.postMessage, so set the location
                // of the target to target_url#message. A bit ugly, but it works! A cache
                // bust parameter is added to ensure that repeat messages trigger the callback.
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
                    interval_id = setInterval(function(){
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

/*
    Plugin Name: JotForm Wordpress Embed Plugin
    Plugin URI: http://www.jotform.com/labs/wordpress
    Description: JotForm's Wordpress Feedback Plugin
    Version: 0.1
    Author: Ertugrul Emre Ertekin
    Author URI: http://ee.ertek.in
    License: MIT
*/

(function() {
    tinymce.create('tinymce.plugins.JotformWP', {
        init : function(ed, url) {
            ed.addButton('jotformWP', {
                title : 'JotForm',
                image : url+'/jotform.png',
                onclick : function() {
                    var formID = jotformtinyMCEInstance.openWizard(function(formID){
                        if (formID !== undefined && formID.length > 0 && formID !== "Please enter your form id") {
                            ed.execCommand('mceInsertContent', false, '[jotform::embed id="'+formID+'"]');
                        }
                    });
                }
            });
        },
        createControl : function(n, cm) {
            return null;
        },
        getInfo : function() {
            return {
                longname : "JotForm Wordpress",
                author : 'Ertugrul Emre Ertekin',
                authorurl : 'http://ee.ertek.in',
                infourl : 'http://www.jotform.com/labs/wordpress',
                version : "1.0"
            };
        }
    });
    tinymce.PluginManager.add('jotformWP', tinymce.plugins.JotformWP);
})();


function JotFormTinyMCE () {
    this.url = "http://www.jotform.com/myforms3/form.picker.php";
    this.closeWizard = function() {
        jQuery(this.wizard).hide();
    };

    this.openWizard = function(callback) {
        $this = this;
        XD.receiveMessage(function(message){
            callback(message.data);
            $this.closeWizard();
        }, 'http://www.jotform.com');

        if(jQuery('#jotformFormWizard').length) {
            /* console.log("wizard is already open") */
        }
        else {
            var wizardStyles = {
                position : "absolute",
                width: "500px",
                height : "400px",
                left : "100px",
                top : "100px",
                border : "1px dashed black"
            };

            this.wizard = document.createElement("div");
            this.wizardIFrame = document.createElement("iframe");
            this.closeButton = document.createElement("img");

            jQuery(this.wizardIFrame).appendTo(jQuery(this.wizard)).attr("src",this.url+'#' + encodeURIComponent(document.location.href)).css({width : "100%", "height": "100%"});
            jQuery(this.wizard).appendTo(jQuery("#poststuff")).attr("id","jotformFormWizard").css(wizardStyles);
            // TODO :: Add a close button for wizard
            //jQuery(this.closeButton).attr('src','')
            //appendTo(jQuery(this.wizard));
        }
    }
}

var jotformtinyMCEInstance = new JotFormTinyMCE();


