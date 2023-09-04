// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Deposit2(uint256 amount);
    event Withdraw2(uint256 amount);
    
    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    function deposit2(uint256 _amount) public payable {
        
        uint256 oldbalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");

        balance = balance + _amount;
        uint256 amount = balance;
        assert(balance==oldbalance+_amount);
        emit Deposit2(amount);

    }

    function withdraw2(uint256 _amount) public payable {
        
        uint256 oldbalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");

        balance = balance + _amount;
        uint256 amount = balance;
        assert(balance==oldbalance+_amount);
        emit Withdraw2(amount);

    }
    //FUNCTION TO DISPLAY THE ETH BALANCE IN INR
    function cvt2INR() view public returns(uint){
        uint amount = getBalance() * 136234 ;
        return amount;
        
    }
    //FUNCTION TO DISPLAY THE ETH BALANCE IN USD
    function cvt2USD() view public returns (uint){
        uint amount = getBalance() * 1647;
        return amount;
    }


    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }
}
