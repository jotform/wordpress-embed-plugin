<?php
/*
    Plugin Name: JotForm Embed Forms
    Plugin URI: http://www.jotform.com/labs/wordpress
    Description:
    Version: 1.2.6
    Author: JotForm.com
    Author URI: http://www.jotform.com
    License: GNU General Public License v3
*/

class JotFormWPEmbed {

    public function __construct() {
        /* Hook action to init */
        add_action('init', array($this ,'addTinyMCEButton') );

        /* Use shortcode api if available */
        if($this->isLegacy()) {
            add_filter('the_content', array($this, 'handleContentTags'));
        } else {
            add_shortcode('jotform', array($this, 'apiEmbedHandler'));
        }
    }

    /*
     * Checks if WP version is less than 2.5 (When shortcode Api was introduced)
     * @return bool
     */
    public function isLegacy() {
    	return get_bloginfo('version') < 2.5;
    }

    public function addTinyMCEButton() {
        if ( ( current_user_can('edit_posts') || current_user_can('edit_pages') ) && get_user_option('rich_editing') ) {
            add_filter("mce_external_plugins", array($this ,'addTinyMCEPlugin'));
            add_filter('mce_buttons', array($this ,'registerFormPicker'));
        }
    }

    public function registerFormPicker($buttons) {
        array_push($buttons, "|", "JotFormWPEmbed");
        return $buttons;
    }

    /* Load the TinyMCE plugin */
    public function addTinyMCEPlugin($plugin_array) {
        $plugin_array['JotFormWPEmbed'] = plugins_url('jotform-wp-embed.js', __FILE__ );
        return $plugin_array;
    }

    public function handleContentTags($content) {
        // this will also support the older version of plugin.
        $pattern = '/\[jotform id=\"(?<formID>.*)\"( title=\"(?<formTitle>.*)?\")?\]/';
        if (preg_match($pattern, $content)) {
            $content = preg_replace_callback($pattern, "replaceTags", $content);
        }
        return $content;
    }

    public function replaceTags($matches)
    {
        return '<script type="text/javascript" src="//www.jotform.com/jsform/'.$matches["formID"].'?redirect=1"></script>';
    }

    /*
     * Reads form id returned from shortcode api and inserts form
     */
    public function apiEmbedHandler($args) {
    	return isset($args['id'])
    		? $this->replaceTags(array('formID' => $args['id']))
    		: '';
    }
}

$jotformwp = new JotFormWPEmbed();
