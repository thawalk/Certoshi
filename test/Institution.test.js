const web3 = require("web3");
var Institution = artifacts.require("./Institution.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Institution", (accounts) => {
    let institution;
    let mockOwnerAcc = accounts[0];
    let mockInstituteAcc = accounts[1];
    let mockRandomInvalidAcc = accounts[2];
    let mockToken = "5c0157fd3ff47a2a54075b02";
    let mockInstitute = {
        instituteName: "Singapore University of Technology and Design",
        instituteAcronym: "SUTD",
        instituteLink: "https://sutd.edu.sg/",
    };
    let mockInstituteCourses = [{
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

    before(async() => {
        // Load Contracts
        institution = await Institution.new({ from: mockOwnerAcc });
        // institution = await Institution.deployed() // if you want to plug the the deployed contract
    });

    describe("Deployment of Institution Contract", async() => {
        it("has an owner", async() => {
            const contractOwner = await institution.owner();
            assert.equal(contractOwner, mockOwnerAcc);
        });
    });

    describe("Adding of an Institution", async() => {
        it("adds an institution with valid id", async() => {
            const receipt = await institution.addInstitute(
                mockToken,
                mockInstitute.instituteName,
                mockInstitute.instituteAcronym,
                mockInstitute.instituteLink,
                mockInstituteCourses, { from: mockOwnerAcc }
            );
            assert.equal(receipt.logs.length, 1, "an event was not triggered");
            assert.equal(
                receipt.logs[0].event,
                "instituteAdded",
                "the event type is incorrect"
            );
            assert.equal(
                receipt.logs[0].args._instituteName,
                mockInstitute.instituteName,
                "the institution name is incorrect"
            );
        });
        it("fails if transaction is from an invalid owner (address)", async() => {
            try {
                const receipt = await institution.addInstitute(
                    mockToken,
                    mockInstitute.instituteName,
                    mockInstitute.instituteAcronym,
                    mockInstitute.instituteLink,
                    mockInstituteCourses, { from: mockRandomInvalidAcc }
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
        it("fails if institute token already exists", async() => {
            const institution2 = await Institution.new({ from: mockOwnerAcc });
            const receipt = await institution2.addInstitute(
                mockToken,
                mockInstitute.instituteName,
                mockInstitute.instituteAcronym,
                mockInstitute.instituteLink,
                mockInstituteCourses, { from: mockOwnerAcc }
            );
            try {
                // add institute with same token - should fail
                const receipt = await institution2.addInstitute(
                    mockToken,
                    mockInstitute.instituteName,
                    mockInstitute.instituteAcronym,
                    mockInstitute.instituteLink,
                    mockInstituteCourses, { from: mockOwnerAcc }
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });

    describe("Data Retrieval for Institute data", async() => {
        it("retrieves correct institute data from valid token", async() => {
            const instituteData = await institution.getInstituteData(mockToken);
            assert.equal(
                instituteData[0],
                mockInstitute.instituteName,
                "the name of the institute is incorrect"
            );
            assert.equal(
                instituteData[1],
                mockInstitute.instituteAcronym,
                "the acronym of the institute is incorrect"
            );
            assert.equal(
                instituteData[2],
                mockInstitute.instituteLink,
                "the link of the institute is incorrect"
            );
            const formattedInstituteCoursesData = instituteData[3].map((x) => {
                return { course_name: x.course_name };
            });
            assert.equal(
                JSON.stringify(formattedInstituteCoursesData),
                JSON.stringify(mockInstituteCourses),
                "the courses of the institute is incorrect"
            );
        });

        it("fails for invalid token", async() => {
            const invalidToken = "invalidc0157fd3ff47a2a54075b02";
            // Check error message - note: need to handle error in client side
            try {
                const instituteData = await institution.getInstituteData(invalidToken);
                const failure = assert.fail(instituteData);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });

    describe("Checking of Institute Permission in Institute Contract", async() => {
        it("returns true with valid token", async() => {
            const result = await institution.checkInstitutePermission(mockToken);
            console.log(result);
            assert.equal(result, true);
        });

        it("returns false with invalid token", async() => {
            const invalidToken = "invalidc0157fd3ff47a2a54075b02";
            const result = await institution.checkInstitutePermission(invalidToken);
            console.log(result);
            assert.equal(result, false);
        });
    });
});