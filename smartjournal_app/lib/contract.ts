export const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_pair",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "_pnl",
				"type": "int256"
			},
			{
				"internalType": "string[]",
				"name": "_confluences",
				"type": "string[]"
			},
			{
				"internalType": "string",
				"name": "_note",
				"type": "string"
			}
		],
		"name": "logTrade",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_tradeIndex",
				"type": "uint256"
			}
		],
		"name": "getConfluences",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userTrades",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "date",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "pair",
				"type": "string"
			},
			{
				"internalType": "int256",
				"name": "pnl",
				"type": "int256"
			},
			{
				"internalType": "string",
				"name": "note",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "";
