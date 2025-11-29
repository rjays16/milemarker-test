<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'is_completed',
        'due_date',
        'user_id',
        'category_id',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'due_date' => 'date',
    ];

    // Relationship: Todo belongs to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship: Todo belongs to Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}