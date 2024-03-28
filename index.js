const { Web3 } = require("web3");

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));



const compiledContract = require("./build/contracts/StudentSkills.json");

const ABI = compiledContract.abi;
const bytecode = compiledContract.bytecode



const contract = new web3.eth.Contract(ABI);



// deploy a contract

deployContract = web3.eth.getAccounts().then((accounts) => {
  mainAccount = accounts[0];
  console.log("Default Account:", mainAccount);
    contract
        .deploy({ data: bytecode, arguments: ['initialpublicKey1253452','initialsadfsad2343242324'] })
        .send({ from: mainAccount, gas: 4700000 })
});


// //read out contract

// const contractAddress = "0xcBCe84B1d055dA811EB0607786C50eC7EF9b5d72";
// const theContract = new web3.eth.Contract(ABI, contractAddress);

// theContract.methods.getPublicKey().call()
//   .then(value => console.log(`The value is ${value}`))
//   .catch(error => console.log(error))

//Add an entry of hashedData and EmployerPublicKey

// theContract.methods.addEntry('newHasheddatastudent??!@', 'newEmployerKeyasdlf')
//     .send({ from: '0xb3Ba434BD22AB74E4DA14996Cdcc41Feb8Af3214', gas: 4700000 })
//     .on('transactionHash', function(hash){
//         console.log('Transaction hash:', hash);
//     })
//     .on('confirmation', function(confirmationNumber, receipt){
//         console.log('Confirmation number:', confirmationNumber);
//         console.log('Receipt:', receipt);
//     })
//     .on('error', console.error);


//Read the entries

// theContract.methods.getEntries().call()
//     .then(value =>{
//         value = "[" + value + "]"
//         jsonValue = JSON.parse(value)
//         jsonValue.forEach(obj => console.log(obj))
//     })
//     .catch(err => console.log(err))

//Delete the entries

// employerPublicKey = 'newEmployerKeyasdlf'
// theContract.methods.deleteEntry(employerPublicKey).send(
//     {from: '0xb3Ba434BD22AB74E4DA14996Cdcc41Feb8Af3214', gas: 4700000}
// ).on('transactionHash', function(hash){
//     console.log('Transaction hash:', hash);
// })
// .on('confirmation', function(confirmationNumber, receipt){
//     console.log('Confirmation number:', confirmationNumber);
//     console.log('Receipt:', receipt);
// })
// .on('error', console.error);

