<?php
/*
    Plugin Name: JotForm Wordpress Embed Plugin
    Plugin URI: http://www.jotform.com/labs/wordpress
    Description: JotForm's Wordpress Embed Plugin
    Version: 0.1
    Author: Ertugrul Emre Ertekin
    Author URI: http://ee.ertek.in
    License: MIT
*/

class JotFormWP {

    public function __construct() {
        /* Hook action to init */
        add_action('init', array($this ,'addTinyMCEButton') );

        /* Content hook */
        add_filter('the_content', array($this ,'handleContentTags'));
    }

    public function addTinyMCEButton() {
        if ( ( current_user_can('edit_posts') || current_user_can('edit_pages') ) && get_user_option('rich_editing') ) {
            add_filter("mce_external_plugins", array($this ,'addTinyMCEPlugin'));
            add_filter('mce_buttons', array($this ,'registerButton'));
       }
    }

    public function registerButton($buttons) {
       array_push($buttons, "|", "jotformWP");
       return $buttons;
    }

    /* Load the TinyMCE plugin */
    public function addTinyMCEPlugin($plugin_array) {
        $plugin_array['jotformWP'] = plugins_url() .'/jotform-wp/tinymce_editor.plugin.js';
        return $plugin_array;
    }

    public function handleContentTags($content) {
        $pattern = '/\[jotform(?<embedType>.*) id=\"(?<formID>.*)\"\]/';
        if (preg_match($pattern, $content)) {
           $content = preg_replace_callback($pattern, array($this, "replaceTags"), $content);
        }
        return $content;
    }

    public function replaceTags($matches) {
        $htmlVersion = "";

        if(isset($matches["formID"]) && isset($matches["embedType"])) {
            $matches["embedType"] = trim($matches["embedType"],':');
            switch ($matches["embedType"]) {
                case 'embed':
                    $htmlVersion = '<script type="text/javascript" src="http://www.jotform.com/jsform/'.$matches["formID"].'?redirect=1"></script>';
                    break;
                default:
                    break;
            }
        }
        return $htmlVersion;
    }
}

$jotformwp = new JotFormWP();

?>