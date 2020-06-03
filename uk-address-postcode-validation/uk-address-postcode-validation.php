<?php
/**
 * Plugin Name: UK Address Postcode Validation
 * Plugin URI: http://ideal-postcodes.co.uk/woocommerce
 * Description: UK address search and validation on address forms
 * Version: 1.0.3
 * Author: Ideal Postcodes
 * Author URI: https://ideal-postcodes.co.uk/
 * Developer: Ideal Postcodes
 * Developer URI: https://ideal-postcodes.co.uk/
 * Text Domain: uk-address-postcode-validation
 * Domain Path: /languages
 *
 * Woo: 12345:342928dfsfhsf8429842374wdf4234sfd
 * WC requires at least: 3.0.0
 * WC tested up to: 4.1.0
 *
 * License: MIT
 * License URI: https://github.com/ideal-postcodes/woocommerce/blob/master/LICENSE
 */

defined('ABSPATH') or die('No direct script');

//set constants
define('IDEALPOSTCODES_DIR', plugin_dir_path(__FILE__));
define('IDEALPOSTCODES_NAME', 'Ideal Postcodes');
define('IDEALPOSTCODES_SLUG', 'uk-address-postcode-validation');
define('IDEALPOSTCODES_TAB', 'ideal_postcodes');
define('IDEALPOSTCODES_URL', plugins_url() . '/' . IDEALPOSTCODES_SLUG . '/');

//includes
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once IDEALPOSTCODES_DIR .
  'classes' .
  DIRECTORY_SEPARATOR .
  'class.ideal-postcodes.php';

//init plugin
add_action('admin_init', ['IdealPostcodes', 'admin_init']);
add_action('init', ['IdealPostcodes', 'init']);
