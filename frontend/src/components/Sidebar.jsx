export default function Sidebar({ onSelect, onSearch }) {
  return (
    <div className="w-60 bg-black text-white h-screen p-4 hidden md:block">
      <h2 className="text-xl font-bold mb-4">Library</h2>
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        onChange={e => onSearch(e.target.value)}
      />
      <ul className="space-y-2">
        <li onClick={() => { onSearch(''); onSelect('playlists'); }} className="cursor-pointer hover:text-green-400">Playlists</li>
        <li onClick={() => { onSearch(''); onSelect('albums'); }} className="cursor-pointer hover:text-green-400">Albums</li>
        <li onClick={() => { onSearch(''); onSelect('recent'); }} className="cursor-pointer hover:text-green-400">Recently Played</li>
      </ul>
    </div>
  );
}