<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $adminRole = Role::query()->updateOrCreate(
            ['name' => 'Admin'],
            ['description' => 'Platform administrator']
        );

        $employeeRole = Role::query()->updateOrCreate(
            ['name' => 'Employee'],
            ['description' => 'Department employee']
        );

        $departments = [
            ['name' => 'HR', 'description' => 'Human Resources'],
            ['name' => 'IT', 'description' => 'Information Technology'],
            ['name' => 'Finance', 'description' => 'Finance & Accounting'],
        ];

        $departmentModels = collect();
        foreach ($departments as $dept) {
            $departmentModels->push(
                Department::query()->updateOrCreate(
                    ['name' => $dept['name']],
                    ['description' => $dept['description']]
                )
            );
        }

        // Keep local development users deterministic so this seeder also works
        // in the production image, where development-only Faker is absent.
        User::query()->updateOrCreate(['email' => 'admin@example.com'], [
            'name' => 'Admin User',
            'password' => Hash::make('password'),
            'role_id' => $adminRole->id,
            'department_id' => null,
        ]);

        foreach ($departmentModels as $index => $dept) {
            User::query()->updateOrCreate(['email' => 'employee'.($index + 1).'@example.com'], [
                'name' => $dept->name.' Employee',
                'password' => Hash::make('password'),
                'role_id' => $employeeRole->id,
                'department_id' => $dept->id,
            ]);
        }
    }
}
