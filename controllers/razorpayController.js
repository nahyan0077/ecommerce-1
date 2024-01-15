const Razorpay = require('razorpay');

var instance = new Razorpay({
    key_id: process.env.RazorPay_key_id,
    key_secret: process.env.RazorPay_key_secret,
});

const createOrder = (req, res, orderid) => {
    try {
        const total = req.session.grandTotal;
        var options = {
            amount: total * 100,
            currency: "INR",
            receipt: orderid,
        };
        console.log("Request Options:", options);
        instance.orders.create(options, function (err, order) {

            if (err) {
                console.error("Razorpay Error:", err);
                res.status(500).send("Error in creating order");
                // res.json({ status: false, err: err, method: 'online' });
            } else {
                console.log("Order created successfully:", order);
                res.json({order:order,payMthd:"online"});
            }
        });
    } catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).send("Error in creating order");
    }
};

module.exports = {
    createOrder,
}