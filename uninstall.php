<?php

if (!defined("WP_UNINSTALL_PLUGIN")) {
    exit(0);
}

delete_option('jotform-ai-chatbot_admin_notice_dismissed');