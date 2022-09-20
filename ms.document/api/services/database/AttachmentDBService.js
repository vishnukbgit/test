/**
 * Created by aravindhanchandrasekar on 25/5/17.
 */
'use strict';
const errorCodeService = require('../ErrorCodeService');
const logger = require('../LoggerService');

let AttachmentDBService = {
    insertAttachmentRecords(attachmentArray,callback) {
        try {
            // eslint-disable-next-line no-undef
            console.log('attachment array',attachmentArray);
            Attachment.createEach(attachmentArray).fetch().exec(function (err,insertedRecordResponse) {  // jshint ignore:line
                if (err) {
                    logger.error("Attachment insertion " ,err);

                    return callback(errorCodeService.sqlErrorCode(),null);
                }

                    return callback(null,insertedRecordResponse);

            });
        } catch (e) {
            logger.error("Error inserting attachment records ",e);

            return callback(e,null);
        }
    },
    deleteAttachmentRecords(idArray,callback) {
        try {
            let id= idArray;
            // eslint-disable-next-line no-undef
            Attachment.destroy({id}).exec(function (err,deletedRecordResponse) {  // jshint ignore:line
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
    getAttachmentRecordsbyId(attachmentIdArray,callback) {
        try {
            // eslint-disable-next-line no-undef
            Attachment.find({id:attachmentIdArray}).exec(function (err,recordResponse) {  // jshint ignore:line
                if (err) {
                    logger.error("Attachment find ", err);

                    return callback(errorCodeService.sqlErrorCode(),null);
                }

                return callback(null,recordResponse);

            });
        } catch (e) {
            logger.error("Error finding attachment records ",e);

            return callback(e,null);
        }
    }

};
module.exports = AttachmentDBService;