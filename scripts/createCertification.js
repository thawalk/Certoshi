const chalk = require('chalk');
const Institution = artifacts.require('Institution')
const Certification = artifacts.require('Certification')

const { encrypt } = require('../client/src/Components/encrypt')

const mockCert = {
    candidateName: encrypt("John Lim", "5c0157fd3ff47a2a54075b01"),
    orgName: "Singapore University of Technology and Design",
    courseIndex: 0,
    creationDate: encrypt(new Date().getTime(), "5c0157fd3ff47a2a54075b01"),
    id: "5c0157fd3ff47a2a54075b01",
};

// Utility function to create Institute easily
module.exports = async function(callback){
    // Set Up
    console.log(chalk.blue("==== Connecting to deployed Institution Contract ===="))
    let institution = await Institution.deployed()
    console.log(chalk.green("===> Institute Contract Present"))
    let institutionContractAddress = await institution.address
    console.log("Contract address:", institutionContractAddress)
    let institutionContractOwner = await institution.owner()
    console.log("Owner of contract:", institutionContractOwner)
    
    console.log(chalk.blue("==== Connecting to deployed Certification Contract ===="))
    let certification = await Certification.deployed();
    console.log(chalk.green("===> Certification Contract Present"))
    let certificationContractAddress = await certification.address
    console.log("Contract address:", certificationContractAddress)
    let certificationContractOwner = await certification.owner()
    console.log("Owner of contract:", certificationContractOwner)
    
    let accounts = await web3.eth.getAccounts()
    const mockInstituteAcc = accounts[1]

    // Add certificate into Certification Contract
    try {
        console.log(chalk.cyan("Generating certificate:", mockCert.id, "(id)", "| With institute account:", mockInstituteAcc))
        const receipt = await certification.generateCertificate(
            mockCert.id,
            mockCert.candidateName,
            mockCert.courseIndex,
            mockCert.creationDate, { from: mockInstituteAcc }
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

        console.log(chalk.bgGreen("===> Certificate added!"))
        console.log("_certificateId:", receipt.logs[0].args._certificateId)

    } catch(err){
        console.log(chalk.bgRed("Something went wrong, check error message below:"))
        console.log(err)
    }
    callback()
}
