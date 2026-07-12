<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core reference data
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            UserSeeder::class,
        ]);

        // Domain data
        $this->call([
            PolicyDocumentSeeder::class,
            PolicyVersionSeeder::class,
            ApprovalSeeder::class,
            AcknowledgementSeeder::class,
            BookmarkSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}


