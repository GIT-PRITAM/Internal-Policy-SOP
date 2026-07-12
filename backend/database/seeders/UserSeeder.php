<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::query()->where('name', 'Admin')->first();
        $employeeRole = Role::query()->where('name', 'Employee')->first();

        if (! $adminRole || ! $employeeRole) {
            // Seeders are expected to run after RoleSeeder.
            $this->command?->warn('Skipping UserSeeder: required roles not found.');
            return;
        }

        $departments = Department::query()->get()->keyBy('name');
        if ($departments->isEmpty()) {
            $this->command?->warn('Skipping UserSeeder: no departments found.');
            return;
        }

        // 3 Admin + ~22 Employees
        $users = [
            // Admins
            [
                'name' => 'Ananya Sharma',
                'email' => 'ananya.sharma@internalcompliance.in',
                'role' => 'Admin',
                'department' => 'Legal',
            ],
            [
                'name' => 'Rahul Iyer',
                'email' => 'rahul.iyer@internalcompliance.in',
                'role' => 'Admin',
                'department' => 'Information Technology',
            ],
            [
                'name' => 'Meera Joshi',
                'email' => 'meera.joshi@internalcompliance.in',
                'role' => 'Admin',
                'department' => 'Human Resources',
            ],

            // Employees (22)
            [
                'name' => 'Vikram Patel',
                'email' => 'vikram.patel@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Finance',
            ],
            [
                'name' => 'Shreya Nair',
                'email' => 'shreya.nair@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Human Resources',
            ],
            [
                'name' => 'Karthik Reddy',
                'email' => 'karthik.reddy@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Information Technology',
            ],
            [
                'name' => 'Priyanka Menon',
                'email' => 'priyanka.menon@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Operations',
            ],
            [
                'name' => 'Siddharth Kulkarni',
                'email' => 'siddharth.kulkarni@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Sales',
            ],
            [
                'name' => 'Nidhi Gupta',
                'email' => 'nidhi.gupta@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Marketing',
            ],
            [
                'name' => 'Rohan Verma',
                'email' => 'rohan.verma@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Customer Support',
            ],
            [
                'name' => 'Aditi Banerjee',
                'email' => 'aditi.banerjee@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Legal',
            ],
            [
                'name' => 'Imran Shaikh',
                'email' => 'imran.shaikh@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Finance',
            ],
            [
                'name' => 'Tanvi Sood',
                'email' => 'tanvi.sood@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Information Technology',
            ],
            [
                'name' => 'Rahul Sharma',
                'email' => 'rahul.sharma2@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Operations',
            ],
            [
                'name' => 'Manish Tiwari',
                'email' => 'manish.tiwari@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Sales',
            ],
            [
                'name' => 'Neha Kapoor',
                'email' => 'neha.kapoor@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Marketing',
            ],
            [
                'name' => 'Arjun Nair',
                'email' => 'arjun.nair@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Customer Support',
            ],
            [
                'name' => 'Divya Rao',
                'email' => 'divya.rao@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Human Resources',
            ],
            [
                'name' => 'Kavya Iyer',
                'email' => 'kavya.iyer@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Finance',
            ],
            [
                'name' => 'Aditya Chakraborty',
                'email' => 'aditya.chakraborty@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Information Technology',
            ],
            [
                'name' => 'Farhan Malik',
                'email' => 'farhan.malik@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Operations',
            ],
            [
                'name' => 'Monika Roy',
                'email' => 'monika.roy@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Sales',
            ],
            [
                'name' => 'Prakash Kumar',
                'email' => 'prakash.kumar@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Customer Support',
            ],
            [
                'name' => 'Sneha Kulkarni',
                'email' => 'sneha.kulkarni@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Legal',
            ],
            [
                'name' => 'Gaurav Mehta',
                'email' => 'gaurav.mehta@internalcompliance.in',
                'role' => 'Employee',
                'department' => 'Marketing',
            ],
        ];

        $password = Hash::make('password');

        $now = Carbon::now();

        foreach ($users as $u) {
            $roleModel = $u['role'] === 'Admin' ? $adminRole : $employeeRole;
            $dept = $departments->get($u['department']);

            if (! $dept) {
                // Fallback: pick any department to keep FK constraints satisfied.
                $dept = $departments->random();
            }

            User::updateOrCreate(
                ['email' => $u['email']],
                [
                    'name' => $u['name'],
                    'role_id' => $roleModel->id,
                    'department_id' => $dept->id,
                    'password' => $password,
                    'email_verified_at' => $now->copy()->subDays(rand(1, 90)),
                ]
            );
        }
    }
}

