import { useState } from "react";
import { BrowserProvider, Contract, toUtf8Bytes, zeroPadBytes } from "ethers";

const CONTRACT_ADDRESS = "0x9d21332C2B1A338c80D4B961946D5508468dC7FF"; // replace this!
const ABI = [
  "function revealMoves(uint256 gameId, uint8 move, bytes32 salt) public"
];

export default function RevealMove() {
  const [gameId, setGameId] = useState("");
  const [move, setMove] = useState(1); // Rock = 1 by default
  const [salt, setSalt] = useState("");

  async function handleRevealMove() {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

    if (gameId === "" || salt === "") {
      alert("Game ID and salt are required");
      return;
    }

    try {
      // Correctly pad the salt to bytes32
      const paddedSalt = zeroPadBytes(toUtf8Bytes(salt), 32);

      const tx = await contract.revealMoves(Number(gameId), move, paddedSalt);
      await tx.wait();
      alert("Move revealed successfully!");
    } catch (err) {
      console.error(err);
      if (err?.error?.reason) {
        alert("Revert reason: " + err.error.reason);
      } else if (err?.reason) {
        alert("Revert reason: " + err.reason);
      } else {
        alert("Unknown error occurred");
      }
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4">Reveal Move</h2>

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
        <label className="block mb-1 mt-4">Your Move:</label>
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

      <div>
        <label className="block mb-1 mt-4">Your Salt:</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          placeholder="Enter the salt you used"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
        />
      </div>

      <button
        onClick={handleRevealMove}
        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded mt-4"
      >
        Reveal Move
      </button>
    </div>
  );
}
