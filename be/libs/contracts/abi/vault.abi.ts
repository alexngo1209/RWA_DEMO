export const VAULT_ABI = [
    "event Deposit(address indexed user, uint256 amount)",
    "event Withdraw(address indexed user, uint256 amount)",

    "function deposit() payable",
    "function withdraw(uint256 amount)"
];