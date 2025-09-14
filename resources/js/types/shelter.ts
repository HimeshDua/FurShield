export interface ShelterProfile {
    id: number;
    location?: string;
    mission?: string;
    contact_email?: string;
}

export interface Adoption {
    shelter_id: number;
    pet_name: string;
    species: string;
    breed: string;
    age: string;
    status: 'available' | 'pending' | 'adopted';
    description: string;
    images: string;
}
