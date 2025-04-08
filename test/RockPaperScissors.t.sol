// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Test.sol";
import "../src/RockPaperScissors.sol";

contract RockPaperScissorsTest is Test{
    address player1 = address(1);
    RockPaperScissors rps;

    function setUp() public {
        rps = new RockPaperScissors();
    }

    function testCreateGame() public {
        // create commitment
        RockPaperScissors.Move player1Move = RockPaperScissors.Move.Rock;
        bytes32 salt = keccak256("testSecret");
        bytes32 commitment = rps.createCommitment(player1Move, salt);

        // vm pretends player 1 is calling the function
        vm.prank(player1);
        // create game
        rps.createGame(commitment);

        // Destruct the game
        (address player1InGame,,,,bytes32 inGameCommitment, RockPaperScissors.State state) = rps.games(0);
        assertEq(player1InGame, player1);
        assertEq(uint256(state), uint256(RockPaperScissors.State.Waiting));
        assertEq(inGameCommitment, commitment);
    }
}