import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2, Search, Settings, LayoutGrid, Info } from 'lucide-react';
// Uvozimo iz istog (src) foldera
import playlistData from './playlist.json';
import PlaylistGrid from './components/PlaylistGrid';

const App = () => {
  // Utility za čišćenje naziva (ako već nisu očišćeni u JSON-u)
  const cleanMetadata = (text) => {
    if (!text) return '';
    return text
      .replace(/^\d+[\s.-]+/, '')
      .replace(/Live\s+/gi, '')
      .replace(/Kafansko ve[čc]e/gi, '')
      .replace(/Official Video/gi, '')
      .replace(/\(Live\)/gi, '')
      .trim();
  };

  const getInitialVolume = () => {
    const saved = localStorage.getItem('veranda_volume');
    return saved ? parseFloat(saved) : 0.8;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const [fullPlaylist] = useState(playlistData.map(t => ({
    ...t,
    displayTitle: cleanMetadata(t.title),
    displayArtist: cleanMetadata(t.artist)
  })));

  const [displayPlaylist, setDisplayPlaylist] = useState(fullPlaylist);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(getInitialVolume());
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [view, setView] = useState('library');
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const howlRef = useRef(null);

  const THEME = {
    primary: '#D1FF26',
    bgApp: 'bg-zinc-950',
    bgCard: 'bg-zinc-900/10',
  };

  useEffect(() => {
    let filtered = [...fullPlaylist];
    if (activeFilter && activeFilter !== 'RESTORAN_VERANDA_Standard') {
      const tag = activeFilter.toLowerCase();
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(tag) ||
        track.artist.toLowerCase().includes(tag)
      );
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
      );
    }
    setDisplayPlaylist(filtered);
  }, [searchQuery, activeFilter, fullPlaylist]);

  const playTrack = (track) => {
    if (howlRef.current) {
      howlRef.current.stop();
      howlRef.current.unload();
    }

    setProgress(0);
    setCurrentTime(0);

    // Putanja usklađena sa tvojom novom strukturom unutar public foldera
    const audioPath = `/RESTORAN_VERANDA_Standard/muzika/${track.file_name}`;

    const sound = new Howl({
      src: [audioPath],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        requestAnimationFrame(updateProgress);
      },
      onload: () => {
        const dur = sound.duration();
        if (dur && dur !== Infinity) setDuration(dur);
      },
      onpause: () => setIsPlaying(false),
      onstop: () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      },
      onend: () => skipNext(),
    });

    howlRef.current = sound;
    setCurrentTrack(track);
    sound.play();
  };

  const updateProgress = () => {
    if (howlRef.current && howlRef.current.playing()) {
      const seek = howlRef.current.seek();
      const dur = howlRef.current.duration();
      if (typeof seek === 'number') {
        setCurrentTime(seek);
        if (dur > 0) setProgress((seek / dur) * 100);
      }
      requestAnimationFrame(updateProgress);
    }
  };

  const togglePlay = () => {
    if (!howlRef.current) {
      if (displayPlaylist.length > 0) playTrack(displayPlaylist[0]);
      return;
    }
    howlRef.current.playing() ? howlRef.current.pause() : howlRef.current.play();
  };

  const skipNext = () => {
    if (!currentTrack) return;
    const idx = displayPlaylist.findIndex(t => t.id === currentTrack.id);
    const nextIdx = (idx + 1) % displayPlaylist.length;
    playTrack(displayPlaylist[nextIdx]);
  };

  const skipPrev = () => {
    if (!currentTrack) return;
    const idx = displayPlaylist.findIndex(t => t.id === currentTrack.id);
    const prevIdx = (idx - 1 + displayPlaylist.length) % displayPlaylist.length;
    playTrack(displayPlaylist[prevIdx]);
  };

  const handleSeek = (e) => {
    if (!howlRef.current) return;
    const value = parseFloat(e.target.value);
    const dur = howlRef.current.duration();
    if (dur) {
      howlRef.current.seek(value * dur / 100);
      setProgress(value);
      setCurrentTime(value * dur / 100);
    }
  };

  const handlePlaylistSelect = (playlist) => {
    setActiveFilter(playlist.name);
    setView('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('veranda_volume', volume.toString());
    if (howlRef.current) howlRef.current.volume(volume);
  }, [volume]);

  return (
    <div className={`min-h-screen ${THEME.bgApp} text-zinc-100 pb-40 flex`}>
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 h-screen flex flex-col p-6 max-lg:hidden">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-[#D1FF26] rounded-xl rotate-12 flex items-center justify-center shadow-glow-lime">
            <Music size={22} className="text-black fill-current" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">
            Veranda <span className="text-[#D1FF26] not-italic">Radio</span>
          </h1>
        </div>
        <nav className="flex flex-col gap-2 mb-10">
          <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2 pl-4">Glavni Meni</p>
          <button onClick={() => setView('library')} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${view === 'library' ? 'bg-[#D1FF26] text-black shadow-glow-lime' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <Music size={18} /> Biblioteka
          </button>
          <button onClick={() => setView('playlists')} className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${view === 'playlists' ? 'bg-[#D1FF26] text-black shadow-glow-lime' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}>
            <LayoutGrid size={18} /> Otkrij Plejliste
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="px-4 md:px-8 py-4 md:py-6 sticky top-0 z-40 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="relative group flex-1 md:flex-none">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text" placeholder="Pretraži..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none w-full md:w-80"
            />
          </div>
          <button className="p-3 bg-white/5 rounded-2xl border border-white/5 shrink-0">
            <Settings size={20} className="text-zinc-400" />
          </button>
        </header>

        <main className="max-w-7xl mx-auto w-full">
          {view === 'playlists' ? (
            <PlaylistGrid onPlaylistSelect={handlePlaylistSelect} />
          ) : (
            <div className="px-4 md:px-8 py-6 md:py-10">
              <div className="relative h-[250px] md:h-[400px] rounded-[32px] md:rounded-[48px] overflow-hidden mb-8 md:mb-16 border border-white/5 bg-zinc-900">
                <img src="/images/placeholders/bg-song.png" className="w-full h-full object-cover opacity-20" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-16">
                  <h2 className="text-3xl md:text-7xl font-black mb-4 md:mb-8 uppercase italic tracking-tighter text-glow truncate">
                    {activeFilter ? activeFilter : "Dnevni Odabir"}
                  </h2>
                  <button onClick={() => playTrack(displayPlaylist[0])} className="px-8 md:px-12 py-3 md:py-5 rounded-[16px] md:rounded-[24px] bg-[#D1FF26] text-black font-black text-xs md:text-sm uppercase shadow-glow-lime">
                    Pokreni Emitovanje
                  </button>
                </div>
              </div>

              <section>
                <h3 className="text-2xl md:text-3xl font-black uppercase italic mb-6 md:mb-10 pl-2">Muzička Biblioteka</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {displayPlaylist.map((track) => (
                    <div key={track.id} onClick={() => playTrack(track)} className={`group p-3 md:p-4 rounded-[24px] md:rounded-[32px] cursor-pointer border transition-all ${currentTrack?.id === track.id ? 'bg-[#D1FF26]/10 border-[#D1FF26]/20' : 'bg-zinc-900/20 border-white/5'}`}>
                      <div className="relative aspect-square rounded-xl md:rounded-2xl overflow-hidden mb-3">
                        <img src={track.cover_url} className="w-full h-full object-cover" alt="" onError={(e) => { e.target.src = '/images/placeholders/bg-song.png'; }} />
                      </div>
                      <h4 className="font-black text-xs md:text-sm uppercase truncate mb-1">{track.displayTitle}</h4>
                      <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase font-bold truncate">{track.displayArtist}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}
        </main>
      </div>

      {/* Floating Player */}
      {currentTrack && (
        <div className="fixed bottom-6 left-4 right-4 md:bottom-8 md:left-8 md:right-8 lg:left-80 h-36 md:h-36 bg-zinc-950/90 backdrop-blur-xl border border-white/5 rounded-[32px] md:rounded-[48px] px-6 md:px-14 flex items-center z-50 group pt-8">
          <div className="absolute top-4 left-8 right-8 md:left-16 md:right-16 h-6 flex items-center">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress}
              onChange={handleSeek}
              onInput={(e) => {
                const val = parseFloat(e.target.value);
                setProgress(val);
                if (howlRef.current) setCurrentTime(val * duration / 100);
              }}
              className="progress-slider w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none relative z-10"
              style={{
                background: `linear-gradient(to right, #D1FF26 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
              }}
            />
          </div>

          {/* Left Info - balanced flex column */}
          <div className="flex-1 flex items-center gap-4 md:gap-6 min-w-0">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[18px] md:rounded-[20px] overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-900 shadow-xl transition-all duration-700 ${isPlaying ? 'scale-105 border-[#D1FF26]/30 shadow-[#D1FF26]/5' : ''}`}>
              <img src={currentTrack.cover_url} className={`w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'animate-pulse-slow' : 'opacity-80'}`} alt="" onError={(e) => { e.target.src = '/images/placeholders/bg-song.png' }} />
            </div>
            <div className="truncate min-w-0">
              <h5 className="text-[15px] md:text-lg font-black uppercase italic tracking-tighter truncate text-glow leading-tight">{currentTrack.displayTitle}</h5>
              <p className="text-[9px] md:text-[10px] text-zinc-400 uppercase font-black truncate opacity-60 mt-1">{currentTrack.displayArtist}</p>
            </div>
          </div>

          {/* Center Controls - perfectly balanced */}
          <div className="flex-1 flex flex-col items-center gap-1 md:gap-2 z-10 shrink-0">
            <div className="flex items-center gap-5 md:gap-8 justify-center">
              <button onClick={skipPrev} className="text-zinc-500 hover:text-[#D1FF26] transition-colors"><SkipBack size={18} className="md:w-6 md:h-6" /></button>
              <button onClick={togglePlay} className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#D1FF26] flex items-center justify-center shadow-glow-lime flex-shrink-0 text-black hover:scale-110 active:scale-95 transition-all duration-300">
                {isPlaying ? <Pause size={22} className="md:w-8 md:h-8" fill="currentColor" /> : <Play size={22} className="md:w-8 md:h-8 ml-0.5" fill="currentColor" />}
              </button>
              <button onClick={skipNext} className="text-zinc-500 hover:text-[#D1FF26] transition-colors"><SkipForward size={18} className="md:w-6 md:h-6" /></button>
            </div>
            <span className="text-[8px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{formatTime(currentTime)} / {formatTime(duration)}</span>
          </div>

          {/* Right Section - Completely hidden on mobile */}
          <div className="flex-1 hidden md:flex items-center justify-end">
            <div className="flex items-center gap-4 bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-sm">
              <button
                onClick={() => setVolume(v => v === 0 ? 0.8 : 0)}
                className="text-zinc-400 hover:text-[#D1FF26] transition-colors"
              >
                <Volume2 size={18} className={volume === 0 ? 'opacity-30' : ''} />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onInput={(e) => setVolume(parseFloat(e.target.value))}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="volume-slider w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer outline-none"
                style={{
                  background: `linear-gradient(to right, #D1FF26 ${volume * 100}%, rgba(255,255,255,0.05) ${volume * 100}%)`
                }}
              />
            </div>
          </div>
        </div>
      )}





      <style>{`
        .text-glow { text-shadow: 0 0 15px rgba(209, 255, 38, 0.3); }
        .shadow-glow-lime { box-shadow: 0 0 40px rgba(209, 255, 38, 0.25); }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-slow { animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }

        .progress-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 0;
          height: 0;
          background: #D1FF26;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 0 15px rgba(209, 255, 38, 0.5);
        }

        .group:hover .progress-slider::-webkit-slider-thumb {
          width: 14px;
          height: 14px;
        }

        .progress-slider:active::-webkit-slider-thumb {
          width: 16px;
          height: 16px;
          box-shadow: 0 0 25px rgba(209, 255, 38, 0.8);
        }

        .progress-slider::-moz-range-thumb {
          width: 0;
          height: 0;
          background: #D1FF26;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .group:hover .progress-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 10px;
          height: 10px;
          background: #D1FF26;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 12px rgba(209, 255, 38, 0.4);
        }
        
        .volume-slider:hover::-webkit-slider-thumb {
          transform: scale(1.3);
          box-shadow: 0 0 20px rgba(209, 255, 38, 0.6);
        }

        @media (max-width: 768px) {
          .volume-slider::-webkit-slider-thumb {
            width: 0;
            height: 0;
          }
        }
      `}</style>

    </div>
  );
};

export default App;