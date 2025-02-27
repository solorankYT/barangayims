<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
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
        $this->seedRoles();
        $this->seedUsers();
        $this->seedDocumentTypes();
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
                'name' => 'Juan Dela Cruz',
                'email' => 'captain@example.com',
                'password' => Hash::make('password'),
                'role' => 'Barangay Captain',
                'contact_number' => '09123456781',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'secretary@example.com',
                'password' => Hash::make('password'),
                'role' => 'Barangay Secretary',
                'contact_number' => '09123456782',
            ],
            [
                'name' => 'Pedro Gomez',
                'email' => 'resident@example.com',
                'password' => Hash::make('password'),
                'role' => 'Resident',
                'contact_number' => '09123456783',
            ],
        ];

        foreach ($users as $userData) {
            $user = User::firstOrCreate([
                'email' => $userData['email'],
            ], [
                'name' => $userData['name'],
                'birthday' => '1990-01-01', // Sample birthday
                'gender' => 'Male', // Default gender, adjust as needed
                'contact_number' => $userData['contact_number'],
                'address' => '123 Barangay St.',
                'city' => 'Sample City',
                'state' => 'Sample State',
                'zip_code' => '12345',
                'household_number' => 'H12345',
                'password' => $userData['password'],
            ]);

            // Assign role to user
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
}
