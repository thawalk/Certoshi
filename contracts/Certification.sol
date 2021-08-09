pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Institution.sol";

contract Certification {
    // State Variables
    address public owner;
    Institution public institution;

    // Mappings
    mapping(bytes32 => Certificate) private certificates;

    // Events
    event certificateGenerated(bytes32 _certificateId);

    constructor(Institution _institution) public {
        owner = msg.sender;
        institution = _institution;
    }

    struct Certificate {
        // Individual Info
        string candidate_name;
        string org_name;
        string course_name;
        uint256 expiration_date;

        // Institute Info
        string institute_name;
        string institute_acronym;
        string institute_link;
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
                result := mload(add(source, 32))
        }
    }

    function generateCertificate(
        string memory _id,
        string memory _candidate_name,
        string memory _org_name, 
        string memory _course_name, 
        uint256 _expiration_date) public {
        // require(institution.checkInstitutePermission(_token) == true, "Invalid institute token");
        require(institution.checkInstitutePermission(msg.sender) == true, "Invalid institute token");
        bytes32 byte_id = stringToBytes32(_id);
        require(certificates[byte_id].expiration_date == 0, "Certificate with given id already exists");
        // (string memory _institute_name, string memory _institute_acronym, string memory _institute_link, Institution.Course[] memory _) = institution.getInstituteData(_token);
        (string memory _institute_name, string memory _institute_acronym, string memory _institute_link, Institution.Course[] memory _) = institution.getInstituteData(msg.sender);
        certificates[byte_id] = Certificate(_candidate_name, _org_name, _course_name, _expiration_date, _institute_name, _institute_acronym, _institute_link);
        emit certificateGenerated(byte_id); // TODO: Maybe can change to return _id instead of byte_id for readability
    }

    function getData(string memory _id) public view returns(string memory, string memory, string memory, uint256, string memory, string memory, string memory) {
        bytes32 byte_id = stringToBytes32(_id);
        Certificate memory temp = certificates[byte_id];
        require(temp.expiration_date != 0, "No data exists");
        // string memory, string memory, string memory, Course[] memory
        // temp.institute_name, temp.institute_acronym, temp.institute_link, instituteCourses[byte_id]);
        return (temp.candidate_name, temp.org_name, temp.course_name, temp.expiration_date, temp.institute_name, temp.institute_acronym, temp.institute_link);
    }
}