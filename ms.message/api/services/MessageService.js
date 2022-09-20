/**
 * Created by aravindhanchandrasekar on 4/4/17.
 */


const errorCodeService = require('./ErrorCodeService');
const utilsService = require('./utilsService');
const logger = require('./LoggerService');
const _=require('underscore');
const AWS = require('aws-sdk');
const { datastores } = require('sails-postgresql');
const { patient } = require('../../../../scripts/db.associations');
const { string } = require('xlsx/jszip');
const UserNotification = require('../models/UserNotification');

const getSMSBody = (firstname,days,due_date) => {
  let smsBody;
  let purpose;

  if (days < 0) {
    smsBody = `Hi ${firstname}, Your test was on ${due_date}. Have you got it done? Please Reply Y or N`;
    purpose = 'Feedback';
  } else {
    smsBody = `Hi ${firstname}, This is a reminder. Your test is due in ${days} day(s). Please ignore if already taken. \nThank you.`;
    purpose = 'Reminder';
  }

  return {smsBody, purpose};
};

let MessageService = {
  sendSMS: function(SMSRecords){
    try{
      SMSRecords.map(async (SMSRecord) => {

      // Set region
      AWS.config.update({region: 'ap-southeast-2'});
      const pinpoint = new AWS.Pinpoint({apiVersion: '2016-12-01'});
      const bodyPayload = getSMSBody(SMSRecord.firstname, SMSRecord.dueDays, SMSRecord.due_date);

      const params = { 
        ApplicationId: '188ed34455cb4fefade631f72e2e7371',
        MessageRequest : { 
          Addresses : {
            [SMSRecord.phone] : {
              // "BodyOverride": "Hi",
              ChannelType: "SMS"
            }
          },
          MessageConfiguration : {
            SMSMessage: 
            {
              Body : bodyPayload.smsBody,
              Keyword: "KEYWORD_365956504116",
              OriginationNumber: "+17052434297",
              MessageType : "TRANSACTIONAL"
            }
          }
        }
      };
      
        //send SMS using pinpoint
        const awsResponse = await pinpoint.sendMessages(params).promise();

        if(awsResponse){
          //get inputs from AWS pinpoint to be updated in user_notification table
          let deliveryStatus;
          if(awsResponse.MessageResponse.Result[SMSRecord.phone].DeliveryStatus === "SUCCESSFUL"){
            deliveryStatus = true;
          } else{
            deliveryStatus = false;
          }
        
          updateRecord = {
            messageId: awsResponse.MessageResponse.Result[SMSRecord.phone].MessageId,
            successFlag: deliveryStatus
          };

          const updatedUserNotification = await UserNotification.updateOne({recipient_id: SMSRecord.owner_id, reference_id: SMSRecord.id}).
          set({
            notification_type: 'SMS',
            notificatiion_sent_id: updateRecord.messageId,
            notification_sent: bodyPayload.smsBody,
            notification_purpose: bodyPayload.purpose,
            success_flag: updateRecord.successFlag
          });
        }
      });     
      return;
    }catch(err){
      logger.error("Error: ", err);
      throw err;
    }
  },

//
// This method assumes the message is completely formed, and no computations/calculations are required
//
  sendMessage(body,callback) {
    let error =null;
    let response =null;
    let required = ["from","message","to"];
    let failed = false;
    let requestcnt = 0;
    let donecnt = 0;

// Check the incoming stuff first
    _.each(required,(item) => {
      if (!body[item]) {
        failed = true;

return callback(utilsService.makeErrParameter("Required parameter missing: "+item),null);
      }
    });
    if (!Array.isArray(body.to)) {
      return callback(utilsService.makeErrParameter("To address should be an array"), null);
    }
//
// Ok to proceed, try and send the message
//
    try {
      let msg = {
        sender_id: body.from,
        subject: body.subject,
        body: body.message.replace(/\n/g,'<br>'),
        parent_id: body.parent_id || 0,
        patient_id: body.patient_id,
        sent_date: new Date(),
        created_by: 0
      };

      Message.create(msg).
      exec(function (err,msgAdded) {
        if (err) {
          logger.error("Message insert failed",err);

return callback(utilsService.makeErrQuery(err.message),null);
        } else if (msgAdded) {
          _.each(body.to,(to_id) => {
            let recipient = {
              message_id: msgAdded.id,
              recipient_id: to_id,
              message_read_flag: false,
              deleted_flag: false,
              created_by: 0
            };
            requestcnt++;

            MessageRecipient.create(recipient).
            exec(function (err,recipAdded) {
              if (err) {
                failed = true;
                logger.error("Recipient insert failed",err);

return callback(utilsService.makeErrQuery(err.message),null);
              } else if (recipAdded) {
                donecnt++;
                if (!failed && donecnt >= requestcnt) {
                  return callback(null,msgAdded);
                }
              } else {
                logger.error("Recip not added ",failed);
                if (!failed) {
                  logger.error("Recipient not added",null);

                  return callback(utilsService.makeErrNonSequitur("Recipient not added"),null);
                }
              }
            });
          });
        } else {
          failed = true;
          logger.error("Message not added",null);

          return callback(utilsService.makeErrNonSequitur("Message not added"),null);
        }
      });
    } catch (e) {
      logger.error("Error",e);
      if (!failed) {
        return callback(utilsService.makeErrException("Problem adding message"), null);
      }
    }
  },

  addTreatmentPlanDecisionMessageToMessageTable(messageObject,messageRecipient,callback) {
    let error = null;

    let message = {};
    message.sender_id = messageObject.sender_id;
    message.subject =messageObject.subject;
    message.body = messageObject.body;
    message.patient_id = messageObject.patient_id;
    message.sent_date = messageObject.sent_date;
    message.created_by = messageObject.created_by;
    message.createdAt = messageObject.createdAt;
    try {
      Message.create(message).exec(function (err, rec){    // jshint ignore:line
        if (err) {
          logger.error("error caught while inserting message object ",err);

return callback(errorCodeService.sqlErrorCode(),null);
        }
          messageRecipient.message_id = rec.id;
          MessageRecipient.create(messageRecipient).exec(function (err, rec){    // jshint ignore:line
            if (err) {
              logger.error("Error caught while inserting messageRecipient object ",err);

return callback(errorCodeService.sqlErrorCode(),null);
            }

return callback(null,"ok");


          });


      });
    } catch (e) {
      logger.error("error caught ",e);
     error = errorCodeService.sqlErrorCode();

     return callback(error,null);
    }
  },

  getMessage(params,callback) {
    try {
      let sql = `WITH RECURSIVE nodes(id,sender_id,patient_id,subject,body,sent_date,parent_id) AS (
    SELECT s1.id, s1.sender_id, s1.patient_id, s1.subject, s1.body, s1.sent_date, s1.parent_id
    FROM message s1 WHERE id = $1
        UNION
    SELECT s2.id, s2.sender_id, s2.patient_id, s2.subject, s2.body, s2.sent_date, s2.parent_id
    FROM message s2, nodes s1 WHERE s1.parent_id = s2.id
)
SELECT * FROM nodes order by id desc
`;

      Message.query(sql, [params.id], function (err, msgs) {
        if (err) {
          logger.error("error caught while querying messages for "+params.id,err);

          return callback(utilsService.makeErrQuery(err.message),null);
        }
        let messages = [];
        let msgIds = [];
        let senderIds = [];
        _.each(msgs.rows,(row) => {
          messages.push(row);
          msgIds.push(row.id);
          senderIds.push(row.sender_id);
        });

        MessageRecipient.find({message_id: msgIds}).
        populate('recipient_id').
        exec(function (err, recipients) {
          if (err) {
            logger.error("error caught while querying message recipients ",err);

            return callback(utilsService.makeErrQuery(err.message),null);
          }
          let rLookup = {};
          _.each(recipients,(r) => {
            if (!rLookup[r.message_id]) {
              rLookup[r.message_id] = [r.recipient_id.name];
            } else {
              rLookup[r.message_id].push(r.recipient_id.name);
            }
          });
          UserAccount.find({id: senderIds}).
          exec(function (err, senders) {
            if (err) {
              logger.error("error caught while querying message senders ",err);

return callback(utilsService.makeErrQuery(err.message),null);
            }
            let sLookup = {};
            _.each(senders,(s) => {
              sLookup[s.id] = s.name;
            });
            _.each(messages,(m) => {
              m.recipients = rLookup[m.id];
              m.sender = sLookup[m.sender_id];
            });

return callback(messages);
          });
        });
      });
    } catch (e) {
      logger.error("error caught ",e);
     let error = errorCodeService.sqlErrorCode();

return callback(error,null);
    }
  },

  notifyCancellation(params,callback) {
    let error = null;

//
// Let's get some data together from the id's we are given...
//
    // TreatmentPlan.find({id: params.treatmentPlanId})
    let message = {};
    message.sender_id = messageObject.sender_id;
    message.subject =messageObject.subject;
    message.body = messageObject.body;
    message.patient_id = messageObject.patient_id;
    message.sent_date = messageObject.sent_date;
    message.created_by = messageObject.created_by;
    message.createdAt = messageObject.createdAt;
    try {
      Message.create(message).exec(function (err, rec){    // jshint ignore:line
        if (err) {
          logger.error("error caught while inserting message object ",err);

return callback(errorCodeService.sqlErrorCode(),null);
        }
          messageRecipient.message_id = rec.id;
          MessageRecipient.create(messageRecipient).exec(function (err, rec){    // jshint ignore:line
            if (err) {
              logger.error("Error caught while inserting messageRecipient object ",err);

return callback(errorCodeService.sqlErrorCode(),null);
            }

return callback(null,"ok");


          });


      });
    } catch (e) {
      logger.error("error caught ",e);
     error = errorCodeService.sqlErrorCode();

return callback(error,null);
    }
  }

};

module.exports = MessageService;
