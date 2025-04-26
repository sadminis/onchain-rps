// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RockPaperScissors {
    // Declare all moves possible
    enum Move {
        None,
        Rock,
        Paper,
        Scissors
    }

    // Declare all states
    // Waiting: waiting for player 2 to make a move
    // Committed: player 2 made a move
    // Revealed: player 1 reveal both moves
    // Completed: game is completed
    enum State {
        Waiting,
        Committed,
        Revealed,
        Completed
    }

    // This is what a Game should contain:
    struct Game {
        address player1;
        address player2;
        Move player1Move;
        Move player2Move;
        bytes32 player1Commitment; // Proves that player 1 made a move and hidden from player 2
        State state;
        address winner; 
    }

    // Assign a game id to each unique game
    mapping(uint256 => Game) public games;
    // GameID
    uint256 public gameCounter;

    // Events
    event GameCreated(uint256 gameID, address player1);
    event MoveCommitted(uint256 gameID, address player2);
    event Player1Revealed(uint256 gameID);
    event GameCompleted(uint256 gameID);

    function createGame(bytes32 commitment) external {
        uint256 gameID = gameCounter++;
        games[gameID] = Game({
            player1: msg.sender,
            player2: address(0),
            player1Move: Move.None,
            player2Move: Move.None,
            player1Commitment: commitment,
            state: State.Waiting,
            winner: address(0) // Initialize winner to address(0)
        });

        emit GameCreated(gameID, msg.sender);
    }

    function joinGame(uint256 gameId, Move move) external {
        Game storage game = games[gameId];
        require(game.state == State.Waiting, "Game not waiting");
        require(move != Move.None, "Invalid move");
        // require(game.player1 != msg.sender, "You can't play with yourself");

        game.player2 = msg.sender;
        game.player2Move = move;
        game.state = State.Committed;

        emit MoveCommitted(gameId, msg.sender);
    }

    function revealMoves(uint256 gameId, Move move, bytes32 salt) external returns (address winner) {
        Game storage game = games[gameId];
        require(game.state == State.Committed, "Player2 not yet committed");
        require(game.player1 == msg.sender, "Only Player1 could reveal moves");
        require(keccak256(abi.encodePacked(move, salt)) == game.player1Commitment, "Commitment does not match");

        game.player1Move = move;
        game.state = State.Revealed;

        emit Player1Revealed(gameId);

        return _determineWinner(gameId);
    }

    function _determineWinner(uint256 gameId) private returns (address winner) {
        Game storage game = games[gameId];

        Move player1Move = game.player1Move;
        Move player2Move = game.player2Move;

        require(game.state == State.Revealed);

        if (player1Move == player2Move) {
            winner = address(0);
        }
        else if (
            (player1Move == Move.Rock && player2Move == Move.Scissors)
            || (player1Move == Move.Scissors && player2Move == Move.Paper)
            || (player1Move == Move.Paper && player2Move == Move.Rock)
        ) {
            winner = game.player1;
        } else {
            winner = game.player2;
        }

        game.winner = winner; // 🆕 Store winner permanently

        emit GameCompleted(gameId);
        game.state = State.Completed;

        return winner;
    }

    // Helper function to create commitment
    function createCommitment(Move player1Move, bytes32 salt) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(player1Move, salt));
    }
}
