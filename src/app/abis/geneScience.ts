export const gene_abi = [{ "inputs": [{ "internalType": "address", "name": "_privilegedBirtherAddress", "type": "address" }, { "internalType": "address", "name": "_kittyCoreAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "uint256", "name": "_genes", "type": "uint256" }], "name": "decode", "outputs": [{ "internalType": "uint8[]", "name": "", "type": "uint8[]" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint8[]", "name": "_traits", "type": "uint8[]" }], "name": "encode", "outputs": [{ "internalType": "uint256", "name": "_genes", "type": "uint256" }], "stateMutability": "pure", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_genes", "type": "uint256" }], "name": "expressingTraits", "outputs": [{ "internalType": "uint8[12]", "name": "", "type": "uint8[12]" }], "stateMutability": "pure", "type": "function" }, { "inputs": [], "name": "isGeneScience", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_genes1", "type": "uint256" }, { "internalType": "uint256", "name": "_genes2", "type": "uint256" }, { "internalType": "uint256", "name": "_targetBlock", "type": "uint256" }], "name": "mixGenes", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "privilegedBirtherWindowSize", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_birtherAddress", "type": "address" }], "name": "setPrivilegedBirther", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]