<?php

namespace Database\Seeders;

use App\Models\PolicyDocument;
use App\Models\PolicyVersion;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ApprovalSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $adminRole = Role::query()->where('name', 'Admin')->first();
        if (! $adminRole) {
            $this->command?->warn('Skipping ApprovalSeeder: Admin role missing.');
            return;
        }
        $approvers = User::query()->where('role_id', $adminRole->id)->get();
        if ($approvers->isEmpty()) {
            $this->command?->warn('Skipping ApprovalSeeder: no admins found.');
            return;
        }

        $policies = PolicyDocument::query()->get();
        if ($policies->isEmpty()) {
            $this->command?->warn('Skipping ApprovalSeeder: no policies found.');
            return;
        }

        $statuses = ['Pending', 'Approved', 'Rejected'];

        foreach ($policies as $policy) {
            $versions = PolicyVersion::query()->where('policy_document_id', $policy->id)->get();
            if ($versions->isEmpty()) {
                continue;
            }

            // Create 0–2 approval records per policy (more history for realism)
            $approvalCount = $faker->numberBetween(1, 2);

            for ($i = 0; $i < $approvalCount; $i++) {
                $version = $faker->boolean(70) ? $versions->sortByDesc('version_number')->first() : $versions->random();

                $status = $faker->randomElement($statuses);
                if ((string) $policy->status === 'Approved') {
                    // bias toward Approved for already-approved policies
                    $status = $faker->boolean(75) ? 'Approved' : $status;
                }

                // Ensure Pending is common too
                if ($faker->boolean(40)) {
                    $status = 'Pending';
                }

                $comments = $faker->optional()->sentence(12);

                // action_at nullable allowed by schema
                $actionAt = $status === 'Pending' ? null : Carbon::now()->subDays($faker->numberBetween(1, 30));

                // Use a deterministic uniqueness approach: if exists, update.
                // Since approvals table has no unique key, use policy_document_id+policy_version_id+approver_user_id+status+action_at window.
                $approver = $approvers->random();

                $existing = \App\Models\Approval::query()
                    ->where('policy_document_id', $policy->id)
                    ->where('policy_version_id', $version->id)
                    ->where('approver_user_id', $approver->id)
                    ->orderByDesc('created_at')
                    ->first();

                if ($existing) {
                    // Update to match latest generated data
                    $existing->status = $status;
                    $existing->comments = $comments;
                    $existing->action_at = $actionAt;
                    $existing->save();
                } else {
                    \App\Models\Approval::create([
                        'policy_document_id' => $policy->id,
                        'policy_version_id' => $version->id,
                        'approver_user_id' => $approver->id,
                        'status' => $status,
                        'comments' => $comments,
                        'action_at' => $actionAt,
                        'created_at' => Carbon::now()->subDays($faker->numberBetween(1, 60)),
                        'updated_at' => Carbon::now()->subDays($faker->numberBetween(0, 30)),
                    ]);
                }
            }
        }
    }
}

