/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
let mkdirp = require('mkdirp');
let logger = require('../api/services/LoggerService');
function announce(){
  console.log("STARTED SUCCESSFULLY\nMS.Document");
}

module.exports.bootstrap = function(cb) {
    let __dirname =process.cwd();
    let directoryName = __dirname+"/logs";
    mkdirp(directoryName, function(err) {
        if (err) {
            logger.error("Error creating folder for logs " + directoryName,null);

            return cb(err);
        }
// Potentially important change :)
        process.env.TZ = 'Australia/Melbourne';

        let api_key_name = 'ms.document_key';
        let s3_access_key_name = 's3_access_key';
        let s3_secret_access_key_name = 's3_secret_access_key';
        let s3_region_key_name = 's3_region';
        let s3_bucketName = 's3_bucketName';
        let s3APIKeys = [s3_access_key_name, s3_secret_access_key_name, s3_region_key_name, s3_bucketName];
        let isError = false;
        let error = new Error();
        error.code = 'CONFIGURATION';
        error.message = "Failed to get configuration settings";

        try {
            utilsService.getApiKey(api_key_name, function (err) {
                if (err)
                    return cb(err);
                else {
                    EnvironmentConfigurationSetting.find({configuration_name: s3APIKeys}).exec(
                        function (err, records) {
                            if (err) {
                                logger.error("error " , err);
                                isError = true;

                            } else if (records) {

                                if (records.length !== s3APIKeys.length) {
                                    isError = true;
                                } else {


                                    for (let i = 0; i < records.length; i++) {
                                        if (records[i].configuration_name.toString().trim().toLowerCase() === s3_access_key_name.trim().toLowerCase()) {
                                            sails.s3AccessKey = records[i].configuration_value;
                                        } else if (records[i].configuration_name.toString().trim().toLowerCase() === s3_secret_access_key_name.trim().toLowerCase()) {
                                            sails.s3SecretAccessKey = records[i].configuration_value;
                                        } else if (records[i].configuration_name.toString().trim().toLowerCase() === s3_region_key_name.trim().toLowerCase()) {
                                            sails.s3Region = records[i].configuration_value;
                                        }
                                        else if (records[i].configuration_name.toString().trim().toLowerCase() === s3_bucketName.trim().toLowerCase()) {
                                            sails.s3bucketName = records[i].configuration_value;
                                        }

                                    }
                                }


                            } else {
                                isError = true;
                            }

                            //return
                            if (isError) {
                                return cb(error);
                            }

                            announce();

                            return cb();
                        }
                    );
                }
            });
        } catch (e) {
            return cb(e);
        }
    });
};
