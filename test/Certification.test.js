const web3 = require("web3");
var Certification = artifacts.require("./Certification.sol");
var Institution = artifacts.require("./Institution.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Certification", (accounts) => {
    let certification, institution;
    let mockOwnerAcc = accounts[0];
    let mockCert = {
        candidateName: "John Lim",
        orgName: "Singapore University of Technology and Design",
        courseName: "Computer Science and Design",
        expirationDate: new Date().getTime(),
        id: "5c0157fd3ff47a2a54075b01",
    };
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
        const receipt = await institution.addInstitute(
            mockToken,
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
                mockToken,
                mockCert.id,
                mockCert.candidateName,
                mockCert.orgName,
                mockCert.courseName,
                mockCert.expirationDate, { from: mockOwnerAcc }
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
        it("fails if token provided is invalid", async() => {
            const invalidToken = "invalidc0157fd3ff47a2a54075b02";
            try {
                // generated certificate with invalid token - should fail
                const receipt = await certification.generateCertificate(
                    invalidToken,
                    mockCert.id,
                    mockCert.candidateName,
                    mockCert.orgName,
                    mockCert.courseName,
                    mockCert.expirationDate, { from: mockOwnerAcc }
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
                mockToken,
                mockCert.id,
                mockCert.candidateName,
                mockCert.orgName,
                mockCert.courseName,
                mockCert.expirationDate, { from: mockOwnerAcc }
            );
            try {
                // generated certificate with same id again - should fail
                const receipt = await certification2.generateCertificate(
                    mockToken,
                    mockCert.id,
                    mockCert.candidateName,
                    mockCert.orgName,
                    mockCert.courseName,
                    mockCert.expirationDate, { from: mockOwnerAcc }
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
        it("retrieves correct data from a valid certificate id", async() => {
            const certData = await certification.getData(mockCert.id);

            // Individual Info
            assert.equal(
                certData[0],
                mockCert.candidateName,
                "the name of the candidate is incorrect"
            );
            assert.equal(
                certData[1],
                mockCert.orgName,
                "the organisation name of the certificate is incorrect"
            );
            assert.equal(
                certData[2],
                mockCert.courseName,
                "the course name of the certificate is incorrect"
            );
            assert.equal(
                certData[3],
                mockCert.expirationDate,
                "the expiration date is incorrect"
            );

            // Institute  Info
            assert.equal(
                certData[4],
                mockInstitute.instituteName,
                "the institute name of the certificate is incorrect"
            );
            assert.equal(
                certData[5],
                mockInstitute.instituteAcronym,
                "the institute acronym of the certificate is incorrect"
            );
            assert.equal(
                certData[6],
                mockInstitute.instituteLink,
                "the institute link of the certificate is incorrect"
            );
        });

        it("fails for invalid certificate ids that do not exist", async() => {
            const invalidCertId = "unavailable5c0157fd3ff47a2a54075b02";
            // Check error message - note: need to handle error in client side
            try {
                const certData = await certification.getData(invalidCertId);
                const failure = assert.fail(certData);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
    });
});