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
			}
		],
		"name": "sendMoney",
		"outputs": [],
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
				"name": "sig",
				"type": "bytes32"
			}
		],
		"name": "splitSignature",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			},
			{
				"name": "",
				"type": "bytes32"
			},
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
		"constant": true,
		"inputs": [
			{
				"name": "message",
				"type": "bytes32"
			},
			{
				"name": "sig",
				"type": "bytes32"
			}
		],
		"name": "recoverSigner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "pure",
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
		"name": "ReturnMoney",
		"type": "event"
	}
]);

var claim = claimMyMoneyContract.at('0x37e92757410a1ab3599432dfa3559e216c902ebe');

console.log(claim);

var eventTransfer = claim.Transfer();

eventTransfer.watch(function(error,result){
  if(!error){
    $('#loader').hide();
    $('#logT').append('<p> Bob is sending ' + result.args._value +
      ' ether and an encrypted message: ' + web3.toAscii(result.args._enMsg) + ' to Alice.</p>');
  }else{
    console.log(error);
    $('#loader').hide();
  }
});

var eventClaim = claim.Claim();

eventClaim.watch(function(error,result){
  if(!error){
    $('#loader').hide();
    $('#logT').append('<p> Alice read the encrypted message ' + web3.toAscii(result.args._enMsg) +
      ' and claim ' +  result.args._value + ' ether.</p>');
  }else{
    console.log(error);
    $('#loader').hide();
  }
});

$('#button').click(function(){
  $('#loader').show();

  const message = web3.sha3($('#msg').val());
  const signature = web3.eth.sign(web3.eth.defaultAccount, message);
  console.log(signature);

  claim.sendMoney(web3.eth.defaultAccount, $('#money').val(), signature, (err, red) =>{
    if (err) {
      $('#loader').hide();
      console.log("Hash is different");
    }
  });
});
