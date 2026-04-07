import React from 'react';
import { Play } from 'lucide-react';

const playlistsData = [
  {
    id: 1,
    name: "RESTORAN_VERANDA_Standard",
    description: "Premium ambijentalni miks za savršenu atmosferu restorana",
    thumbnail: "/images/placeholders/veranda.png",
    tag: "standard"
  },
  {
    id: 3,
    name: "Rock Nights",
    description: "Najveći strani rock hitovi svih vremena na jednom mjestu",
    thumbnail: "/images/placeholders/rock_nights.png",
    tag: "rock"
  },
  {
    id: 4,
    name: "Vikend Rock",
    description: "Nova energija i najmoderniji rock zvuk današnjice",
    thumbnail: "/images/placeholders/vikend_rock.png",
    tag: "rock"
  },
  {
    id: 5,
    name: "Vikend Ex-Yu Rock",
    description: "Najbolji hitovi iz zlatne ere ex-u roka",
    thumbnail: "/images/placeholders/exyu_rock.png",
    tag: "exyu"
  },
];

const PlaylistGrid = ({ onPlaylistSelect }) => {
  return (
    <div className="px-4 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 md:w-12 h-1 bg-[#D1FF26] rounded-full"></span>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-[#D1FF26]">Ekskluzivno</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 uppercase italic">Pronađi <span className="text-[#D1FF26] not-italic">Svoj Stil</span></h2>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] md:text-[10px] max-w-sm leading-relaxed opacity-80">Odaberite raspoloženje i prepustite se pažljivo kuriranim plejlistama.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {playlistsData.map((playlist, idx) => (
          <div
            key={playlist.id}
            onClick={() => onPlaylistSelect?.(playlist)}
            className="group cursor-pointer relative"
          >
            <div className="relative aspect-[3/4] rounded-[24px] md:rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 transition-all duration-700 md:group-hover:-translate-y-4 shadow-2xl">
              <img
                src={playlist.thumbnail}
                className="w-full h-full object-cover opacity-30 md:group-hover:opacity-100 transition-all duration-700"
                alt={playlist.name}
                onError={(e) => { e.target.src = '/images/placeholders/bg-song.png'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 md:via-transparent to-transparent"></div>
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 md:pb-10">
                <p className="text-[#D1FF26] text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-2 md:mb-3 opacity-80">Playlist</p>
                <h3 className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2 md:group-hover:text-[#D1FF26] transition-colors uppercase italic tracking-tighter line-clamp-2 md:line-clamp-none leading-tight">{playlist.name}</h3>
                <p className="text-[9px] md:text-[10px] text-zinc-400 font-bold leading-relaxed line-clamp-2 uppercase tracking-wide opacity-60">{playlist.description}</p>
              </div>
              <div className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-14 md:h-14 rounded-2xl md:rounded-3xl bg-[#D1FF26] flex items-center justify-center transform scale-0 md:group-hover:scale-100 transition-all duration-500 shadow-glow-lime">
                <Play size={18} fill="black" className="ml-1 md:w-6 md:h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistGrid;