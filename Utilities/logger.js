const request = require('request');

exports.database = (message, applicationkey, supportkey) => {

    try {
        console.log('supportkey : ', supportkey)
        var options = {
            url: process.env.GM_API + 'device/addDbLog',
            method: 'POST',
            json: true,
            headers: {
                'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
                'applicationkey': applicationkey,
                'supportkey': process.env.SUPPORT_KEY
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            }
        };

        // request(options, (error, response, body) => {
        //     if (error) {
        //         console.log("addDblog Error : ", error);
        //     } else {
        //         console.log("addDblog Response : ", body);
        //     }
        // });
    } catch (error) {
        console.log("addDblog Exception : ", error);
    }
}


exports.info = async (message, applicationkey, deviceid, supportkey) => {

    try {
        var options = {
            url: process.env.GM_API + 'device/addAPILog',
            method: 'POST',
            headers: {
                'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
                'applicationkey': 'pd1zAtB3Bg9pRJp6',
                'supportkey': process.env.SUPPORT_KEY,
                'deviceid': deviceid
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            },
            json: true
        };

        // request(options, (error, response, body) => {
        //     if (error) {
        //         console.log("addAPILog Error : ", error);
        //     } else {
        //         console.log("addAPILog Response : ", body);
        //     }
        // });
    } catch (error) {
        console.log("addAPILog Exception : ", error);
    }
}

exports.error = async (message, applicationkey, supportkey) => {

    try {
        var options = {
            url: process.env.GM_API + 'device/addErrorLog',
            method: 'POST',
            headers: {
                'apikey': 'SLQphsR7FlH8K3jRFnv23Mayp8jlnp9R',
                'applicationkey': applicationkey,
                'supportkey': process.env.SUPPORT_KEY
            },
            body: {
                MESSAGE: message,
                APPLICATION_KEY: applicationkey
            },
            json: true
        };

        // request(options, (error, response, body) => {
        //     if (error) {
        //         console.log("addErrorLog Error : ", error);
        //     } else {
        //         console.log("addErrorLog Response : ", body);
        //     }
        // });
    } catch (error) {
        console.log("addErrorLog Exception : ", error);
    }
}
