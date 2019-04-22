/*
    Plugin Name: JotForm Embed Forms
    Plugin URI: http://www.jotform.com/labs/wordpress
    Description:
    Version: 1.2.2
    Author: JotForm.com
    Author URI: http://www.jotform.com
    License: GNU General Public License v3
*/

(function() {
    tinymce.create('tinymce.plugins.JotFormWPEmbed', {
        init : function(ed, url) {
            ed.addButton('JotFormWPEmbed', {
                title : 'JotForm',
                image : url+'/images/jotform.png',
                onclick : function(event) {
                    function openWizard() {
                        window.jotformFormPicker.openWizard(function(formID){
                            if (formID !== undefined && formID.length > 0 && formID !== "Please enter your form id") {
                                tinyMCE.activeEditor.execCommand('mceInsertContent', 0, '[jotform id="' + formID + '"]');
                            }
                        });
                    }
                    if(window.jotformFormPicker) {
                        event.preventDefault();
                        openWizard();
                    }
                    else {
                        jQuery.getScript("//js.jotform.com/JotFormFormPicker.js", function(data, textStatus, jqxhr) {
                            event.preventDefault();
                            window.jotformFormPicker = new JotFormFormPicker();
                            openWizard();
                        });
                    }
                }
            });
        },
        createControl : function(n, cm) {
            return null;
        },
        getInfo : function() {
            return {
                longname : "JotForm Embed Forms",
                author : 'JotForm.com',
                authorurl : 'http://www.jotform.com',
                infourl : 'http://www.jotform.com/labs/wordpress',
                version : "1.0"
            };
        }
    });
    tinymce.PluginManager.add('JotFormWPEmbed', tinymce.plugins.JotFormWPEmbed);
})();
