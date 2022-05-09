//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

interface IERC20 {
   
    function totalSupply() external view returns (uint256);

    function balanceOf(address tokenOwner) external view returns (uint256);

    function transfer(address receiver, uint numTokens) external returns (bool);
   
    function approve(address owner, address spender, uint numTokens) external returns (bool);  

    function allowance(address owner, address spender) external view returns (uint256);

    function transferFrom(address user, address company, uint numTokens) external returns (bool);

}

contract LimitedEditionStore {

    //to store the address of the admin
    address admin;

    //to store ERC20 contract address
    address ERC20contract_Address;

    address contract_addr;

    //product struct to store the details of products
    struct Product {
        uint productId;
        bytes32 productName;
        uint noOfUnitsManufactured;
        uint availableUnits;
        uint price;
        uint companyId;
    }

    //company struct to store the details of company
    struct Company {
        uint companyId;
        bytes32 companyName;
        bool isActive;
        address payable companyAddress;
    }

    uint productId = 0;
    uint companyId = 0;

    //Array of Product structure to store all products details
    Product[] products;

    //Array of Company structure to store all companies details
    Company[] companies;
    
    //To get details of company by address and  unregister company by address
    mapping(address => Company) addressToCompanyMap;
    
    //mapping product to owners using a map from productID to address[] array
    mapping(uint => address[]) owners;

    constructor(address ERC20_address) {
        admin = msg.sender;
        contract_addr = address(this);
        ERC20contract_Address = ERC20_address;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier onlyCompanies() {
        require(addressToCompanyMap[msg.sender].isActive== true);
        _;
    }

    // function setContractAddr(address ERC20_address) public payable {
    //    ERC20contract_Address = ERC20_address;
    // }

    function sendTokens(address payable address1) payable public onlyAdmin{
        IERC20(ERC20contract_Address).transfer(address1, 100);
    }

    function getBalance(address user) view public returns (uint){
        return IERC20(ERC20contract_Address).balanceOf(user);
    }

    function registerCompany(bytes32 companyName, address payable companyAddress) public onlyAdmin {
        Company memory com;
        com.companyId = companyId;
        com.companyName = companyName;
        com.isActive = true;
        com.companyAddress = companyAddress;
        addressToCompanyMap[companyAddress] = com;
        companies.push(com);
        IERC20(ERC20contract_Address).transfer(companyAddress, 100);
        companyId++;
    }

    function unRegisterCompany(address payable companyAddress) public onlyAdmin {
        require(addressToCompanyMap[companyAddress].isActive!=false); 
        addressToCompanyMap[companyAddress].isActive = false;
    }

    function addProduct(bytes32 productName, uint noOfUnitsManufactured, uint price) public onlyCompanies {
        products.push(Product(productId, productName, noOfUnitsManufactured, noOfUnitsManufactured, price, addressToCompanyMap[msg.sender].companyId));
        productId++;
    }

    function approve(uint price) public {
        IERC20(ERC20contract_Address).approve(msg.sender , contract_addr, price);
    }

    function buyProduct(uint productId1) public payable {
        //require(msg.value == products[productId1].price );
        require(products[productId1].availableUnits > 0);
        products[productId1].availableUnits--;
        //add product to user
        owners[productId1].push(msg.sender);
        //transfer money to company
        IERC20(ERC20contract_Address).transferFrom(msg.sender,companies[products[productId1].companyId].companyAddress, products[productId1].price);
        //companies[products[productId1].companyId].companyAddress.transfer(msg.value);
    }

    function getOwners(uint productId2) view public returns(address[] memory) {
        return owners[productId2];
    }
    
    function getProducts() view public returns(Product[] memory) {
        return products;    
    }

}