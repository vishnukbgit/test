'use strict';
let moment = require("moment-timezone");
const AEST_TIMEZONE = 'Australia/Melbourne';
const logger = require('./LoggerService');
let TimezoneUtilService = {
    convertAuditFieldstoAEST(obj) {
        try {
            if (obj) {
                if (obj && obj.createdAt) {
                    obj.createdAt = moment.tz(obj.createdAt, AEST_TIMEZONE).format();
                }
                if (obj && obj.updatedAt) {
                    obj.updatedAt = moment.tz(obj.updatedAt, AEST_TIMEZONE).format();
                }
            }
        } catch (err) {
            logger.error("Error in converting audit fields to AEST", err);
        } finally {
            return obj;
        }
    },
    convertSpecificfieldtoAEST(field) {
        try {
            if (field) {
                field = moment.tz(field, AEST_TIMEZONE).format();
            }
        } catch (err) {
            logger.error("Error in converting specific field to AEST", err);
        } finally {
            return field;
        }
    }

};

module.exports = TimezoneUtilService;
