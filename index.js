const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())








async function run() {
    try {







     // payment gateway intent

        app.post('/create-payment-intent', async (req, res) => {
            const { price } = req.body;

            const amount = parseInt(price * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],


            });
            res.send({
                clientSecret: paymentIntent.client_secret
            })
        })


        // jwt token related api 

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res.send({token})
        })




    } finally {

    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Running successfully")
})
app.listen(port, () => {
    console.log(`Sitting on port ${port}`)
})