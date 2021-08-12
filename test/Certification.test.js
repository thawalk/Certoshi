const web3 = require("web3");
var Certification = artifacts.require("./Certification.sol");
var Institution = artifacts.require("./Institution.sol");

import { encrypt } from "../client/src/Components/encrypt";
import { decrypt } from "../client/src/Components/decrypt";

require("chai").use(require("chai-as-promised")).should();

contract("Certification", (accounts) => {
    let certification, institution;
    let mockOwnerAcc = accounts[0];
    let mockInstituteAcc = accounts[1]; // Same one used to add the institute
    let mockInvalidAcc = accounts[2]
    let mockCert = {
        candidateName: "John Lim",
        courseIndex: 0,
        creationDate: new Date().getTime(),
        id: "5c0157fd3ff47a2a54075b01",
        id2: "6c0157fd3ff47a2a54075b01"
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

    before(async () => {
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

    describe("Deployment of Certification Contract", async () => {
        it("has an owner", async () => {
            const contractOwner = await certification.owner();
            assert.equal(contractOwner, mockOwnerAcc);
        });
    });

    describe("Generation of Certificate", async () => {
        it("generates a certificate with a valid unique id", async () => {
            const receipt = await certification.generateCertificate(
                mockCert.id,
                encrypt(mockCert.candidateName, mockCert.id),
                mockCert.courseIndex,
                encrypt(mockCert.creationDate, mockCert.id), { from: mockInstituteAcc }
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
        it("fails if function is called by an invalid institute account", async () => {
            try {
                // generated certificate with invalid sender account - should fail
                const receipt = await certification.generateCertificate(
                    mockCert.id,
                    encrypt(mockCert.candidateName, mockCert.id),
                    mockCert.courseIndex,
                    encrypt(mockCert.creationDate, mockCert.id), { from: mockInvalidAcc }
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
        it("fails if certificate id already exists", async () => {
            const certification2 = await Certification.new(institution.address);
            try {
                // generated certificate with same id again - should fail
                const receipt = await certification2.generateCertificate(
                    mockCert.id,
                    encrypt(mockCert.candidateName, mockCert.id),
                    mockCert.courseIndex,
                    encrypt(mockCert.creationDate, mockCert.id), { from: mockInvalidAcc }
                );
                const failure = assert.fail(certData);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
        it("fails if course index given is invalid", async () => {
            try {
                const receipt = await certification.generateCertificate(
                    mockCert.id,
                    encrypt(mockCert.candidateName, mockCert.id),
                    99, // list of courses in institute is 0 - 3 only
                    encrypt(mockCert.creationDate, mockCert.id), { from: mockInstituteAcc }
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
    describe("Data Retrieval for Certificate data", async () => {
        it("retrieves correct data for a valid certificate id", async () => {
            const certData = await certification.getData(mockCert.id);

            // Individual Info
            assert.equal(
                decrypt(certData[0], mockCert.id),
                mockCert.candidateName,
                "the name of the candidate is incorrect"
            );
            assert.equal(
                certData[1],
                mockInstituteCourses[mockCert.courseIndex]['course_name'],
                "the course name of the certificate is incorrect"
            );
            assert.equal(
                decrypt(certData[2], mockCert.id),
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

        it("fails for invalid certificate id that does not exist", async () => {
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
    describe("Revoke Certificate Based On Certificate ID", async () => {
        it("revokes certificate correctly", async () => {
             await certification.generateCertificate(
                mockCert.id2,
                encrypt(mockCert.candidateName, mockCert.id2),
                mockCert.courseIndex,
                encrypt(mockCert.creationDate, mockCert.id2), { from: mockInstituteAcc }
            );
            const receipt = await certification.revokeCertificate(
                mockCert.id2, { from: mockInstituteAcc }
            );
            assert.equal(receipt.logs.length, 1, "an event was not triggered");
            assert.equal(
                receipt.logs[0].event,
                "certificateRevoked",
                "the event type is incorrect"
            );
            assert.equal(
                web3.utils.toAscii(receipt.logs[0].args._certificateId).slice(0, 24),
                mockCert.id2,
                "the certificate id is incorrect"
            );
            const certData = await certification.getData(mockCert.id2);
            assert.equal(
                certData[6],
                true,
                "the revoked status of the certificate is incorrect"
            );
        });
        it("fails if function is called by an invalid institute account", async () => {
            try {
                // generated certificate with invalid sender account - should fail
                const receipt = await certification.revokeCertificate(
                    mockCert.id
                );
                const failure = assert.fail(receipt);
            } catch (err) {
                assert(
                    err.message.indexOf("revert") >= 0,
                    "error message must contain revert"
                );
            }
        });
        it("fails for invalid certificate id that does not exist", async () => {
            const invalidCertId = "unavailable5c0157fd3ff47a2a54075b02";
            // Check error message - note: need to handle error in client side
            try {
                const certData = await certification.revokeCertificate(invalidCertId);
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