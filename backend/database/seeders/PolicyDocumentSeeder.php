<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\PolicyDocument;
use App\Models\PolicyVersion;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PolicyDocumentSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $adminRole = Role::query()->where('name', 'Admin')->first();
        $admins = $adminRole ? User::query()->where('role_id', $adminRole->id)->get() : collect();
        $employees = User::query()->whereHas('role', fn ($q) => $q->where('name', 'Employee'))->get();

        $departments = Department::query()->get();
        if ($departments->isEmpty()) {
            $this->command?->warn('Skipping PolicyDocumentSeeder: no departments found.');
            return;
        }
        if ($admins->isEmpty()) {
            $this->command?->warn('Skipping PolicyDocumentSeeder: no admins found.');
            return;
        }

        $states = ['Draft', 'Under Review', 'Approved', 'Archived'];
        $visibilities = ['Public', 'Department', 'Private'];

        // About 35–40 policy documents
        $count = 38;

        // When private: use the owner_user_id to keep FK and visibility semantics consistent.
        for ($i = 0; $i < $count; $i++) {
            $department = $departments->random();
            $owner = Arr::wrap($faker->randomElement($employees->isNotEmpty() ? $employees : $admins));
            $ownerUserId = $owner instanceof User ? $owner->id : ($owner?->id ?? $admins->random()->id);

            $status = $faker->randomElement($states);
            $visibility = $faker->randomElement($visibilities);

            // ensure Approved policies have a sensible current_version pointer later in PolicyVersionSeeder
            $mandatory = $faker->boolean(60);

            $effectiveDate = $faker->boolean(70) ? Carbon::today()->subDays($faker->numberBetween(1, 120)) : null;
            $reviewDate = $faker->boolean(50) ? Carbon::today()->subDays($faker->numberBetween(1, 90)) : null;

            if ($visibility === 'Department' || $visibility === 'Public') {
                // keep owner inside department sometimes, but not required by schema
                $ownerUserId = $faker->boolean(70)
                    ? ($employees->where('department_id', $department->id)->random()->id ?? $admins->random()->id)
                    : $admins->random()->id;
            }

            if ($visibility === 'Private') {
                // owner should typically be a non-admin employee
                if ($employees->isNotEmpty()) {
                    $ownerUserId = ($employees->random()->id);
                }
            }

            $title = $faker->sentence(4, true);
            $summary = $faker->paragraph(2);
            $content = $faker->paragraphs(4, true);

            // Temporary current_version_id; PolicyVersionSeeder will update it.
            $currentVersionId = null;

            PolicyDocument::updateOrCreate(
                ['title' => $title, 'department_id' => $department->id],
                [
                    'owner_user_id' => $ownerUserId,
                    'title' => $title,
                    'summary' => $summary,
                    'content' => $content,
                    'visibility' => $visibility,
                    'status' => $status,
                    'mandatory' => $mandatory,
                    'effective_date' => $effectiveDate,
                    'review_date' => $reviewDate,
                    'current_version_id' => $currentVersionId,
                    'created_at' => Carbon::now()->subDays($faker->numberBetween(30, 180)),
                    'updated_at' => Carbon::now()->subDays($faker->numberBetween(1, 60)),
                ]
            );
        }

        // PolicyVersionSeeder will create versions and set current_version_id.
    }
}

