<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\PolicyDocument;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $faker = \Faker\Factory::create();

        $users = User::query()->get();
        if ($users->isEmpty()) {
            $this->command?->warn('Skipping NotificationSeeder: no users found.');
            return;
        }

        $policies = PolicyDocument::query()->get();
        if ($policies->isEmpty()) {
            $this->command?->warn('Skipping NotificationSeeder: no policies found.');
            return;
        }

        $types = ['approval', 'acknowledgement', 'policy', 'system'];

        foreach ($users as $user) {
            $count = $faker->numberBetween(3, 8);

            for ($i = 0; $i < $count; $i++) {
                $policy = $policies->random();
                $type = $faker->randomElement($types);

                $title = match ($type) {
                    'approval' => 'Approval update',
                    'acknowledgement' => 'Acknowledgement required',
                    'policy' => 'New policy activity',
                    default => 'System notice',
                };

                $message = $faker->sentence(12);

                $isRead = $faker->boolean(60);
                $readAt = $isRead ? Carbon::now()->subDays($faker->numberBetween(1, 30)) : null;

                // reseeding-safe via title+message+type+user
                $existing = Notification::query()
                    ->where('user_id', $user->id)
                    ->where('type', $type)
                    ->where('title', $title)
                    ->where('message', $message)
                    ->first();

                if ($existing) {
                    continue;
                }

                Notification::create([
                    'user_id' => $user->id,
                    'type' => $type,
                    'title' => $title,
                    'message' => $message,
                    'data' => [
                        'policy_document_id' => $policy->id,
                        'policy_title' => $policy->title,
                    ],
                    'is_read' => $isRead,
                    'read_at' => $readAt,
                    'created_at' => Carbon::now()->subDays($faker->numberBetween(1, 45)),
                    'updated_at' => Carbon::now()->subDays($faker->numberBetween(0, 15)),
                ]);
            }
        }
    }
}

