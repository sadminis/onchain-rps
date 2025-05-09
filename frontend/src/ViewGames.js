import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const CONTRACT_ADDRESS = "0x9d21332C2B1A338c80D4B961946D5508468dC7FF"; // <-- replace with your contract address
const ABI = [
  "function gameCounter() view returns (uint256)",
  "function games(uint256) view returns (address player1, address player2, uint8 player1Move, uint8 player2Move, bytes32 player1Commitment, uint8 state, address winner)"
];

export default function ViewGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      if (typeof window.ethereum === "undefined") {
        console.error("MetaMask not found");
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const contract = new Contract(CONTRACT_ADDRESS, ABI, provider);

      const counter = await contract.gameCounter();
      const gameList = [];

      for (let i = 0; i < counter; i++) {
        const game = await contract.games(i);
        gameList.push({
          id: i,
          player1: game.player1,
          player2: game.player2,
          player1Move: parseInt(game.player1Move),
          player2Move: parseInt(game.player2Move),
          state: parseInt(game.state),
          winner: game.winner
        });
      }

      // Sort by id descending
      gameList.sort((a, b) => b.id - a.id);

      setGames(gameList);
    }

    fetchGames();
    const interval = setInterval(fetchGames, 5000);

    return () => clearInterval(interval);
  }, []);

  function formatState(state) {
    switch (state) {
      case 0:
        return "Waiting";
      case 1:
        return "Committed";
      case 2:
        return "Revealed";
      case 3:
        return "Completed";
      default:
        return "Unknown";
    }
  }

  function formatMove(move) {
    switch (move) {
      case 1:
        return "Rock";
      case 2:
        return "Paper";
      case 3:
        return "Scissors";
      default:
        return "None";
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Games</h1>
      {games.length === 0 ? (
        <p>No games yet.</p>
      ) : (
        <ul className="space-y-2">
          {games.map((game) => (
            <li key={game.id} className="border p-2 rounded">
              <p><strong>Game ID:</strong> {game.id}</p>
              <p><strong>Player 1:</strong> {game.player1}</p>
              <p><strong>Player 2:</strong> {game.player2}</p>
              <p><strong>State:</strong> {formatState(game.state)}</p>

              {game.state === 3 && (
                <>
                  <p><strong>Player 1 Move:</strong> {formatMove(game.player1Move)}</p>
                  <p><strong>Player 2 Move:</strong> {formatMove(game.player2Move)}</p>
                  <p><strong>Winner:</strong> {game.winner === "0x0000000000000000000000000000000000000000" ? "Tie" : game.winner}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
