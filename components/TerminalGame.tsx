import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, ShieldAlert, Cpu, User, Skull } from 'lucide-react';

interface TerminalGameProps {
  onClose: () => void;
}

type Player = 'X' | 'O' | null;
type GamePhase = 'SETUP' | 'PLAYING' | 'GAMEOVER';
type Difficulty = 'MEDIUM' | 'IMPOSSIBLE';

export const TerminalGame: React.FC<TerminalGameProps> = ({ onClose }) => {
  const [phase, setPhase] = useState<GamePhase>('SETUP');
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [showCowardMessage, setShowCowardMessage] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('MEDIUM');

  // --- LOGIC ---

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return squares.includes(null) ? null : 'DRAW';
  };

  const minimax = (squares: Player[], depth: number, isMaximizing: boolean): number => {
    const result = checkWinner(squares);
    if (result === 'O') return 10 - depth;
    if (result === 'X') return depth - 10;
    if (result === 'DRAW') return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                squares[i] = 'O';
                const score = minimax(squares, depth + 1, false);
                squares[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (squares[i] === null) {
                squares[i] = 'X';
                const score = minimax(squares, depth + 1, true);
                squares[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
  };

  const getBestMove = (currentBoard: Player[]) => {
      let bestScore = -Infinity;
      let move = -1;
      const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      
      // Optimization: First move center or corner
      if (available.length >= 8) {
        if (currentBoard[4] === null) return 4;
        return available[Math.floor(Math.random() * available.length)];
      }

      for (let i of available) {
          const tempBoard = [...currentBoard];
          tempBoard[i] = 'O';
          const score = minimax(tempBoard, 0, false);
          if (score > bestScore) {
              bestScore = score;
              move = i;
          }
      }
      return move;
  }

  const getRandomMove = (currentBoard: Player[]) => {
      const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
      if (available.length === 0) return -1;
      return available[Math.floor(Math.random() * available.length)];
  }

  const aiTurn = (currentBoard: Player[]) => {
    const available = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null) as number[];
    if (available.length === 0) return;

    let move: number = -1;

    if (difficulty === 'IMPOSSIBLE') {
        move = getBestMove(currentBoard);
    } else {
        // MEDIUM: 60% Chance of playing perfectly, 40% chance of random error
        if (Math.random() > 0.4) {
            move = getBestMove(currentBoard);
        } else {
            move = getRandomMove(currentBoard);
        }
    }

    if (move === -1) move = getRandomMove(currentBoard);

    const newBoard = [...currentBoard];
    newBoard[move] = 'O';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) setWinner(result);
    setIsPlayerTurn(true);
  };

  const handleCellClick = (i: number) => {
    if (board[i] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[i] = 'X';
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => aiTurn(newBoard), 600);
    }
  };

  const handleStart = (playerStarts: boolean) => {
    setPhase('PLAYING');
    setIsPlayerTurn(playerStarts);
    if (!playerStarts) {
        // AI starts
        setTimeout(() => aiTurn(board), 800);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setPhase('SETUP');
    // Keep difficulty setting for replay unless explicitly changed
  };

  const handleEasyMode = () => {
      setShowCowardMessage(true);
      setTimeout(() => {
          onClose();
      }, 2500);
  }

  return (
    // Added pb-32 to lift the modal up and avoid overlapping with the bottom navbar
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pb-32">
      <motion.div 
        // @ts-ignore
        {...{ initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 } } as any}
        className="relative w-full max-w-md bg-[#0c0c0c] border border-primary/50 rounded-xl shadow-[0_0_50px_rgba(255,77,0,0.2)] overflow-hidden flex flex-col p-8 min-h-[460px]"
      >
        {/* Decorators */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary/50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary/50" />

        <AnimatePresence mode="wait">
            {showCowardMessage ? (
                <motion.div 
                    key="coward"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full flex-grow py-10"
                >
                     <ShieldAlert size={64} className="text-red-600 mb-6 animate-pulse" />
                     <h2 className="text-4xl font-display font-bold text-red-600 tracking-widest text-center leading-tight">
                         I DON'T LIKE<br/>COWARDS.
                     </h2>
                     <div className="mt-8 text-[10px] font-mono text-red-800 animate-pulse">TERMINATING SESSION...</div>
                </motion.div>
            ) : (
                <div className="flex flex-col h-full w-full">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 shrink-0">
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-widest">TACTICAL_SIM</h2>
                            <div className="flex items-center gap-2">
                                <div className={`text-[10px] font-mono animate-pulse ${difficulty === 'IMPOSSIBLE' ? 'text-red-500 font-bold' : 'text-primary'}`}>
                                    MODE: {difficulty}
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-dim hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {phase === 'SETUP' && (
                        <div className="flex flex-col gap-4 text-center h-full justify-between">
                            <div>
                                <div className="mb-4 text-gray-400 text-sm font-mono">INITIATIVE_SELECTION</div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button 
                                        onClick={() => handleStart(true)}
                                        className="p-6 border border-white/10 rounded bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all group flex flex-col items-center gap-3"
                                    >
                                        <User size={32} className="text-gray-400 group-hover:text-primary transition-colors" />
                                        <span className="text-xs font-mono font-bold">I START</span>
                                    </button>
                                    <button 
                                        onClick={() => handleStart(false)}
                                        className="p-6 border border-white/10 rounded bg-white/5 hover:bg-white/10 hover:border-secondary/50 transition-all group flex flex-col items-center gap-3"
                                    >
                                        <Cpu size={32} className="text-gray-400 group-hover:text-secondary transition-colors" />
                                        <span className="text-xs font-mono font-bold">CPU STARTS</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-3">
                                <button 
                                    onClick={handleEasyMode}
                                    className="w-full py-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-green-500 hover:text-green-500 transition-all text-[10px] font-mono text-dim flex items-center justify-center gap-2 group"
                                >
                                    <ShieldAlert size={14} className="group-hover:text-green-500" /> 
                                    <span>ENABLE EASY MODE</span>
                                </button>
                                
                                <button 
                                    onClick={() => {
                                        setDifficulty(prev => prev === 'MEDIUM' ? 'IMPOSSIBLE' : 'MEDIUM');
                                    }}
                                    className={`w-full py-3 border rounded transition-all text-[10px] font-mono flex items-center justify-center gap-2 group
                                        ${difficulty === 'IMPOSSIBLE' 
                                            ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20' 
                                            : 'bg-white/5 border-white/10 text-dim hover:bg-white/10 hover:border-red-500 hover:text-red-500'
                                        }`}
                                >
                                    <Skull size={14} /> 
                                    <span>{difficulty === 'IMPOSSIBLE' ? 'DISABLE IMPOSSIBLE MODE' : 'ENABLE IMPOSSIBLE MODE'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {phase === 'PLAYING' && (
                        <div className="flex flex-col items-center h-full">
                            <div className="mb-6 text-center h-8 shrink-0">
                                {winner ? (
                                    <div className={`text-xl font-bold font-mono tracking-wider ${winner === 'X' ? 'text-green-500' : winner === 'O' ? 'text-red-500' : 'text-yellow-500'} animate-pulse`}>
                                        {winner === 'X' ? '>> VICTORY <<' : winner === 'O' ? '>> DEFEAT <<' : '>> STALEMATE <<'}
                                    </div>
                                ) : (
                                    <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
                                        TURN: <span className={isPlayerTurn ? 'text-primary font-bold' : 'text-secondary font-bold'}>{isPlayerTurn ? 'PLAYER' : 'AI_CORE'}</span>
                                        {!isPlayerTurn && <div className="w-2 h-2 bg-secondary rounded-full animate-ping" />}
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-3 mb-8 grow-0">
                                {board.map((cell, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleCellClick(i)}
                                        disabled={!!cell || !!winner || !isPlayerTurn}
                                        className={`w-16 h-16 sm:w-20 sm:h-20 border border-white/10 rounded bg-black/50 flex items-center justify-center text-3xl sm:text-4xl font-bold font-display transition-all duration-200
                                            ${!cell && !winner && isPlayerTurn ? 'hover:bg-white/10 hover:border-primary/50' : ''}
                                            ${cell === 'X' ? 'text-primary shadow-[0_0_15px_rgba(255,77,0,0.3)] border-primary/30' : ''}
                                            ${cell === 'O' ? 'text-secondary shadow-[0_0_15px_rgba(0,240,255,0.3)] border-secondary/30' : ''}
                                        `}
                                    >
                                        {cell}
                                    </button>
                                ))}
                            </div>

                            {winner && (
                                <button onClick={resetGame} className="flex items-center gap-2 px-6 py-2 border border-white/20 rounded hover:bg-white/10 text-white font-mono text-xs tracking-widest transition-colors">
                                    <RotateCcw size={14} /> SYSTEM_RESET
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};