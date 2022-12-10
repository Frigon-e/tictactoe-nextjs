import {useEffect, useState} from "react";

type Gameboard = [
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null],
    [string | null, string | null, string | null,
            string | null, string | null, string | null,
            string | null, string | null, string | null]];

type Moves = { Row: number, Col: number }
export default function TicTacToe() {
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [gameboard, setGameboard] = useState<Gameboard>([
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null]]);
    const [playerMoves, setPlayerMoves] = useState<Moves[]>([] as Moves[]);
    const [computerMoves, setComputerMoves] = useState<Moves[]>([] as Moves[]);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [isComputer, setIsComputer] = useState(false);

    useEffect(() => {
        console.log("effect used to set computer");

        if (isComputer && currentPlayer === 'O' && !gameOver) {
            makeComputerMove();
        }
    }, [currentPlayer]);

    const handleCellClick = (row: number, col: number) => {
        if (gameboard[row][col] != null || gameOver) {
            return;
        }

        let newGameboard = gameboard;
        newGameboard[row][col] = currentPlayer;
        setGameboard(newGameboard);

        let newPlayerMoves = playerMoves;
        newPlayerMoves.push({Row: row, Col: col});
        setPlayerMoves(newPlayerMoves);

        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        setIsComputer(!isComputer);
    }

    const makeComputerMove = () => {
        // Make a post request to the server to get the computer's move
        console.log(JSON.stringify({"ComputerMoves": computerMoves, "PlayerMoves": playerMoves}));
        fetch('http://127.0.0.1:5000/api/move/', {body: JSON.stringify({"ComputerMoves": computerMoves, "PlayerMoves": playerMoves}), method: 'POST'})
            .then(response =>
                response.json())
            .then(data => {
                console.log(data);

                let newComputerMoves : Moves[]= data.computerMoves.map((move: Moves) => ({
                    Row: move.Row,
                    Col: move.Col
                }));
                setComputerMoves(newComputerMoves);

                let newGameboard = gameboard;
                // Gets the last move made by the computer
                newGameboard[newComputerMoves[newComputerMoves.length - 1].Row][newComputerMoves[newComputerMoves.length - 1].Col] = 'O';
                setGameboard(newGameboard);


                setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
                setIsComputer(!isComputer);
            });

    }

    return (
        <div className={"max-w-fit max-h-fit ml-4 mt-4"}>
            {gameOver && (
                <div>
                    {winner ? (
                        <p> Player {winner} wins!</p>
                    ) : (
                        <p> Game is a draw </p>
                    )}
                    <button onClick={() => window.location.reload()}>Play Again</button>
                </div>
            )}
            {!gameOver && (
                <div >
                    {/* Show a message if the computer is making a move */}
                    {isComputer && currentPlayer === 'O' && <p>The computer is making a move...</p>}
                    <div className="flex flex-col w-256 h256 p-4 rounded-md shadow-2xl">
                        {gameboard.map((row, rowIndex) => (
                            <div key={rowIndex} className={`flex flex-row items-center bg-gray-200}`}>
                                {row.map((cell, colIndex) => (
                                    <button
                                        key={colIndex}
                                        onClick={() => {
                                            handleCellClick(rowIndex, colIndex)
                                            console.log(rowIndex, colIndex)
                                        }}
                                        className={`h-20 w-20 p-1 bg-gray-600 bg-clip-content rounded-md border-green-300 ${(rowIndex === 2 || rowIndex ===5 ? "mb-4" : "" )}` + ` ${(colIndex === 2 || colIndex ===5 ? "mr-4" : "" )}`}>
                                        {cell || ' '}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>)}
        </div>
    );
}
