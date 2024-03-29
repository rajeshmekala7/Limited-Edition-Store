App = {
  web3: null,
  contracts: {},
  // address:'0x085475DDBDBDA7Bdf336Ae2a0Cdf2bADD78355C4', - ropsten working using remix
  // address: '0xBE84d21295ba6996788a56F014b91dfd7410239D', // ropsten using truffle
  address:'0x891352683B414EE66c515E9B4386f2d92Df21601', // ropsten using truffle new
  handler:null,
  selectedProduct:-1,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {         
    if (typeof web3 !== 'undefined') {
      App.web3 = new Web3(Web3.givenProvider);
    } else {
      App.web3 = new Web3(App.url);
    }
    ethereum.enable(); 
    return App.initContract();  
  },

  initContract: function() { 
    App.contracts.Les = new App.web3.eth.Contract(App.abi,App.address, {});
    App.populateAddress();
    App.getProducts();
    App.getBalance();    
    return App.bindEvents();
  },

  bindEvents: function() {  
    $(document).on('click', '#b1', function() {
      App.getProducts();
    });

    $(document).on('click', '#getOwners', function() {
      App.getOwners();
    });

    $(document).on('click', '#reg', function() {
      App.registerCompany();
    });

    $(document).on('click', '#ureg', function() {
      App.unregisterCompany();
    });

    $(document).on('click', '#sendtoken', function() {
      App.sendTokens();
    });

    $(document).on('click', '#ap', function() {
      App.addProduct();
    });

  },

  getOwners: function() {
    // App.populateAddress().then(r => App.handler = r[0]);
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      var pid = $('#pId').val();
      $('#owners').empty();
      $('#omsg').empty();
      App.contracts.Les.methods.getOwners(pid).call().then(r=> {
        // jQuery('#owners').append(`Owners of productId : ${pid}`);
        jQuery.each(r, function(i) {
          const n = r[i];
          console.log(n);
          jQuery('#owners').append(`<li class="list-group-item">${n}</li>`);
          // jQuery('#owners').append(`<tr><td>${n}</td></tr>`);
        })
      });
    });
    // const str= App.web3.utils.hexToAscii('0x7361690000000000000000000000000000000000000000000000000000000000');
    // web3.toAscii("");
    // const abc = App.web3.utils.asciiToHex('sai')
    // console.log(str); // "ethereum"
    // alert(App.web3.utils.hexToAscii(App.web3.utils.asciiToHex('sai')));
  },

  populateAddress : async function() {
    // App.handler = App.web3.givenProvider.selectedAddress;
    return await ethereum.request({method : 'eth_requestAccounts'});
  },

  buyProduct : function(productId, price) {
    // alert(productId);
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      console.log(App.handler)
      // value : App.web3.utils.toWei(price,"ether")
      App.contracts.Les.methods.buyProduct(productId).send({from:App.handler})
      .on('receipt',(receipt)=>{
        if(receipt.status) {
          $('#msg').empty();
          jQuery('#msg').append(`Product bought successfully...!!!`);
          document.getElementById('mb').click();
      }})
      .on('error',(err)=>{
        $('#msg').empty();
          jQuery('#msg').append(`Product buy failed...!!!`);
          document.getElementById('mb').click()}
    )});
  },

  approve : function(price) {
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      console.log(App.handler)
      App.contracts.Les.methods.approve(price).send({from:App.handler})
      .on('receipt',(receipt)=>{
        if(receipt.status) {
          $('#msg').empty();
          jQuery('#msg').append(`Approval successful...!!!`);
          document.getElementById('mb').click();
      }})
      .on('error',(err)=>{
        $('#msg').empty();
          jQuery('#msg').append(`Approval failed...!!!`);
          document.getElementById('mb').click()}
    )});  
  },
  
  addProduct : function() {
    // App.populateAddress().then(r => App.handler = r[0]);
    // alert('add product called');
    // alert(App.handler);
    // App.populateAddress().then(r => App.handler = r[0]).then(()=> {});
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      var productName = $('#pname').val();
      var totalUnits = $('#pn').val();
      var price = $('#pp').val();
      if(productName==='') {
        $('#msg').empty();
        jQuery('#msg').append(`Enter valid name...!!!`);
        document.getElementById('mb').click();
        return;
      }
      if(!totalUnits) {
        $('#msg').empty();
        jQuery('#msg').append(`Enter valid units...!!!`);
        document.getElementById('mb').click();
        return;
      }
      if(!price) {
        $('#msg').empty();
        jQuery('#msg').append(`Enter valid price...!!!`);
        document.getElementById('mb').click();
        return;
      }
      const nameInHex = App.web3.utils.asciiToHex(productName);
      // alert(nameInHex);
      App.contracts.Les.methods.addProduct(nameInHex, totalUnits, price).send({from:App.handler})
      .on('receipt',(receipt)=>{
        if(receipt.status) {
          $('#msg').empty();
          jQuery('#msg').append(`Product added...!!!`);
          document.getElementById('mb').click();
      }})
      .on('error',(err)=>{
        $('#msg').empty();
          jQuery('#msg').append(`Product addition failed...!!!`);
          document.getElementById('mb').click();
      })
    });
  },

  registerCompany : function() {
    // App.populateAddress().then(r => App.handler = r[0]);
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      var ad = $('#companyAddress1').val();
      var name = $('#companyName1').val();
      if(name === '') {
        $('#msg').empty();
        jQuery('#msg').append(`Enter valid company name...!!!`);
        document.getElementById('mb').click();
        return;
      }
      if(ad === '') {
        $('#msg').empty();
        jQuery('#msg').append(`Enter valid address...!!!`);
        document.getElementById('mb').click();
        return;
      }
      
      const nameInHex = App.web3.utils.asciiToHex(name);
      App.contracts.Les.methods.registerCompany(nameInHex, ad).send({from:App.handler})
      .on('receipt',(receipt)=>{
        if(receipt.status){
          $('#msg').empty();
          jQuery('#msg').append(`Registration successful...!!!`);
          document.getElementById('mb').click();
      }})
      .on('error',(err)=>{
        $('#msg').empty();
        jQuery('#msg').append(`Company registration failed...!!!`);
        document.getElementById('mb').click();
      })
    });
  },

  unregisterCompany : function() {
    // App.populateAddress().then(r => App.handler = r[0]);
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      var ad = $('#companyAddress2').val();
      App.contracts.Les.methods.unRegisterCompany(ad).send({from:App.handler})
      .on('receipt',(receipt)=>{
        if(receipt.status){
          $('#msg').empty();
          jQuery('#msg').append(`Unregistration successful...!!!`);
          document.getElementById('mb').click();
      }})
      .on('error',(err)=>{
        $('#msg').empty();
          jQuery('#msg').append(`Company unregistration failed...!!!`);
          document.getElementById('mb').click();
      })
    });
  
  },

  sendTokens : function() {
    console.log('send tokens');
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      var ad = $('#useraddr').val();
      if(ad === '') {
        $('#msg').empty();
        jQuery('#msg').append(`Enter valid address...!!!`);
        document.getElementById('mb').click();
        return;
      }
      App.contracts.Les.methods.sendTokens(ad).send({from:App.handler})
      .on('receipt',(receipt)=>{
        if(receipt.status){
          $('#msg').empty();
          jQuery('#msg').append(`Tokens sent...!!!`);
          document.getElementById('mb').click();
      }})
      .on('error',(err)=>{
        $('#msg').empty();
        jQuery('#msg').append(`Company registration failed...!!!`);
        document.getElementById('mb').click();
      })
    });
  },

  getBalance : function() {
    console.log('get balance called....');
    $('#info').empty();
    App.populateAddress().then(r => App.handler = r[0]).then(()=> {
      App.contracts.Les.methods.getBalance(App.handler).call().then(r2=> {
        console.log(r2);
        const str = `Address is ${App.handler}, Balance is : ${r2}`
        console.log(str);
        jQuery('#info').append(str);
      })
    });
  },

  getProducts : function() {
    // App.populateAddress().then(r => App.handler = r[0]);
    console.log("Products Fetched...!!!");
    // alert(App.handler);
    $('#productList').empty();
    App.populateAddress().then(re => App.handler = re[0]).then(()=> {
      App.contracts.Les.methods.getProducts().call().then(r=> {
        console.log(r);
        jQuery.each(r, function(i) {
          const str= App.web3.utils.hexToAscii(r[i].productName);
          const p1 = `<div class="col-md-4"> <div class="card" style="width: 22rem; height:16rem; margin-bottom: 2rem; background-color:#e6e7ed;">
            <div class=\"card-body\" style=\"align-content: center;\"> <h5 class=\"card-title\">Product Name : ${str} </h5>
            <h6 class=\"card-subtitle mb-2 text-muted\">Price : ${r[i].price} LEC </h6>
            <h6 class=\"card-subtitle mb-2 text-muted\">Items left : ${r[i].availableUnits}</h6>
            <h6 class=\"card-subtitle mb-2 text-muted\">Product Id : ${r[i].productId}</h6>
            </div>
            <div class=\"card-footer\">
            <a href=\"#\" id=\"a${r[i].productId}\" class=\"btn btn-primary\">Approve</a>
            <a href=\"#\" id=\"b${r[i].productId}\" class=\"btn btn-primary\">Buy</a>
            </div>
            </div>
            </div>`
            jQuery('#productList').append(p1);
            var elem = document.getElementById(`b${r[i].productId}`);
            elem.addEventListener('click', function() {
              selectedProduct=r[i].productId;
              App.buyProduct(r[i].productId, r[i].price);
            }, false);
            var elem2 = document.getElementById(`a${r[i].productId}`);
            elem2.addEventListener('click', function() {
              selectedProduct=r[i].productId;
              App.approve(r[i].price);
            }, false);  
        })
      })
    });    
  },
  
  abi : [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "ERC20_address",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "productName",
          "type": "bytes32"
        },
        {
          "internalType": "uint256",
          "name": "noOfUnitsManufactured",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId1",
          "type": "uint256"
        }
      ],
      "name": "buyProduct",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId2",
          "type": "uint256"
        }
      ],
      "name": "getOwners",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProducts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "productId",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "productName",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "noOfUnitsManufactured",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "availableUnits",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "companyId",
              "type": "uint256"
            }
          ],
          "internalType": "struct LimitedEditionStore.Product[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "companyName",
          "type": "bytes32"
        },
        {
          "internalType": "address payable",
          "name": "companyAddress",
          "type": "address"
        }
      ],
      "name": "registerCompany",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "address1",
          "type": "address"
        }
      ],
      "name": "sendTokens",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "companyAddress",
          "type": "address"
        }
      ],
      "name": "unRegisterCompany",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}

window.ethereum.on('accountsChanged', function () {
  App.populateAddress().then(()=>{
    App.getBalance();
  })
  
})

$(function() {
  $(window).load(function() {
    App.init();
  });
});
