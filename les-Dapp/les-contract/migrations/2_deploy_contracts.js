// var les = artifacts.require("LimitedEditionStore"); //Specify the contract to be deployed.
// module.exports = function(deployer) {
//   deployer.deploy(les);
// };

var les = artifacts.require("LimitedEditionStore");
var erc = artifacts.require("ERC20MYN");

module.exports = async function(deployer) {
  await deployer.deploy(erc, "10000");
  const erc_contract = await erc.deployed();
  
  await deployer.deploy(les, erc_contract.address);

}