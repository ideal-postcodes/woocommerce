<?php
defined('ABSPATH') or die('No direct script');

class IdealPostcodes
{
  //init markups to always run init once
  private static $init = false;
  private static $admin_init = false;

  //settings fields names
  private static $options = [
    'idealpostcodes_enabled' => 'yes',
    'idealpostcodes_api_key' => '',
    'idealpostcodes_populate_organisation' => 'no',
    'idealpostcodes_populate_county' => 'no',
  ];

  /**
   * Init checkout js plugin
   */
  public static function init()
  {
    if (!self::$init) {
      // Bind to checkout
      add_action('woocommerce_update_options_' . IDEALPOSTCODES_TAB, [
        'IdealPostcodes',
        'update_settings',
      ]);
      add_action('woocommerce_before_checkout_form', [
        'IdealPostcodes',
        'add_postcode_lookup_plugin',
      ]);
      add_action('woocommerce_before_checkout_form', [
        'IdealPostcodes',
        'add_autocomplete_plugin',
      ]);
      add_action('woocommerce_after_checkout_form', [
        'IdealPostcodes',
        'add_idpc_bindings',
      ]);
      // Bind to accounts
      add_action(
        'woocommerce_before_edit_account_address_form' . IDEALPOSTCODES_TAB,
        ['IdealPostcodes', 'update_settings']
      );
      add_action('woocommerce_before_edit_account_address_form', [
        'IdealPostcodes',
        'add_postcode_lookup_plugin',
      ]);
      add_action('woocommerce_before_edit_account_address_form', [
        'IdealPostcodes',
        'add_autocomplete_plugin',
      ]);
      add_action('woocommerce_before_edit_account_address_form', [
        'IdealPostcodes',
        'add_idpc_bindings',
      ]);
      self::$init = true;
    }
  }

  /**
   * Init admin settings
   */
  public static function admin_init()
  {
    if (!self::$admin_init) {
      add_filter(
        'woocommerce_settings_tabs_array',
        ['IdealPostcodes', 'add_settings_tab'],
        50
      );
      add_action('woocommerce_sections_' . IDEALPOSTCODES_TAB, [
        'IdealPostcodes',
        'sections',
      ]);
      add_filter(
        'woocommerce_settings_' . IDEALPOSTCODES_TAB,
        ['IdealPostcodes', 'settings_tab'],
        10,
        1
      );
      self::$admin_init = true;
    }

    if (is_admin()) {
      if (!class_exists('WooCommerce')) {
        add_action('admin_notices', ['IdealPostcodes', 'deactivated_notice']);
        deactivate_plugins(plugin_basename(__FILE__));
      }
    }
  }

  /**
   * Deactivateing notice message when woocommerce is not installed
   */
  public static function deactivated_notice()
  {
    ?>
        <div class="notice notice-error">
            <p>
                <?php esc_html_e(
                  'Ideal Postcodes extension requires WooCommerce to be installed and activated.',
                  IDEALPOSTCODES_SLUG
                ); ?>
            </p>
        </div>
        <?php
  }

  /**
   * Add tabs for settings in admin
   */
  public static function add_settings_tab($settings_tabs)
  {
    $settings_tabs[IDEALPOSTCODES_TAB] = __(
      'Ideal Postcodes',
      'woocommerce-settings-' . IDEALPOSTCODES_SLUG
    );
    return $settings_tabs;
  }

  /**
   * Get section for admin
   */
  public static function get_sections()
  {
    $sections = [
      '' => __('Required', IDEALPOSTCODES_SLUG),
      'options' => __('Options', IDEALPOSTCODES_SLUG),
    ];
    return apply_filters(
      'woocommerce_get_sections_' . IDEALPOSTCODES_TAB,
      $sections
    );
  }

  /**
   * Generate sections view
   */
  public static function sections()
  {
    global $current_section;

    $sections = self::get_sections();

    if (empty($sections) || 1 === sizeof($sections)) {
      return;
    }

    echo '<ul class="subsubsub">';

    $array_keys = array_keys($sections);

    foreach ($sections as $id => $label) {
      echo '<li><a href="' .
        admin_url(
          'admin.php?page=wc-settings&tab=' .
            IDEALPOSTCODES_TAB .
            '&section=' .
            sanitize_title($id)
        ) .
        '" class="' .
        ($current_section == $id ? 'current' : '') .
        '">' .
        $label .
        '</a> ' .
        (end($array_keys) == $id ? '' : '|') .
        ' </li>';
    }

    echo '</ul><br class="clear" />';
  }

  /**
   * Set settings tab
   */
  public static function settings_tab()
  {
    woocommerce_admin_fields(self::settings());
  }

  /**
   * Allow update setting
   */
  public static function update_settings()
  {
    woocommerce_update_options(self::settings());
  }

  /**
   * Set settings fields
   */
  public static function settings()
  {
    global $current_section;

    $settings = [];

    if ($current_section === '') {
      $settings[] = [
        'id' => 'idealpostcodes_required',
        'title' => __('Required', IDEALPOSTCODES_SLUG),
        'desc' => '',
        'type' => 'title',
      ];

      $settings[] = [
        'id' => 'idealpostcodes_enabled',
        'title' => __('Enabled', IDEALPOSTCODES_SLUG),
        'desc' => __(
          'Enable/Disable Idealpostcodes Postcode Lookup extension',
          IDEALPOSTCODES_SLUG
        ),
        'type' => 'checkbox',
        'default' => 'yes',
      ];

      $settings[] = [
        'id' => 'idealpostcodes_api_key',
        'title' => __('API Key', IDEALPOSTCODES_SLUG),
        'desc' => '',
        'type' => 'text',
      ];
    }

    if ($current_section === 'options') {
      $settings[] = [
        'id' => 'idealpostcodes_options',
        'title' => __('Options', IDEALPOSTCODES_SLUG),
        'desc' => '',
        'type' => 'title',
      ];

      $settings[] = [
        'id' => 'idealpostcodes_populate_organisation',
        'title' => __('Enable Populate Organisation', IDEALPOSTCODES_SLUG),
        'desc' => __(
          'Fill the Company field based on selected address.',
          IDEALPOSTCODES_SLUG
        ),
        'type' => 'checkbox',
        'default' => 'yes',
      ];

      $settings[] = [
        'id' => 'idealpostcodes_populate_county',
        'title' => __('Enable County', IDEALPOSTCODES_SLUG),
        'desc' => __(
          'This will populate the county field. County data is no longer used in the UK to identify a premise, however this can be enabled if you prefer.',
          IDEALPOSTCODES_SLUG
        ),
        'type' => 'checkbox',
        'default' => 'no',
      ];
    }

    return apply_filters('wc_settings_' . IDEALPOSTCODES_TAB, $settings);
  }

  /**
   * Get all options with default values
   */
  public static function get_options()
  {
    $options = self::$options;
    return [
      "enabled" => self::to_bool(get_option('idealpostcodes_enabled')),
      "apiKey" => get_option('idealpostcodes_api_key'),
      "populateOrganisation" => self::to_bool(
        get_option('idealpostcodes_populate_organisation')
      ),
      "populateCounty" => self::to_bool(
        get_option('idealpostcodes_populate_county')
      ),
    ];
  }

  public static function to_bool($str)
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
   * Init js plugin on the checkout page
   */
  public static function add_idpc_bindings()
  {
    $json = json_encode(self::get_options(), JSON_FORCE_OBJECT);
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
