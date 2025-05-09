import { useState } from "react";
import { BrowserProvider, Contract, keccak256, concat, toUtf8Bytes, zeroPadBytes, hexlify } from "ethers";

const CONTRACT_ADDRESS = "0x9d21332C2B1A338c80D4B961946D5508468dC7FF"; // <-- Replace this!
const ABI = [
  "function createGame(bytes32 commitment) public"
];

export default function CreateGame() {
  const [move, setMove] = useState(1); // Default Rock
  const [salt, setSalt] = useState("");

  async function handleCreateGame() {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, ABI, signer);

    if (!salt) {
      alert("Salt cannot be empty");
      return;
    }

    try {
      // Correct packing like abi.encodePacked(move, salt)
      const paddedSalt = zeroPadBytes(toUtf8Bytes(salt), 32);
      const moveHex = hexlify(Uint8Array.from([move])); // ✅ Correctly hexlify move
      const packed = concat([moveHex, paddedSalt]);
      const commitment = keccak256(packed); // ✅ Correct keccak256 over packed data

      const tx = await contract.createGame(commitment);
      await tx.wait();
      alert("Game created successfully!");
    } catch (err) {
      console.error(err);
      alert("Error creating game");
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Game</h2>

      <div>
        <label className="block mb-1">Choose your move:</label>
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
        <label className="block mb-1 mt-4">Enter your secret salt:</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
          placeholder="Enter random secret"
        />
      </div>

      <button
        onClick={handleCreateGame}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Create Game
      </button>
    </div>
  );
}
