<?php

namespace Database\Seeders;

use App\Models\Bookmark;
use App\Models\PolicyDocument;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class BookmarkSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $employeeRole = Role::query()->where('name', 'Employee')->first();
        if (! $employeeRole) {
            $this->command?->warn('Skipping BookmarkSeeder: Employee role missing.');
            return;
        }

        $employees = User::query()->where('role_id', $employeeRole->id)->get();
        if ($employees->isEmpty()) {
            $this->command?->warn('Skipping BookmarkSeeder: no employees found.');
            return;
        }

        $policies = PolicyDocument::query()->get();
        if ($policies->isEmpty()) {
            $this->command?->warn('Skipping BookmarkSeeder: no policies found.');
            return;
        }

        foreach ($employees as $employee) {
            $bookmarkCount = $faker->numberBetween(2, 6);

            for ($i = 0; $i < $bookmarkCount; $i++) {
                $policy = $policies->random();

                // Only bookmark policies within employee scope (approx)
                $inScope = false;
                if ($policy->visibility === 'Public') {
                    $inScope = true;
                } elseif ($policy->visibility === 'Department') {
                    $inScope = (int) $policy->department_id === (int) $employee->department_id;
                } elseif ($policy->visibility === 'Private') {
                    $inScope = (int) $policy->owner_user_id === (int) $employee->id;
                }

                if (! $inScope) {
                    continue;
                }

                $exists = Bookmark::query()
                    ->where('user_id', $employee->id)
                    ->where('policy_document_id', $policy->id)
                    ->first();
                if ($exists) {
                    continue;
                }

                Bookmark::create([
                    'user_id' => $employee->id,
                    'policy_document_id' => $policy->id,
                    'created_at' => Carbon::now()->subDays($faker->numberBetween(1, 60)),
                    'updated_at' => Carbon::now()->subDays($faker->numberBetween(0, 20)),
                ]);
            }
        }
    }
}

