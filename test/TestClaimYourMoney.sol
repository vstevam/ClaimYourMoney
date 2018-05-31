pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ClaimYourMoney.sol";

contract TestClaimYourMoney{

  function testInitialSendMoney() public{
    ClaimYourMoney money = new ClaimYourMoney();

    uint expected = 1;

    Assert.equal(money.sendMoney(tx.origin, 1), expected, "Money was sent!");

  }

  function testClaimMoney() public{
        ClaimYourMoney money = new ClaimYourMoney();

        bool expected = true;

        Assert.equal(money.claimMyMoney(tx.origin, 1), expected, "Claimed Money!");

  }


}
