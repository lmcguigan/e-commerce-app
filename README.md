# E-Commerce App

## About this app

This app is a mock e-commerce React Native / Expo application that loads product data via RTK Query and utilizes Redux for state management.

Users can view the full list of products and filter products via a search bar on the main Products list, with quick add buttons to add items to their cart. Clicking a product tile takes the user to a screen where they can view full product details, select their desired variations, and add the item to their cart. 

Users can adjust quantities and remove items from the cart page. Users must complete a form with simple data validation to checkout.

Support for data validation is provided by the `libphonenumber-js`, `states-us` and `card-validator` libraries. 

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Running the app

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```