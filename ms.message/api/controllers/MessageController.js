/**
 * Controller
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _ = require('lodash');

const EmailService = require('../services/EmailService');
const MessageService = require('../services/MessageService');
const errorCodeService = require('../services/ErrorCodeService');
const logger = require('../services/LoggerService');
const utilsService = require('../services/utilsService');
module.exports = {

/**
 * Fetch a list of tasks, I want the following information per task:
		+ Task Summary
		+ Patient Name
		+ Attachment(s)
		+ Status
		@returns messages
 *
 */
	findMyMessages(req,res) {

    try {
      let myId = parseInt(req.param('id'),10);
      MessageRecipient.find({recipient_id: myId}).
				populate('message_id').
				populate('recipient_id').
        sort('id DESC').
        exec(function (err, msgData) {
        if (err) {
          logger.error("Error: ", err);

          return res.serverError(err);
        }
        if (!msgData) {
          return res.json({error: "Not found"});
        }
        let msgs = [];
        _.each(msgData,(t) => {
        	let newT = {
            // message_recipient_id: t.id,
						message_read_flag: t.message_read_flag,
						deleted_flag: t.deleted_flag,
						read_date: t.read_date,
						updated_by: t.updated_by,
						createdAt: t.createdAt,
          	attachments: [ ]


        	};
        	if (t.message_id) {
            newT.message_id = t.message_id.id;
						newT.subject = t.message_id.subject;
						newT.body = t.message_id.body;
						newT.sent_date = t.message_id.sent_date;
						newT.sender_id = t.message_id.sender_id;
						// newT.id = t.id;        //TODO : need to validate id and message_id for the actual test data after hook-orm update
            newT.id = t.message_id.id;
        	}
        	msgs.push(newT);
        });

return res.json(msgs);
      });
    } catch (err) {
      logger.error("Error: ", err);

return res.json({error: err, code: "SQL_ERROR"});
    }
	},

  setMessageRead(req,res) {

    try {

      let myId = parseInt(req.param('id'),10);
      MessageRecipient.update({message_id: myId},{message_read_flag: req.param('message_read_flag')}).
        exec(function (err, msgData) {
        if (err) {
          logger.error("Error: ", err);

          return res.serverError(err);
        }
        if (!msgData) {
          return res.json({error: "Not found"});
        }

return res.json(msgData);
      });
    } catch (err) {
      logger.error("Error: ", err);
    }
  },

  sendForgotPassword(req,res) {
    try {
      let context = req.body.params;
      let user = req.body.user;
      EmailService.sendForgotPassword(context,user,function (err, result) {
        if (err) {
          logger.error("Error",err);

          return res.json(err.message);
        }

        return res.json(result);
      });
    } catch (err) {
      logger.error("Error: ", err);
    }
  },

  processNotification(req,res){

    try{
      switch(req.params.notificationType){
        case 'sms':
          MessageService.sendSMS(req.body);
          break;
        case 'pushNotification':
          //to be implemented in V2
          break;  
        case 'email':
          //to be implemented in V2
          break;
        default:
          break;

      }
      return res.json({});
      
    }catch (err) {
      logger.error("Error: ", err);
      return res.json(utilsService.makeErrException(err.message));
    }
     
  },

//
// This method assumes the message is completely formed, and no computations/calculations are required
//
  sendMessage(req,res) {
    try {
      MessageService.sendMessage(req.body,function (err, msgSent) {
        if (err) {
          logger.error("Error",err);

return res.json(err.message);


        }


// Now send an email to let them know about it
          let context = req.body;
          context.user_account_id = req.body.to;
          context.url = '/login';
          context.template = 'new-notification';
          context.subject = 'You have a new notification!';
          EmailService.sendAnEmail(context,function (err, result) {
            if (err) {
              logger.error("Error",err);

              return res.json(err);
            }


              return res.json(msgSent);

          });

      });
    } catch (err) {
      logger.error("Error: ", err);

return res.json(utilsService.makeErrException(err.message));
    }
  },

  addTreatmentPlanDecisionMessageToMessageTable(req, res) {

    let error = null;
    let response = null;
    try {
      if (req.body.sender_id && (req.body.hasOwnProperty('isApproved') || req.body.hasOwnProperty('isRejected') || req.body.hasOwnProperty('isAddTask')) && req.body.recipient_id && req.body.patient_name &&
        req.body.treatmentPlanName && req.body.patientId) {

        let subject = "Treatment Plan for " + req.body.patient_name + " has been";
        let body = "Treatment Plan - " + req.body.treatmentPlanName + " for " + req.body.patient_name + " has been";
        if (req.body.isApproved) {
          subject += ' approved';
          body += ' approved';
        } else if (req.body.isRejected) {
          subject += ' rejected';
          body += ' rejected';
        } else if (req.body.isAddTask) {
          subject = "Treatment Plan for " + req.body.patient_name + " has a new task added";
           body = "Treatment Plan - " + req.body.treatmentPlanName + " for " + req.body.patient_name + " has a new task added";
        }
        let messageObject = {};
        messageObject.sender_id = req.body.sender_id;
        messageObject.subject = subject;
        messageObject.body = body;
        messageObject.patient_id = req.body.patientId;
        messageObject.sent_date = new Date();
        messageObject.created_by = 0;
        messageObject.createdAt = new Date();
        let messageRecipient = {};
        messageRecipient.recipient_id = req.body.recipient_id;
        messageRecipient.message_read_flag = false;
        messageRecipient.deleted_flag = false;
        messageRecipient.created_by = 0;
        messageRecipient.createdAt = new Date();
        MessageService.addTreatmentPlanDecisionMessageToMessageTable(
          messageObject,messageRecipient,function(err,resObject) {
            if (err) {
              logger.error("Error",err);
              error = errorCodeService.genericInternalErrorCode();

              return res.send({error, response});
            }
              response = "message added";

              return res.send({error, response});
          }
        );
      } else {
        error = errorCodeService.missingParametersErrorCode();

        return res.send({error, response});
      }
    } catch (e) {
      logger.error("internal error caught ",e);
      error = errorCodeService.genericInternalErrorCode();

      return res.send({error, response});
    }
  },

//
// This method assumes the message is completely formed, and no computations/calculations are required
//
  getMessage(req,res) {
    try {
      MessageService.getMessage(req.body,function (err, msg) {
        if (err) {
          logger.error("Error",err);

return res.json(err);
        }

        return res.json(msg);
      });
    } catch (err) {
      logger.error("Error",err);

return res.json(utilsService.makeErrException(err.message));
    }
  }

};
