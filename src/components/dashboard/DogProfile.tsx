export default function DogProfile() {
    return (
        <section className="bg-white p-4 shadow-md rounded-lg mb-4"
            aria-labelledby="dog-profile-title"
        >
            <h2 id="dog-profile-title" className="text-xl font-bold">
                🐶 내 강아지
            </h2>
            <p className="text-gray-500">산책 빈도, 예방접종 기록 기반 상태 표시</p>
        </section>
    );
}
