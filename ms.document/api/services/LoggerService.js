const winston = require('winston');
const appRoot = require('app-root-path');
require('winston-daily-rotate-file');
const rTracer = require('cls-rtracer');
const _ = require('lodash');
const { format } = require('winston')
const { timestamp, printf } = format

const options = {
    file: {
        level: 'info',
        // filename: `${appRoot}/logs/app.log`,
        filename: `logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
        level: 'info',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
    dailyRotationFile: {
        level: "debug",
        // filename: `${appRoot}/logs/application-%DATE%.log`,
        filename: `logs/application-%DATE%.log`,
        datePattern: 'YYYY-MM-DD-HH',
        colorize: true,
        handleExceptions: true,
        json: true,
        maxSize: '20m',
        maxFiles: 14,
        frequency: '2h'//rotate files every 2 hours

    }
};

const humanReadableFormat = winston.format.combine(
    timestamp(),
    printf(({ timestamp, level, message, ...params }) => {
        const rid = rTracer.id()
        let spanId, traceId;
        if (rid) {
            [traceId, spanId] = rid.split('|');
        }
        if (!(_.isEmpty(traceId) || _.isEmpty(spanId))) {
            return JSON.stringify({timestamp,level,traceId,spanId,message,params});
        }
        return JSON.stringify({timestamp,level,traceId,spanId,message,params});
    })
)

// const jsonFormat = winston.format.combine(winston.format.timestamp(), winston.format.json())

const LoggerService = new winston.createLogger({
    format: humanReadableFormat,
    transports: [
        new winston.transports.Console({}),
        new winston.transports.DailyRotateFile(options.dailyRotationFile)
    ],
    exitOnError: false, // do not exit on handled exceptions
});


LoggerService.stream = {
    write: function (message, encoding) {
        LoggerService.error(message);
    },
};//connect to Morgan



module.exports = LoggerService;


