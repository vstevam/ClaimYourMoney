if(typeof web3 !== 'undefined'){
  web3 = new Web3(web3.currentProvider);
}else{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

web3.eth.defaultAccount = web3.eth.accounts[0];
var claimMyMoneyContract = web3.eth.contract([
	{
		"constant": false,
		"inputs": [
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_enMsg",
				"type": "bytes32"
			},
			{
				"name": "_r",
				"type": "bytes32"
			},
			{
				"name": "_s",
				"type": "bytes32"
			},
			{
				"name": "_v",
				"type": "uint8"
			}
		],
		"name": "claimMyMoney",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "prefixed",
		"outputs": [
			{
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "constVerify",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "data",
		"outputs": [
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "enMsg",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "r",
				"type": "bytes32"
			},
			{
				"name": "s",
				"type": "bytes32"
			},
			{
				"name": "v",
				"type": "uint8"
			},
			{
				"name": "hash",
				"type": "bytes32"
			}
		],
		"name": "verify",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_receiver",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			},
			{
				"name": "_enMsg",
				"type": "bytes32"
			},
			{
				"name": "_r",
				"type": "bytes32"
			},
			{
				"name": "_s",
				"type": "bytes32"
			},
			{
				"name": "_v",
				"type": "uint8"
			}
		],
		"name": "sendMoney",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_enMsg",
				"type": "bytes32"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_enMsg",
				"type": "bytes32"
			}
		],
		"name": "Claim",
		"type": "event"
	}
]);

var claim = claimMyMoneyContract.at('0xdc4b11a41aaf223e871f9142cbd92510cd9efd21');

console.log(claim);

var eventTransfer = claim.Transfer();

eventTransfer.watch(function(error,result){
  if(!error){
    $('#loader').hide();
    $('#logT').append('<p> Bob is sending ' + result.args._value +
      ' ether and an encrypted message ' + '(' + web3.toAscii(result.args._enMsg) + ')' + ' to Alice.</p>');
  }else{
    console.log(error);
    $('#loader').hide();
  }
});

var eventClaim = claim.Claim();

eventClaim.watch(function(error,result){
  if(!error){
    $('#loader').hide();
    $('#logT').append('<p> Alice read the encrypted message ' + '(' +  web3.eth.accounts[0] + ')' +
      ' and claimed ' +  result.args._value + ' ether.</p>');
  }else{
    console.log(error);
    $('#loader').hide();
  }
});

$('#button').click(function(){
  $('#loader').show();

  const message = web3.sha3($('#msg').val());
  const signature = web3.eth.sign(web3.eth.accounts[0], web3.sha3($('#msg').val()));

  r = "0x" + signature.slice(2, 66);
  s = "0x" + signature.slice(66, 130);
  v = "0x" + signature.slice(130, 132);
  var v_decimal = web3.toDecimal(v)
  if(v_decimal != 27 || v_decimal != 28) {
    v_decimal += 27
  }
  h = web3.sha3($('#msg').val());

  claim.sendMoney(web3.eth.defaultAccount, $('#money').val(), h, r, s, v_decimal, (err, red) =>{
    if (err) {
      $('#loader').hide();
      console.log("Hash is different");
    }
  });
});
