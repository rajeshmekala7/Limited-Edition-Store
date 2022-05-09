var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'Use your MNEMONIC';
module.exports = {
  networks: {
     development: {
      host: "localhost",     
      port: 7545,            
      network_id: "5777",       
     },
     ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/useyourapikey")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  compilers: {
    solc: {
      version: "0.8.11"
    }
  }
};
// afe7852abe50439fbba5a07e5ea8870c