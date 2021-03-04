<?php

if (!class_exists("WC_IdealPostcodes_Integration")):
  class WC_IdealPostcodes_Integration extends WC_Integration
  {
    public function __construct()
    {
      global $woocommerce;

      $this->id = "idealpostcodes";
      $this->method_title = __(
        "UK Address Postcode Validation",
        "woocommerce-idealpostcodes"
      );
      $this->method_description = __(
        "Adds Ideal Postcodes UK address validation to WooCommerce. See the <a href=\"https://ideal-postcodes.co.uk/guides/woocommerce\">guide</a> for more information.",
        "woocommerce-idealpostcodes"
      );

      // Load the settings.
      $this->add_form_fields();
      $this->init_settings();

      //check versions and if need copy values to WC admin container
      $this->version_check();
      // Define user set variables.
      $this->config = (object) [
        "idealpostcodes_enabled" => $this->get_option("idealpostcodes_enabled"),
        "idealpostcodes_api_key" => $this->get_option("idealpostcodes_api_key"),
        "idealpostcodes_watch_country" => $this->get_option(
          "idealpostcodes_watch_country"
        ),
        "idealpostcodes_populate_organisation" => $this->get_option(
          "idealpostcodes_populate_organisation"
        ),
        "idealpostcodes_populate_county" => $this->get_option(
          "idealpostcodes_populate_county"
        ),
        "idealpostcodes_watch_country" => $this->get_option(
          "idealpostcodes_watch_country"
        ),
        "idealpostcodes_postcodelookup_override" => $this->get_option(
          "idealpostcodes_postcodelookup_override"
        ),
        "idealpostcodes_autocomplete_override" => $this->get_option(
          "idealpostcodes_autocomplete_override"
        ),
      ];

      add_action("woocommerce_update_options_integration_" . $this->id, [
        $this,
        "process_admin_options",
      ]);

      if ($this->config->idealpostcodes_enabled === "yes") {
        //IdealPostcodes custom action
        add_action("ideal_postcodes_address_search", [$this, "add_js"]);
        //Bind to checkout
        add_action("woocommerce_before_checkout_form", function () {
          do_action("ideal_postcodes_address_search");
        });
        // Bind to accounts
        add_action("woocommerce_before_edit_account_address_form", function () {
          do_action("ideal_postcodes_address_search");
        });
      }
    }

    private function version_check()
    {
      if (get_option("idealpostcodes_enabled") !== false) {
        //copy settings from old storage
        $this->update_option(
          "idealpostcodes_enabled",
          get_option("idealpostcodes_enabled")
        );
        $this->update_option(
          "idealpostcodes_api_key",
          get_option("idealpostcodes_api_key")
        );
        $this->update_option(
          "idealpostcodes_populate_organisation",
          get_option("idealpostcodes_populate_organisation")
        );
        $this->update_option(
          "idealpostcodes_watch_country",
          get_option("idealpostcodes_watch_country")
        );
        $this->update_option(
          "idealpostcodes_populate_county",
          get_option("idealpostcodes_populate_county")
        );
        //delete old stored options
        delete_option("idealpostcodes_enabled");
        delete_option("idealpostcodes_api_key");
        delete_option("idealpostcodes_populate_organisation");
        delete_option("idealpostcodes_populate_county");
      }
    }

    public function add_form_fields()
    {
      $this->form_fields = [
        "idealpostcodes_required" => [
          "title" => __("Required", IDEALPOSTCODES_SLUG),
          "type" => "title",
          "css" => "",
          "id" => "idealpostcodes_required",
          "description" => "",
        ],
        "idealpostcodes_enabled" => [
          "id" => "idealpostcodes_enabled",
          "title" => __("Enabled", IDEALPOSTCODES_SLUG),
          "type" => "checkbox",
          "description" => __(
            "Enable/Disable Idealpostcodes Postcode Lookup extension",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "yes",
        ],
        "idealpostcodes_api_key" => [
          "id" => "idealpostcodes_api_key",
          "title" => __("API Key", IDEALPOSTCODES_SLUG),
          "type" => "text",
          "description" => "",
        ],
        "idealpostcodes_options" => [
          "title" => __("Options", IDEALPOSTCODES_SLUG),
          "type" => "title",
          "css" => "",
          "id" => "idealpostcodes_options",
          "description" => "",
        ],
        "idealpostcodes_autocomplete" => [
          "id" => "idealpostcodes_autocomplete",
          "title" => __("Enable Address Autocomplete", IDEALPOSTCODES_SLUG),
          "type" => "checkbox",
          "description" => __(
            "Enable/Disable Address autocomplete functionality",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "yes",
        ],
        "idealpostcodes_postcodelookup" => [
          "id" => "idealpostcodes_postcodelookup",
          "title" => __("Enable Address Postcode Lookup", IDEALPOSTCODES_SLUG),
          "type" => "checkbox",
          "description" => __(
            "Enable/Disable Address Postcode Lookup functionality",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "yes",
        ],
        "idealpostcodes_watch_country" => [
          "id" => "idealpostcodes_watch_country",
          "title" => __(
            "Enable Address Validation based on country",
            IDEALPOSTCODES_SLUG
          ),
          "type" => "checkbox",
          "description" => __(
            "Enabling this feature will disable our Address Validation tools when an unsupported territory is selected",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "false",
        ],
        "idealpostcodes_populate_organisation" => [
          "id" => "idealpostcodes_populate_organisation",
          "title" => __("Enable Populate Organisation", IDEALPOSTCODES_SLUG),
          "type" => "checkbox",
          "description" => __(
            "Fill the Company field based on selected address.",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "yes",
        ],
        "idealpostcodes_populate_county" => [
          "id" => "idealpostcodes_populate_county",
          "title" => __("Enable County", IDEALPOSTCODES_SLUG),
          "type" => "checkbox",
          "description" => __(
            "This will populate the county field. County data is no longer used in the UK to identify a premise, however this can be enabled if you prefer.",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "no",
        ],
        "idealpostcodes_advanced" => [
          "title" => __("Advanced Configuration", IDEALPOSTCODES_SLUG),
          "type" => "title",
          "css" => "",
          "id" => "idealpostcodes_advanced",
          "description" => "",
        ],
        "idealpostcodes_postcodelookup_override" => [
          "id" => "idealpostcodes_postcodelookup_override",
          "title" => __(
            "Postcode Lookup Configuration Override",
            IDEALPOSTCODES_SLUG
          ),
          "type" => "textarea",
          "description" => __(
            "This setting overrides your postcode lookup configuration globally to allow for highly customisable and niche integrations. Leave blank to disable. This setting is dangerous as invalid input will break your integration.",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "",
        ],
        "idealpostcodes_autocomplete_override" => [
          "id" => "idealpostcodes_autocomplete_override",
          "title" => __(
            "Address Autocomplete Configuration Override",
            IDEALPOSTCODES_SLUG
          ),
          "type" => "textarea",
          "description" => __(
            "This setting overrides your address autocomplete configuration globally to allow for highly customisable and niche integrations. Leave blank to disable. This setting is dangerous as invalid input will break your integration.",
            IDEALPOSTCODES_SLUG
          ),
          "desc_tip" => true,
          "default" => "",
        ],
      ];
    }

    /**
     * Get all options with default values
     */
    public function get_options()
    {
      return [
        "enabled" => $this->to_bool(
          $this->get_option("idealpostcodes_enabled")
        ),
        "apiKey" => $this->get_option("idealpostcodes_api_key"),
        "autocomplete" => $this->to_bool(
          $this->get_option("idealpostcodes_autocomplete")
        ),
        "postcodeLookup" => $this->to_bool(
          $this->get_option("idealpostcodes_postcodelookup")
        ),
        "watchCountry" => $this->to_bool(
          $this->get_option("idealpostcodes_watch_country")
        ),
        "populateOrganisation" => $this->to_bool(
          $this->get_option("idealpostcodes_populate_organisation")
        ),
        "populateCounty" => $this->to_bool(
          $this->get_option("idealpostcodes_populate_county")
        ),
        "postcodeLookupOverride" => $this->get_option(
          "idealpostcodes_postcodelookup_override"
        ),
        "autocompleteOverride" => $this->get_option(
          "idealpostcodes_autocomplete_override"
        ),
      ];
    }

    public function to_bool($str)
    {
      if ($str === "yes") {
        return true;
      } else {
        return false;
      }
    }

    public function add_js()
    {
      $this->add_autocomplete_styles();
      $this->add_autocomplete_plugin();
      $this->add_postcode_lookup_plugin();
      $this->add_idpc_bindings();
    }
    /**
     * Add jquery plugin code
     */
    private function add_postcode_lookup_plugin()
    {
      wp_enqueue_script(
        "postcode-lookup",
        IDEALPOSTCODES_URL . "js/postcodes.min.js",
        ["jquery"]
      );
    }

    /**
     * Add autocomplete plugin
     */
    private function add_autocomplete_plugin()
    {
      wp_enqueue_script(
        "ideal-postcodes-autocomplete",
        IDEALPOSTCODES_URL . "js/ideal-postcodes-autocomplete.min.js"
      );
    }

    /**
     * Add autocomplete stylesheet
     */
    private function add_autocomplete_styles()
    {
      wp_enqueue_style(
        "ideal-postcodes-autocomplete-style",
        IDEALPOSTCODES_URL . "css/ideal-postcodes-autocomplete.css"
      );
    }

    /**
     * Init js plugin on the checkout page
     */
    private function add_idpc_bindings()
    {
      $options = $this->get_options();
      $postcode_lookup_override =
        strlen($options["postcodeLookupOverride"]) > 0
          ? html_entity_decode($options["postcodeLookupOverride"])
          : "{}";
      $autocomplete_override =
        strlen($options["autocompleteOverride"]) > 0
          ? html_entity_decode($options["autocompleteOverride"])
          : "{}";
      $options["postcodeLookupOverride"] = "%postcodeLookupOverride%";
      $options["autocompleteOverride"] = "%autocompleteOverride%";
      $json = json_encode($options, JSON_FORCE_OBJECT);
      $script = "window.idpcConfig = " . $json . ";";
      //replace overrides
      $script = str_replace(
        "\"%postcodeLookupOverride%\"",
        $postcode_lookup_override,
        $script
      );
      $script = str_replace(
        "\"%autocompleteOverride%\"",
        $autocomplete_override,
        $script
      );
      wp_enqueue_script(
        "ideal-postcodes-bindings",
        IDEALPOSTCODES_URL . "js/woocommerce.min.js",
        ["postcode-lookup", "ideal-postcodes-autocomplete"],
        "1.0",
        true
      );
      wp_add_inline_script("ideal-postcodes-bindings", $script, "before");
    }
  }
endif;
