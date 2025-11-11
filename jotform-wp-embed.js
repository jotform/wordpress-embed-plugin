/**
 * Plugin Name:       Jotform Online Forms - Drag & Drop Form Builder, Securely Embed Contact Forms
 * Description:       Securely embed online forms in your WordPress website.
 * Requires at least: 5.3
 * Requires PHP:      7.4
 * Version:           1.3.7
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

                    event.preventDefault();
                    if (window.jotformFormPicker) {
                        openWizard();
                    } else if (JotFormFormPicker) {
                        window.jotformFormPicker = new JotFormFormPicker();
                        openWizard();
                    }
                }
            });
        },
        createControl : function(n, cm) {
            return null;
        },
        getInfo : function() {
            return {
                longname : "Jotform Online Forms",
                author : 'Jotform',
                authorurl : 'https://www.jotform.com',
                version : "1.3.7"
            };
        }
    });
    tinymce.PluginManager.add('JotFormWPEmbed', tinymce.plugins.JotFormWPEmbed);
})();
