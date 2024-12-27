'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ModeToggle } from '@/components/theme-toggle';
import {
    AlertDialogFooter,
    AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

export default function Home() {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [isWinner, setIsWinner] = useState(false);

    const calculateWinner = (squares: any[]) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // columns
            [0, 4, 8],
            [2, 4, 6], // diagonals
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (
                squares[a] &&
                squares[a] === squares[b] &&
                squares[a] === squares[c]
            ) {
                return squares[a];
            }
        }

        if (squares.every((square: null) => square !== null)) {
            return 'draw';
        }

        return null;
    };

    const handleClick = (index: number) => {
        if (board[index] || calculateWinner(board)) {
            return;
        }

        const newBoard = [...board];

        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const winner = calculateWinner(newBoard);
        if (winner) {
            setIsWinner(true);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setIsWinner(false);
    };

    const winner = calculateWinner(board);

    const status = winner
        ? winner === 'draw'
            ? "It's a draw!"
            : `Winner: ${winner}`
        : `${isXNext ? 'X' : 'O'}`;

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <ModeToggle />
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center font-bold text-2xl">
                    Tic Tac Toe
                    <CardDescription>Challenge yourself!!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center mb-5">{`Next player is : ${status}`}</div>

                    <div className="grid grid-cols-3 gap-3 mb-5">
                        {board.map((square, index) => (
                            <Button
                                key={index}
                                className="font-bold text-2xl"
                                variant={'outline'}
                                onClick={() => handleClick(index)}
                                disabled={square !== null || winner !== null}
                            >
                                {square}
                            </Button>
                        ))}
                    </div>

                    <Button onClick={resetGame} className="w-full">
                        Reset Game
                    </Button>

                    <AlertDialog open={isWinner} onOpenChange={setIsWinner}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Game Over!!</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {winner === 'draw'
                                        ? "It's a draw!"
                                        : `Player ${winner} wins!`}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogAction onClick={resetGame}>
                                    Play Again
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
