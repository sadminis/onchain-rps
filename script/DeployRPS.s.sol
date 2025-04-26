// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/RockPaperScissors.sol";

contract DeployRPS is Script {
    function run() external {
        vm.startBroadcast();
        new RockPaperScissors();
        vm.stopBroadcast();
    }
}
