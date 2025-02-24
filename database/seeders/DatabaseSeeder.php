<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Define roles
        $roles = ['Barangay Captain', 'Barangay Secretary', 'Resident'];

        // Create roles if they don't exist
        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Create users and assign roles
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
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
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
}
