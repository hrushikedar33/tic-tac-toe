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
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Trophy, RotateCcw, LogOut, Crown, Star } from 'lucide-react';

type GamePhase = 'setup' | 'playing' | 'gameOver';

interface Player {
    name: string;
    symbol: 'X' | 'O';
    wins: number;
}

export default function Home() {
    // Game state
    const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [isWinner, setIsWinner] = useState(false);

    // Player state
    const [player1Name, setPlayer1Name] = useState('');
    const [player2Name, setPlayer2Name] = useState('');
    const [players, setPlayers] = useState<[Player, Player]>([
        { name: '', symbol: 'X', wins: 0 },
        { name: '', symbol: 'O', wins: 0 },
    ]);

    // Tournament state
    const [tournamentMode, setTournamentMode] = useState<number | null>(null);
    const [currentMatch, setCurrentMatch] = useState(1);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);

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
                return { winner: squares[a], line: lines[i] };
            }
        }

        if (squares.every((square: null) => square !== null)) {
            return { winner: 'draw', line: null };
        }

        return null;
    };

    const handleClick = (index: number) => {
        const currentWinner = calculateWinner(board);
        if (board[index] || currentWinner) {
            return;
        }

        const newBoard = [...board];
        newBoard[index] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const result = calculateWinner(newBoard);
        if (result) {
            setWinningLine(result.line);
            if (result.winner !== 'draw') {
                const winningPlayer = players.find(
                    (p) => p.symbol === result.winner
                );
                if (winningPlayer) {
                    setPlayers(
                        (prev) =>
                            prev.map((p) =>
                                p.symbol === result.winner
                                    ? { ...p, wins: p.wins + 1 }
                                    : p
                            ) as [Player, Player]
                    );
                }
            }
            setIsWinner(true);
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setIsWinner(false);
        setWinningLine(null);

        if (tournamentMode && currentMatch < tournamentMode) {
            setCurrentMatch((prev) => prev + 1);
        }
    };

    const resetScore = () => {
        setPlayers(
            (prev) => prev.map((p) => ({ ...p, wins: 0 })) as [Player, Player]
        );
        setCurrentMatch(1);
        resetGame();
    };

    const exitGame = () => {
        setGamePhase('setup');
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setIsWinner(false);
        setPlayer1Name('');
        setPlayer2Name('');
        setPlayers([
            { name: '', symbol: 'X', wins: 0 },
            { name: '', symbol: 'O', wins: 0 },
        ]);
        setTournamentMode(null);
        setCurrentMatch(1);
        setWinningLine(null);
    };

    const startGame = (matches: number | null) => {
        if (player1Name.trim() && player2Name.trim()) {
            setPlayers([
                { name: player1Name, symbol: 'X', wins: 0 },
                { name: player2Name, symbol: 'O', wins: 0 },
            ]);
            setTournamentMode(matches);
            setGamePhase('playing');
        }
    };

    const winnerResult = calculateWinner(board);
    const winner = winnerResult?.winner || null;
    const currentPlayer = players[isXNext ? 0 : 1];

    const isTournamentComplete =
        tournamentMode && currentMatch >= tournamentMode && winner;
    const tournamentWinner = isTournamentComplete
        ? players.reduce((prev, current) =>
              prev.wins > current.wins ? prev : current
          )
        : null;

    // Setup Screen
    if (gamePhase === 'setup') {
        return (
            <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-slate-900">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-slate-700/25"></div>
                <div className="absolute top-4 right-4 z-10">
                    <ModeToggle />
                </div>

                <div className="relative min-h-screen flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl border-2 animate-in fade-in-50 zoom-in-95 duration-500">
                        <CardHeader className="text-center space-y-2 pb-8">
                            <div className="flex justify-center mb-4">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full">
                                    <Trophy className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Tic Tac Toe Tournament
                            </CardTitle>
                            <CardDescription className="text-lg">
                                Enter player names and choose your game mode!
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        <Star className="w-4 h-4 text-blue-500" />
                                        Player 1 Name (X)
                                    </label>
                                    <Input
                                        placeholder="Enter Player 1 name"
                                        value={player1Name}
                                        onChange={(e) =>
                                            setPlayer1Name(e.target.value)
                                        }
                                        className="h-12 text-lg"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold flex items-center gap-2">
                                        <Star className="w-4 h-4 text-pink-500" />
                                        Player 2 Name (O)
                                    </label>
                                    <Input
                                        placeholder="Enter Player 2 name"
                                        value={player2Name}
                                        onChange={(e) =>
                                            setPlayer2Name(e.target.value)
                                        }
                                        className="h-12 text-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-center text-lg">
                                    Select Game Mode
                                </h3>
                                <div className="grid gap-3">
                                    <Button
                                        onClick={() => startGame(null)}
                                        disabled={
                                            !player1Name.trim() ||
                                            !player2Name.trim()
                                        }
                                        className="h-14 text-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                                    >
                                        Single Match
                                    </Button>
                                    <Button
                                        onClick={() => startGame(3)}
                                        disabled={
                                            !player1Name.trim() ||
                                            !player2Name.trim()
                                        }
                                        className="h-14 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                    >
                                        Best of 3 Tournament
                                    </Button>
                                    <Button
                                        onClick={() => startGame(5)}
                                        disabled={
                                            !player1Name.trim() ||
                                            !player2Name.trim()
                                        }
                                        className="h-14 text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    >
                                        Best of 5 Tournament
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Playing Screen
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-slate-900">
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-grid-slate-700/25"></div>
            <div className="absolute top-4 right-4 z-10">
                <ModeToggle />
            </div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-4xl space-y-6">
                    {/* Score Board */}
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Player 1 Card */}
                        <Card
                            className={`transition-all duration-300 ${
                                isXNext && !winner
                                    ? 'ring-4 ring-blue-500 scale-105'
                                    : ''
                            }`}
                        >
                            <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {players[0].wins > players[1].wins &&
                                        tournamentMode && (
                                            <Crown className="w-5 h-5 text-yellow-500 animate-bounce" />
                                        )}
                                    <p className="font-bold text-2xl">
                                        {players[0].name}
                                    </p>
                                </div>
                                <p className="text-4xl font-bold text-blue-500">
                                    X
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {players[0].wins}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Wins
                                </p>
                            </CardContent>
                        </Card>

                        {/* Tournament Info Card */}
                        <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                            <CardContent className="p-6 text-center">
                                <Trophy className="w-8 h-8 mx-auto mb-2" />
                                {tournamentMode ? (
                                    <>
                                        <p className="text-sm opacity-90">
                                            Tournament
                                        </p>
                                        <p className="text-3xl font-bold">
                                            Match {currentMatch}/
                                            {tournamentMode}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm opacity-90">
                                            Game Mode
                                        </p>
                                        <p className="text-2xl font-bold">
                                            Single Match
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Player 2 Card */}
                        <Card
                            className={`transition-all duration-300 ${
                                !isXNext && !winner
                                    ? 'ring-4 ring-pink-500 scale-105'
                                    : ''
                            }`}
                        >
                            <CardContent className="p-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {players[1].wins > players[0].wins &&
                                        tournamentMode && (
                                            <Crown className="w-5 h-5 text-yellow-500 animate-bounce" />
                                        )}
                                    <p className="font-bold text-2xl">
                                        {players[1].name}
                                    </p>
                                </div>
                                <p className="text-4xl font-bold text-pink-500">
                                    O
                                </p>
                                <p className="text-3xl font-bold mt-2">
                                    {players[1].wins}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Wins
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Game Board */}
                    <Card className="shadow-2xl border-2">
                        <CardContent className="p-8">
                            <div className="text-center mb-6">
                                <p className="text-2xl font-bold">
                                    {winner
                                        ? winner === 'draw'
                                            ? "It's a Draw!"
                                            : `${
                                                  winner === 'X'
                                                      ? players[0].name
                                                      : players[1].name
                                              } Wins!`
                                        : `${currentPlayer.name}'s Turn`}
                                </p>
                            </div>

                            {/* Board Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-6 max-w-md mx-auto">
                                {board.map((square, index) => (
                                    <button
                                        key={index}
                                        className={`
                                            aspect-square rounded-xl font-bold text-5xl
                                            transition-all duration-300 transform
                                            border-4 border-border
                                            ${
                                                !square && !winner
                                                    ? 'hover:scale-110 hover:shadow-lg cursor-pointer bg-card'
                                                    : 'cursor-not-allowed'
                                            }
                                            ${
                                                square === 'X'
                                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                                                    : ''
                                            }
                                            ${
                                                square === 'O'
                                                    ? 'bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400'
                                                    : ''
                                            }
                                            ${
                                                winningLine?.includes(index)
                                                    ? 'ring-4 ring-green-500 animate-pulse'
                                                    : ''
                                            }
                                            ${
                                                square
                                                    ? 'animate-in zoom-in-50 duration-300'
                                                    : ''
                                            }
                                        `}
                                        onClick={() => handleClick(index)}
                                        disabled={
                                            square !== null || winner !== null
                                        }
                                    >
                                        {square}
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    onClick={resetScore}
                                    variant="outline"
                                    className="h-12 text-lg"
                                >
                                    <RotateCcw className="w-5 h-5 mr-2" />
                                    Reset Score
                                </Button>
                                <Button
                                    onClick={exitGame}
                                    variant="destructive"
                                    className="h-12 text-lg"
                                >
                                    <LogOut className="w-5 h-5 mr-2" />
                                    Exit Game
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Game Over Dialog */}
            <AlertDialog open={isWinner} onOpenChange={setIsWinner}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader>
                        <div className="flex justify-center mb-4">
                            {winner === 'draw' ? (
                                <div className="bg-gradient-to-r from-gray-400 to-gray-600 p-4 rounded-full">
                                    <Trophy className="w-12 h-12 text-white" />
                                </div>
                            ) : (
                                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-full animate-bounce">
                                    <Crown className="w-12 h-12 text-white" />
                                </div>
                            )}
                        </div>
                        <AlertDialogTitle className="text-3xl text-center">
                            {isTournamentComplete && tournamentWinner
                                ? `🎉 ${tournamentWinner.name} Wins the Tournament! 🎉`
                                : winner === 'draw'
                                ? "It's a Draw!"
                                : `${
                                      winner === 'X'
                                          ? players[0].name
                                          : players[1].name
                                  } Wins!`}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-lg space-y-2">
                            {isTournamentComplete ? (
                                <>
                                    <div className="text-xl font-bold mt-4">
                                        Final Score:
                                    </div>
                                    <div>
                                        {players[0].name}: {players[0].wins}{' '}
                                        wins
                                    </div>
                                    <div>
                                        {players[1].name}: {players[1].wins}{' '}
                                        wins
                                    </div>
                                </>
                            ) : tournamentMode ? (
                                <>
                                    Match {currentMatch} of {tournamentMode}{' '}
                                    complete!
                                </>
                            ) : (
                                <>Great game!</>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {isTournamentComplete ? (
                            <AlertDialogAction
                                onClick={exitGame}
                                className="w-full"
                            >
                                Back to Menu
                            </AlertDialogAction>
                        ) : (
                            <AlertDialogAction
                                onClick={resetGame}
                                className="w-full"
                            >
                                {tournamentMode && currentMatch < tournamentMode
                                    ? 'Next Match'
                                    : 'Play Again'}
                            </AlertDialogAction>
                        )}
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
