require('winston-daily-rotate-file');
const { createLogger, format, transports } = require('winston');

const env = process.env.NODE_ENV || 'development';
const logger = createLogger({
    level: env === 'production' ? 'info' : 'debug',
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [new (transports.Console)({
        timestamp: function () {
            return Date.now();
        },
        formatter: function (options) {
            return options.timestamp() + ' ' +
                options.level.toUpperCase() + ' ' +
                (options.message ? options.message : '') +
                (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
        }
    }),
    new (transports.DailyRotateFile)({
        filename: '/tmp/backend-log',
        datePattern: 'yyyy-MM-dd.',
        prepend: true
    })
    ]
});
module.exports = logger
