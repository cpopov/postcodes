var rest = require('restler');

module.exports = function(appId){

    var geoCode = function(address,callback) {
        var retries = 0;
        var url = "https://maps.googleapis.com/maps/api/geocode/json";

        var query = {
            address:address,
            components:'country:GB',
            region : 'uk',
            key: appId
        };

        rest.get(url,{query:query})
            .on('complete', function(result) {
                retries++;
                if (result instanceof Error) {
                    if (retries<3) {
                        this.retry(5000);
                    } else {
                        return callback(new Error(result.message));
                    }
                } else {
                    if (result.status !== 'OK') {

                        if (result.status==='INVALID_REQUEST') {
                            return callback(new Error('Error in geocoding: Missing address information'));
                        } else if (result.status==='ZERO_RESULTS') {
                            return callback(new Error('Error in geocoding: The address was not found'));
                        } else {
                            return callback(new Error(`Error in geocoding: ${result.status}: ${result.error_message}`));
                        }
                    }

                    return callback(null,result.results[0].formatted_address);
                }
            });
    };

    return {
        getAddress : geoCode
    };
};
