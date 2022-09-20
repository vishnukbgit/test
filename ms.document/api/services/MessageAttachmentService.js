/**
 * Created by aravindhanchandrasekar on 25/5/17.
 */
'use strict';
const errorCodeService = require('./ErrorCodeService');
const fileUploadService = require('../services/FileUploadService');
const fileDownloadService = require('../services/FileDownloadService');
const fileDeleteService = require('../services/DeleteFileService');
const attachmentDBService = require('./database/AttachmentDBService');
const logger = require('./LoggerService');
const messageAttachmentDBService = require('./database/MessageAttachmentDBService');
let MessageAttachmentService = {
    uploadAttachments(messageId,attachmentsList,callback) {
       fileUploadService.processAndUploadFiles(attachmentsList,
         function(err,response) {
           if (err || response.isUploadError) {
               logger.error("Error",err);

              return callback(errorCodeService.genericInternalErrorCode(),null);
           }
             let uploadedFilesKeyArray = response.uploadedFilesKeyList;
             let attachmentRecordsToInsert=[];
             uploadedFilesKeyArray.forEach(function(up) {
                 attachmentsList.forEach(function (att) {
                     if (att.key.toString().trim().toLowerCase() === up.toString().trim().toLowerCase()){
                         let attachObj ={};
                         attachObj.name= att.fileName.substring(0, att.fileName.lastIndexOf('.'));
                         attachObj.filename = att.fileName;
                         attachObj.s3_bucket = att.key;
                         attachObj.content_type = att.contentType;
                         attachObj.created_by =0;
                         attachmentRecordsToInsert.push(attachObj);
                     }
                 });
             });
             if (attachmentRecordsToInsert.length >0) {
                 attachmentDBService.insertAttachmentRecords(attachmentRecordsToInsert,
                   function(err,responseObj) {
                     if (err) {
                         logger.error("Error",err);
                         fileDeleteService.deleteFilesByKeyNameList(uploadedFilesKeyArray,
                           function(err,response) {
                             if (err) {
                                 logger.error("Error",err);
                             }
                              return callback(errorCodeService.genericInternalErrorCode(),null);
                           }
                         );
                     }
                     let messageAttachmentRecordsToInsert =[];
                     let attachmentIds=[];
                     console.log('response obj',responseObj);
                       responseObj.forEach(function(obj) {
                          let mObj ={};
                          mObj.message_id = messageId;
                          mObj.attachment_id = obj.id;
                          mObj.created_by = 0;
                          attachmentIds.push(obj.id);
                           messageAttachmentRecordsToInsert.push(mObj);
                       });
                       messageAttachmentDBService.insertMessageAttachmentRecords(messageAttachmentRecordsToInsert,
                           function(err,responseObj) {
                               if (err) {
                                   logger.error("Error",err);
                                   attachmentDBService.deleteAttachmentRecords(attachmentIds,
                                     function(err,res) {
                                       if (err) {
                                           logger.error("Error",err);
                                       }
                                         fileDeleteService.deleteFilesByKeyNameList(uploadedFilesKeyArray,
                                             function(err,response) {
                                                 if (err) {
                                                     logger.error("Error",err);
                                                 }
                                                 return callback(errorCodeService.genericInternalErrorCode(),null);
                                             }
                                         );
                                     }

                                   );

                               } else {
                               return callback(null,"ok");
                               }

                           }
                       );
                   }
                 );
             } else {
                 return null,"ok";
             }
         }

       );
    } ,
    downloadAttachmentsByMessageIdArray(messageIdArray,callback) {
        try {
            let response = [];
            let counter = 0;
            for (let i = 0; i < messageIdArray.length; i++) {
                MessageAttachmentService.downloadAttachmentsbyMessageId(messageIdArray[i],
                    function (err, resList, messageId) {
                        if (err) {
                            logger.error("Error",err);

                            return callback(errorCodeService.genericInternalErrorCode(), null);
                        }

                        let resObj = {};
                        resObj.messageId = messageId;
                        resObj.attachments = resList;
                        response.push(resObj);
                        counter++;
                        if (counter >= messageIdArray.length) {
                            return callback(null, response);
                        }

                    }
                );
            }
        } catch(e) {
            logger.error("downloadAttachmentsByMessageIdArray exception caught ",e);

            return callback(errorCodeService.genericInternalErrorCode(),null);
        }

    },
    downloadAttachmentsbyMessageId(messageId,callback) {
       try {
           messageAttachmentDBService.getMessageAttachmentRecordsbyMessageId(messageId,
             function(err,responseObj){
               if (err) {
                   logger.error("downloadAttachmentsbyMessageId get message attachments records exception caught ",err);

return callback(errorCodeService.genericInternalErrorCode(),null);
               }
                 let attachmentIds=[];

                 responseObj.forEach(function(obj) {
                     attachmentIds.push(obj.attachment_id);
                 });
                 attachmentDBService.getAttachmentRecordsbyId(attachmentIds,
                     function(err,attachObj){
                         if (err) {
                             logger.error("downloadAttachmentsbyMessageId get attachments records exception caught ",err);

return callback(errorCodeService.genericInternalErrorCode(),null);
                         }

                         let keys=[];
                         attachObj.forEach(function(obj) {
                             keys.push(obj.s3_bucket);
                         });

                         fileDownloadService.processAndDownloadFiles(keys,
                           function(err,response) {
                             if (err || response.isDownloadError) {
                                 logger.error("downloadAttachmentsbyMessageId download from s3 exception caught ",err);

return callback(errorCodeService.genericInternalErrorCode(),null);
                             }
                             let responseList=[];
                                attachObj.forEach(function(obj) {
                                        response.downloadedFilesKeyList.forEach(function(down) {
                                          if (obj.s3_bucket.toString().trim().toLowerCase() === down.key.toString().trim().toLowerCase()) {
                                              let fileObj={};
                                              fileObj.fileName = obj.filename;
                                              fileObj.content_type = obj.content_type;
                                              fileObj.base64String = down.base64String;
                                              responseList.push(fileObj);
                                          }
                                       });
                               }
                               );

                            return callback(err,responseList,messageId);
                           }
                         );

                     }
                 );
             }
           );
       } catch (e) {
           logger.error("downloadAttachmentsbyMessageId exception caught ",e);

return callback(errorCodeService.genericInternalErrorCode(),null);
       }
    },
    removeAttachmentsbyMessageId(messageId,callback) {
        try {
            messageAttachmentDBService.getMessageAttachmentRecordsbyMessageId(messageId,
                function(err,responseObj){
                    if (err) {
                        logger.error("removeAttachmentsbyMessageId get message attachments records exception caught ",err);

return callback(errorCodeService.genericInternalErrorCode(),null);
                    }
                    let attachmentIds=[];
                    let messageAttachmentIds =[];

                    responseObj.forEach(function(obj) {
                        attachmentIds.push(obj.attachment_id);
                        messageAttachmentIds.push(obj.id);
                    });
                    attachmentDBService.getAttachmentRecordsbyId(attachmentIds,
                        function(err,attachObj){
                            if (err) {
                                logger.error("removeAttachmentsbyMessageId get attachments records exception caught ",err);

return callback(errorCodeService.genericInternalErrorCode(),null);
                            }

                            let keys=[];
                            attachObj.forEach(function(obj) {
                                keys.push(obj.s3_bucket);
                            });

                            fileDeleteService.deleteFilesByKeyNameList(keys,
                                function(err,response) {
                                    if (err) {
                                        logger.error("removeAttachmentsbyMessageId delete from s3 exception caught ",err);

return callback(errorCodeService.genericInternalErrorCode(),null);
                                    }

                                    messageAttachmentDBService.deleteMessageAttachmentRecords(messageAttachmentIds,
                                      function(err,response) {
                                        if (err) {
                                            logger.error("removeAttachmentsbyMessageId delete attachment records exception caught ",err);
                                        }
                                          attachmentDBService.deleteAttachmentRecords(attachmentIds,
                                              function(err,response) {
                                                  if (err) {
                                                      logger.error("removeAttachmentsbyMessageId delete message attachment records exception caught ",err);
                                                  }

return callback(err,"deleted");
                                              }
                                          );
                                      }
                                    );


                                }
                            );

                        }
                    );
                }
            );
        } catch (e) {
            logger.error("removeAttachmentsbyMessageId exception caught ",e);

return callback(errorCodeService.genericInternalErrorCode(),null);
        }
    },
    hasMessageGotAttachments(messageId,callback) {

    }

};
module.exports = MessageAttachmentService;
