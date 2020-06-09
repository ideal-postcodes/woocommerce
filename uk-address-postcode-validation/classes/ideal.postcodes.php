<?php

//if ( ! class_exists( 'WC_IdealPostcodes_Integration' ) ) :

class WC_IdealPostcodes_Integration extends WC_Integration
{
  private static $options = [
    'idealpostcodes_enabled' => 'yes',
    'idealpostcodes_api_key' => '',
    'idealpostcodes_populate_organisation' => 'no',
    'idealpostcodes_populate_county' => 'no',
  ];

  public function __construct()
  {
    global $woocommerce;

    $this->id = 'idealpostcodes';
    $this->method_title = __('Ideal Postcodes Autocomplete', 'woocommerce-idealpostcodes');
    $this->method_description = __('Adds Ideal Postcodes UK Address Autocomplete to WooCommerce checkout pages.', 'woocommerce-idealpostcodes');

    // Load the settings.
    $this->add_form_fields();
    $this->init_settings();

    //check versions and if need copy values to WC admin container

    // Define user set variables.
    $this->config = (object)[
      'idealpostcodes_enabled' => $this->get_option('idealpostcodes_enabled'),
      'idealpostcodes_api_key' => $this->get_option('idealpostcodes_api_key'),
      'idealpostcodes_populate_organisation' => $this->get_option('idealpostcodes_populate_organisation'),
      'idealpostcodes_populate_county' => $this->get_option('idealpostcodes_populate_county')
    ];

    add_action('woocommerce_update_options_integration_' . $this->id, array($this, 'process_admin_options'));

    if ($this->config->idealpostcodes_enabled === 'yes') {
      add_action('woocommerce_before_checkout_form', [
        $this,
        'add_postcode_lookup_plugin',
      ]);
      add_action('woocommerce_before_checkout_form', [
        $this,
        'add_autocomplete_plugin',
      ]);
      add_action('woocommerce_before_checkout_form', [
        $this,
        'add_autocomplete_styles',
      ]);
      add_action('woocommerce_after_checkout_form', [
        $this,
        'add_idpc_bindings',
      ]);
      // Bind to accounts
      add_action('woocommerce_before_edit_account_address_form', [
        $this,
        'add_postcode_lookup_plugin',
      ]);
      add_action('woocommerce_before_edit_account_address_form', [
        $this,
        'add_autocomplete_plugin',
      ]);
      add_action('woocommerce_before_edit_account_address_form', [
        $this,
        'add_autocomplete_styles',
      ]);
      add_action('woocommerce_before_edit_account_address_form', [
        $this,
        'add_idpc_bindings',
      ]);
    }
  }

  private function version_check()
  {
    if (get_option('idealpostcodes_enabled') !== false && $this->get_option('idealpostcodes_enabled') === false) {
      //copy settings from old storage
      $this->update_option('idealpostcodes_enabled', get_option('idealpostcodes_enabled'));
      $this->update_option('idealpostcodes_api_key', get_option('idealpostcodes_api_key'));
      $this->update_option('idealpostcodes_populate_organisation', get_option('idealpostcodes_populate_organisation'));
      $this->update_option('idealpostcodes_populate_county', get_option('idealpostcodes_populate_county'));
      delete_option('idealpostcodes_enabled');
      delete_option('idealpostcodes_api_key');
      delete_option('idealpostcodes_populate_organisation');
      delete_option('idealpostcodes_populate_county');
    }
  }

  public function add_form_fields()
  {
    $this->form_fields = array(
      'idealpostcodes_required' => array(
        'title' => __('Required', IDEALPOSTCODES_SLUG),
        'type' => 'title',
        'css' => '',
        'id' => 'idealpostcodes_required',
        'description' => '',
      ),
      'idealpostcodes_enabled' => array(
        'id' => 'idealpostcodes_enabled',
        'title' => __('Enabled', IDEALPOSTCODES_SLUG),
        'type' => 'checkbox',
        'description' => __(
          'Enable/Disable Idealpostcodes Postcode Lookup extension',
          IDEALPOSTCODES_SLUG
        ),
        'desc_tip' => true,
        'default' => 'yes'
      ),
      'idealpostcodes_api_key' => array(
        'id' => 'idealpostcodes_api_key',
        'title' => __('API Key', IDEALPOSTCODES_SLUG),
        'type' => 'text',
        'description' => ''
      ),
      'idealpostcodes_options' => array(
        'title' => __('Options', IDEALPOSTCODES_SLUG),
        'type' => 'title',
        'css' => '',
        'id' => 'idealpostcodes_options',
        'description' => ''
      ),
      'idealpostcodes_populate_organisation' => array(
        'id' => 'idealpostcodes_populate_organisation',
        'title' => __('Enable Populate Organisation', IDEALPOSTCODES_SLUG),
        'type' => 'checkbox',
        'description' => __(
          'Fill the Company field based on selected address.',
          IDEALPOSTCODES_SLUG
        ),
        'desc_tip' => true,
        'default' => 'yes'
      ),
      'idealpostcodes_populate_county' => array(
        'id' => 'idealpostcodes_populate_county',
        'title' => __('Enable County', IDEALPOSTCODES_SLUG),
        'type' => 'checkbox',
        'description' => __(
          'This will populate the county field. County data is no longer used in the UK to identify a premise, however this can be enabled if you prefer.',
          IDEALPOSTCODES_SLUG
        ),
        'desc_tip' => true,
        'default' => 'no'
      )
    );
  }

  /**
   * Get all options with default values
   */
  public function get_options()
  {
    return [
      "enabled" => $this->to_bool($this->get_option('idealpostcodes_enabled')),
      "apiKey" => $this->get_option('idealpostcodes_api_key'),
      "populateOrganisation" => $this->to_bool(
        $this->get_option('idealpostcodes_populate_organisation')
      ),
      "populateCounty" => $this->to_bool(
        $this->get_option('idealpostcodes_populate_county')
      ),
    ];
  }

  public function to_bool($str)
  {
    if ($str === 'yes') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Add jquery plugin code
   */
  public function add_postcode_lookup_plugin()
  {
    wp_enqueue_script(
      'postcode-lookup',
      IDEALPOSTCODES_URL . 'js/postcodes.min.js',
      ['jquery']
    );
  }

  /**
   * Add autocomplete plugin
   */
  public function add_autocomplete_plugin()
  {
    wp_enqueue_script(
      'ideal-postcodes-autocomplete',
      IDEALPOSTCODES_URL . 'js/ideal-postcodes-autocomplete.min.js'
    );
  }

  /**
   * Add autocomplete stylesheet
   */
  public function add_autocomplete_styles()
  {
    wp_enqueue_style(
      'ideal-postcodes-autocomplete-style',
      IDEALPOSTCODES_URL . 'css/ideal-postcodes-autocomplete.css'
    );
  }

  /**
   * Init js plugin on the checkout page
   */
  public function add_idpc_bindings()
  {
    $json = json_encode($this->get_options(), JSON_FORCE_OBJECT);
    var_dump($json);
    $script = 'window.idpcConfig = ' . $json . ';';

    wp_enqueue_script(
      'ideal-postcodes-bindings',
      IDEALPOSTCODES_URL . 'js/woocommerce.min.js',
      ['postcode-lookup', 'ideal-postcodes-autocomplete'],
      '1.0',
      true
    );
    wp_add_inline_script('ideal-postcodes-bindings', $script, 'before');
  }
}
//endif;
