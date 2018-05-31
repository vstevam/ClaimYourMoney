pragma solidity ^0.4.18;

contract ClaimYourMoney{
  address owner = msg.sender;
  struct Sender {
     uint256 amount;
     bytes32 enMsg;
  }

  mapping (address => Sender ) public data;

  event Transfer(address indexed _from, address indexed _to, uint256 _value,
     bytes32 _enMsg);

  event Claim(address indexed _from, address indexed _to, uint256 _value,
        bytes32 _enMsg);

  function sendMoney(address _receiver, uint _amount, bytes32 _enMsg, bytes32 _r, bytes32 _s, uint8 _v) public {
    data[msg.sender].amount -= _amount;
    if(claimMyMoney(_receiver, _amount, _enMsg, _r, _s, _v)){
      data[_receiver].amount += _amount;
      emit Transfer(msg.sender, _receiver, _amount, _enMsg);
    }
  }

  function claimMyMoney(address _receiver, uint _amount, bytes32 _enMsg, bytes32 _r, bytes32 _s, uint8 _v ) public returns(bool){
    if(constVerify(_r, _s, _v, _enMsg) == owner){
        emit Claim(_receiver, msg.sender, _amount, _enMsg);
        return true;
      } else{
          data[msg.sender].amount += _amount;
          return false;
      }

  }

  // Destroy contract and reclaim leftover funds.
  function kill() public {
      require(msg.sender == owner);
      selfdestruct(msg.sender);
  }

    // Signature methods
    function constVerify(bytes32 r, bytes32 s, uint8 v, bytes32 hash) constant returns(address) {
        return ecrecover(prefixed(hash), v, r, s);
    }
    function verify(bytes32 r, bytes32 s, uint8 v, bytes32 hash) returns(address) {
        return ecrecover(prefixed(hash), v, r, s);
    }

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) pure returns (bytes32) {
        return keccak256("\x19Ethereum Signed Message:\n32", hash);
    }

}
