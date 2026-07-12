<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Human Resources',
                'description' => 'Employee lifecycle management, onboarding, performance cycles, compliance training, and people analytics.',
            ],
            [
                'name' => 'Information Technology',
                'description' => 'Infrastructure, identity and access controls, security operations, and systems enablement for internal users.',
            ],
            [
                'name' => 'Finance',
                'description' => 'Financial governance, budgeting, expense controls, procurement policies, and invoice approval workflows.',
            ],
            [
                'name' => 'Operations',
                'description' => 'Business operations governance, incident management readiness, continuity planning, and asset handling controls.',
            ],
            [
                'name' => 'Sales',
                'description' => 'Commercial execution and process governance for client onboarding, sales approvals, and stakeholder coordination.',
            ],
            [
                'name' => 'Marketing',
                'description' => 'Brand, content, and campaign governance including usage guidelines, review workflows, and messaging compliance.',
            ],
            [
                'name' => 'Legal',
                'description' => 'Contract review, data protection guidance, compliance oversight, and policy enforcement support.',
            ],
            [
                'name' => 'Customer Support',
                'description' => 'Customer issue resolution governance, escalation standards, and complaint handling procedures.',
            ],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['name' => $department['name']],
                ['description' => $department['description']]
            );
        }
    }
}

