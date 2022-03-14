import {
    datadogLogs
} from '@datadog/browser-logs';

export default {
    install(Vue, options) {
        /**
         * Rules:
         * - Enable in client only
         * - Not disabled
         */
        const isNotExecutable = !process.browser || options.disabled;
        if (isNotExecutable) return;

        /**
         * Check before executing the plugin:
         * - Client token must exist and not empty
         * - Service name must exist and not empty
         */
        const initialCheck =
            (!options.clientToken || options.clientToken.length === 0) &&
            (!options.service || options.service.length === 0);
        const loggingWarn = () => {
            /* eslint no-console: ["error", { allow: ["warn", "error"] }] */
            console.warn(
                'You are not using Datadog vue plugin. If you want to, you can enter a Datadog client token'
            );
            return;
        };
        initialCheck ? loggingWarn() : null;

        /**
         * Initialising datadogLogs!
         * See the params https://docs.datadoghq.com/logs/log_collection/javascript/#initialization-parameters
         * Required: clientToken & site
         */
        datadogLogs
            ?
            datadogLogs.init({
                clientToken: options.clientToken, // REQUIRED
                site: 'datadoghq.eu', // REQUIRED
                forwardErrorsToLogs: true,
                sampleRate: 100,
                service: options.service,
                env: process.env.NODE_ENV,
            }) :
            null;

        /**
         * Add a context to all your loggers
         * See the params https://docs.datadoghq.com/logs/log_collection/javascript/#global-context
         */
        datadogLogs.addLoggerGlobalContext('Site', options.service);
    },
    /**
     * Log functionality to Datadog
     * @param  {String} message The message of your log that is fully indexed by Datadog.
     * @param  {Object} messageContext A valid JSON object, which includes all attributes attached to the <MESSAGE>
     * @param {String} status The status of your log; accepted status values are `debug`, `info`, `warn`, or `error`.
     */
    $log: function (
        message = 'No message',
        messageContext = {
            function: 'noMessageContext'
        },
        status = 'error'
    ) {
        datadogLogs.logger.log(
            message, {
                context: {
                    stack_trace: new Error().stack,
                    ...messageContext,
                },
            },
            status
        );
    },
};