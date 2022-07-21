/**
 * Plugin Name:       Jotform Online Forms
 * Description:       Securely embed online forms in your WordPress website.
 * Requires at least: 3.3
 * Requires PHP:      5.6
 * Version:           1.2.5
 * Author:            Jotform
 * Author URI:        https://www.jotform.com
 * License:           GNU General Public License v3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
*/

(function() {
    tinymce.create('tinymce.plugins.JotFormWPEmbed', {
        init : function(ed, url) {
            ed.addButton('JotFormWPEmbed', {
                title : 'Jotform',
                image : url+'/jotform.png',
                onclick : function(event) {
                    function openWizard() {
                        window.jotformFormPicker.openWizard(function(data){
                            var value;
                            var isValid;
                            if(typeof data !== 'string'){
                                isValid = data && data.title && data.id && data.id !== "Please enter your form id";
                                value = '[jotform id="' + data.id + '" title="'+data.title+'"]';
                            } else{
                                isValid = data.length > 0 && data !== "Please enter your form id";
                                value = '[jotform id="' + data + '"]';
                            }
                            if (isValid) {
                                tinyMCE.activeEditor.execCommand('mceInsertContent', 0, value);
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
                authorurl : 'https://www.jotform.com',
                infourl : 'https://www.jotform.com/labs/',
                version : "1.2.5"
            };
        }
    });
    tinymce.PluginManager.add('JotFormWPEmbed', tinymce.plugins.JotFormWPEmbed);
})();
