pragma solidity >=0.4.24;
pragma experimental ABIEncoderV2;

contract Institution {
    // State Variables
    address public owner;

    // Mappings
    mapping(bytes32 => Institute) private institutes; // Institutes Mapping
    mapping(bytes32 => Course[]) private instituteCourses; // Courses Mapping

    // Events
    event instituteAdded(string _instituteName);

    constructor() public {
        owner = msg.sender;
    }

    struct Course {
        // TODO: Check if there are other variables for Course struct
        string course_name;
        // string course_acronym;
        // string course_link;
    }

    struct Institute {
        string institute_name;
        string institute_acronym;
        string institute_link;
    }

    function stringToBytes32(string memory source)
        private
        pure
        returns (bytes32 result)
    {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
            result := mload(add(source, 32))
        }
    }

    function addInstitute(
        string memory _token,
        string memory _institute_name,
        string memory _institute_acronym,
        string memory _institute_link,
        Course[] memory _institute_courses
    ) public returns (bool) {
        // Only owner can add institute
        require(
            msg.sender == owner,
            "caller must be the owner - only owner can add an institute"
        );
        bytes32 byte_id = stringToBytes32(_token);
        bytes memory tempEmptyStringNameTest = bytes(
            institutes[byte_id].institute_name
        );
        require(
            tempEmptyStringNameTest.length == 0,
            "Institute with token already exists"
        );
        institutes[byte_id] = Institute(
            _institute_name,
            _institute_acronym,
            _institute_link
        );
        // instituteCourses[byte_id] = _institute_courses; // UnimplementedFeatureError: Copying of type struct Institution.Course memory[] memory to storage not yet supported.
        for (uint256 i = 0; i < _institute_courses.length; i++) {
            instituteCourses[byte_id].push(_institute_courses[i]);
        }
        emit instituteAdded(_institute_name);
    }

    function getInstituteData(string memory _token)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            Course[] memory
        )
    {
        bytes32 byte_id = stringToBytes32(_token);
        Institute memory temp = institutes[byte_id];
        bytes memory tempEmptyStringNameTest = bytes(temp.institute_name);
        require(
            tempEmptyStringNameTest.length > 0,
            "Institute does not exist!"
        );
        return (
            temp.institute_name,
            temp.institute_acronym,
            temp.institute_link,
            instituteCourses[byte_id]
        );
    }

    function checkInstitutePermission(string memory _token)
        public
        view
        returns (bool)
    {
        bytes32 byte_id = stringToBytes32(_token);
        Institute memory temp = institutes[byte_id];
        bytes memory tempEmptyStringNameTest = bytes(temp.institute_name);
        if (tempEmptyStringNameTest.length > 0) {
            return true;
        } else {
            return false;
        }
    }
}
