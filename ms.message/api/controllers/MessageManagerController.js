'use strict';
const errorCodeService = require('../services/ErrorCodeService');
const emailService = require('../services/EmailService');
const messageService = require('../services/MessageService');
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');

let MessageManagerController = {
  sendPatientTasksReminderEmails(req,res) {

    let error = null;
    let response = null;
    try {
      if (req.body.emailAddressAndNumberOfTasks && req.body.dueInMessage) {
        emailService.sendPatientTasksReminderEmails(req.body.emailAddressAndNumberOfTasks, req.body.dueInMessage,
          function (err, resObject) {
          if (err) {
            logger.error("sendPatientTasksReminderEmails error occured ",err);
            error = errorCodeService.genericInternalErrorCode();

return res.send({error, response});
          }
            response = "ok";

return res.send({error, response});
          }
        );
      } else {
        logger.error("Missing required parameters ",null);
        error = errorCodeService.missingParametersErrorCode();

return res.send({error,response});
      }
    } catch (e) {
      logger.error("Error",e);

      error = errorCodeService.genericInternalErrorCode();

return res.send({error,response});
    }
  },
  sendGenericNotification(req, res) {
    let error = null;
    let response = null;
    try {
      if (req.body.toEmailAddresses) {
        emailService.sendGenericNotification(req.body.toEmailAddresses, req.body.userId,
          function (err, resObject) {
            response = "ok";

            return res.send({err, response});
          }
        );
      } else {
        return res.json(utilsService.makeErrParameter("Missing email address"));
      }
    } catch (e) {
      return res.json(utilsService.makeErrException(e.message));
    }
  },

  sendMessageNotification(req, res) {
    let error = null;
    let response = null;
    try {
      if (req.body.toEmailAddresses) {
        emailService.sendMessageNotification(req.body.toEmailAddresses, req.body.userId,
          function (err, resObject) {
            response = "ok";

            return res.send({err, response});
          }
        );
      } else {
        return res.json(utilsService.makeErrParameter("Missing email address"));
      }
    } catch (e) {
      return res.json(utilsService.makeErrException(e.message));
    }
  },

  sendPatientActivationEmail(req, res) {
    let error = null;
    let response = null;
    try {
      if (req.body.email) {
// Now send an email to let them know about it
        let context = req.body;
        context.url = '/uservalidation/'+context.verify_token;
        context.user_account_id = context.id;
        context.template = 'patient-activate';
        EmailService.sendAnEmail(context,function (err, msgSent) {
          if (err)
            return res.json(err);

            return res.json(msgSent);

        });
      } else {
        return res.json(utilsService.makeErrParameter("Missing email address"));
      }
    } catch (e) {
      return res.json(utilsService.makeErrException(e.message));
    }
  },

  resendPatientActivationEmail(req, res) {
    let error = null;
    let response = null;
    try {
      if (req.body.email) {
// Now send an email to let them know about it
        let context = req.body;
        context.url = '/uservalidation/'+context.verify_token;
        context.user_account_id = context.id;
        context.template = 'patient-activate';
        EmailService.sendAnEmail(context,function (err, msgSent) {
          if (err)
            return res.json(err);

            return res.json(msgSent);

        });
      } else {
        return res.json(utilsService.makeErrParameter("Missing email address"));
      }
    } catch (e) {
      return res.json(utilsService.makeErrException(e.message));
    }
  },

  sendTPApprovalNotificationToPatient(req, res) {
    let error = null;
    let response = null;
    try {
      if (req.body.toEmailAddresses) {
        emailService.sendTPApprovalNotificationToPatient(req.body.toEmailAddresses, req.body.userId,
          function (err, resObject) {
            response = "ok";

            return res.send({err, response});
          }
        );
      } else {
        error = new error();
        error.message = "Missing to addresses";
        error.code = "MISSING_TO_EMAIL_ADDRESSES";

        return res.send({error, response});
      }
    } catch (e) {
      return res.json(utilsService.makeErrException(e.message));
    }
  },

// Expecting input data like this:
  // {
  //   subject:
  //   message:
  //   patient_id:
  //   plan_name:
  //   addressees: [ {
  //     user_account_id:
  //     email:
  //     role:
  //     } ]
  // }
  notifyCancellation(req, res) {
    let error = null;
    let response = null;
    try {

      let subject = req.body.subject;
      let message = req.body.message
      let from = req.body.user_id;
      let patient_id = req.body.patient_id;
      _.each(req.body.addressees,(prac) => {
        if (prac.user_account_id > 0) {
          let to = [prac.user_account_id];
          messageService.sendMessage({from, message, to, subject, patient_id}, function (err, sent) {
            if (err) {
              logger.error("error caught while sending message to practitioner "+to,err);

              return res.json(utilsService.makeErrQuery(err.message),null);
            }
// Now send an email to let them know about it
            emailService.sendMessageNotification(prac.email,prac.user_account_id,function (err, result) {
              if (err) {
                logger.error("error",err);

                return res.json(utilsService.makeErrQuery(err.message),null);
              }

            });
          });
        }
      });

return res.json({response: "success"});
    } catch (e) {
      logger.error("error",e);

      return res.json(utilsService.makeErrException(e.message));
    }
  }

};

module.exports = MessageManagerController;
