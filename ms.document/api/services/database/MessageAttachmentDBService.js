/**
 * Created by aravindhanchandrasekar on 25/5/17.
 */
'use strict';
const errorCodeService = require('../ErrorCodeService');
const logger = require('../LoggerService');

let MessageAttachmentDBService = {
    insertMessageAttachmentRecords(attachmentArray,callback) {
        try {
            // eslint-disable-next-line no-undef
            MessageAttachment.createEach(attachmentArray).fetch().exec(function (err,insertedRecordResponse) {  // jshint ignore:line
                if (err) {
                    logger.error("Message Attachment insertion " ,err);

                    return callback(errorCodeService.sqlErrorCode(),null);
                }

                return callback(null,insertedRecordResponse);

            });
        } catch (e) {
            logger.error("Error inserting message attachment records ",e);

            return callback(e,null);
        }
    },
    deleteMessageAttachmentRecords(idArray,callback) {
        try {
            let id= idArray;
            // eslint-disable-next-line no-undef
            MessageAttachment.destroy({id}).exec(function (err,deletedRecordResponse) {  // jshint ignore:line
                if (err) {
                    logger.error("Attachment deletion " ,err);

                    return callback(errorCodeService.sqlErrorCode(),null);
                }

                return callback(null,deletedRecordResponse);

            });
        } catch (e) {
            logger.error("Error deleting attachment records ",e);

            return callback(e,null);
        }
    },
    getMessageAttachmentRecordsbyMessageId(messageIdArray,callback) {
        try {

            // eslint-disable-next-line no-undef
            MessageAttachment.find({message_id:messageIdArray}).exec(function (err,recordResponse) {  // jshint ignore:line
                if (err) {
                    logger.error("Message Attachment find " ,err);

                    return callback(errorCodeService.sqlErrorCode(),null);
                }

                return callback(null,recordResponse);

            });
        } catch (e) {
            logger.error("Error finding message attachment records ",e);

            return callback(e,null);
        }
    }

};
module.exports = MessageAttachmentDBService;
