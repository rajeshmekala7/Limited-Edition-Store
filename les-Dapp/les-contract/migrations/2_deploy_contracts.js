var les = artifacts.require("LimitedEditionStore"); //Specify the contract to be deployed.
module.exports = function(deployer) {
  deployer.deploy(les);
};