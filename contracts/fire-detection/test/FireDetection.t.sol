// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import "../src/FireDetection.sol";

contract FireDetectionTest is Test {
    FireDetection public fireDetection;
    address public reporter = address(1);

    function setUp() public {
        fireDetection = new FireDetection();
        vm.label(reporter, "Reporter");
    }

    function testReportFire() public {
        string memory message = "Fire detected in coordinates X";
        string[] memory waypoints = new string[](2);
        waypoints[0] = "-34.6037, -58.3816";
        waypoints[1] = "-34.6038, -58.3817";

        vm.startPrank(reporter);
        
        vm.expectEmit(true, false, false, true);
        emit FireDetection.FireReported(reporter, message, waypoints);
        
        fireDetection.reportFire(message, waypoints);
        vm.stopPrank();

        FireDetection.FireReport[] memory reports = fireDetection.getReports();
        assertEq(reports.length, 1, "Should have one report");
        
        FireDetection.FireReport memory lastReport = reports[0];
        assertEq(lastReport.message, message, "Message should match");
        assertEq(lastReport.reporter, reporter, "Reporter should match");
        assertEq(lastReport.waypoints.length, waypoints.length, "Waypoints length should match");
        assertEq(lastReport.waypoints[0], waypoints[0], "First waypoint should match");
        assertEq(lastReport.waypoints[1], waypoints[1], "Second waypoint should match");
    }

    function testGetReports() public {
        // First report
        string memory message1 = "First fire report";
        string[] memory waypoints1 = new string[](1);
        waypoints1[0] = "-34.6037, -58.3816";

        vm.prank(reporter);
        fireDetection.reportFire(message1, waypoints1);

        // Second report
        string memory message2 = "Second fire report";
        string[] memory waypoints2 = new string[](1);
        waypoints2[0] = "-34.6038, -58.3817";

        vm.prank(address(2));
        fireDetection.reportFire(message2, waypoints2);

        // Get all reports
        FireDetection.FireReport[] memory reports = fireDetection.getReports();
        
        assertEq(reports.length, 2, "Should have two reports");
        assertEq(reports[0].message, message1, "First report message should match");
        assertEq(reports[1].message, message2, "Second report message should match");
        assertEq(reports[0].reporter, reporter, "First reporter should match");
        assertEq(reports[1].reporter, address(2), "Second reporter should match");
    }
}