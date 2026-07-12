<?php

namespace Database\Seeders;

use App\Models\PolicyDocument;
use App\Models\PolicyVersion;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class PolicyVersionSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $adminRole = Role::query()->where('name', 'Admin')->first();
        $admins = $adminRole ? User::query()->where('role_id', $adminRole->id)->get() : collect();
        if ($admins->isEmpty()) {
            $this->command?->warn('Skipping PolicyVersionSeeder: no admins found.');
            return;
        }

        $policies = PolicyDocument::query()->get();
        if ($policies->isEmpty()) {
            $this->command?->warn('Skipping PolicyVersionSeeder: no policies found.');
            return;
        }

        foreach ($policies as $policy) {
            $versionCount = $faker->numberBetween(1, 3);

            $versions = [];
            for ($v = 1; $v <= $versionCount; $v++) {
                $createdBy = $admins->random();

                $title = $policy->title . ' - v' . $v;
                $content = $faker->paragraphs(4, true);
                $changeSummary = $faker->sentence(10, true);

                $approvedAt = null;
                $approvedBy = null;

                // Align with policy status distribution.
                $status = (string) $policy->status;
                if ($status === 'Approved') {
                    // Make the latest version approved.
                    $approvedAt = $v === $versionCount ? Carbon::now()->subDays($faker->numberBetween(1, 45)) : null;
                    $approvedBy = $v === $versionCount ? $admins->random() : null;
                } else {
                    // Not approved policies should have nullable approvals.
                    $approvedAt = null;
                    $approvedBy = null;
                }

                $version = PolicyVersion::updateOrCreate(
                    [
                        'policy_document_id' => $policy->id,
                        'version_number' => $v,
                    ],
                    [
                        'title' => $title,
                        'content' => $content,
                        'change_summary' => $changeSummary,
                        'created_by' => $createdBy->id,
                        'approved_by' => $approvedBy?->id,
                        'approved_at' => $approvedAt,
                    ]
                );

                $versions[] = $version;
            }

            // Set current_version_id to the last version.
            usort($versions, fn ($a, $b) => $a->version_number <=> $b->version_number);
            $latest = end($versions);

            PolicyDocument::query()->where('id', $policy->id)->update([
                'current_version_id' => $latest->id,
                'updated_at' => Carbon::now()->subDays($faker->numberBetween(0, 30)),
            ]);
        }
    }
}

