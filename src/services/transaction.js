import store from '@/store'
import Vue from 'vue'
import LoadScript from 'vue-plugin-load-script';

Vue.use(LoadScript);


const {$routes, $config} = require('@config')

/* eslint-disable */


export default {

    /**
     *
     */
    servicePaypal(identifier, params) {


        return new Promise(function (resolve, reject) {
            return paypal.Button.render({
                env: store.state.settings.settings.api_paypal_mode, // Or 'production'
                client: {
                    'sandbox': store.state.settings.settings.api_paypal_client_id,
                    'client-id': store.state.settings.settings.api_paypal_client_id,
                },
                style: {
                    size: 'medium',
                    color: 'blue',
                    shape: 'rect',
                },
                payment: function (data, actions) {
                    return actions.request.post($config.service + $routes.payment.resource,
                        {platform: 'paypal', ...params, ...(params.reference)},
                        {headers: {'Authorization': 'Bearer ' + store.state.auth.token}}).then(function (res) {

                        return res.id;
                    }).catch(function (error) {

                        return false;
                    });
                },

                onAuthorize: function (data, actions) {
                    return actions.request.post($config.service + $routes.payment.authorize,
                        {
                            payment_id: data.paymentID,
                            payer_id: data.payerID,
                            platform: 'paypal',
                            ...params.reference
                        },
                        {headers: {'Authorization': 'Bearer ' + store.state.auth.token}}).then(function (res) {
                        return resolve(res);
                    }).catch(error => {
                        console.log(error);
                        return reject(error);
                    });
                }
                ,
                onCancel: function () {

                    // Show a cancel page, or return to cart
                }

            }, identifier);

        });


    },
    serviceMercadoPago(identifier, preference) {
        return new Promise(function () {
            /* eslint-disable */
            let mp = new MercadoPago(store.state.settings.settings.api_mercadopago_public_key, {
                locale: (store.state.settings.settings.api_mercadopago_language !== undefined || null) ? store.state.settings.settings.api_mercadopago_language : 'es-MX',
            });

            mp.checkout({
                preference: {
                    id: preference.id,
                },
                render: {
                    container: identifier, // Indica el nombre de la clase donde se mostrará el botón de pago
                    label: "Pagar", // Cambia el texto del botón de pago (opcional)
                    type: "wallet", // Cambia el texto del botón de pago (opcional)

                },
            });

            return mp;
        });
    },
    serviceStripe(identifier, preference) {
        return new Promise(function () {
            /* eslint-disable */
            let mp = new MercadoPago(store.state.settings.settings.api_mercadopago_public_key, {
                locale: (store.state.settings.settings.api_mercadopago_language !== undefined || null) ? store.state.settings.settings.api_mercadopago_language : 'es-MX',
            });

            mp.checkout({
                preference: {
                    id: preference.id,
                },
                render: {
                    container: identifier, // Indica el nombre de la clase donde se mostrará el botón de pago
                    label: "Pagar", // Cambia el texto del botón de pago (opcional)
                    type: "wallet", // Cambia el texto del botón de pago (opcional)

                },
            });

            return mp;
        });
    },


}
