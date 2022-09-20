/**
 * Common microservice template, created by mikkel in April 2017.
 */

/* jshint undef: false */

/*
	 * * * * WARNING: This file is generated from a template. * * * *
		- You shouldn't edit it, because it will be replaced when the templater is next run
		
*/

const _ = require('lodash');
const uuidV4 = require('uuid/v4');

sails.apikey = '';

var utilsService = {

  version: function() {
    return "1.4.5";
  },

  uptime: function() {
  	if (sails.bootTime)
	  	return (new Date().getTime() - sails.bootTime)/1000;
	  else 
	  	return 0;
  },

//
// Generate a random id
//
  generateUuid: function() {
    return uuidV4();
  },

//
// Generate a random password
//
  generatePwd: function() {
    var seed = new Date().getTime();
    var uuid = 'xxxxxxPa0'
    .replace(/[xy]/g, function(c){
      var r = (seed + random(1)*16)%16 | 0;
      seed = Math.floor(seed/16);
      return (c==='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
  },

//
// Fetch the API key from database
// If no matching record is found, don't let the server boot.
// TODO: no longer fetch keys from the database... get them from a local config file
//
  getApiKey: function(keyName,cb) {
    let api_key_error = {
      code: "API_KEY_DATA_NOT_FOUND", 
      message: keyName+" value not found in EnvironmentConfiguration table"
    };
    let is_api_key_error = false;

    sails.bootTime = new Date().getTime();
/* jshint undef: false */
    EnvironmentConfigurationSetting.findOne({configuration_name: keyName})
/* jshint undef: true */
      .exec(function (err,record) {
        if(err) {
          is_api_key_error = true;
        } else if (record!=='undefined' && record) {
          if (record.length === 0) {
            is_api_key_error = true;
          } else {
            if (record.configuration_value) {
/* jshint undef: false */
              sails.apikey = record.configuration_value;  /* jshint unused: false */
/* jshint undef: true */
              
              return cb();
            }
            else {
              is_api_key_error = true;
            }
          }
        } else {
          is_api_key_error = true;
        }

        //return
        if (is_api_key_error)
          return cb(api_key_error);
        else {
          return cb();
        }
      }
    );
  },

  makeErr(errType,msg) {
    let err = {error:{code: errType}};
    if (typeof msg === 'object') {
      if (msg.error && msg.error.message && msg.error.code) // If it's our error message already
        return msg;                                         // then simply return it
      if (msg.message) {
        err.error.message = msg.message;
        // err.error.details = msg;
      }
    } else {
      err.error.message = msg;
    }
    sails.log.error(err);
    return err;
  },

  makeErrValidation(msg) {
    return utilsService.makeErr("VALIDATION",msg);
  },

  makeErrException(msg) {
    return utilsService.makeErr("EXCEPTION",msg);
  },

  makeErrQuery(msg) {
    return utilsService.makeErr("DATABASE",msg);
  },

  makeErrNotFound(msg) {
    return utilsService.makeErr("NOT_FOUND",msg);
  },

  makeErrParameter(msg) {
    return utilsService.makeErr("PARAMETER",msg);
  },

  makeErrNonSequitur(msg) {         // Errors that should never happen
    return utilsService.makeErr("NON_SEQUITUR",msg);
  },

  makeErrAWS(msg) {
    return utilsService.makeErr("AWS",msg);
  },

//
// Fetch config items from database
//
  getCfgItems: function(cfgList,cb) {
    if (!Array.isArray(cfgList)) {
      return cb({code: "BAD_PARAMETER", message: "Argument provided must be an array"});
    }

    let itemList = _.map(cfgList, 'name');
/* jshint undef: false */
    EnvironmentConfigurationSetting.find({configuration_name: itemList})
/* jshint undef: true */
      .exec(function (err,records) {
        if(err) {
          return cb({code: "EXCEPTION", message: err})
        } else {
          if (records.length === 0)
            return cb({code: "NOT_FOUND", message: "Config items "+itemList.join()+" not found"});
          let result = {};
          let missingList = [];
//
// Save them into a more compact object to return
//          
          _.each(records, rec => {
            result[rec.configuration_name] = rec.configuration_value;
          });
//
// Now check we got them all
//
          _.each(cfgList, item => {
            if (!result[item.name]) {
              missingList.push(item.name);
            } else {
              switch (item.type) {
                case 'integer':
                  sails[item.name] = parseInt(result[item.name]);
                  break;
                case 'float':
                  sails[item.name] = parseFloat(result[item.name]);
                  break;
                case 'string':
                  sails[item.name] = result[item.name];
                  break;
                default:
                  sails[item.name] = result[item.name];
                  break;
              }
            }
          });
          if (missingList.length === 0) {
            return cb(null, result);
          } else {
            return cb({code: "MISSING",message: "Missing config items: "+missingList.join()});
          }
        }
      }
    );
  }

};

module.exports = utilsService;
