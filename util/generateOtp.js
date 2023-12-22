function generateOTP() {
    // Implement your OTP generation logic here
    // For example, you can use a random number generator
    return Math.floor(1000 + Math.random() * 9000).toString();
}

module.exports={generateOTP}