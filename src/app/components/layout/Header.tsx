export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        <button className="text-2xl">≡</button>
        <h1 className="text-xl font-bold">🐶 DogNote</h1>
        <button className="text-sm bg-gray-200 px-3 py-1 rounded-md">강아지 전환</button>
      </header>
    );
  }
  