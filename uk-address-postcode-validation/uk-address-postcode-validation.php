<?php
/**
 * Plugin Name: UK Address Postcode Validation
 * Plugin URI: http://ideal-postcodes.co.uk/woocommerce
 * Description: UK address search and validation on address forms
 * Version: 1.0.6
 * Author: Ideal Postcodes
 * Author URI: https://ideal-postcodes.co.uk/
 * Developer: Ideal Postcodes
 * Developer URI: https://ideal-postcodes.co.uk/
 * Text Domain: uk-address-postcode-validation
 * Domain Path: /languages
 *
 * Woo: 12345:342928dfsfhsf8429842374wdf4234sfd
 * WC requires at least: 3.0.0
 * WC tested up to: 4.2.0
 *
 * License: MIT
 * License URI: https://github.com/ideal-postcodes/woocommerce/blob/master/LICENSE
 */

defined('ABSPATH') or die('No direct script');

//set constants
define('IDEALPOSTCODES_DIR', plugin_dir_path(__FILE__));
define('IDEALPOSTCODES_NAME', 'Ideal Postcodes');
define('IDEALPOSTCODES_SLUG', 'uk-address-postcode-validation');
define('IDEALPOSTCODES_URL', plugins_url() . '/' . IDEALPOSTCODES_SLUG . '/');

//includes
require_once ABSPATH . 'wp-admin/includes/plugin.php';

if (!class_exists('WC_IdealPostcodes')) {
  class WC_IdealPostcodes
  {
    /**
     * Construct the plugin.
     */
    public function __construct()
    {
      add_action('plugins_loaded', [$this, 'init']);
    }

    /**
     * Initialize the plugin.
     */
    public function init()
    {
      if (class_exists('WC_Integration')) {
        require_once IDEALPOSTCODES_DIR .
          'classes' .
          DIRECTORY_SEPARATOR .
          'ideal.postcodes.php';
        add_filter('woocommerce_integrations', [$this, 'add_integration']);
      }
    }

    /**
     * Add a new integration to WooCommerce.
     */
    public function add_integration($integrations)
    {
      $integrations[] = 'WC_IdealPostcodes_Integration';
      return $integrations;
    }
  }

  //Init plugin if woocommerce is installed
  $WC_IdealPostcodes_Integration = new WC_IdealPostcodes(__FILE__);
}
