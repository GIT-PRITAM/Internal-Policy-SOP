<?php

namespace App\Policies;

use App\Models\PolicyDocument;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PolicyDocumentPolicy
{
    private function isAdmin(User $user): bool
    {
        return (string) $user->role?->name === 'Admin';
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->isAdmin($user) || $user->role?->name === 'Employee';
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PolicyDocument $policyDocument): bool
    {
        if ($this->isAdmin($user)) {
            return true;
        }

        if ($policyDocument->status !== 'Approved') {
            return false;
        }

        // Employee visibility rules
        $visibility = $policyDocument->visibility;
        $userDeptId = $user->department_id;

        if ($visibility === 'Public') {
            return true;
        }

        if ($visibility === 'Department') {
            return $userDeptId !== null && (int) $policyDocument->department_id === (int) $userDeptId;
        }

        // Private: only owner
        return (int) $policyDocument->owner_user_id === (int) $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PolicyDocument $policyDocument): bool
    {
        return $this->isAdmin($user);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PolicyDocument $policyDocument): bool
    {
        return $this->isAdmin($user);
    }

    public function restore(User $user, PolicyDocument $policyDocument): bool
    {
        return $this->isAdmin($user);
    }

    public function forceDelete(User $user, PolicyDocument $policyDocument): bool
    {
        return $this->isAdmin($user);
    }
}
