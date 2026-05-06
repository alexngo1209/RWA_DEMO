// Vault.sol
pragma solidity ^0.8.20;

contract Vault {
    event Deposit(address indexed user, uint256 amount, uint256 orderId);
    event Withdraw(address indexed user, uint256 amount);

    function deposit(uint256 orderId) external payable {
        require(msg.value > 0, "No value");
        emit Deposit(msg.sender, msg.value, orderId);
    }

    function withdraw(uint256 amount) external {
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
}