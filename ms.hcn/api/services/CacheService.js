// cache Service
/**
 * Created by mikkel in March 2017.
 */

var myCache = {};



var cacheService = {

	set: function(name,data) {
		if (!name)
			throw("Please supply a name to CacheService.set");
		if (!data)
			throw("Please supply data to CacheService.set('"+name+"')");

		myCache[name] = data;
	},

	get: function(name) {
		if (!name)
			throw("Please supply a name to CacheService.get");

		return myCache[name];
	}

};
module.exports = cacheService;
