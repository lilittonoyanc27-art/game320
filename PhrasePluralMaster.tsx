import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  Trophy, 
  RotateCcw, 
  Star,
  CheckCircle2,
  XCircle,
  Wand2,
  ScrollText,
  Volume2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PhraseExercise {
  id: number;
  singular: string;
  plural: string;
  translation: string;
}

const EXERCISES: PhraseExercise[] = [
  { id: 1, singular: "El gato es negro", plural: "Los gatos son negros", translation: "Կատուները սև են" },
  { id: 2, singular: "La perra es pequeña", plural: "Las perras son pequeñas", translation: "Շները փոքր են" },
  { id: 3, singular: "El niño es alto", plural: "Los niños son altos", translation: "Տղաները բարձրահասակ են" },
  { id: 4, singular: "La amiga es simpática", plural: "Las amigas son simpáticas", translation: "Ընկերուհիները համակրելի են" },
  { id: 5, singular: "El libro es nuevo", plural: "Los libros son nuevos", translation: "Գրքերը նոր են" },
  { id: 6, singular: "La casa es grande", plural: "Las casas son grandes", translation: "Տները մեծ են" },
  { id: 7, singular: "El coche es rápido", plural: "Los coches son rápidos", translation: "Մեքենաները արագ են" },
  { id: 8, singular: "La flor es roja", plural: "Las flores son rojas", translation: "Ծաղիկները կարմիր են" },
  { id: 9, singular: "El árbol es verde", plural: "Los árboles son verdes", translation: "Ծառերը կանաչ են" },
  { id: 10, singular: "La ciudad es bella", plural: "Las ciudades son bellas", translation: "Քաղաքները գեղեցիկ են" },
  { id: 11, singular: "El profesor es serio", plural: "Los profesores son serios", translation: "Ուսուցիչները լուրջ են" },
  { id: 12, masculine: "El alumno es bueno", plural: "Los alumnos son buenos", translation: "Աշակերտները լավն են" },
  { id: 13, singular: "La canción es larga", plural: "Las canciones son largas", translation: "Երգերը երկար են" },
  { id: 14, singular: "El país es lejano", plural: "Los países son lejanos", translation: "Երկրները հեռու են" },
  { id: 15, singular: "La mujer es fuerte", plural: "Las mujeres son fuertes", translation: "Կանայք ուժեղ են" },
  { id: 16, singular: "El hombre es joven", plural: "Los hombres son jóvenes", translation: "Տղամարդիկ երիտասարդ են" },
  { id: 17, singular: "La luz es blanca", plural: "Las luces son blancas", translation: "Լույսերը սպիտակ են" },
  { id: 18, singular: "El perro es gordo", plural: "Los perros son gordos", translation: "Շները գեր են" },
  { id: 19, singular: "La ventana es limpia", plural: "Las ventanas son limpias", translation: "Պատուհանները մաքուր են" },
  { id: 20, singular: "El camino es difícil", plural: "Los caminos son difíciles", translation: "Ճանապարհները դժվար են" }
].map(item => ({ ...item, singular: item.singular || (item as any).masculine })); // Fallback if typo

