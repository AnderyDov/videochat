import { useEffect, useRef, useState } from 'react';
import socket from '../../socket';
import { ACTIONS } from '../../socket/actions';
import { v4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
    let navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const rootNode = useRef();

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
            // if (rootNode.current) {
            setRooms(rooms);
            // }
        });
    }, []);

    // console.log(socket);

    return (
        <div ref={rootNode}>
            <h2>MAIN PAGE</h2>
            <ul>
                {rooms.map((roomID) => {
                    return (
                        <li key={roomID}>
                            {roomID}
                            <button>JOIN ROOM</button>
                        </li>
                    );
                })}
            </ul>
            <button
                onClick={() => {
                    navigate(`/room/${v4()}`);
                }}
            >
                Create New Room
            </button>
        </div>
    );
}
