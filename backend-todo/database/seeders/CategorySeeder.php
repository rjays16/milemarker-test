<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $user = User::firstOrCreate(
            [
                'email' => 'test@example.com'
            ],

            [
                'name' => 'Test User',
                'password' => bcrypt('password'),
            ]
        );

        // Create default categories
        $categories = [
            ['name' => 'Work', 'color' => '#3b82f6'],      // Blue
            ['name' => 'Personal', 'color' => '#10b981'],   // Green
            ['name' => 'Shopping', 'color' => '#f59e0b'],   // Amber
            ['name' => 'Health', 'color' => '#ef4444'],     // Red
            ['name' => 'Study', 'color' => '#8b5cf6'],      // Violet
            ['name' => 'Home', 'color' => '#06b6d4'],       // Cyan
        ];

         foreach ($categories as $category) {
            Category::create([
                'name' => $category['name'],
                'color' => $category['color'],
                'user_id' => $user->id,
            ]);
        }
    }
}
