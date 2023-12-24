const bcrypt = require("bcrypt");

const hashData = async (data, saltRound = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRound);
        return hashedData;
    } catch (err) {
        throw err;
    }
};


const verifyHashedData = async (unHashed, hashed) => {
    try {
        // console.log(unHashed,' unash ')
        // console.log(hashed,' hashed ')
        const match = await bcrypt.compare(unHashed, hashed);
        // const match = await bcrypt.compare(hashed, unHashed);
        console.log(match);
        return match;
    } catch (err) {
        throw err;
    }
};


module.exports = {
    hashData,
    verifyHashedData,
};