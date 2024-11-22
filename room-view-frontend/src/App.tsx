import logo from './logo.svg';
import Calendar from "./components/viewRoomData";
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" /> Savonia Room View
      </header>
      <Calendar />
    </div>
  );
}

export default App;
