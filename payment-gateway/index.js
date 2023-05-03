require('dotenv').config({path: './.env'});
const stripe = require('stripe')(process.env.STRIPE_SECRET_API_KEY);
const express = require('express');
const app = express();
const cors = require('cors');

//Firebase init
var admin = require("firebase-admin");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_FIREBASE)),
  databaseURL: 'https://vsounds-online-store.firebaseio.com'
});
const db = admin.firestore(); 
const ordersRef = db.collection('Orders');
const productsRef = db.collection('Products'); 

//Nodemailer init
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.VSOUNDS_EMAIL,
    pass: process.env.VSOUNDS_EMAIL_APP_PASSWORD
  }
});

//User cart
var cart = null;

//cors setup
var whitelist = [`${process.env.CLIENT_URL}`, 'https://stripe.com']
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
}));

app.use((req, res, next) => {
  if (req.originalUrl === '/stripewebhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next); 
  }
});

//Home
app.get('/',(req,res)=>{
  res.json('Service is live!');
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const sendOrderEmail = (data,customer) => {
  let items = cart.map((item)=>{
    return {name: item.name, price: item.price, quantity: item.quantity, image: item.imageurl_and_colors.img, link: item.link};
  });

  let shipping = null;
  if (customer.metadata.shipping === 'Free') { shipping = customer.metadata.shipping}
  else {shipping = `$${customer.metadata.shipping}`}

  let mailOptions = {
    from: process.env.VSOUNDS_EMAIL,
    to: data.customer_details.email,
    subject: `Vsounds - Order confirmed! - ${data.customer}`,
    html: `<div style="font-size: medium">
      <img src="https://www.dropbox.com/s/834nbjlt0asjk0w/logo.png?raw=1" height="80" width="150" alt="logo"/>
      <h1>Order Confirmed</h1>
      <p style="margin-bottom: 40px;">Hi, ${data.customer_details.name}. Thank you for shopping with us. Please find your order details below. You will reveive an email when your order is dispatched.</p>
      <p style="margin-bottom: 40px;">Feel free to <a style="color: #1DB954" href="mailto: apptests.tomno@gmail.com">contact us</a> asap, if you need to make changes to your order.</p>
      <p style="margin-bottom: 40px;">We ship all items as soon as they're ready, so there's a chance you may receive more than one shipment.</p>
      <p style="margin-bottom: 40px;">Remember to save this email until you've received everything in your order.</p>
      <div style="margin-bottom: 40px;"><strong>Order Reference: </strong><p style="color: #414141; font-size:14px;">${data.customer}</p></div>
      <br/>
      <p><strong>Shipping to:</strong></p>
      <p style="margin: 0; color: #414141; font-size:14px;">${data.customer_details.name}</p>
      <p style="margin: 0; color: #414141; font-size:14px;">${data.customer_details.address.line1 || data.customer_details.address.line2}</p>
      <p style="margin: 0; color: #414141; font-size:14px;">${data.customer_details.address.city}</p>
      <p style="margin: 0; color: #414141; font-size:14px;">${data.customer_details.address.postal_code}</p>
      <p style="margin: 0; color: #414141; font-size:14px;">${data.customer_details.address.country}</p>
      <p style="margin: 0; color: #414141;  font-size:14px;">${data.customer_details.phone}</p>
      <br/>
      <div class="order-details">
          <p><strong>Your order:</strong></p>
          <table cellpadding="2" border="0" width="100%" cellspacing="0">
              <thead>
                  <tr>
                      <th colspan="2" style="font-size: 14px; line-height:16px;padding:10px 0px 10px 5px; color: #414141" align="left">
                          Product
                      </th>
                      <th style="font-size: 14px; line-height:16px;padding:10px 0px 10px 5px; color: #414141" align="right">
                          Price
                      </th>
                      <th style="font-size: 14px; line-height:16px;padding:10px 0px 10px 5px; color: #414141" align="right">
                          Qty
                      </th>
                  </tr>
              </thead>
              <tbody>
                  ${items.map((item)=>{
                    return `<tr style="font-size: 14px;">
                      <td style="line-height:16px;color: #1DB954" valign="top">
                          <img src="${item.image}" alt="${item.name}' style="object-fit:cover" width="90px" height="90px"/>
                      </td>
                      <td style="line-height:16px;color: #1DB954" valign="top">
                          <a href="${process.env.CLIENT_URL}${item.link}" target="_blank" style="text-decoration:none">${item.name}</a>                                                                                                                                                                                                                 
                      </td>
                      <td style="line-height:16px;" valign="top" align="right">$${item.price}</td>
                      <td style="line-height:16px;" valign="top" align="right">${item.quantity}</td>
                    </tr>`
                  })}
              </tbody>
          </table>
          <p style="padding: 0 5px; color: #414141; font-size: 14px;">Sub Total: $${data.amount_subtotal/100}</p>
          <p style="padding: 0 5px; color: #414141; font-size: 14px;">Shipping: ${shipping}</p>
          <p style="padding: 0 5px; color: #414141; font-size: 14px; font-weight: bold"">Total: $${data.amount_total/100}</p>
      </div>
    </div>`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      return {error:error};
    } else {
    }
  }); 
};

