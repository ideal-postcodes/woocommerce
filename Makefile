.DEFAULT_GOAL := help

## -- Container Launch --

## Launch services and run initialisation scripts
.PHONY: bootstrap
bootstrap: up init-db init-wp init-wc seed init-ip

## Launch docker-compose as background daemon
.PHONY: up
up:
	docker-compose up -d

## Launch docker-compose as background daemon
.PHONY: down
down:
	docker-compose down --volumes

## -- Test Container Launch --

## Bootstrap WooCommerce 3.3 environment
.PHONY: bootstrap-33
bootstrap-33: up-33 init-db init-wp init-wc seed init-ip

## Bootstrap 4.2 WooCommerce environment
.PHONY: bootstrap-42
bootstrap-42: up-42 init-db init-wp init-wc seed init-ip

## Bootstrap 4.3 WooCommerce environment
.PHONY: bootstrap-43
bootstrap-43: up-43 init-db init-wp init-wc seed init-ip

## Bootstrap 4.5 WooCommerce environment
.PHONY: bootstrap-45
bootstrap-45: up-45 init-db init-wp init-wc seed init-ip

## Bootstrap 4.6 WooCommerce environment
.PHONY: bootstrap-46
bootstrap-46: up-46 init-db init-wp init-wc seed init-ip

## Bootstrap 4.7 WooCommerce environment
.PHONY: bootstrap-47
bootstrap-47: up-47 init-db init-wp init-wc seed init-ip

## Launch WC 3.3
.PHONY: up-33
up-33:
	docker-compose -f docker-compose.yml -f docker/33.yml up -d

## Launch WC 4.2
.PHONY: up-42
up-42:
	docker-compose -f docker-compose.yml -f docker/42.yml up -d

## Launch WC 4.3
.PHONY: up-43
up-43:
	docker-compose -f docker-compose.yml -f docker/43.yml up -d

## Launch WC 4.5
.PHONY: up-45
up-45:
	docker-compose -f docker-compose.yml -f docker/45.yml up -d

## Launch WC 4.6
.PHONY: up-46
up-46:
	docker-compose -f docker-compose.yml -f docker/46.yml up -d

## Launch WC 4.7
.PHONY: up-47
up-47:
	docker-compose -f docker-compose.yml -f docker/47.yml up -d

## -- Development Methods --

## Shell into Wordpress container
.PHONY: shell
shell:
	docker-compose exec web bash

## Tail logs
.PHONY: logs
logs:
	docker-compose logs -f

## Initialise DB
.PHONY: init-db
init-db:
	docker-compose exec -T web dockerize -wait tcp://db:3306 -timeout 1m
	docker-compose exec -T db mysql -u root -ppassword -e "create database if not exists woocommerce"
	docker-compose exec -T db mysql -u root -ppassword -e "create user if not exists 'woocommerce'@'localhost' identified by 'woocommerce'"
	docker-compose exec -T db mysql -u root -ppassword -e "GRANT ALL PRIVILEGES ON woocommerce.* TO woocommerce@localhost"
	docker-compose exec -T db mysql -u root -ppassword -e "FLUSH PRIVILEGES"

## Initialise WP
.PHONY: init-wp
init-wp:
	docker-compose exec -T web find ! -name uk-address-postcode-validation -type d -exec chmod 777 {} \;
	docker-compose exec -T web find ! -name uk-address-postcode-validation -type f -exec chmod 666 {} \;
	docker-compose exec -T -u 33 web wp core install --url=http://localhost:8000 --title=test --admin_user=admin --admin_email=test@example.com --admin_password=password

## Initialise woocommerce
.PHONY: init-wc
init-wc:
	docker-compose exec -T -u 33 web wp theme install storefront --activate
	docker-compose exec -T -u 33 web wp plugin activate woocommerce
	docker-compose exec -T -u 33 web wp option set woocommerce_store_address "10 Foo Street"
	docker-compose exec -T -u 33 web wp option set woocommerce_store_address_2 ""
	docker-compose exec -T -u 33 web wp option set woocommerce_store_city "London"
	docker-compose exec -T -u 33 web wp option set woocommerce_default_country "GB"
	docker-compose exec -T -u 33 web wp option set woocommerce_store_postalcode "EC1A 2BN"
	docker-compose exec -T -u 33 web wp option set woocommerce_store_postcode "EC1A 2BN"
	docker-compose exec -T -u 33 web wp option set woocommerce_currency "GBP"
	docker-compose exec -T -u 33 web wp option set woocommerce_product_type "physical"
	docker-compose exec -T -u 33 web wp option set woocommerce_allow_tracking "no"
	docker-compose exec -T -u 33 web wp option set --format=json woocommerce_stripe_settings '{"enabled":"no","create_account":false,"email":false}'
	docker-compose exec -T -u 33 web wp option set --format=json woocommerce_ppec_paypal_settings '{"reroute_requests":false,"email":false}'
	docker-compose exec -T -u 33 web wp option set --format=json woocommerce_cheque_settings '{"enabled":"no"}'
	docker-compose exec -T -u 33 web wp option set --format=json woocommerce_bacs_settings '{"enabled":"no"}'
	docker-compose exec -T -u 33 web wp option set --format=json woocommerce_cod_settings '{"enabled":"yes"}'


## Seed ample data
.PHONY: seed
seed:
	docker-compose exec -T -u 33 web wp wc product create --name='Test' --type='simple' --sku='WCCLITESTP' --regular_price='20' --user=admin

## Initialise Ideal Postcodes extension
.PHONY: init-ip
init-ip:
	docker-compose exec -T -u 33 web wp plugin activate uk-address-postcode-validation

## -- Misc --

## Update repository against origin/master
.PHONY: update
update:
	git fetch
	git merge --ff-only origin/master

## How to use this Makefile
.PHONY: help
help:
	@printf "Usage\n";

	@awk '{ \
			if ($$0 ~ /^.PHONY: [a-zA-Z\-\_0-9]+$$/) { \
				helpCommand = substr($$0, index($$0, ":") + 2); \
				if (helpMessage) { \
					printf "\033[36m%-20s\033[0m %s\n", \
						helpCommand, helpMessage; \
					helpMessage = ""; \
				} \
			} else if ($$0 ~ /^[a-zA-Z\-\_0-9.]+:/) { \
				helpCommand = substr($$0, 0, index($$0, ":")); \
				if (helpMessage) { \
					printf "\033[36m%-20s\033[0m %s\n", \
						helpCommand, helpMessage; \
					helpMessage = ""; \
				} \
			} else if ($$0 ~ /^##/) { \
				if (helpMessage) { \
					helpMessage = helpMessage"\n                     "substr($$0, 3); \
				} else { \
					helpMessage = substr($$0, 3); \
				} \
			} else { \
				if (helpMessage) { \
					print "\n                     "helpMessage"\n" \
				} \
				helpMessage = ""; \
			} \
		}' \
		$(MAKEFILE_LIST)
