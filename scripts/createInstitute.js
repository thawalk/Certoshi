const chalk = require('chalk');
const Institution = artifacts.require('Institution')

const mockToken = "52a9a2f8-a2e6-45ed-a0bc-ac6d4e173963";
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
    console.log(chalk.blue("==== Creating new Institute ===="))
    let institution = await Institution.deployed()
    console.log(chalk.green("===> Institute Contract Present"))
    let instituteContractOwner = await institution.owner()
    console.log("Owner of contract:", instituteContractOwner)

    let accounts = await web3.eth.getAccounts()
    const currentOwnerAcc = accounts[0]


    // Add mock Institute into Institute Contract
    try {
        const receipt = await institution.addInstitute(
        mockToken,
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
        console.log(chalk.green("===> Institute added!"))

    } catch(err){
        console.log(chalk.red("Something went wrong, check error message below:"))
        console.log(err)
    }
    callback()
}
