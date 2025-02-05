<?php
/**
 * Plugin Name:       Jotform Online Forms
 * Description:       Securely embed online forms in your WordPress website.
 * Requires at least: 5.3
 * Requires PHP:      7.4
 * Version:           1.3.6
 * Author:            Jotform
 * Author URI:        https://www.jotform.com
 * License:           GNU General Public License v3
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.html
 */

class JotFormWPEmbed {

    public function __construct() {
        /* Hook action to init */
        add_action('init', array($this ,'addTinyMCEButton') );
        add_shortcode('jotform', array($this, 'apiEmbedHandler'));

        add_action('admin_notices', array($this, 'showNewPluginNotification'));
        add_action('wp_ajax_jotform-ai-chatbot_dismiss_notice', array($this, 'dismissNewPluginNotification'));
    }

    public function showNewPluginNotification() {
        if (!current_user_can('manage_options')) {
            return;
        }
    
        if (get_option('jotform-ai-chatbot_admin_notice_dismissed')) {
            return;
        }
    
        $plugin_slug = 'jotform-ai-chatbot';
        $plugin_url = esc_url("plugin-install.php?tab=plugin-information&plugin=$plugin_slug&TB_iframe=true&width=600&height=550");
    
        ?>
        <div class="notice notice-info is-dismissible" id="jotform-ai-chatbot-admin-notice">
            <p>🚀 <strong>Meet Jotform AI Chatbot!</strong> Automate support, boost engagement & generate leads. No coding needed. <a href="<?php echo $plugin_url; ?>" class="thickbox">Try it now!</a> 🤖✨</p>    
        </div>
        <?php
        
        add_thickbox();

        ?>
        <script>
        jQuery(document).on('click', '#jotform-ai-chatbot-admin-notice .notice-dismiss', function () {
            jQuery.post(ajaxurl, {
                action: 'jotform-ai-chatbot_dismiss_notice'
            });
        });
        </script>
        <?php

        add_action('admin_footer', 'jotform-ai-chatbot_notice_script');
    }

    public function dismissNewPluginNotification() {
        update_option('jotform-ai-chatbot_admin_notice_dismissed', true);
        wp_die();
    }

    public function addTinyMCEButton() {
        if ( ( current_user_can('edit_posts') || current_user_can('edit_pages') ) && get_user_option('rich_editing') ) {
            add_filter("mce_external_plugins", array($this ,'addTinyMCEPlugin'));
            add_filter('mce_buttons', array($this ,'registerFormPicker'));
        }
    }

    public function registerFormPicker($buttons) {
        wp_enqueue_script( 'jotform-wp-embed-fp-wrapper', plugins_url( 'jotform-wp-embed-fp-wrapper.js', __FILE__ ));
        array_push($buttons, "|", "JotFormWPEmbed");
        return $buttons;
    }

    /* Load the TinyMCE plugin */
    public function addTinyMCEPlugin($plugin_array) {
        $plugin_array['JotFormWPEmbed'] = plugins_url('jotform-wp-embed.js', __FILE__ );
        return $plugin_array;
    }

    public function replaceTags($matches)
    {
        $url = '//www.jotform.com/jsform/'.$matches["formID"].'?redirect=1';
        return '<script type="text/javascript" src="'.esc_url($url).'"></script>';
    }

    /*
     * Reads form id returned from shortcode api and inserts form
     */
    public function apiEmbedHandler($args) {
    	return isset($args['id']) && ctype_digit($args['id'])
    		? $this->replaceTags(array('formID' => $args['id']))
    		: '';
    }
}

$jotformwp = new JotFormWPEmbed();