const updateStock = async() => {
  const itemNames = cart.map((item)=>item.name);
  const itemNamesToQuantity = {};
  cart.forEach((item)=>{
    itemNamesToQuantity[item.name] = item.quantity;
  });
  try {
    const products = await productsRef.where('name','in',itemNames).get();
    let batch = db.batch();
    products.docs.forEach((product)=>{
      if (product.data().stock >= 1) {
        batch.update(product.ref,{
          stock:(parseInt(product.data().stock)-itemNamesToQuantity[product.data().name]).toString()});
      }
    });
    await batch.commit(); 
  } catch (error) {
    return {error:error};
  }
};

const createOrder = async(customer,data) => {
  const items = cart.map((item)=>{
    delete item.stock;
    return item;
  });

  try {
      await ordersRef.add({
      userId: customer.metadata.userId,
      customerId: data.customer,
      paymentIntentId: data.payment_intent,
      products: items,
      subtotal: data.amount_subtotal/100,
      total: data.amount_total/100,
      shipping: data.customer_details,
      shippingFee: (data.amount_total/100)-(data.amount_subtotal/100),
      deliveryStatus: 'pending',
      paymentMethod: `Stripe - ${data.payment_method_types[0]}`,
      paymentStatus: data.payment_status,
      timestamp: Date.now()
    });

  } catch (error) {
    return {error:error};
  }

};

//Paypal
/*
const paypal = require('paypal-rest-sdk');

//Paypal init
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.PAYPAL_CLIENT_ID,
  'client_secret': process.env.PAYPAL_CLIENT_SECRET
});
app.post('/paypal-checkout',(req,res)=>{
  const items = req.body.cart.map((item)=>{
    return {
      "name": `${item.name}`,
      "sku": "item",
      "price": `${item.price}`,
      "currency": "USD",
      "quantity": `${item.quantity}`
    }
  });
  let total = req.body.cart.reduce((total,current)=>total+parseInt(current.price),0);
  if (req.body.shipping !== 'Free') { total += req.body.shipping;}
  var create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": `${process.env.CLIENT_URL}/OrderComplete?success=true`,
        "cancel_url": `${process.env.CLIENT_URL}/Payment?canceled=true`
    },
    "transactions": [{
        "item_list": {
            "items": items
        },
        "amount": {
            "currency": "USD",
            "total": `${total}`
        },
        "description": "Payment for your order at Vsounds"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        res.status(500).json(error);
    } else {
        res.status(200).json(payment.links[1].href);
    }
});
});
*/


//Stripe
//Webhook
app.post('/stripewebhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let data;
  let eventType;
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  data = event.data.object;
  eventType = event.type;

  if (eventType === 'checkout.session.completed') {
    stripe.customers.retrieve(data.customer).then(
      (customer)=>{
        createOrder(customer,data).then(()=>sendOrderEmail(data,customer));
        updateStock();
      }
      ).catch((err)=>{return {error:err}});
  }

  // Return a 200 response to acknowledge receipt of the event
  response.status(200).json({received:true});
});

//Stripe checkout
app.post('/stripe-checkout', async (req, res) => {
    cart = req.body.cart;
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.userId,
        shipping: req.body.shipping
      }
    });

    const shippingOptions = [];
    if (req.body.shipping === 'Free') {shippingOptions.push({shipping_rate: 'shr_1MgmahCQeqZyNdeo4LiP92iH'})}
    if (req.body.shipping === '5') {shippingOptions.push({shipping_rate: 'shr_1MgmeZCQeqZyNdeo3Py6A8hn'})}
    if (req.body.shipping === '10') {shippingOptions.push({shipping_rate: 'shr_1MgmfFCQeqZyNdeofCUg7XQc'})}
    const params = {
        line_items: req.body.cart.map((item)=>{
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [item.imageurl_and_colors.img]
              },
              unit_amount: (item.price/item.quantity) * 100
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1
            },
            quantity: item.quantity
          }
        }),
        customer: customer.id,
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        phone_number_collection: {enabled: true},
        shipping_address_collection: {
          allowed_countries: ['US', 'KE', 'UG', 'TZ', 'RW', 'DE', 'FR', 'ET', 'EG', 'NG', 'CD', 'HR', 'CA', 'BE', 'AR', 'JP']
        },
        billing_address_collection: 'auto',
        shipping_options: shippingOptions,
        success_url: `${process.env.CLIENT_URL}/OrderComplete?success=true`,
        cancel_url: `${process.env.CLIENT_URL}/Payment?canceled=true`,
    };

  const session = await stripe.checkout.sessions.create(params);

  res.status(200).json(session);
});

app.listen(process.env.PORT, () => console.log(`PAYMENT GATEWAY LISTENING ON PORT ${process.env.PORT}`));