# vsounds-backend
This is the server code for my web application project vsounds client which is an ecommerce platform for selling musical (guitar) instruments.

# Functionality
This code provides functionality to the client application through various endpoints. These functionalities include:
- Stripe checkout via stripe api
- Paypal checkout code is working but currently not in use by the application
- Order creation in the database
- Stock update of ordered items after order creation
- Sending of order confirmation email after checkout, order creation and stock update

# Flow
- (Receives request from vsounds client) 
->  Creates checkout params from request body 
--> Makes request to stripe endpoint and returns the response (stripe url for checkout) to vsounds client
---> Stripe webhook listens to checkout event completion
----> Creates an order in firebase database
-----> Updates stock of each item ordered
------> Sends order confirmation email to buyer
