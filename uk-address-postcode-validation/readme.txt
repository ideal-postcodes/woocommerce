=== UK Address Postcode Validation ===
Contributors: idealpostcodes
Donate link: https://ideal-postcodes.co.uk/
Tags: address, validation, search, checkout, data, PAF, ideal postcodes
Requires at least: 5.0
Tested up to: 5.6
Stable tag: 2.2.0
Requires PHP: 7.1.0
License: MIT
License URI: https://github.com/ideal-postcodes/woocommerce/blob/master/LICENSE

Ideal Postcodes UK address search and validation extension for WooCommerce

== Description ==

This extension provides realtime address autocompletion lookup on your address forms, including billing and shipping. Ideal Postcodes address tools validates and accelerates customer entered address information to reduce cart abandonment and ensure correct delivery address capture.

Ideal Postcodes provides address autocomplete for your WooCommerce address forms. We specialize in the UK addressing data, drawing the most up-to-date & accurate UK dataset from Royal Mail on a daily basis. We have over 1,000 clients that use our address validation tools to speed up checkout, increase deliverability, and ensure data quality.

This extension adds address validation including realtime address autocompletion on your address forms. Our tools appear on your checkout and user account pages (for billing and shipping addresses). Our address validation tools speed up the checkout process and ensure that correct addresses are collected, thereby reducing cart abandonment and ensuring deliverability.

This extension is free to download and install. However, our address validation services requires a paid account at [ideal-postcodes.co.uk](https://ideal-postcodes.co.uk).

Contact us if you get stuck. Drop by our [chat page](https://ideal-postcodes.co.uk) for immediate assistance or send us a message on one of our [support channels](https://ideal-postcodes.co.uk/support).

= Benefits =

- *Speed up the Checkout Process.* Reduce the time it takes to accurately insert an address on your checkout
- *Increase Deliverability.* Reduce failed deliveries by making address entry easier and less error prone
- *Ensure Data Quality.* Access the most up-to-date and accurate address dataset in the UK with Royal Mail's PAF® dataset

= Features =

- Address autocompletion on checkout shipping and billing pages
- Address autocompletion on accounts pages
- Checks if key is usable before enabling autocomplete
- Optionally populate organisation name from selected address
- Optionally populate county information

== Installation ==

= Wordpress Plugins =

1. Install the plugin through the Wordpress plugins screen

= Manual Installation =

1. Retrieve the plugin from the [Github repository](https://github.com/ideal-postcodes/woocommerce) and download the latest from the [releases page](https://github.com/ideal-postcodes/woocommerce/releases)
2. Unzip the release and upload the `uk-address-postcode-validation` directory to `/wp-content/plugins/uk-address-postcode-validation`

= Configuration =

When the plugin has been retrieved manually or via the plugins page,

1. Activate the plugin through the 'Plugins' screen in WordPress
2. Configure the plugin. Click on the WooCommerce link in the sidebar and then the `Ideal Postcodes` configuration tab on the settings page.
3. Add your API Key. You will need to add your API Key from your Ideal Postcodes dashboard. Your first key will have a free test balance. To go live, you will need to prepurchase a lookup balance on your key.

== Frequently Asked Questions ==

= How do I create an Ideal Postcodes API Key? =

You will need to create an account on Ideal-Postcodes.co.uk and generate a key from the dashboard. [View our guide](https://ideal-postcodes.co.uk/guides/account-setup) on how to create your first Ideal Postcodes API key and enable automated top-ups.

= Is this free to test? =

Yes. Your first key on your Ideal Postcodes account will carry a free test balance which you can use to verify and test your integration. When you are ready to go live, you will need to add a live balance to your Key either manually or with automated top-ups.

= How much does this cost? =

Prices range between 2 and 2.5p per lookup, with alternate pricing options available for specific sectors and volumes. See our [pricing page](https://ideal-postcodes.co.uk/pricing) or [contact us](https://ideal-postcodes.co.uk/support) to find out more.

== Screenshots ==

1. Address autocompletion on accounts pages
2. Address autocompletion on checkout billing and shipping pages
3. Admin console
4. Admin console, second tab

== Changelog ==

= 2.2.0 =
* Added Postcode Lookup and Address Autocomplete configuration overrides

= 2.1.9 =
* Tested up to WooCommerce 4.7
* Test Wordpress 5.5.3

= 2.0.3 =
* Tested up to WooCommerce 4.6

= 2.0.2 =
* Tested up to WooCommerce 4.3

= 2.0.1 =
* Fix: Restore manual checkout trigger

= 2.0.0 =
* Tested up to WooCommerce 4.2
* BREAKING CHANGE: Settings page moved to Integration tab, under "UK Address Postcode Validation"
* Feature: Adds postcode lookup to checkout pages

= 1.0.5 =
* Manually fire checkout refresh on address population

= 1.0.3 =
* Update tested platforms for Wordpress & WooCommerce
* Release to Wordpress plugins directory

= 1.0.2 =
* Automate version deploys to Wordpress plugins directory

= 1.0.1 =
* Drop trademark for plugin submission

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 1.0.5 =
* None

= 1.0.4 =
* None

= 1.0.3 =
* Installations and updates can now be retrieved from the Wordpress plugins directory

= 1.0.2 =
* None

= 1.0.1 =
* None

= 1.0.0 =
* Initial release
