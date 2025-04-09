// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.0;

import "../lib/forge-std/src/Test.sol";
import "../lib/forge-std/src/console.sol";
import "../src/RockPaperScissors.sol";

contract RockPaperScissorsTest is Test{
    address player1 = address(1);
    address player2 = address(2);
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
    
    function testJoinGame() public {
        // player 1 create commitment
        RockPaperScissors.Move player1Move = RockPaperScissors.Move.Rock;
        bytes32 salt = keccak256("testSecret");
        bytes32 commitment = rps.createCommitment(player1Move, salt);

        // player 1 creates room
        vm.prank(player1);
        rps.createGame(commitment);

        
        // make sure room created
        (,,,,, RockPaperScissors.State state) = rps.games(0);
        assertEq(uint256(state), uint256(RockPaperScissors.State.Waiting));

        // player 2 joins the game
        RockPaperScissors.Move player2Move = RockPaperScissors.Move.Rock;
        uint256 gameID = 0;
        vm.prank(player2);
        rps.joinGame(gameID, player2Move);


        (,address inGamePlayer2,,RockPaperScissors.Move inGamePlayer2Move,, RockPaperScissors.State inGameState) = rps.games(0);
        assertEq(inGamePlayer2, player2);
        assertEq(uint256(inGamePlayer2Move), uint256(player2Move));
        assertEq(uint256(inGameState), uint256(RockPaperScissors.State.Committed));
    }
}