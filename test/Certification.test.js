const web3 = require("web3");
var Certification = artifacts.require("./Certification.sol");
var Institution = artifacts.require("./Institution.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Certification", (accounts) => {
    let certification, institution;
    let mockOwnerAcc = accounts[0];
    let mockInstituteAcc = accounts[1]; // Same one used to add the institute
    let mockInvalidAcc = accounts[2]
    let mockCert = {
        candidateName: "John Lim",
        courseName: "Computer Science and Design",
        creationDate: new Date().getTime(),
        id: "5c0157fd3ff47a2a54075b01",
    };
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
        const receipt = await institution.addInstitute(
            mockInstituteAcc,
            mockInstitute.instituteName,
            mockInstitute.instituteAcronym,
            mockInstitute.instituteLink,
            mockInstituteCourses, { from: mockOwnerAcc }
        );
        certification = await Certification.new(institution.address);
    });

    describe("Deployment of Certification Contract", async() => {
        it("has an owner", async() => {
            const contractOwner = await certification.owner();
            assert.equal(contractOwner, mockOwnerAcc);
        });
    });

    describe("Generation of Certificate", async() => {
        it("generates a certificate with a valid unique id", async() => {
            const receipt = await certification.generateCertificate(
                mockCert.id,
                mockCert.candidateName,
                mockCert.courseName,
                mockCert.creationDate, { from: mockInstituteAcc }
            );
            assert.equal(receipt.logs.length, 1, "an event was not triggered");
            assert.equal(
                receipt.logs[0].event,
                "certificateGenerated",
                "the event type is incorrect"
            );
            assert.equal(
                web3.utils.toAscii(receipt.logs[0].args._certificateId).slice(0, 24),
                mockCert.id,
                "the certificate id is incorrect"
            );
        });
        it("fails if function is called by an invalid institute account", async() => {
            try {
                // generated certificate with invalid sender account - should fail
                const receipt = await certification.generateCertificate(
                    mockCert.id,
                    mockCert.candidateName,
                    mockCert.courseName,
                    mockCert.creationDate, { from: mockInvalidAcc }
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
        it("fails if certificate id already exists", async() => {
            const certification2 = await Certification.new(institution.address);
            const receipt = await certification2.generateCertificate(
                mockCert.id,
                mockCert.candidateName,
                mockCert.courseName,
                mockCert.creationDate, { from: mockInstituteAcc }
            );
            try {
                // generated certificate with same id again - should fail
                const receipt = await certification2.generateCertificate(
                    mockCert.id,
                    mockCert.candidateName,
                    mockCert.courseName,
                    mockCert.creationDate, { from: mockInstituteAcc }
                );
                const failure = assert.fail(certData);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });
    describe("Data Retrieval for Certificate data", async() => {
        it("retrieves correct data for a valid certificate id", async() => {
            const certData = await certification.getData(mockCert.id);

            // Individual Info
            assert.equal(
                certData[0],
                mockCert.candidateName,
                "the name of the candidate is incorrect"
            );
            assert.equal(
                certData[1],
                mockCert.courseName,
                "the course name of the certificate is incorrect"
            );
            assert.equal(
                certData[2],
                mockCert.creationDate,
                "the creation date is incorrect"
            );

            // Institute  Info
            assert.equal(
                certData[3],
                mockInstitute.instituteName,
                "the institute name of the certificate is incorrect"
            );
            assert.equal(
                certData[4],
                mockInstitute.instituteAcronym,
                "the institute acronym of the certificate is incorrect"
            );
            assert.equal(
                certData[5],
                mockInstitute.instituteLink,
                "the institute link of the certificate is incorrect"
            );
            assert.equal(
                certData[6],
                false,
                "the revoked status of the certificate is incorrect"
            );
        });

        it("fails for invalid certificate id that does not exist", async() => {
            const invalidCertId = "unavailable5c0157fd3ff47a2a54075b02";
            // Check error message - note: need to handle error in client side
            try {
                const certData = await certification.getData(invalidCertId);
                console.log("***certData")
                console.log(certData)
                const failure = assert.fail(certData);
                console.log("***failure")
                console.log(failure)
            } catch (err) {
                console.log("***err.msg")
                console.log(err.message)
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });
});