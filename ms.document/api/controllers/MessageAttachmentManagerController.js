/**
 * Created by aravindhanchandrasekar on 23/5/17.
 */
'use strict';
const messageAttachmentService = require('../services/MessageAttachmentService');
const errorCodeService = require('../services/ErrorCodeService');
let MessageAttachmentManagerController = {
  uploadAttachmentsbyMessageId(req,res) {
    let error = null;
    let response =null;
    try {
        console.log("validating check ",req.body.attachmentsList && Array.isArray(req.body.attachmentsList) && req.body.messageId);
    if (req.body.attachmentsList && Array.isArray(req.body.attachmentsList) && req.body.messageId) {
        messageAttachmentService.uploadAttachments(req.body.messageId,req.body.attachmentsList,
   function(err,response) {
            console.log("error ",err);
     return res.send({err,response});
   }


   );
    } else {
        console.log('got here');
    error =errorCodeService.missingParametersErrorCode();

    return res.send({error,response});
    }
    } catch (e) {
        console.log("error here",e);
      error =errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
  },

  downloadAttachmentsbyMessageIdArray(req,res) {
    let error = null;
    let response =null;
    try {
      if (req.body.messageIdList) {
          messageAttachmentService.downloadAttachmentsByMessageIdArray(req.body.messageIdList,
          function(err,response) {
            return res.send({err,response});
          }


        );
      } else {
        error =errorCodeService.missingParametersErrorCode();

        return res.send({error,response});
      }
    } catch (e) {
      error =errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
  },
  removeAttachmentsbyMessageId(req,res) {
    let error = null;
    let response =null;
    try {
      if (req.body.messageId) {
          messageAttachmentService.removeAttachmentsbyMessageId(req.body.messageId,
          function(err,response) {
            return res.send({err,response});
          }


        );
      } else {
        error =errorCodeService.missingParametersErrorCode();

        return res.send({error,response});
      }
    } catch (e) {
      error =errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
  },
    hasMessageGotAttachments(req,res) {
        let error = null;
        let response =null;
        try {
            if (req.body.messageId) {
                messageAttachmentService.hasMessageGotAttachments(req.body.messageId,
                    function(err,response) {
                        return res.send({err,response});
                    }


                );
            } else {
                error =errorCodeService.missingParametersErrorCode();

                return res.send({error,response});
            }
        } catch (e) {
            error =errorCodeService.genericInternalErrorCode();

            return res.send({error,response});
        }
    }


};
module.exports = MessageAttachmentManagerController;

