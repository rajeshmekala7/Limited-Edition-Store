//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract LimitedEditionStore {
    
    //to store the address of the admin
    address admin;

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

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    modifier onlyCompanies() {
        require(addressToCompanyMap[msg.sender].isActive== true);
        _;
    }

    function registerCompany(bytes32 companyName, address payable companyAddress) public onlyAdmin {
        Company memory com;
        com.companyId = companyId;
        com.companyName = companyName;
        com.isActive = true;
        com.companyAddress = companyAddress;
        addressToCompanyMap[companyAddress] = com;
        companies.push(com);
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

    function buyProduct(uint productId1) public payable {
        require(msg.value == (products[productId1].price * 10 ** 18) );
        require(products[productId1].availableUnits > 0);
        products[productId1].availableUnits--;
        // add product to user
        owners[productId1].push(msg.sender);
        // transfer money to company
        companies[products[productId1].companyId].companyAddress.transfer(msg.value);
    }

    function getOwners(uint productId2) view public returns(address[] memory) {
        return owners[productId2];
    }
    
    function getProducts() view public returns(Product[] memory) {
        return products;    
    }

}