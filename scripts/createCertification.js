const chalk = require('chalk');
const Institution = artifacts.require('Institution')
const Certification = artifacts.require('Certification')

const mockToken = "52a9a2f8-a2e6-45ed-a0bc-ac6d4e173963"; // must use the same one used to create institute
const mockCert = {
    candidateName: "John Lim",
    orgName: "Singapore University of Technology and Design",
    courseName: "Computer Science and Design",
    expirationDate: new Date().getTime(),
    id: "5c0157fd3ff47a2a54075b01",
};

// Utility function to create Institute easily
module.exports = async function(callback){
    // Set Up
    console.log(chalk.blue("==== Creating new Institute ===="))
    let institution = await Institution.deployed()
    console.log(chalk.green("===> Institute Contract Present"))
    let instituteContractOwner = await institution.owner()
    console.log("Owner of contract:", instituteContractOwner)
    
    let certification = await Certification.deployed();
    console.log(chalk.green("===> Certification Contract Present"))
    let certificationContractOwner = await certification.owner()
    console.log("Owner of contract:", certificationContractOwner)
    
    let accounts = await web3.eth.getAccounts()
    const chosenAcc = accounts[1]
    console.log("Using this account to generate certificate:", chosenAcc)

    // Add certificate into Certification Contract
    try {
        const receipt = await certification.generateCertificate(
            mockToken,
            mockCert.id,
            mockCert.candidateName,
            mockCert.orgName,
            mockCert.courseName,
            mockCert.expirationDate, { from: chosenAcc }
        );
        // Some checks:
        if (receipt.logs.length != 1){
            throw "an event was not triggered"
        }
        if (receipt.logs[0].event != "certificateGenerated"){
            throw "the event type is incorrect"
        }
        if (web3.utils.toAscii(receipt.logs[0].args._certificateId).slice(0, 24) != mockCert.id){
            throw "the certificate id is incorrect"
        }

        console.log(chalk.green("===> Certificate added!"))
        console.log("_certificateId:", receipt.logs[0].args._certificateId)

    } catch(err){
        console.log(chalk.red("Something went wrong, check error message below:"))
        console.log(err)
    }
    callback()
}
