const { Web3 } = require("web3");
const compiledContract = require("./build/contracts/StudentSkills.json")


const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));



const abi = compiledContract.abi;

// console.log(abi)

const contractAddress = "0x6F276722748822D26568a7209EAA72C506affb41";

const contract = new web3.eth.Contract(abi, contractAddress);


// contract.methods.getPublicKey().call((error, result) => {
//     if (error) {
//       console.error('Error:', error);
//     } else {
//       console.log('Contract Data:', result);
//     }
//   });

contract.methods.getPublicKey().call()
  .then(value => console.log(`The value is ${value}`))
  .catch(error => console.log(error));



  // async function getBlockNumberAsync() {
//   const block = await web3.eth.getBlockNumber();
//   return block
// }

// getBlockNumberAsync()
//     .then(blockNumber => {
//         console.log('Latest block number:', blockNumber);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });