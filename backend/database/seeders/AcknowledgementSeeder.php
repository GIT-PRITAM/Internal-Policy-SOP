<?php

namespace Database\Seeders;

use App\Models\Acknowledgement;
use App\Models\PolicyDocument;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AcknowledgementSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $employeeRole = Role::query()->where('name', 'Employee')->first();
        if (! $employeeRole) {
            $this->command?->warn('Skipping AcknowledgementSeeder: Employee role missing.');
            return;
        }

        $employees = User::query()->where('role_id', $employeeRole->id)->get();
        if ($employees->isEmpty()) {
            $this->command?->warn('Skipping AcknowledgementSeeder: no employees found.');
            return;
        }

        // Only for mandatory + approved policies (per requirement)
        $mandatoryApprovedPolicies = PolicyDocument::query()
            ->where('status', 'Approved')
            ->where('mandatory', true)
            ->get();

        if ($mandatoryApprovedPolicies->isEmpty()) {
            $this->command?->warn('Skipping AcknowledgementSeeder: no mandatory approved policies.');
            return;
        }

        foreach ($mandatoryApprovedPolicies as $policy) {
            // For each policy, create acknowledgements for ~50–90% of employees that are in scope.
            // Scope rules are enforced in the app; we approximate with visibility.

            foreach ($employees as $employee) {
                $inScope = false;

                if ($policy->visibility === 'Public') {
                    $inScope = true;
                } elseif ($policy->visibility === 'Department') {
                    $inScope = (int) $employee->department_id === (int) $policy->department_id;
                } elseif ($policy->visibility === 'Private') {
                    $inScope = (int) $employee->id === (int) $policy->owner_user_id;
                }

                if (! $inScope) {
                    continue;
                }

                // 0–1 acknowledgement due to unique constraint
                $already = Acknowledgement::query()
                    ->where('user_id', $employee->id)
                    ->where('policy_document_id', $policy->id)
                    ->first();

                if ($already) {
                    continue;
                }

                // Mix pending and acknowledged
                $isAcknowledged = $faker->boolean(65);
                $status = $isAcknowledged ? 'Acknowledged' : 'Pending';

                $ackAt = $isAcknowledged
                    ? Carbon::now()->subDays($faker->numberBetween(1, 45))
                    : null;

                Acknowledgement::create([
                    'user_id' => $employee->id,
                    'policy_document_id' => $policy->id,
                    'status' => $status,
                    'acknowledged_at' => $ackAt,
                ]);
            }
        }
    }
}

