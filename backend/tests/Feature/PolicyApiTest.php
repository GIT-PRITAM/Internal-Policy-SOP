<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\PolicyDocument;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PolicyApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        $role = Role::query()->firstOrCreate(['name' => 'Admin']);

        return User::factory()->create(['role_id' => $role->id]);
    }

    public function test_admin_can_list_paginate_search_and_filter_policies(): void
    {
        $admin = $this->admin();
        $hr = Department::query()->create(['name' => 'HR']);
        $it = Department::query()->create(['name' => 'IT']);

        PolicyDocument::query()->create([
            'department_id' => $hr->id,
            'owner_user_id' => $admin->id,
            'title' => 'Remote Work Policy',
            'summary' => 'Hybrid work guidance',
            'content' => 'Policy content',
            'visibility' => 'Department',
            'status' => 'Approved',
            'mandatory' => true,
        ]);
        PolicyDocument::query()->create([
            'department_id' => $it->id,
            'owner_user_id' => $admin->id,
            'title' => 'Access Management',
            'summary' => 'Identity controls',
            'content' => 'Policy content',
            'visibility' => 'Public',
            'status' => 'Draft',
            'mandatory' => false,
        ]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/v1/policies?search=remote&department_id='.$hr->id.'&status=Approved&mandatory=1&per_page=1');

        $response->assertOk()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.meta.total', 1)
            ->assertJsonPath('data.meta.per_page', 1)
            ->assertJsonPath('data.items.0.title', 'Remote Work Policy');
    }

    public function test_admin_can_create_an_unassigned_public_policy_and_employees_cannot_create_policies(): void
    {
        $admin = $this->admin();
        $employeeRole = Role::query()->firstOrCreate(['name' => 'Employee']);
        $employee = User::factory()->create(['role_id' => $employeeRole->id]);
        $payload = [
            'title' => 'Corporate Travel Policy',
            'summary' => 'Travel and expense guidance',
            'content' => 'Full policy content',
            'visibility' => 'Public',
            'status' => 'Draft',
            'mandatory' => false,
        ];

        $this->actingAs($employee, 'sanctum')
            ->postJson('/api/v1/policies', $payload)
            ->assertForbidden();

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/v1/policies', $payload);

        $response->assertCreated()
            ->assertJsonPath('status', 'success')
            ->assertJsonPath('data.policy.title', 'Corporate Travel Policy')
            ->assertJsonPath('data.policy.department_id', null);

        $this->assertDatabaseHas('policy_documents', [
            'title' => 'Corporate Travel Policy',
            'owner_user_id' => $admin->id,
            'department_id' => null,
        ]);
    }

    public function test_policy_show_honors_content_opt_in_and_employee_visibility_rules(): void
    {
        $admin = $this->admin();
        $employeeRole = Role::query()->firstOrCreate(['name' => 'Employee']);
        $department = Department::query()->create(['name' => 'Legal']);
        $employee = User::factory()->create([
            'role_id' => $employeeRole->id,
            'department_id' => $department->id,
        ]);
        $approvedPolicy = PolicyDocument::query()->create([
            'department_id' => $department->id,
            'owner_user_id' => $admin->id,
            'title' => 'Code of Conduct',
            'summary' => 'Expected behavior',
            'content' => 'Confidential policy body',
            'visibility' => 'Department',
            'status' => 'Approved',
        ]);
        $draftPolicy = PolicyDocument::query()->create([
            'department_id' => $department->id,
            'owner_user_id' => $admin->id,
            'title' => 'Draft Conduct Policy',
            'content' => 'Draft body',
            'visibility' => 'Department',
            'status' => 'Draft',
        ]);

        $this->actingAs($employee, 'sanctum')
            ->getJson('/api/v1/policies/'.$approvedPolicy->id)
            ->assertOk()
            ->assertJsonPath('data.policy.content', null);

        $this->actingAs($employee, 'sanctum')
            ->getJson('/api/v1/policies/'.$approvedPolicy->id.'?include_content=1')
            ->assertOk()
            ->assertJsonPath('data.policy.content', 'Confidential policy body');

        $this->actingAs($employee, 'sanctum')
            ->getJson('/api/v1/policies/'.$draftPolicy->id)
            ->assertForbidden();
    }

    public function test_admin_can_update_a_policy_and_employee_cannot_update_it(): void
    {
        $admin = $this->admin();
        $employeeRole = Role::query()->firstOrCreate(['name' => 'Employee']);
        $employee = User::factory()->create(['role_id' => $employeeRole->id]);
        $department = Department::query()->create(['name' => 'Operations']);
        $policy = PolicyDocument::query()->create([
            'department_id' => $department->id,
            'owner_user_id' => $admin->id,
            'title' => 'Operations Policy',
            'content' => 'Version one',
            'visibility' => 'Department',
            'status' => 'Draft',
        ]);

        $this->actingAs($employee, 'sanctum')
            ->putJson('/api/v1/policies/'.$policy->id, ['title' => 'Unauthorized update'])
            ->assertForbidden();

        $this->actingAs($admin, 'sanctum')
            ->putJson('/api/v1/policies/'.$policy->id, [
                'title' => 'Operations Policy v2',
                'status' => 'Approved',
                'mandatory' => true,
            ])
            ->assertOk()
            ->assertJsonPath('data.policy.title', 'Operations Policy v2')
            ->assertJsonPath('data.policy.status', 'Approved')
            ->assertJsonPath('data.policy.mandatory', true);

        $this->assertDatabaseHas('policy_documents', [
            'id' => $policy->id,
            'title' => 'Operations Policy v2',
            'status' => 'Approved',
            'mandatory' => true,
        ]);
    }

    public function test_admin_can_delete_a_policy_and_employee_cannot_delete_it(): void
    {
        $admin = $this->admin();
        $employeeRole = Role::query()->firstOrCreate(['name' => 'Employee']);
        $employee = User::factory()->create(['role_id' => $employeeRole->id]);
        $department = Department::query()->create(['name' => 'Security']);
        $policy = PolicyDocument::query()->create([
            'department_id' => $department->id,
            'owner_user_id' => $admin->id,
            'title' => 'Security Policy',
            'content' => 'Security content',
            'visibility' => 'Public',
            'status' => 'Approved',
        ]);

        $this->actingAs($employee, 'sanctum')
            ->deleteJson('/api/v1/policies/'.$policy->id)
            ->assertForbidden();

        $this->actingAs($admin, 'sanctum')
            ->deleteJson('/api/v1/policies/'.$policy->id)
            ->assertOk()
            ->assertJsonPath('status', 'success');

        $this->assertDatabaseMissing('policy_documents', ['id' => $policy->id]);
    }
}
