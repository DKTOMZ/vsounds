# vsounds-client
An ecommerce app for selling guitars and accessories built using react,nodejs and firebase.
- Link to application: https://vsounds.onrender.com

# Functionality
This is the client (front-end) of the application and consists of a simple but smooth web UI that provides:
- Authentication (Login, Signup, SIgnin, Profile view and editing)
- Displays all products fetched from firebase database in different categories
- Cart functionality which is stored on the device browser storage. The cart is limited to 9 items.
- Selecting shipping options during checkout
- Checkout functionality which currently makes use of stripe (paypal code also works but not in use currently). This is 
handled by some backend code on a different server which handles the entire ordering process from start to completion.

# Flow
- Auth(Login,Signup)
  - -> Browse products 
    - -> Add products to cart 
      - -> (Redirect to auth if not authenticated) 
        - -> View cart 
          - -> Checkout 
            - -> Make checkout api request to vsounds backend 
              - -> Response from backend redirects to stripe for checkout
                - -> Redirect to success page after checkout
