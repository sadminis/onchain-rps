import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";

const CONTRACT_ADDRESS = "0x9d21332C2B1A338c80D4B961946D5508468dC7FF"; // replace this!
const ABI = [
  "function joinGame(uint256 gameId, uint8 move) public"
];

export default function JoinGame() {
  const [gameId, setGameId] = useState("");
  const [move, setMove] = useState(1); // Default move = Rock

  async function handleJoinGame() {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

    if (gameId === "") {
      alert("Game ID is required");
      return;
    }

    try {
      const tx = await contract.joinGame(Number(gameId), move);
      await tx.wait();
      alert("Successfully joined the game!");
    } catch (err) {
      console.error(err);
      alert("Revert reason: " + err.reason);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Join Existing Game</h2>

      <div>
        <label className="block mb-1">Game ID:</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Enter Game ID"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
      </div>

      <div>
        <label className="block mb-1 mt-4">Choose your move:</label>
        <select
          className="border p-2 rounded w-full"
          value={move}
          onChange={(e) => setMove(Number(e.target.value))}
        >
          <option value={1}>Rock</option>
          <option value={2}>Paper</option>
          <option value={3}>Scissors</option>
        </select>
      </div>

      <button
        onClick={handleJoinGame}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        Join Game
      </button>
    </div>
  );
}
