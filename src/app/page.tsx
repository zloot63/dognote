import AddDogForm from "@/components/AddDogForm";
import DogList from "@/components/DogList";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">DogNote 🐶</h1>
      <p className="text-lg text-gray-700 mb-4">반려견 건강 & 일정 관리</p>
      <AddDogForm />
      <DogList />
    </div>
  );
}
