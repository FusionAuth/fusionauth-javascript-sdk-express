const { jwtDecode } = require("jwt-decode");
const pako = require('pako');

const zlib = require('zlib');
const util = require('util'); // For promisify
const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

module.exports = {
    // Note: maxAge is in ms (from express-session)
    setSecure: function(res, name, value, maxAge=undefined) {
        const cookieProps = {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        };
        if (typeof(maxAge) !== 'undefined') {
            cookieProps['maxAge'] = maxAge;
        }
        
        res.cookie(name, value, cookieProps); // Set cookie
    },

    // Note: maxAge is in ms (from express-session)
    setSecureCompressed: function(res, name, value, maxAge=undefined) {
        const cookieProps = {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        };
        if (typeof(maxAge) !== 'undefined') {
            cookieProps['maxAge'] = maxAge;
        }
        
        encodedValue = this.getCompressedValue(value);
        console.log(`setSecureCompressed and encoded value for cookie: ${encodedValue}`);
        res.cookie(name, encodedValue, cookieProps); // Set cookie
    },

    setReadable: function(res, name, value, maxAge=undefined) {
        const cookieProps = {
            httpOnly: false,
            secure: true,
            sameSite: 'lax'
        };
        if (typeof(maxAge) !== 'undefined') {
            cookieProps['maxAge'] = maxAge;
        }
        res.cookie(name, value, cookieProps);
    },

    setReadableCompressed: function(res, name, value, maxAge=undefined) {
        const cookieProps = {
            httpOnly: false,
            secure: true,
            sameSite: 'lax'
        };
        if (typeof(maxAge) !== 'undefined') {
            cookieProps['maxAge'] = maxAge;
        }

        encodedValue = this.getCompressedValue(value);
        console.log(`setReadableCompressed and encoded value for cookie: ${encodedValue}`);
        res.cookie(name, encodedValue, cookieProps); // Set cookie
    },

    getCompressedValue: function(value) {
        try {
            const payload = jwtDecode(value.toString('utf8'));

            console.log(`Decoded payload: ${JSON.stringify(payload)}`);

            const payloadString = JSON.stringify(payload);

            const compressedPayload = pako.deflate(payloadString)

            const encodedCompressedPayload = Buffer.from(compressedPayload).toString('base64');

            return encodedCompressedPayload;
        } catch (error) {
            console.error('Error compressing:', error);
        }
    },

    getDecompressedValue: function(value) {
        try {
            if (!value) return null;

            const decodedCompressedPayload = Buffer.from(value, 'base64');  // decode value to buffer

            const decompressedPayload = pako.inflate(decodedCompressedPayload, { to: 'string' });

            console.log(`decompressedBuffer: ${decompressedPayload}`);
            return JSON.parse(decompressedPayload.toString('utf8')); // Parse the original value
        } catch (error) {
            console.error('Error decompressing cookie:', error);
            return null;
        }
    }

}
