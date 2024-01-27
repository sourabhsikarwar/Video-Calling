import ReactPlayer from "react-player";
import { useSocket } from "../context/SocketProvider";
import { useCallback, useEffect, useState } from "react";
import peer from "../service/peer";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`${email} joined`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", {
      to: remoteSocketId,
      offer,
    });
    setMyStream(stream);
  }, [socket, remoteSocketId]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    console.log("Incoming Call", from, offer);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incoming:call", handleIncomingCall);
    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incoming:call", handleIncomingCall);
    };
  }, [socket, handleUserJoined, handleIncomingCall]);

  return (
    <div>
      <h1>Room Page</h1>
      {remoteSocketId ? (
        <p>Remote User Connected</p>
      ) : (
        <p>No one in the room</p>
      )}
      {remoteSocketId && <button onClick={handleCallUser}>Call</button>}
      {myStream && (
        <>
          <h1>My Stream</h1>
          <ReactPlayer
            url={myStream}
            width="200px"
            height="150px"
            playing={true}
          />
        </>
      )}
    </div>
  );
};

export default RoomPage;
