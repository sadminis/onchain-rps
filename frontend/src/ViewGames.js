import { useEffect, useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x8a3411b6e286A31aB279d5b1e26217Fe702a3c67";
const ABI = [
  // Only include the parts of ABI you need
  "function gameCounter() view returns (uint256)",
  "function games(uint256) view returns (address player1, address player2, uint8 player1Move, uint8 player2Move, bytes32 player1Commitment, uint8 state)"
];

export default function ViewGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchGames() {
      if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask");
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const counter = await contract.gameCounter();
      const gameList = [];

      for (let i = 0; i < counter; i++) {
        const game = await contract.games(i);
        gameList.push({
          id: i,
          player1: game.player1,
          player2: game.player2,
          state: parseInt(game.state)
        });
      }

      setGames(gameList);
    }

    fetchGames();
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
