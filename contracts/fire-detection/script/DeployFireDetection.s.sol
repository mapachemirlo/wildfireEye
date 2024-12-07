// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Script.sol";
import "../src/FireDetection.sol";

contract DeployFireDetection is Script {
    function run() external {
        vm.startBroadcast();

        FireDetection fireDetection = new FireDetection();

        console.log("FireDetection deployed to:", address(fireDetection));

        vm.stopBroadcast();
    }
}
