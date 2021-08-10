const chalk = require('chalk');
const Institution = artifacts.require('Institution')

const mockInstitute = {
    instituteName: "Singapore University of Technology and Design",
    instituteAcronym: "SUTD",
    instituteLink: "https://sutd.edu.sg/",
};
const mockInstituteCourses = [{
        course_name: "Computer Science and Design",
    },
    {
        course_name: "Engineering Product and Development",
    },
    {
        course_name: "Engineering Systems and Design",
    },
    {
        course_name: "Architecture and Sustainable Design",
    },
];

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

    let accounts = await web3.eth.getAccounts()
    const currentOwnerAcc = accounts[0]
    const mockInstituteAcc = accounts[1]
    
    // Add mock Institute into Institute Contract
    try {
        console.log(chalk.cyan("Adding Institute Acc:", mockInstituteAcc, "| With account:", currentOwnerAcc))
        const receipt = await institution.addInstitute(
        mockInstituteAcc,
        mockInstitute.instituteName,
        mockInstitute.instituteAcronym,
        mockInstitute.instituteLink,
        mockInstituteCourses, { from: currentOwnerAcc }
        );

        // Some checks:
        if (receipt.logs.length != 1){
            throw "an event was not triggered"
        }
        if (receipt.logs[0].event != "instituteAdded"){
            throw "the event type is incorrect"
        }
        if (receipt.logs[0].args._instituteName != mockInstitute.instituteName){
            throw "the institution name is incorrect"
        }
        console.log(chalk.bgGreen("===> Institute added!"))

    } catch(err){
        console.log(chalk.bgRed("Something went wrong, check error message below:"))
        console.log(err)
    }
    callback()
}
