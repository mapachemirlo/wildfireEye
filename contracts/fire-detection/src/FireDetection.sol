// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract FireDetection {
    struct FireReport {
        string message;
        string[] waypoints;
        address reporter;
    }

    FireReport[] public fireReports;

    event FireReported(address indexed reporter, string message, string[] waypoints);

    function reportFire(string memory message, string[] memory waypoints) public {
        FireReport memory newReport = FireReport({
            message: message,
            waypoints: waypoints,
            reporter: msg.sender
        });

        fireReports.push(newReport);

        emit FireReported(msg.sender, message, waypoints);
    }

    function getReports() public view returns (FireReport[] memory) {
        return fireReports;
    }
}
