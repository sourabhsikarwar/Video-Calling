import { Routes, Route } from "react-router-dom";
import LobbyPage from "./pages/Lobby";
import RoomPage from "./pages/Room";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LobbyPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </div>
  );
}

export default App;
