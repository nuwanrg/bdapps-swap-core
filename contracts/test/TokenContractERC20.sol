pragma solidity =0.5.16;

import '../TokenContract.sol';

contract TokenContractERC20 is TokenContract {
    constructor(uint _totalSupply) public {
        _mint(msg.sender, _totalSupply);
    }
}