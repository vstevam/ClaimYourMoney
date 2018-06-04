pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ClaimYourMoney.sol";

contract TestClaimYourMoney{

    function testClaimMoney() public{
        ClaimYourMoney money = new ClaimYourMoney();
        bool expected = false;
        uint8 v = 28;
        bytes32 r = 0xfa9c91f80d9e27b06af89734066395078bfe2e626f0717cd396f2d87f5e3ee95;
        bytes32 s = 0x003dbd17de0db5b7b6ad7b630bd7b929267dd59af81df1ad17a0a06d964857dd;
        bytes32 h = 0xe0d4f6e915eb01068ecd79ce922236bf16c38b2d88cccffcbc57ed53ef3b74aa;

        Assert.equal(money.claimMyMoney(tx.origin, 1, h, r, s, v), expected, "Claimed Money!");

  }


}
