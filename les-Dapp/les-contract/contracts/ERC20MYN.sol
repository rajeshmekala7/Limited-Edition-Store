//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract ERC20MYN {

    //naming constants
    string public constant name = "LimitedEditionCoin";
    string public constant symbol = "LEC";
    uint8 public constant decimals = 0;  
   
    address ERCowner; //#1
    

    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    event Transfer(address indexed from, address indexed to, uint tokens);


    mapping(address => uint256) balances;

    mapping(address => mapping (address => uint256)) allowed;
    
    uint256 totalSupply_;

    using SafeMath for uint256;


   constructor(uint256 total) public {  
	    totalSupply_ = total;
	    balances[msg.sender] = totalSupply_;
	    ERCowner = msg.sender; //#2
    }  

    function totalSupply() external view returns (uint256) {
	    return totalSupply_;
    }
    
    function balanceOf(address tokenOwner) external view returns (uint) {
        return balances[tokenOwner];
    }

    function transfer(address receiver, uint numTokens) payable external returns (bool) {
        require(numTokens <= balances[ERCowner]);
        balances[ERCowner] = balances[ERCowner].sub(numTokens);
        balances[receiver] = balances[receiver].add(numTokens);
        emit Transfer(ERCowner, receiver, numTokens);
        return true;
    }

    function approve(address owner, address spender, uint numTokens) external returns (bool) {
        allowed[owner][spender] = numTokens;
        emit Approval(owner, spender, numTokens);
        return true;
    }

    function allowance(address owner, address spender) external view returns (uint) {
        return allowed[owner][spender];
    }

    function transferFrom(address user, address company, uint numTokens) payable external returns (bool) {
        require(numTokens <= balances[user]);    
        require(numTokens <= allowed[user][msg.sender]);
    
        balances[user] = balances[user].sub(numTokens);
        allowed[user][msg.sender] = allowed[user][msg.sender].sub(numTokens);
        balances[company] = balances[company].add(numTokens);
        emit Transfer(user, company, numTokens);
        return true;
    }
    
    //#3
    function close() external { 
        require(msg.sender == ERCowner);
        selfdestruct(payable(msg.sender)); 
     }
 
}

library SafeMath { 
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
      assert(b <= a);
      return a - b;
    }
    
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
      uint256 c = a + b;
      assert(c >= a);
      return c;
    }
}