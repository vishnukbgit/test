// HCN Service
/**
 * Created by mikkel in April 2017.
 */

const _ = require('lodash');

const utilsService = require('../services/utilsService');
const errorCodeService = require('../services/ErrorCodeService');

const SPECIALIST_CODE ='specialist';
const GP_CODE ='gp';
const NURSE_CODE ='nurse';
const logger = require('./LoggerService');

let HCNService = {

  getPractitionerPatients(pid,cb) {
    try {


      HealthPractitionerCarer.findOne({id: pid}).
        populate('health_practitioner_type_id').
      exec(function (err,prac) {
        if (err) {
          logger.error("Exception finding practitioner: "+pid,err);

          return cb(utilsService.makeErrQuery(err.message));
        }
        if (!prac) {
          return cb(utilsService.makeErrNotFound("Practitioner "+pid+" not found"));
        }
        let isSpecialistGp = false;
        let practitionerCode = prac.health_practitioner_type_id.code;
        if (practitionerCode.toString().trim().
          toLowerCase() === SPECIALIST_CODE.trim().
          toLowerCase() ||
          practitionerCode.toString().trim().
          toLowerCase() === GP_CODE.trim().
          toLowerCase()) {
          isSpecialistGp = true;
        }
        CareUnitPractitionerAssociation.find({practitioner_id: pid}).
        populate('care_unit_id').
        exec(function (err,careUnits) {
          if (err) {
            logger.error("Exception finding care unit associations for practitioner: "+pid,err);

            return cb(utilsService.makeErrQuery(err));
          }
          if (!careUnits) {
            return cb(utilsService.makeErrNotFound("Care unit associations for practitioner "+pid+" not found"));
          }

            let cuList = [];
            _.each(careUnits,(cu) => {
              cuList.push(cu.care_unit_id.id);
            });
  //
  // Now go and get the care-unit-patient associations for the list of care unit ids
  //
            let criteria = {care_unit_id: cuList};
            if (isSpecialistGp) {
              criteria.primary_practitioner_id = pid;
            }
            CareUnitPatientAssociation.find(criteria).
              populate('patient_id').
              exec(function (err,cupaList) {

              if (err) {
                logger.error("Exception finding care unit associations for care unit: "+JSON.stringify(cuList),err);

                return cb(utilsService.makeErrQuery(err));
              }
              if (!cupaList) {
                return cb(utilsService.makeErrNotFound("Care unit associations for care unit "+JSON.stringify(cuList)+" not found "));
              }
                let response = [];
                let copyThese = ["id","firstname","family_name","address_suburb","medicare_number","date_of_birth","address_postcode"];

                _.each(cupaList,(cupa) => {
                  if (typeof cupa.patient_id === 'object') {
                    response.push(cupa.patient_id.id);
                  }
                });

return cb(null,response);

            });

        });
      });
    } catch (err) {

      logger.error("Error",err);

      return cb(utilsService.makeErrException(err));
    }
  },

  getHierarchy(cb) {
    try {

//
// Start out by caching the lot
//
      let donecnt = 0;
      let requestcnt = 0;
      let failed = false;
      let entities = [
        {
key: "prac", name: "practitioner",
          table: HealthPractitionerCarer,
          select:['id', 'fullname', 'classification']
},
        {
key: "cu", name: "care unit",
          table: CareUnit,
          select: ['id', 'name']
},
        {
key: "pat", name: "patient",
          table: Patient,
          select: ['id', 'firstname', 'family_name']
},
        {
key: "cu_prac", name: "cu_practitioner",
          table: CareUnitPractitionerAssociation,
          select:['id', 'practitioner_id', 'care_unit_id']
},
        {
key: "cu_pat", name: "cu_patient",
          table: CareUnitPatientAssociation,
          select:['id', 'patient_id', 'care_unit_id','primary_practitioner_id']
}
      ];
      let lot = {};
      _.each(entities,(e) => {
        lot[e.key] = {};
        requestcnt++;
        e.table.find({where: {}, select: e.select}).
          exec(function (err,data) {
          if (err && !failed) {
            logger.error("Error fetching "+e.name+": ",err);
            failed = true;

            return cb(utilsService.makeErrQuery(err));
          }
          _.each(data,(d) => {
            d.name = _.truncate(d.name,{length:30, separator: /,?\.* +/});
            if (e.key === "pat") {
              d.name = d.firstname+" "+d.family_name;
              delete d.firstname;
              delete d.family_name;
            }
            if (e.key === "prac") {
              d.name = d.fullname+" ("+d.classification+")";
              delete d.fullname;
              delete d.classification;
            }
            lot[e.key][d.id] = d;
          });

          donecnt++;
          if (donecnt === requestcnt && !failed)  {
            return cb(null,lot);
          }
        });
      });

    } catch (err) {
      logger.error("Error",err);

return cb(utilsService.makeErrException(err));
    }
  },

  getMyPatients(params,cb) {
    try {

      AllMyPatients.find({user_account_id: params.user_account_id}).
      exec(function (err,patients) {
        if (err) {
          logger.error("Exception finding my patients for user account: "+params.user_account_id,err);

          return cb(utilsService.makeErrQuery(err));
        }


        return cb(null,patients);
      });
    } catch (err) {
      logger.error("Error",err);

      return cb(utilsService.makeErrException(err));
    }
  },
  getMyDirectPatients(userId,cb) {
    try {

      AllMyDirectPatients.find({user_account_id: userId}).
      exec(function (err,patients) {
        if (err) {
          logger.error("Exception finding my patients for user account: "+userId,err);

          return cb(utilsService.makeErrQuery(err));
        }


        return cb(null,patients);
      });
    } catch (err) {
      logger.error("Error",err);

      return cb(utilsService.makeErrException(err));
    }
  },

  getPatientRecipients(params,cb) {
    try {

      HealthPractitionerCarer.findOne({id: params.practitioner_id}).
      exec(function (err,prac) {
        if (err) {
          logger.error("Exception finding practitioner: "+params.practitioner_id,err);

          return cb(utilsService.makeErrQuery(err.message));
        }
        if (params.practitioner_id && !prac) {
          return cb(utilsService.makeErrNotFound("Practitioner "+params.practitioner_id+" not found"));
        }
        let query = {
          patient_id: params.patient_id,
          practitioner_id: {not: params.practitioner_id}
        };
        if (!params.practitioner_id) {    // Is it a patient asking?
          query = {
            patient_id: params.patient_id,
            role: "Nurse"
          };
        }
        PatientPractitioners.find(query).
        exec(function (err,practitioners) {
          if (err) {
            logger.error("Exception finding my practitioners for patient: "+params.patient_id,err);

            return cb(utilsService.makeErrQuery(err));
          }


          return cb(null,practitioners);
        });
      });
    } catch (err) {
      logger.error("Error",err);

      return cb(utilsService.makeErrException(err));
    }
  },

  getPatientSpecialists(params,cb) {
    try {

      PatientPractitioners.find({where: {...params}}).
      exec(function (err,practitioners) {
        if (err) {
          logger.error("Exception finding my practitioners for patient: "+params.patient_id,err);

          return cb(utilsService.makeErrQuery(err));
        }

        let uids = [];
        _.each(practitioners,(prac) => {
          if (prac.user_account_id) {
            uids.push(prac.user_account_id);
          }
        });
        UserAccount.find({id: uids}).
        exec(function (err,users) {
          if (err) {
            logger.error("Exception finding user accounts  "+uids.join(),err);

            return cb(utilsService.makeErrQuery(err));
          }
          let emails = {};
          _.each(users,(u) => {
            emails[u.id] = u.email;
          });
          _.each(practitioners,(prac) => {
            if (prac.user_account_id)  {
              prac.email = emails[prac.user_account_id];
            }
          });

return cb(null,practitioners);
        });
      });
    } catch (err) {
      logger.error("Error",err);

return cb(utilsService.makeErrException(err));
    }
  }


};
module.exports = HCNService;

