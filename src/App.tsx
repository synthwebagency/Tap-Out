import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Menu, X, ChevronRight, ChevronLeft, MapPin, Clock, Trophy } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

function EntryOverlay({ onComplete }: { onComplete: () => void, key?: string }) {
  const { scrollYProgress } = useScroll();
  
  // Transitions for the text
  const letterSpacing = useTransform(scrollYProgress, [0, 0.4], ['0.1em', '5em']);
  const opacity = useTransform(scrollYProgress, [0.7, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.7, 1], [1, 1.2]);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (v) => {
      if (v >= 0.95) {
        onComplete();
        window.scrollTo(0, 0); // Reset for main content
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, onComplete]);

  return (
    <div className="relative z-50">
      {/* Scrollable container to drive progress */}
      <div className="h-[300vh] w-full" />
      
      {/* Fixed UI */}
      <motion.div 
        style={{ opacity }}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div 
          style={{ scale }}
          className="w-full h-full flex flex-col items-center justify-center"
        >
          {/* Full Screen Entry Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/opening.jpg" 
              alt="Opening" 
              className="w-full h-full object-cover opacity-60 contrast-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <motion.h1 
              style={{ letterSpacing }}
              className="text-5xl sm:text-7xl md:text-9xl lg:text-[18rem] font-display text-white leading-[0.7] whitespace-nowrap"
            >
              TAPOUT
            </motion.h1>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-col items-center gap-6"
            >
              <p className="text-brand-red font-bold tracking-[2em] uppercase animate-pulse text-xs md:text-sm border-y border-brand-red/20 py-4 px-8">
                SCROLL TO ENTER
              </p>
              <button 
                onClick={onComplete}
                className="text-white/40 hover:text-brand-red transition-colors text-[10px] tracking-[0.3em] font-bold uppercase underline underline-offset-4 cursor-pointer"
              >
                OR CLICK HERE TO SKIP
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'SENSEIS', path: '/senseis' },
    { name: 'TIMETABLE', path: '/timetable' },
    { name: 'CLASSES', path: '/classes' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 md:py-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-full">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 md:gap-3 cursor-pointer group"
        >
          <img 
            src="/images/logo.png" 
            alt="TAPOUT Logo" 
            className="w-8 h-8 md:w-12 md:h-12 object-contain group-hover:invert transition-all duration-500 rounded-lg border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="text-xl md:text-3xl font-display group-hover:text-brand-red transition-all duration-300">
            TAPOUT
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 lg:gap-12">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "text-sm font-bold tracking-widest transition-all hover:text-brand-red uppercase",
                location.pathname === item.path ? "text-brand-red" : "text-white/70"
              )}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/10 p-8 flex flex-col gap-6 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={cn(
                  "text-2xl font-display text-left hover:text-brand-red transition-colors uppercase",
                  location.pathname === item.path ? "text-brand-red" : "text-white"
                )}
              >
                {item.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// --- Pages ---

function Home() {
  const navigate = useNavigate();

  return (
    <div className="pt-24 space-y-24">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-neutral-900">
          <video 
            src="/images/hero_video.mp4" 
            autoPlay 
            muted 
            loop 
            playsInline
            poster="/images/opening.jpg"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
        
        <div className="relative z-10 text-center px-4 space-y-6">
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl sm:text-7xl md:text-9xl font-display tracking-tight leading-[0.8]"
          >
            TRAIN LIKE A <span className="text-brand-red">FIGHTER</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl font-bold tracking-[0.5em] text-white/60"
          >
            NO LIMITS. NO EXCUSES.
          </motion.p>
          <motion.button 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/classes')}
            className="mt-8 px-12 py-4 bg-brand-red hover:bg-white hover:text-black transition-all font-bold tracking-widest text-lg aggressive-glow"
          >
            BROWSE CLASSES
          </motion.button>
        </div>
      </section>

      {/* Short Intro */}
      <section className="max-w-4xl mx-auto px-8 text-center space-y-8">
        <h2 className="text-4xl md:text-6xl text-white">ELITE MMA TRAINING FACILITY</h2>
        <p className="text-xl text-white/60 leading-relaxed font-light">
          WE PROVIDE A HIGH-LEVEL ENVIRONMENT FOR ATHLETES AND ENTHUSIASTS. 
          OUR TRAINING IS DESIGNED TO PUSH YOUR LIMITS IN MULTIPLE COMBAT DISCIPLINES.
          EXPERIENCE A REAL FIGHT ENVIRONMENT WITH THE BEST COACHES IN THE WORLD.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="p-8 border border-white/5 bg-white/5 space-y-4">
            <Trophy className="mx-auto text-brand-red" size={40} />
            <h3 className="text-2xl">ELITE FIGHTERS</h3>
            <p className="text-sm text-white/40">TRAIN BESIDE CHAMPIONS</p>
          </div>
          <div className="p-8 border border-white/5 bg-white/5 space-y-4">
            <Clock className="mx-auto text-brand-red" size={40} />
            <h3 className="text-2xl">DISCIPLINE</h3>
            <p className="text-sm text-white/40">NEVER SETTLE FOR LESS</p>
          </div>
          <div className="p-8 border border-white/5 bg-white/5 space-y-4">
            <MapPin className="mx-auto text-brand-red" size={40} />
            <h3 className="text-2xl">COMBAT READY</h3>
            <p className="text-sm text-white/40">REAL WORLD APPLICATION</p>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/10 text-center space-y-8">
        <div className="text-5xl font-display opacity-20">TAPOUT</div>
        <div className="flex flex-col items-center gap-4 text-white/50">
          <div className="flex items-center gap-2 hover:text-brand-red cursor-pointer transition-colors px-4 py-2 border border-white/5">
            <MapPin size={18} />
            <a 
              href="https://www.google.com/maps/search/?api=1&query=Delta+Park+School,+Standard+Dr,+Blairgowrie,+Johannesburg,+2123,+South+Africa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase font-bold"
            >
              DELTA PARK SCHOOL, BLAIRGOWRIE, JOHANNESBURG
            </a>
          </div>
          <p className="text-white/30 text-xs tracking-widest">© 2026 TAPOUT MMA ACADEMY. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  );
}

