<?php

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit(0);
}

if (!defined("WP_UNINSTALL_PLUGIN")) {
    exit(0);
}

delete_option('jotform-ai-chatbot_admin_notice_dismissed');
