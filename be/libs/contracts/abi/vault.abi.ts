export const VAULT_ABI = [
    "event Deposit(address indexed user, uint256 amount, uint256 orderId)",
    "event Withdraw(address indexed user, uint256 amount)",

    "function deposit(uint256 orderId) payable",
    "function withdraw(uint256 amount)"
];