function SenseisPage() {
  const senseis = [    { 
      name: "JON JONES", 
      discipline: "MMA", 
      bio: "A master of strategy and control, holding multiple UFC titles across divisions. Teaches dominance through precision and adaptability.",
      img: "/images/mma_jon_jones.jpg"
    },
    { 
      name: "CANELO ÁLVAREZ", 
      discipline: "BOXING", 
      bio: "A champion of four divisions, perfected in timing and counterpunching. Teaches patience, precision, and calculated power.",
      img: "/images/home/boxing_canelo_alvarez.jpg"
    },
    { 
      name: "CHARLES OLIVEIRA", 
      discipline: "JIU JITSU", 
      bio: "A submission master and former UFC champion with relentless finishing ability. Teaches fearlessness and lethal technique.",
      img: "/images/home/jiu_jitsu_charles_oliveira.jpg"
    },
    { 
      name: "KHABIB NURMAGOMEDOV", 
      discipline: "WRESTLING", 
      bio: "An undefeated champion who ruled through pressure and control. Teaches discipline, dominance, and ground mastery.",
      img: "/images/wrestling_khabib_nurmagomedov.jpg"
    },
    { 
      name: "RODTANG JITMUANGNON", 
      discipline: "MUAY THAI", 
      bio: "A striking warrior and world champion known for relentless aggression. Teaches toughness, pressure, and heart.",
      img: "/images/muay_thai_rodtang_jitmuangnon.jpg"
    },
    { 
      name: "ISLAM MAKHACHEV", 
      discipline: "JUDO", 
      bio: "A dominant champion with elite grappling and control. Teaches efficiency, balance, and quiet dominance.",
      img: "/images/judo_islam_makhachev.jpg"
    },
  ];

  return (
    <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto space-y-16">
      <h1 className="text-6xl md:text-8xl text-center">MEET OUR <span className="text-brand-red">SENSEIS</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {senseis.map((s, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative bg-white/5 border border-white/10 overflow-hidden"
          >
            <div className="aspect-[3/4] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
              <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="p-6 space-y-2 relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-brand-red px-3 py-1 text-xs font-bold tracking-widest">{s.discipline}</div>
              <h3 className="text-3xl">{s.name}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{s.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TimetablePage() {
  const schedule = [
    { time: "06:00 AM", mon: "MMA", tue: "BOXING", wed: "JIU JITSU", thu: "MMA", fri: "MUAY THAI", sat: "SPARRING" },
    { time: "10:00 AM", mon: "JUDO", tue: "WRESTLING", wed: "KIDS", thu: "JUDO", fri: "BOXING", sat: "SPARRING" },
    { time: "05:00 PM", mon: "MUAY THAI", tue: "MMA", wed: "JIU JITSU", thu: "BOXING", fri: "WRESTLING", sat: "CLOSED" },
    { time: "07:00 PM", mon: "JIU JITSU", tue: "BOXING", wed: "MMA", thu: "WRESTLING", fri: "MUAY THAI", sat: "CLOSED" },
  ];

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-8xl text-center underline decoration-brand-red underline-offset-8">TIMETABLE</h1>
        <p className="text-brand-red tracking-[0.2em] md:tracking-[0.5em] font-bold text-sm md:text-base">BOYS AND GIRLS TRAIN TOGETHER</p>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar">
        <table className="w-full text-left border-collapse border border-white/10 min-w-[800px]">
          <thead>
            <tr className="bg-brand-red">
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">TIME</th>
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">MON</th>
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">TUE</th>
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">WED</th>
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">THU</th>
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">FRI</th>
              <th className="p-4 md:p-6 text-sm md:text-xl tracking-widest">SAT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {schedule.map((row, idx) => (
              <motion.tr 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="hover:bg-white/5 transition-colors"
              >
                <td className="p-4 md:p-6 font-bold text-white/50 text-xs md:text-base">{row.time}</td>
                <td className="p-4 md:p-6 font-display text-lg md:text-2xl group hover:text-brand-red cursor-pointer transition-colors">{row.mon}</td>
                <td className="p-4 md:p-6 font-display text-lg md:text-2xl group hover:text-brand-red cursor-pointer transition-colors">{row.tue}</td>
                <td className="p-4 md:p-6 font-display text-lg md:text-2xl group hover:text-brand-red cursor-pointer transition-colors">{row.wed}</td>
                <td className="p-4 md:p-6 font-display text-lg md:text-2xl group hover:text-brand-red cursor-pointer transition-colors">{row.thu}</td>
                <td className="p-4 md:p-6 font-display text-lg md:text-2xl group hover:text-brand-red cursor-pointer transition-colors">{row.fri}</td>
                <td className="p-4 md:p-6 font-display text-lg md:text-2xl group hover:text-brand-red cursor-pointer transition-colors text-brand-red">{row.sat}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-8 border border-brand-red text-center">
        <p className="text-xl italic">"SPARRING IS COMPULSORY ON SATURDAYS. BE READY FOR COMBAT."</p>
      </div>
    </div>
  );
}

function ClassesPage() {
  const navigate = useNavigate();
  const classes = [
    { name: "MMA", img: "/images/mma.jpg", id: "mma" },
    { name: "BOXING", img: "/images/boxing.jpg", id: "boxing" },
    { name: "JIU JITSU", img: "/images/jiu_jitsu.jpg", id: "jiu-jitsu" },
    { name: "JUDO", img: "/images/judo.jpg", id: "judo" },
    { name: "WRESTLING", img: "/images/wrestling.jpg", id: "wrestling" },
    { name: "MUAY THAI", img: "/images/muay_thai.jpg", id: "muay-thai" },
  ];

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      <h1 className="text-5xl md:text-8xl text-center">OUR <span className="text-brand-red">CLASSES</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {classes.map((c) => (
          <motion.div 
            key={c.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate(`/sport/${c.id}`)}
            className="group relative h-72 md:h-96 overflow-hidden cursor-pointer border border-white/10"
          >
            <img src={c.img} alt={c.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
              <h3 className="text-4xl md:text-6xl text-white group-hover:text-brand-red transition-colors">{c.name}</h3>
              <div className="flex items-center gap-2 text-brand-red font-bold tracking-widest mt-2 overflow-hidden w-0 group-hover:w-48 transition-all duration-500">
                EXPLORE <ChevronRight size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-brand-red p-8 md:p-12 text-center space-y-4">
        <h2 className="text-3xl md:text-6xl">FULL GYM EQUIPMENT AVAILABLE</h2>
        <p className="text-xs md:text-base tracking-widest opacity-80 font-bold uppercase">FREE USE FOR ALL ELITE MEMBERS</p>
      </div>
    </div>
  );
}

function SportDetailPage() {
  const { id } = useLocation().pathname.split('/').pop() ? { id: useLocation().pathname.split('/').pop() } : { id: '' };
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const sportData: Record<string, any> = {
    'boxing': {
      title: "BOXING",
      slides: [
        { title: "PADWORK", line1: "IMPROVES SPEED AND ACCURACY.", line2: "BUILDS TIMING AND COMBINATIONS.", img: "/images/boxingpadwork.jpg" },
        { title: "SPARRING", line1: "SIMULATES REAL FIGHT CONDITIONS.", line2: "DEVELOPS REACTION AND DEFENSE.", img: "/images/boxingsparring.jpg" },
        { title: "HEAVY BAG", line1: "BUILDS POWER AND ENDURANCE.", line2: "IMPROVES STRIKING TECHNIQUE.", img: "/images/boxingheavybag.jpg" },
      ]
    },
    'mma': {
      title: "MMA",
      slides: [
        { title: "CAGE WORK", line1: "LEARN TO USE THE CAGE.", line2: "CONTROL YOUR OPPONENT.", img: "/images/mmacagework.jpg" },
        { title: "GROUND & POUND", line1: "AGGRESSIVE STRIKING FROM TOP.", line2: "FINISH THE FIGHT.", img: "/images/mmagroundandpound.jpg" },
        { title: "SCRAMBLES", line1: "DYNAMIC TRANSITIONS.", line2: "NEVER STAY DOWN.", img: "/images/mmascrambles.jpg" },
      ]
    },
    'jiu-jitsu': {
      title: "JIU JITSU",
      slides: [
        { title: "DRILLING", line1: "REPETITION IS KEY.", line2: "MASTER THE TRANSITION.", img: "/images/jiujitsudrilling.jpg" },
        { title: "ROLLING", line1: "LIVE APPLICATION.", line2: "TEST YOUR TECHNIQUES.", img: "/images/jiujitsurolling.jpg" },
        { title: "SUBMISSIONS", line1: "ELITE FINISHES.", line2: "FORCE THE TAP.", img: "/images/jiujitsusubmissions.jpg" },
      ]
    },
    'judo': {
      title: "JUDO",
      slides: [
        { title: "UCHI-KOMI", line1: "PERFECT YOUR TECHNIQUE.", line2: "SPEED AND ACCURACY.", img: "/images/judouchikomi.jpg" },
        { title: "RANDORI", line1: "FREE PRACTICE SPARRING.", line2: "APPLY LEVERAGE AND TIMING.", img: "/images/judorandori.jpg" },
        { title: "THROWS", line1: "DOMINATE THE STANDING FIGHT.", line2: "EXPLOSIVE EXECUTION.", img: "/images/judothrows.jpg" },
      ]
    },
    'wrestling': {
      title: "WRESTLING",
      slides: [
        { title: "TAKEDOWNS", line1: "AGGRESSIVE LEVEL CHANGES.", line2: "CHAIN WRESTLING SKILLS.", img: "/images/wrestlingtakedowns.jpg" },
        { title: "CONTROL", line1: "PIN YOUR OPPONENT.", line2: "DOMINATE THE MAT.", img: "/images/wrestlingcontrol.jpg" },
        { title: "ESCAPE", line1: "GET BACK TO YOUR FEET.", line2: "NEVER GET PINNED.", img: "/images/wrestlingescape.jpg" },
      ]
    },
    'muay-thai': {
      title: "MUAY THAI",
      slides: [
        { title: "CLINCH", line1: "CONTROL THE NECK.", line2: "ELBOWS AND KNEES.", img: "/images/muaythaiclinch.jpg" },
        { title: "POWER KICKS", line1: "SHATTER DEFENSES.", line2: "UNMATCHED LEG STRENGTH.", img: "/images/muaythaipowerkicks.jpg" },
        { title: "COMBINATIONS", line1: "FLOW THROUGH STRIKES.", line2: "AGGRESSION REFINED.", img: "/images/muaythaicombinations.jpg" },
      ]
    },
  };

  const data = sportData[id as string] || sportData['boxing']; // Default to boxing if not found for demo

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % data.slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + data.slides.length) % data.slides.length);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="relative h-full w-full"
        >
          <img src={data.slides[currentSlide].img} className="absolute inset-0 w-full h-full object-cover scale-105" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="relative h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
            <h2 className="text-brand-red text-2xl tracking-[1em] mb-4">{data.title}</h2>
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-display tracking-tighter leading-none"
            >
              {data.slides[currentSlide].title}
            </motion.h1>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-1 text-base md:text-2xl lg:text-3xl text-white font-bold tracking-[0.1em] md:tracking-[0.2em] max-w-lg md:max-w-2xl border-y border-white/20 py-4 md:py-6"
            >
              <p>{data.slides[currentSlide].line1}</p>
              <p className="text-brand-red">{data.slides[currentSlide].line2}</p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => navigate('/classes')} className="absolute top-8 left-8 text-white hover:text-brand-red z-50 flex items-center gap-2 tracking-widest font-bold">
        <ChevronLeft /> BACK TO CLASSES
      </button>

      <div className="absolute bottom-6 md:bottom-12 left-0 w-full flex justify-between px-6 md:px-12 items-center">
        <div className="flex gap-2 md:gap-4">
          <button onClick={prevSlide} className="p-3 md:p-4 border border-white/20 hover:border-brand-red hover:bg-brand-red transition-all">
            <ChevronLeft size={24} className="md:w-8 md:h-8" />
          </button>
          <button onClick={nextSlide} className="p-3 md:p-4 border border-white/20 hover:border-brand-red hover:bg-brand-red transition-all">
            <ChevronRight size={24} className="md:w-8 md:h-8" />
          </button>
        </div>
        <div className="text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] font-bold">
          {currentSlide + 1} / {data.slides.length}
        </div>
      </div>
    </div>
  );
}

// --- Main App Logic ---

export default function App() {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Control scroll when overlay is active
    if (showOverlay) {
      document.body.style.overflowY = 'scroll'; // Keep scrollbar visible but let spacers drive it
    } else {
      document.body.style.overflowY = 'auto';
    }
  }, [showOverlay]);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-brand-red selection:text-white flex flex-col">
        <AnimatePresence>
          {showOverlay && (
            <EntryOverlay key="overlay" onComplete={() => setShowOverlay(false)} />
          )}
        </AnimatePresence>
        
        {!showOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="flex-1"
          >
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/senseis" element={<SenseisPage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/sport/:id" element={<SportDetailPage />} />
            </Routes>
          </motion.div>
        )}
      </div>
    </Router>
  );
}
