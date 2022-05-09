# Limited Edition Store

## Issue addressed

Limited edition products are uniquely branded items that are created in small quantities and only sold for a certain time period in the market. People buy these to highlight their own individuality and social status by owning an exclusive item. There are numerous companies around the world who sell these items like Bugatti, Rolex, etc. However, there is no track of who owns these limited edition items. This decentralized application assists companies in selling their limited edition items to consumers and also helps to keep track of the proud owners of these items for the benefit of companies and future generations.

## Abstract

This project's goal is to enable consumers to purchase limited edition products using a token. We are going to take the product details like product name, cost of the product, and the number of items manufactured from the companies that are registered on the application. Users can buy these limited edition items and the tokens will be credited to the company as per the cost. As the limited edition items are rare and product manufacturing ceases after a certain time. This application can be used to keep track of those owners for both companies and future generations.

## Instructions to deploy, test, and interact:

1. Open Ganache, and click “quick start”. Copy the mnemonic. <br>
2. 2. In the browser, open metamask and click on “ import using Secret Recovery Phrase”. Use the mnemonic and set the new password, and add the accounts.<br>
3. Now in the “les-Dapp/les-contract” folder, use the command prompt and enter “truffle compile”. <br>
4. After compiling without any errors, now enter “truffle migrate –reset”. (use sudo if needed). <br>
5. Copy the contract address and paste it into the App.address property in the les-Dapp/les-app/src/js/app.js file. <br>
6. In the “les-Dapp/les-app/” folder, enter “npm install” to download node modules. <br>
7. Now in the “les-Dapp/les-app” folder, enter “npm start”. <br>
8. The server will start on port 3000. You should be able to access it in the browser using localhost:3000
