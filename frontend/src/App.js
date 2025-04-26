import CreateGame from './CreateGame';
import JoinGame from './JoinGame';
import RevealMove from './RevealMove';
import ViewGames from './ViewGames';

function App() {
  return (
    <div className="App">
      <CreateGame />
      <JoinGame />
      <RevealMove />
      <ViewGames />
    </div>
  );
}

export default App;
