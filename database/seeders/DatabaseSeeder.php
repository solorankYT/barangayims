<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\EvacuationSite;
use App\Models\Household;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->seedHouseholds();
        $this->seedRoles();
        $this->seedUsers();
        $this->seedDocumentTypes();
        $this->seedSites();
    }

    /**
     * Seed roles into the database.
     */
    private function seedRoles(): void
    {
        $roles = ['Barangay Captain', 'Barangay Secretary', 'Resident'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }
    }

    /**
     * Seed users and assign roles.
     */
    private function seedUsers(): void
    {
        $users = [
            [
                'name' => 'Barangay Captain',
                'email' => 'barangaycaptain@example.com',
                'password' => Hash::make('password'),
                'role' => 'Barangay Captain',
                'contact_number' => '09628500142',
            ],
            [
                'name' => 'Barangay Secretary',
                'email' => 'barangaysecretary@example.com',
                'password' => Hash::make('password'),
                'role' => 'Barangay Secretary',
                'contact_number' => '09666791182',
            ],
            [
                'name' => 'Sample Account',
                'email' => 'barangayims@gmail.com',
                'password' => Hash::make('123'),
                'role' => 'Barangay Captain',
                'contact_number' => '09606200611',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate([
                'email' => $userData['email'],
            ], [
                'name' => $userData['name'],
                'birthday' => '1990-01-01', 
                'gender' => 'Male',
                'contact_number' => $userData['contact_number'],
                'address' => '123 Barangay St.',
                'city' => 'Sample City',
                'zip_code' => '12345',
                'household_id' => 2,
                'password' => $userData['password'],
            ]);

            $user->assignRole($userData['role']);
        }
    }

    /**
     * Seed document types into the database.
     */
    private function seedDocumentTypes(): void
    {
        $documentTypes = [
            [
                'name' => 'Barangay Clearance',
                'category' => 'Certification',
                'description' => 'A document certifying residency and good standing in the barangay.',
            ],
            [
                'name' => 'Certificate of Indigency',
                'category' => 'Certification',
                'description' => 'A certificate proving that an individual belongs to an indigent family.',
            ],
            [
                'name' => 'First Time Job Seeker Certificate',
                'category' => 'Employment',
                'description' => 'A certificate issued for first-time job seekers to avail of government benefits.',
            ],
            [
                'name' => 'Barangay Business Permit',
                'category' => 'Business',
                'description' => 'A permit required for operating a business within the barangay jurisdiction.',
            ],
            [
                'name' => 'Barangay Blotter Report',
                'category' => 'Incident Report',
                'description' => 'A record of complaints or incidents reported to the barangay.',
            ],
        ];



        foreach ($documentTypes as $type) {
            DB::table('document_types')->updateOrInsert(
                ['name' => $type['name']], // Unique identifier
                [
                    'category' => $type['category'],
                    'description' => $type['description'],
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );
        }
    }
    
    public function seedSites()
    {
        $sites = [
            [
                'site_name' => 'Barangay Hall Evacuation Center',
                'location' => 'Barangay 137, Quezon City, Metro Manila',
                'capacity' => 500,
                'status' => 'Active',
                'resources' => 'Food, Water, Medical Supplies',
                'contact_person' => 'Captain Juan Dela Cruz',
                'contact_number' => '09123456789',
                'latitude' => 14.6505, 
                'longitude' => 121.0349,
                'link' => 'https://queen.jollibee.com.ph/2023/05/2-pc.-Chickenjoy-VM-Promo-min-819x1024.jpg',
            ],
            [
                'site_name' => 'Public School Gymnasium',
                'location' => 'Barangay 145, Manila City, Metro Manila',
                'capacity' => 700,
                'status' => 'Active',
                'resources' => 'Food, Blankets, First Aid',
                'contact_person' => 'Brgy. Kagawad Maria Santos',
                'contact_number' => '09987654321',
                'latitude' => 14.5995,
                'longitude' => 120.9842,
                'link' => 'https://queen.jollibee.com.ph/2023/05/2-pc.-Chickenjoy-VM-Promo-min-819x1024.jpg',
            ],
            [
                'site_name' => 'Barangay Covered Court',
                'location' => 'Barangay 112, Caloocan City, Metro Manila',
                'capacity' => 300,
                'status' => 'Full',
                'resources' => 'None (Under Maintenance)',
                'contact_person' => 'Brgy. Sec. Pedro Dizon',
                'contact_number' => '09231234567',
                'latitude' => 14.7573,
                'longitude' => 120.9561,
                'link' => 'https://queen.jollibee.com.ph/2023/05/2-pc.-Chickenjoy-VM-Promo-min-819x1024.jpg',
            ]
        ];

        foreach ($sites as $site) {
            EvacuationSite::create($site);
        }
    }

    public function seedHouseholds()
    {
        $households = [
            ['name' => 'Household 1'],
            ['name' => 'Household 2'],
            ['name' => 'Household 3'],
        ];

        foreach ($households as $household) {
            Household::create($household);
        }
    }
}
