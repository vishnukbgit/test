/**
 * Controller
 *
 * @description :: Server-side logic for managing birds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const _ = require('lodash');
const moment = require('moment');
const errorCodeService = require('../services/ErrorCodeService');
const utilsService = require('../services/utilsService');
const logger = require('../services/LoggerService');
/* jshint undef: false */

let HPCController = {

  upsertPractitioner(req, res) {
    try {

      HealthPractitionerCarer.create(req.body,function (error,returnValue) {
        if (error) {
          logger.error("Error creating practitioner: ",error);

return res.json(utilsService.makeErrQuery(error));
        }


        return res.json(returnValue);
      });
    } catch (error) {
      logger.error("Error: ", error);

return res.json(utilsService.makeErrException(error));
    }
  },

  upsertCareUnit(req, res) {
    try {

      CareUnit.findOne({name: req.body.name, suburb: req.body.suburb}).exec(function (error,cu) {
        if (error) {
          logger.error("Error checking if care unit ["+req.body.name+"] exists: ",error);

          return res.json(utilsService.makeErrQuery(error));
        }

        if (cu) {
          return res.json(utilsService.makeErrValidation("Care Unit already exists"));
        }

          CareUnit.create(req.body,function (error,returnValue) {
            if (error) {
              logger.error("Error creating care unit: ",error);

return res.json(utilsService.makeErrQuery(error));
            }


            return res.json(returnValue);
          });

      });
    } catch (error) {
      logger.error("Error: ", error);

return res.json(utilsService.makeErrException(error));
    }
  },

  getRefData(req, res) {
    try {

      let refdata = {
      	userTitles: [],
      	practitionerTypes: [],
      	careUnits: [],
        Practitioners: []
      };
	    let donecnt = 0;
	    let requestcnt = 0;
	    let failed = false;

	    requestcnt++;
      UserTitle.find({}).exec(function (error,values) {
        if (error && !failed) {
          logger.error("Error fetching user titles: ",error);
          failed = true;

          return res.json(utilsService.makeErrQuery(error));
        }

        _.each(values,(v) => {
        	if (v.id) {
	        	refdata.userTitles.push({id: v.id, value: v.description});
	        }
        });

		    requestcnt++;
	      HealthPractitionerType.find({}).exec(function (error,hpt) {
	        if (error && !failed) {
            logger.error("Error fetching user practitioner types: ",error);
	          failed = true;

	          return res.json(utilsService.makeErrQuery(error));
	        }

	        _.each(hpt,(v) => {
	        	if (v.id) {
		        	refdata.practitionerTypes.push({id: v.id, value: v.description});
	        	}
	        });

			    requestcnt++;
		      CareUnit.find({}).exec(function (error,hcu) {
		        if (error && !failed) {
              logger.error("Error fetching care units: ",error);
		          failed = true;

		          return res.json(utilsService.makeErrQuery(error));
		        }

		        _.each(hcu,(v) => {
		        	if (v.id) {
			        	refdata.careUnits.push({id: v.id, value: v.name});
			        }
		        });

            requestcnt++;
            HealthPractitionerCarer.find({}).exec(function (error,hpc) {
              if (error && !failed) {
                logger.error("Error fetching care units: ",error);
                failed = true;

                return res.json(utilsService.makeErrQuery(error));
              }

              _.each(hpc,(v) => {
                if (v.id) {
                  refdata.Practitioners.push({id: v.id, value: v.fullname});
                }
              });

              donecnt++;
              if (donecnt === requestcnt && !failed) {
                return res.json(refdata);
              }
            });
		        donecnt++;
		        if (donecnt === requestcnt && !failed) {
              return res.json(refdata);
            }
		      });

	        donecnt++;
	        if (donecnt === requestcnt && !failed) {
            return res.json(refdata);
          }
	      });

        donecnt++;
        if (donecnt === requestcnt && !failed) {
          return res.json(refdata);
        }
      });
    } catch (error) {
      logger.error("Error: ", error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  async Search(req, res) {
    let remove_these = ["createdAt", "updatedAt", "updated_by", "created_by", "effective_start_date", "effective_end_date", "hpc_id","ut_id","ut_code","ut_description","hpt_id","hpt_code","hpt_description","hpc_created_by","hpc_updated_by","htp_code"];
    try {
      let criteria = req.param("criteria") ? req.param("criteria") : "";

      let page = req.param("page");
      let count = req.param("count");
      let totalcount = 0;
      criteria = "%" + criteria.toLowerCase() + "%";
      let countQuery = `select count(*) from health_practitioner_carer as hpc 
where lower(hpc.family_name) like '${criteria}' or lower(hpc.firstname) 
like '${criteria}' or lower(hpc.classification) like '${criteria}' or lower(hpc.postcode) like '${criteria}'`;
      console.log("count query",countQuery);
      const dataStore = HealthPractitionerCarer.getDatastore();
      const response = await dataStore.sendNativeQuery(countQuery);
      totalcount = response.rows[0].count;
      console.log("total ",totalcount);

      let searchQuery = `select hpc.id as hpc_id,user_account_id,firstname,family_name,fullname,classification,effective_start_date,effective_end_date,primary_phone,emergency_phone,address_1,address_2,
       address_3, suburb, postcode, avatar_url, hpc.created_by as hpc_created_by, hpc.updated_by as hpc_updated_by, ut.id as ut_id, ut.code as ut_code, ut.description as ut_description, hpt.id as hpt_id, hpt.code as htp_code, hpt.description as hpt_description
       from health_practitioner_carer as hpc left join user_title as ut on hpc.title_id = ut.id left join health_practitioner_type as hpt on hpc.health_practitioner_type_id = hpt.id
      where lower(hpc.family_name) like '${criteria}' or lower(hpc.firstname) like '${criteria}' or lower(hpc.classification) like '${criteria}' or lower(hpc.postcode) like '${criteria}' order by hpc.firstname asc limit ${count} offset ${page};`
      // let practitionerSearchQuery = `select * from health_practitioner_carer as hpc
      // where lower(hpc.family_name) like '${criteria}' or lower(hpc.firstname) like '${criteria}' or lower(hpc.classification) like '${criteria}' or lower(hpc.postcode) like '${criteria}' order by hpc.firstname asc limit ${count} offset ${page};`

      const practitionerResponse = await dataStore.sendNativeQuery(searchQuery);
      console.log("search response ",practitionerResponse);
      let practitioners = practitionerResponse.rows;
      console.log("pracitioners ",practitioners);
      if(!practitioners.length) {
        res.json({totalcount, practitioners});
      } else {

        let requestcnt = 0;
        let donecnt = 0;
        _.each(practitioners, (p) => {
          p.id = p.hpc_id
          p.health_practitioner_type_id = p.hpt_id;
          p.health_practitioner_type = p.hpt_description;
          // if (p.health_practitioner_type_id.id) {
          //   p.health_practitioner_type = p.health_practitioner_type_id.description;
          //   let pid = p.health_practitioner_type_id.id;
          //   delete p.health_practitioner_type_id;
          //   p.health_practitioner_type_id = pid;
          // }
          p.title = p.ut_description
          p.title_id = p.ut_id
          // if (p.title_id.id) {
          //   p.title = p.title_id.description;
          //   let tid = p.title_id.id;
          //   delete p.title_id;
          //   p.title_id = tid;
          // }
          _.each(remove_these, (rm) => {
            delete p[rm];
          });
          p.care_units = [];

          requestcnt++;
          PractitionerCareUnit.find({practitioner_id: p.id}).populate('care_unit_id').sort('provider_number ASC').exec(function (error, careUnits) {
            if (error) {
              logger.error("Error", error);

              return res.json(utilsService.makeErrQuery(error));
            }


            _.each(careUnits, (cu) => {
              let cuName = '';
              if (cu.care_unit_id) {
                cuName = cu.care_unit_id.name;
              }
              p.care_units.push({
                id: cu.id,
                provider_number: cu.provider_number,
                name: cuName
              });
            });

            donecnt++;
            if (donecnt >= requestcnt) {
              res.json({totalcount, practitioners});
            }
          });
        });
      }

    } catch (error) {
      logger.error("Error: ", error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  rmPractitioner(req,res) {
    try {

      HealthPractitionerCarer.findOne({id: req.body.id}).exec(function (error,foundRecords) {
        if (error) {
          logger.error("Error finding practitioner: ",error);

          return res.json(utilsService.makeErrQuery(error));
        }
        if (!foundRecords) {
          return res.json(utilsService.makeErrValidation("Practitioner does not exist"));
        }
          HealthPractitionerCarer.destroy({id: req.body.id}).fetch().
            exec(function (error,deletedRecords) {
            if (error) {
              logger.error("Error deleting practitioner: ",error);

              return res.json(utilsService.makeErrQuery(error));
            }

            if (deletedRecords.length > 0) {
              UserAccount.destroy({id: deletedRecords[0].user_account_id}).
              exec(function (error,deletedUsers) {
                if (error) {
                  logger.error("Error deleting practitioner: ",error);

                  return res.json(utilsService.makeErrQuery(error));
                }

                return res.json({status: "deleted", deleted: deletedRecords});
              });
            } else {
              return res.json({status: "deleted", deleted: deletedRecords});
            }

          });


      });
    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },
  getCareUnitsForPractitionerId(req,res){
    let error =null;
    let response =null;
    if (!req.body.hasOwnProperty('pracId')) {
      logger.error("Missing required parameters",null);

      error = errorCodeService.missingParametersErrorCode();

      return res.send({error,response});
    }
    try {
      CareUnitPractitionerAssociation.find({practitioner_id:req.body.pracId}).exec(function (error, careUnitsArray) {
        response = careUnitsArray;

return res.send({error,response});
      }
      );
    } catch (e) {
      logger.error("Error",e);
      error= errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
  },
  getPatientDetailsFromCareUnitId(req,res){
    let error =null;
    let response =null;
    if (!req.body.hasOwnProperty('careUnitId')) {
      logger.error("Missing required parameters",null);
      error = errorCodeService.missingParametersErrorCode();

      return res.send({error,response});
    }
    try {
      CareUnitPatientAssociation.find({care_unit_id:req.body.careUnitId}).exec(function (error, careUnitsArray) {
          response = careUnitsArray;

          return res.send({error,response});
        }
      );
    } catch (e) {
      logger.error("Error",e);
      error = errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
  },
 getPractitionersFromCareUnitId (req,res) {
   let roleId2code = CacheService.get("roleId2code");
    let error =null;
    let response ={};
    response.practitioners=[];
   response.isGPCareUnit = false;
   response.isSpecialistCareUnit = false;
    try {
      if (!req.body.hasOwnProperty('careUnitId')) {
        logger.error("Missing required parameters",null);
        error = errorCodeService.missingParametersErrorCode();

        return res.send({error,response});
      }

      CareUnitPractitionerAssociation.find({care_unit_id: req.body.careUnitId}).
  populate('practitioner_id').
        populate('care_unit_id').
  exec(function (err, practitioners) {
    if (err) {
      logger.error("Error",err);
      error = errorCodeService.genericInternalErrorCode();

      return res.send(error,response);
    }
      _.each(practitioners,(prac) => {
        let newPrac = {};

        if (typeof prac.practitioner_id === 'object') {
          newPrac.id = prac.id;
          newPrac.practitioner_id = prac.practitioner_id.id;
          newPrac.firstname = prac.practitioner_id.firstname;
          newPrac.family_name = prac.practitioner_id.family_name;
          newPrac.fullname = prac.practitioner_id.fullname;
          newPrac.role_id = prac.practitioner_id.health_practitioner_type_id;
          newPrac.roleCode = roleId2code[newPrac.role_id];
          newPrac.classification = prac.practitioner_id.classification;
        }
        if (typeof prac.care_unit_id === 'object') {
          newPrac.care_unit_id = prac.care_unit_id.id;
          newPrac.suburb = prac.care_unit_id.suburb;
          newPrac.care_unit_name = prac.care_unit_id.name;
        }

        if (newPrac.roleCode && newPrac.roleCode.toString().toLowerCase().trim() !== 'nurse'.toString().toLowerCase().trim()) {
          response.practitioners.push(newPrac);
        }

      });

      if (response.practitioners.length>0) {
        if (response.practitioners[0].roleCode && response.practitioners[0].roleCode.toString().toLowerCase().trim() === 'gp'.toString().toLowerCase().trim()) {
          response.isGPCareUnit = true;
        }
        if (response.practitioners[0].roleCode && response.practitioners[0].roleCode.toString().toLowerCase().trim() === 'specialist'.toString().toLowerCase().trim()) {
          response.isSpecialistCareUnit = true;
        }

      }

      return res.send({error,response});

  });
    } catch (e) {
      logger.error("Error",e);
      error = errorCodeService.genericInternalErrorCode();

      return res.send({error,response});
    }
 },

  async SearchCareUnit(req, res) {
    let remove_these = ["createdAt", "updatedAt", "updated_by", "created_by", "effective_start_date", "effective_end_date"];
    try {
      let criteria = req.param("criteria") ? req.param("criteria") : "";

      let page = req.param("page");
      let count = req.param("count");
      let totalcount = 0;
      let roleId2name = CacheService.get("roleId2name");


      criteria = "%" + criteria.toLowerCase() + "%";
      console.log("criteria ",criteria);

      let countQuery = `select count(*)
                        from care_unit as cu
                        where lower(cu.name) like '${criteria}'
                           or lower(cu.address_1)
                          like '${criteria}'
                           or lower(cu.address_2) like '${criteria}'
                           or lower(cu.suburb) like '${criteria}'
                           or lower(cu.postcode) like '${criteria}'`;
      console.log("count query", countQuery);
      const dataStore = CareUnit.getDatastore();
      const response = await dataStore.sendNativeQuery(countQuery);
      totalcount = response.rows[0].count;
      console.log("total ", totalcount);

      let requestcnt = 0;
      let donecnt = 0;
      let searchQuery = `select *
                         from care_unit as cu
                         where lower(cu.name) like '${criteria}'
                            or lower(cu.address_1)
                           like '${criteria}'
                            or lower(cu.address_2) like '${criteria}'
                            or lower(cu.suburb) like '${criteria}'
                            or lower(cu.postcode) like '${criteria}'
                         order by cu.name asc limit ${count} offset ${page};`
      console.log("search query ",searchQuery);
      let careUnits = await dataStore.sendNativeQuery(searchQuery);
      console.log("care unit response ", careUnits);
      careUnits = careUnits.rows;
      if (!careUnits.length) {
        res.json({totalcount, careUnits})
      } else {
          _.each(careUnits, (cu) => {
            _.each(remove_these, (rm) => {
              delete cu[rm];
            });
            cu.practitioners = [];

            requestcnt++;
            CareUnitPractitioner.find({care_unit_id: cu.id}).populate('practitioner_id').sort('provider_number ASC').exec(function (error, practitioners) {
              if (error) {
                logger.error("Error", error);

                return res.json(utilsService.makeErrQuery(error));

              }


              _.each(practitioners, (cup) => {
                let newCup = {
                  id: cup.id,
                  provider_number: cup.provider_number,
                  role: 'Doctor',
                  avatar_url: '',
                  name: 'Doctor ?'
                };
                let pName = '';
                if (typeof cup.practitioner_id === 'object') {
                  newCup.name = cup.practitioner_id.fullname;
                  newCup.avatar_url = cup.practitioner_id.avatar_url;
                  newCup.role_id = cup.practitioner_id.health_practitioner_type_id;
                  newCup.role = roleId2name[newCup.role_id];
                }
                cu.practitioners.push(newCup);
              });

              donecnt++;
              if (donecnt >= requestcnt) {
                res.json({totalcount, careUnits});
              }
            });
          });
          // res.json({ totalcount: totalcount, careUnits: careUnits });
      }
    }catch (error) {
      logger.error("Error: ", error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  rmCareUnit(req,res) {
    try {

      CareUnit.findOne({id: req.body.id}).exec(function (err,foundRecords) {
        if (err) {
          logger.error("Error finding care unit: ",err);

          return res.json(utilsService.makeErrQuery(err));
        }
        if (!foundRecords) {
          logger.error("Care unit does not exist ",null);

          return res.json(utilsService.makeErrNotFound("Care unit does not exist"));
        }
          CareUnit.destroy({id: req.body.id}).exec(function (error,deletedRecords) {
            if (error) {
              logger.error("Error deleting care unit: ",error);

              return res.json(utilsService.makeErrQuery(error));
            }

            return res.json({status: "deleted", deleted: deletedRecords});
          });


      });
    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  addPractitioner2CareUnit(req,res) {
    try {

      CareUnit.findOne({id: req.body.care_unit_id}).exec(function (error,cu) {
        if (error) {
          logger.error("Exception finding care unit: "+req.body.care_unit_id,error);

          return res.json(utilsService.makeErrQuery(error));
        }
        if (!cu) {
          return res.json(utilsService.makeErrNotFound("Care unit "+req.body.care_unit_id+" does not exist "));
        }
          HealthPractitionerCarer.findOne({id: req.body.practitioner_id}).exec(function (error,p) {
            if (error) {
              logger.error("Error finding practitioner: ",error);

              return res.json(utilsService.makeErrQuery(error));
            }
            if (!p) {
              logger.error("Practitioner "+req.body.practitioner_id+" does not exist",null);

              return res.json(utilsService.makeErrNotFound("Practitioner "+req.body.practitioner_id+" does not exist"));
            }
              CareUnitPractitionerAssociation.findOne({
                  practitioner_id: req.body.practitioner_id,
                  care_unit_id: req.body.care_unit_id
}).
                exec(function (error,cupa) {
                if (error) {
                  logger.error("Error finding practitioner care unit association: ",error);

                  return res.json(utilsService.makeErrQuery(error));
                }
                if (cupa) {
                  logger.error("Practitioner care unit association already exists",null);

                  return res.json(utilsService.makeErrValidation("Practitioner care unit association already exists"));
                }
                  CareUnitPractitionerAssociation.create(req.body,function (error,newCUPA) {
                    if (error) {
                      logger.error("Error creating practitioner care unit association: ",error);

                      return res.json(utilsService.makeErrQuery(error));
                    }


                    return res.json(newCUPA);
                  });

              });

          });


      });
    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getPractitionerCareUnits(req,res) {
    try {

      let query = {};
      if (req.body.practitioner_id) {
        query = {practitioner_id: req.body.practitioner_id};
      }
      CareUnitPractitionerAssociation.find(query).
      populate('care_unit_id').
      exec(function (error,careUnits) {
        if (error) {
          logger.error("DB error finding care unit associations for practitioner: "+req.body.practitioner_id,error);

          return res.json(utilsService.makeErrQuery(error));
        }
        if (!careUnits) {
          logger.error("Care unit associations for practitioner "+req.body.practitioner_id+" not found ",null);

          return res.json(utilsService.makeErrNotFound("Care unit associations for practitioner "+req.body.practitioner_id+" not found "));
        }

          let response = {care_units: []};
          _.each(careUnits,(cu) => {
            if (typeof cu.care_unit_id === 'object') {
              response.care_units.push({
                id: cu.care_unit_id.id,
                value: cu.care_unit_id.name
              });
            }
          });

          return res.json(response);


      });
    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getGPs(req,res) {
    return HPCController.getPractitioners(req,res,'GP');
  },

  getSpecialists(req,res) {
    return HPCController.getPractitioners(req,res,'Specialist');
  },

  getNurses(req,res) {
    return HPCController.getPractitioners(req,res,'Nurse');
  },

  getPractitioners(req,res,type) {
    try {

      let pracs = {};
      HealthPractitionerType.findOne({code: type}).
      exec(function (error,practype) {
        if (error) {
          logger.error("DB Error finding care unit associations for practitioner: "+type,error);

          return res.json(utilsService.makeErrQuery(error));
        }
        HealthPractitionerCarer.find({health_practitioner_type_id: practype.id}).
        exec(function (error,practitioners) {
          if (error) {
            logger.error("DB Error finding practitioners: "+practype.id,error);

            return res.json(utilsService.makeErrQuery(error));
          }
          if (!practitioners) {
            logger.error("Practitioners for "+practype.id+" not found ",null);

            return res.json(utilsService.makeErrNotFound("Practitioners for "+practype.id+" not found "));
          }

            let pidlist = [];
            _.each(practitioners,(p) => {
              pidlist.push(p.id);
              pracs[p.id] = {fullname: p.fullname,firstname:p.firstname, family_name:p.family_name, classification: p.classification};
            });
            CareUnitPractitionerAssociation.find({practitioner_id: pidlist}).
            populate('care_unit_id').
            exec(function (error,cupaList) {
              if (error) {
                logger.error("Error finding care units: "+pidlist,error);

                return res.json(utilsService.makeErrQuery(error));
              }
              if (!cupaList) {
                logger.error("Care units for GPs not found ",null);

                return res.json(utilsService.makeErrNotFound("Care units for GPs not found "));
              }

                let response = [];
                _.each(cupaList,(cupa) => {
                  let prac = pracs[cupa.practitioner_id];
                  response.push({
                    id: cupa.id,
                    practitioner_id: cupa.practitioner_id,
                    care_unit_id: cupa.care_unit_id.id,
                    suburb: cupa.care_unit_id.suburb,
                    care_unit_name: cupa.care_unit_id.name,
                    fullname: prac.fullname,
                    firstname: prac.firstname,
                    family_name: prac.family_name,
                    classification: prac.classification
                  });
                });

                return res.json(response);

            });

        });
      });
    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getPractitionerPatients(req,res) {
    try {

      HCNService.getPractitionerPatients(req.body.practitioner_id,function (error,pidlist) {
        if (error) {
          logger.error("Error",error);

          return res.json(utilsService.makeErrQuery(error));
        }

        return res.json(pidlist);
      });

    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  PatientSearch(req,res) {
    try {

      HCNService.getPractitionerPatients(req.body.practitioner_id,function (error,pidlist) {
        if (error) {
          logger.error("Error",error);

          return res.json(utilsService.makeErrQuery(error));
        }
// At this point we have a list of patient id's to search
        else if(!pidlist.length){
          return res.json({totalcount:0, patients:[]});
        } else {

          let criteria = req.body.criteria
              ? req.body.criteria
              : "";

          let page = req.body.page;
          let count = req.body.count;
          let totalcount = 0;


          let allowedFormats = ["DD-MM-YYYY", "DD/MM/YYYY", "D-M-YYYY", "D/M/YYYY"];
          let sql;
          let sqlParams = [];
          if (moment(criteria, allowedFormats, true).isValid()) {
            sqlParams.push(moment(criteria, allowedFormats).format('YYYY-MM-DD'));
            sql = "select id from patient where id in (" + pidlist.join() + ") and ";
            sql += "date_of_birth = $1";
          } else {
            sqlParams.push("%" + criteria + "%");
            sql = "select id from patient where id in (" + pidlist.join() + ") and (";
            sql += " firstname ilike $1";
            sql += " OR family_name ilike $1";
            sql += " OR medicare_number like $1";
            sql += " OR address_postcode like $1";
            sql += ")";
          }

          console.log("sql ", sql);

          Patient.query(sql, sqlParams, function (err, patients) {

            if (!err) {
              totalcount = patients.rows.length;
              let pids = [];
              _.each(patients.rows, (row) => {
                pids.push(row.id);
              });
              Patient.find({where: {id: pids}, skip: page, limit: count}).exec(function (error, patients) {
                if (error) {
                  logger.error("Error", error);

                  return res.json(utilsService.makeErrQuery(error));
                }

                return res.json({totalcount, patients});
              });
            } else {
              return res.json(utilsService.makeErrException(err));
            }
          });
        }
      });

    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  DiseaseAssessmentUpdate(req,res) {
    try {

// Grab the gp_care_unit_id and specialist_care_unit_id
/**
 The patient is already associated with the logged in user
 If logged in user is a specialist,
   - associate the GP with the patient by adding a patient-practitioner link
 If logged in user is a GP,
   - associate the specialist with the patient

 practitioner_id tells us who we are

*/
      let r = req.body;
      let c = {};
      if (!r.practitioner_id || !r.patient_id) {
        logger.error("Missing practitioner_id or patient_id",null);

        return res.json(utilsService.makeErrParameter("Missing practitioner_id or patient_id"));
      }
      if (r.practitioner_id === r.gp_id) {
        c = {
          primary_practitioner_id: r.specialist_id,
          care_unit_id: r.specialist_care_unit_id
        };
        if (!c.primary_practitioner_id || !c.care_unit_id) {
          logger.error("Missing specialist_care_unit_id or specialist_id",null);

          return res.json(utilsService.makeErrParameter("Missing specialist_care_unit_id or specialist_id"));
        }
      } else {
        c = {
          primary_practitioner_id: r.gp_id,
          care_unit_id: r.gp_care_unit_id
        };
        if (!c.primary_practitioner_id || !c.care_unit_id) {
          logger.error("Missing gp_care_unit_id or gp_id",null);

          return res.json(utilsService.makeErrParameter("Missing gp_care_unit_id or gp_id"));
        }
      }
// Simply delete eny non-primary associations (in case this is a modification)
// When nurses get involved we will need to add a practitioner type to the association
// and may need some rules about how many of each type are allowed.
// For GP's and specialists this is probably just one
// For nurses it may be more.
      CareUnitPatientAssociation.
      destroy({primary_care_unit_flag: false, patient_id: r.patient_id.id}).
      exec(function (error,existingCupa) {
        if (error) {
          logger.error("Error removing old patient care unit assoc: ",error);

          return res.json(utilsService.makeErrQuery(error));
        }
        let newCupa = {
          primary_practitioner_id: c.primary_practitioner_id,
          care_unit_id: c.care_unit_id,
          primary_care_unit_flag: false,    // Assume the second association is not the primary!
          patient_id: r.patient_id.id || r.patient_id,
          created_by: 0
        };

        CareUnitPatientAssociation.create(newCupa).exec(function (error,cupa) {
          if (error) {
            logger.error("Error creating patient care unit assoc: ",error);

            return res.json(utilsService.makeErrQuery(error));
          }

          return res.json(cupa);
        });
      });
      // return res.json({"status": "I'm ok thanks"});
    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getHierarchy(req,res) {
    try {

      HCNService.getHierarchy(function(err,lot) {
        if (err) {
          logger.error("Error retrieving HCN hierarchy: ",err);

          return res.json(utilsService.makeErrQuery(err));
        }
//
// We just got a bunch of data, now munch it into a good format...
//
// Iterate over the data
        _.each(_.keys(lot.cu_prac),(cupid) => {
          let cu_prac = lot.cu_prac[cupid];
          let cu_id = cu_prac.care_unit_id;
          let cu = lot.cu[cu_id];
// Add the practitioners to the care units
          let prac_id = cu_prac.practitioner_id;
          let prac = lot.prac[prac_id];
          if (!cu.practitioners) {
            cu.practitioners = [];
          }
          cu.practitioners.push({
            id: prac.id,
            name: prac.name
          });
// Add the care units to the practitioners
          if (!prac.care_units) {
            prac.care_units = [];
          }
          prac.care_units.push({
            id: cu.id,
            name: cu.name
          });
        });
// Iterate again...
        _.each(_.keys(lot.cu_pat),(cupid) => {
          let cu_pat = lot.cu_pat[cupid];
          let cu_id = cu_pat.care_unit_id;
          let cu = lot.cu[cu_id];
// Get the patients
          let pat_id = cu_pat.patient_id;
          let pat = lot.pat[pat_id];
          if (!cu.patients) {
            cu.patients = [];
          }
          cu.patients.push({
            id: pat.id,
            name: pat.name
          });

          let prac_id = cu_pat.primary_practitioner_id;
          let prac = lot.prac[prac_id];
// Get the patients
          if (!prac.patients) {
            prac.patients = [];
          }
          prac.patients.push({
            id: pat.id,
            name: pat.name
          });

        });

//
// Now we have the data where we want it
//
// 1) Report by Doctors => Care Units => Patients
//
        let rpt = {};
        if (req.body.report === 'practitioner' || !req.body.report) {
          rpt = {
            name: "Doctors => Care Units => Patients",
            children: []
          };

          _.each(_.keys(lot.prac),(pracid) => {
            let dr = lot.prac[pracid];
            let dr_pkt = {
              // id: pracid,
              name: dr.name,
              children: []
            };
            _.each(dr.care_units,(cu) => {
              let cu_pkt = {
                // id: cu.id,
                name: cu.name,
                children: []
              };
              //---- Get the patients for the care unit
              let thecu = lot.cu[cu.id];
              _.each(thecu.patients,(pat) => {
                let pat_pkt = {
                  // id: pat.id,
                  name: pat.name,
                  children: []
                };
                cu_pkt.children.push(pat_pkt);
              });
              //--------------------
              dr_pkt.children.push(cu_pkt);
            });
            rpt.children.push(dr_pkt);
          });

        }
        if (req.body.report === 'care unit') {
          rpt = {
            name: "Care Units => Doctors => Patients",
            children: []
          };

          _.each(_.keys(lot.cu),(cuid) => {
            let cu = lot.cu[cuid];
            let cu_pkt = {
              // id: cuid,
              name: cu.name,
              children: []
            };
            _.each(cu.practitioners,(dr) => {
              let dr_pkt = {
                // id: dr.id,
                name: dr.name,
                children: []
              };
              //---- Get the patients for the care unit
              let thedr = lot.prac[dr.id];
              _.each(thedr.patients,(pat) => {
                let pat_pkt = {
                  // id: pat.id,
                  name: pat.name,
                  children: []
                };
                dr_pkt.children.push(pat_pkt);
              });
              //--------------------
              cu_pkt.children.push(dr_pkt);
            });
            rpt.children.push(cu_pkt);
          });

        }

return res.json(rpt);
      });

    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  version(req, res) {
    try {

      return res.json({version: utilsService.version()});

    } catch (error) {
      logger.error("Error: ", error);

      return res.json(utilsService.makeErrQuery(error));
    }
  },

  getMyPatients(req,res) {
    try {

      HCNService.getMyPatients(req.body,function (error,patientlist) {
        if (error) {
          logger.error("Error",error);

return res.json(utilsService.makeErrQuery(error));
        }

return res.json(patientlist);
      });

    } catch (error) {
      logger.error("Error",error);

return res.json(utilsService.makeErrException(error));
    }
  },
  getMyDirectPatients(req,res) {
    try {
      let userId = req.body.userId;
      HCNService.getMyDirectPatients(userId,function (error,patientlist) {
        if (error) {
          logger.error("Error",error);

          return res.json(utilsService.makeErrQuery(error));
        }

        return res.json(patientlist);
      });

    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getPatientRecipients(req,res) {
    try {

      HCNService.getPatientRecipients(req.body,function (error,practitioners) {
        if (error) {
          logger.error("Error",error);

return res.json(utilsService.makeErrQuery(error));
        }

return res.json(practitioners);
      });

    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getPatientSpecialists(req,res) {
    try {

      let query = {
        patient_id: req.body.patient_id,
        role: ['Specialist', 'Patient', 'General Practitioner']
      };
      HCNService.getPatientSpecialists(query,function (error,practitioners) {
        if (error) {
          logger.error("Error",error);

          return res.json(utilsService.makeErrQuery(error));
        }

        return res.json(practitioners);
      });

    } catch (error) {
      logger.error("Error",error);

      return res.json(utilsService.makeErrException(error));
    }
  },

  getPatientSpecialistsNurses(req,res) {
    try {

      let query = {
        patient_id: req.body.patient_id,
        role: ['Specialist', 'Nurse', 'General Practitioner']
      };
      HCNService.getPatientSpecialists(query,function (error,practitioners) {
        if (error) {
          logger.error("Error",error);

          return res.json(utilsService.makeErrQuery(error));
        }

return res.json(practitioners);
      });

    } catch (error) {
      logger.error("Error",error);

return res.json(utilsService.makeErrException(error));
    }
  }

};

module.exports = HPCController;
