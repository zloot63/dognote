import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Dog, DogListItem } from '@/types/dog';

interface DogState {
  // 상태
  dogs: Dog[];
  selectedDog: Dog | null;
  isLoading: boolean;
  error: string | null;
  
  // 필터링 및 정렬
  searchQuery: string;
  sortBy: 'name' | 'age' | 'breed' | 'createdAt';
  sortOrder: 'asc' | 'desc';
  filterBy: {
    size?: Dog['size'];
    gender?: Dog['gender'];
    breed?: string;
  };

  // 액션
  setDogs: (dogs: Dog[]) => void;
  addDog: (dog: Dog) => void;
  updateDog: (id: string, updates: Partial<Dog>) => void;
  removeDog: (id: string) => void;
  setSelectedDog: (dog: Dog | null) => void;
  
  // 로딩/에러 상태
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 필터링/검색
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: DogState['sortBy']) => void;
  setSortOrder: (order: DogState['sortOrder']) => void;
  setFilter: (filter: Partial<DogState['filterBy']>) => void;
  clearFilters: () => void;
  
  // 계산된 값들
  getFilteredDogs: () => Dog[];
  getDogById: (id: string) => Dog | undefined;
  getDogListItems: () => DogListItem[];
}

export const useDogStore = create<DogState>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      dogs: [],
      selectedDog: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      sortBy: 'name',
      sortOrder: 'asc',
      filterBy: {},

      // 기본 액션
      setDogs: (dogs) => set({ dogs }),
      
      addDog: (dog) => set((state) => ({ 
        dogs: [...state.dogs, dog] 
      })),
      
      updateDog: (id, updates) => set((state) => ({
        dogs: state.dogs.map(dog => 
          dog.id === id ? { ...dog, ...updates, updatedAt: new Date().toISOString() } : dog
        ),
        selectedDog: state.selectedDog?.id === id 
          ? { ...state.selectedDog, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedDog
      })),
      
      removeDog: (id) => set((state) => ({
        dogs: state.dogs.filter(dog => dog.id !== id),
        selectedDog: state.selectedDog?.id === id ? null : state.selectedDog
      })),
      
      setSelectedDog: (dog) => set({ selectedDog: dog }),

      // 로딩/에러 상태
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // 필터링/검색
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSortBy: (sortBy) => set({ sortBy }),
      setSortOrder: (sortOrder) => set({ sortOrder }),
      setFilter: (filter) => set((state) => ({ 
        filterBy: { ...state.filterBy, ...filter } 
      })),
      clearFilters: () => set({ 
        searchQuery: '', 
        filterBy: {},
        sortBy: 'name',
        sortOrder: 'asc'
      }),

      // 계산된 값들
      getFilteredDogs: () => {
        const { dogs, searchQuery, sortBy, sortOrder, filterBy } = get();
        
        let filtered: Dog[] = dogs;

        // 검색 필터
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter((dog: Dog) => 
            dog.name.toLowerCase().includes(query) ||
            dog.breed.toLowerCase().includes(query) ||
            dog.description?.toLowerCase().includes(query)
          );
        }

        // 카테고리 필터
        if (filterBy.size) {
          filtered = filtered.filter(dog => dog.size === filterBy.size);
        }
        if (filterBy.gender) {
          filtered = filtered.filter(dog => dog.gender === filterBy.gender);
        }
        if (filterBy.breed) {
          filtered = filtered.filter(dog => dog.breed === filterBy.breed);
        }

        // 정렬
        filtered.sort((a, b) => {
          let aValue: string | number | Date, bValue: string | number | Date;
          
          switch (sortBy) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'age':
              aValue = new Date(a.birthDate);
              bValue = new Date(b.birthDate);
              break;
            case 'breed':
              aValue = a.breed.toLowerCase();
              bValue = b.breed.toLowerCase();
              break;
            case 'createdAt':
              aValue = new Date(a.createdAt);
              bValue = new Date(b.createdAt);
              break;
            default:
              return 0;
          }

          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getDogById: (id) => {
        return get().dogs.find(dog => dog.id === id);
      },

      getDogListItems: () => {
        const { getFilteredDogs } = get();
        return getFilteredDogs().map(dog => ({
          id: dog.id,
          name: dog.name,
          breed: dog.breed,
          profileImage: dog.profileImage,
          age: Math.floor((Date.now() - new Date(dog.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
          weight: dog.weight,
          size: dog.size
        }));
      }
    }),
    {
      name: 'dog-store'
    }
  )
);
