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

    event ReturnMoney(address indexed _from, address indexed _to, uint256 _value,
        bytes32 _enMsg);


  function sendMoney(address _receiver, uint _amount, bytes32 _enMsg) public {
    data[msg.sender].amount -= _amount;
    if(claimMyMoney(_receiver, _amount, _enMsg)){
      data[_receiver].amount += _amount;
      emit Transfer(msg.sender, _receiver, _amount, _enMsg);
    }
  }

  function claimMyMoney(address _receiver, uint _amount, bytes32 _enMsg ) public returns(bool){
    // This recreates the message that was signed on the client.
    bytes32 message = prefixed(keccak256(msg.sender, _amount, _enMsg));

//recoverSigner(message, _enMsg)
    if(msg.sender == owner){
        emit Claim(_receiver, msg.sender, _amount, _enMsg);
        return true;
      } else{
          data[msg.sender].amount += _amount;
          emit ReturnMoney(msg.sender, _receiver, _amount, _enMsg);
          return false;
      }

  }

  // Destroy contract and reclaim leftover funds.
  function kill() public {
      require(msg.sender == owner);
      selfdestruct(msg.sender);
  }

    // Signature methods

    function splitSignature(bytes32 sig) pure returns (uint8, bytes32, bytes32){
        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    function recoverSigner(bytes32 message, bytes32 sig) pure returns (address){
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        return ecrecover(message, v, r, s);
    }

    // Builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) pure returns (bytes32) {
        return keccak256("\x19Ethereum Signed Message:\n32", hash);
    }

}