const speak = (text: string) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export default function PhrasePluralMaster() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'feedback' | 'finish'>('intro');
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);

  const currentEx = EXERCISES[currentIdx];

  // Generate options
  useEffect(() => {
    if (gameState === 'playing') {
      const correct = currentEx.plural;
      const parts = correct.split(' '); // [Los, gatos, son, negros]
      const [art, noun, son, adj] = parts;
      
      const sParts = currentEx.singular.split(' '); // [El, gato, es, negro]
      
      // Fake options
      const fake1 = `${sParts[0]}s ${noun} ${son} ${adj}`; // Els gatos son negros (Els is not Spanish)
      const fake2 = `${art} ${sParts[1]} ${son} ${adj}`; // Los gato son negros
      const fake3 = `${art} ${noun} es ${adj}`; // Los gatos es negros
      const fake4 = `${art} ${noun} ${son} ${sParts[3]}`; // Los gatos son negro
      
      const set = new Set([correct]);
      const distractors = [fake1, fake2, fake3, fake4].filter(f => f !== correct);
      
      while (set.size < 3 && distractors.length > 0) {
        const idx = Math.floor(Math.random() * distractors.length);
        set.add(distractors[idx]);
        distractors.splice(idx, 1);
      }
      
      setOptions(Array.from(set).sort(() => Math.random() - 0.5));
      setSelectedOpt(null);
    }
  }, [currentIdx, gameState]);

  const handleSelect = (opt: string) => {
    if (gameState !== 'playing') return;
    setSelectedOpt(opt);
    setGameState('feedback');
    
    if (opt === currentEx.plural) {
      setScore(s => s + 1);
      speak(currentEx.plural);
      if (currentIdx === EXERCISES.length - 1) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const next = () => {
    if (currentIdx < EXERCISES.length - 1) {
      setCurrentIdx(i => i + 1);
      setGameState('playing');
    } else {
      setGameState('finish');
    }
  };

  const restart = () => {
    setCurrentIdx(0);
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500 overflow-hidden flex flex-col items-center">
      
      {/* Neo Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a]" />
        <div className="absolute top-1/3 left-1/4 w-[60vw] h-[60vw] bg-cyan-500/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[50vw] h-[50vw] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <header className="w-full max-w-5xl p-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 backdrop-blur-md">
            <ScrollText className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter uppercase leading-none">Plural</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/60">Academia de Frases</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white/5 px-6 py-2 rounded-full border border-white/10">
          <Star className="text-cyan-400" size={16} fill="currentColor" />
          <span className="font-black text-lg tracking-tighter">{score}</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">

          {gameState === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-10"
            >
              <div className="space-y-4">
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="w-32 h-32 bg-cyan-600 rounded-[2.5rem] mx-auto flex items-center justify-center shadow-2xl border-4 border-white/10"
                >
                  <Sparkles size={64} />
                </motion.div>
                <h2 className="text-6xl font-black italic tracking-tighter uppercase leading-none">
                  PODER <br /><span className="text-cyan-400">PLURAL</span>
                </h2>
                <p className="max-w-xs mx-auto text-white/40 font-bold uppercase text-[10px] tracking-[0.4em] leading-relaxed">
                  Փոխիր նախադասությունները մենակիից հոգնակի և հաղթահարիր բոլոր մակարդակները։
                </p>
              </div>

              <button 
                onClick={() => setGameState('playing')}
                className="px-12 py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Սկսել
              </button>
            </motion.div>
          )}

          {(gameState === 'playing' || gameState === 'feedback') && (
            <motion.div 
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full space-y-12"
            >
               <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-10 md:p-20 text-center space-y-12 relative overflow-hidden shadow-2xl">
                  {/* Progress Line */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-white/5">
                    <motion.div 
                      className="h-full bg-cyan-500" 
                      animate={{ width: `${(currentIdx / EXERCISES.length) * 100}%` }}
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">Singular (Մեկ)</span>
                      <h3 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                        {currentEx.singular}
                      </h3>
                      <p className="text-xs font-bold text-white/20 uppercase tracking-widest">{currentEx.translation}</p>
                    </div>

                    <div className="flex justify-center">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                        <ChevronRight className="rotate-90 text-white/10" size={48} />
                      </motion.div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-400">Plural (Շատ)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {options.map(opt => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(opt)}
                        disabled={gameState === 'feedback'}
                        className={`group py-8 px-4 rounded-[2.5rem] border-2 font-black italic text-xl uppercase transition-all shadow-xl
                          ${gameState === 'feedback' 
                            ? opt === currentEx.plural 
                              ? 'bg-cyan-500 border-white text-white scale-105' 
                              : selectedOpt === opt ? 'bg-rose-500 border-white text-white' : 'bg-white/5 border-white/5 text-white/10'
                            : 'bg-white/5 border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
                          }
                        `}
                      >
                        {opt}
                        <div className="text-[10px] mt-2 opacity-40 group-hover:opacity-100 transition-opacity uppercase tracking-widest leading-none">
                           {opt.split(' ').map((p, i) => <span key={i}>{p} {i < opt.split(' ').length-1 ? '+ ' : ''}</span>)}
                        </div>
                      </button>
                    ))}
                  </div>

                  <AnimatePresence>
                    {gameState === 'feedback' && (
                      <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="flex flex-col items-center gap-6 pt-6"
                      >
                         <div className={`p-4 rounded-2xl flex items-center gap-3 font-black uppercase text-xs tracking-widest ${selectedOpt === currentEx.plural ? 'text-cyan-400' : 'text-rose-400'}`}>
                           {selectedOpt === currentEx.plural ? (
                             <><CheckCircle2 /> CORRECTO</>
                           ) : (
                             <><XCircle /> INCORRECTO: {currentEx.plural}</>
                           )}
                         </div>

                         <button 
                          onClick={next}
                          className="px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-cyan-50 transition-colors shadow-2xl"
                         >
                           SIGUIENTE <ChevronRight size={16} />
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </motion.div>
          )}

          {gameState === 'finish' && (
            <motion.div 
              key="finish"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-12"
            >
               <div className="space-y-6">
                  <div className="w-48 h-48 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl border-8 border-white/10">
                    <Trophy size={96} className="text-white animate-bounce" />
                  </div>
                  <h2 className="text-7xl font-black italic tracking-tighter uppercase leading-none">
                    ¡ACADEMIA<br /><span className="text-cyan-400">TERMINADA!</span>
                  </h2>
                  <div className="inline-block px-10 py-6 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-2">PUNTUACIÓN</p>
                     <p className="text-6xl font-black italic text-cyan-400">{score} <span className="text-white/20 text-2xl">/ {EXERCISES.length}</span></p>
                  </div>
               </div>

               <button 
                onClick={restart}
                className="px-12 py-6 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm shadow-2xl flex items-center gap-3 mx-auto"
               >
                 <RotateCcw size={20} /> REPETIR
               </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="w-full p-12 text-center opacity-10 relative z-10 select-none">
         <p className="text-[10px] font-black uppercase tracking-[1em]">Plural Master v2.0</p>
      </footer>
    </div>
  );
}
