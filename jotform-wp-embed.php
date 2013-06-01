<?php
/*
    Plugin Name: JotForm Embed Forms
    Plugin URI: http://www.jotform.com/labs/wordpress
    Description:
    Version: 1.0
    Author: Ertugrul Emre Ertekin
    Author URI: http://ee.ertek.in
    License: GNU General Public License v3
*/

class JotFormWPEmbed {

    public function __construct() {
        /* Hook action to init */
        add_action('init', array($this ,'addTinyMCEButton') );

        /* Content hook */
        add_filter('the_content', array($this ,'handleContentTags'));
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
        $pattern = '/\[jotform id=\"(?<formID>.*)\"\]/';
        if (preg_match($pattern, $content)) {
           $content = preg_replace_callback($pattern, array($this, "replaceTags"), $content);
        }
        return $content;
    }

    public function replaceTags($matches) {
        $htmlVersion = '<script type="text/javascript" src="http://www.jotform.com/jsform/'.$matches["formID"].'?redirect=1"></script>';
        return $htmlVersion;
    }
}

$jotformwp = new JotFormWPEmbed();

?>