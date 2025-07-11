export default function Sidebar({ onSelect }) {
  return (
    <div className="w-60 bg-black text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Library</h2>
      <ul className="space-y-2">
        <li onClick={() => onSelect('playlists')} className="cursor-pointer hover:text-green-400">Playlists</li>
        <li onClick={() => onSelect('albums')} className="cursor-pointer hover:text-green-400">Albums</li>
        <li onClick={() => onSelect('recent')} className="cursor-pointer hover:text-green-400">Recently Played</li>
      </ul>
    </div>
  );
}
