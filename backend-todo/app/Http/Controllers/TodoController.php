<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
         $query = Todo::where('user_id', $request->user()->id)
            ->with('category');

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by completed status
        if ($request->has('is_completed')) {
            $query->where('is_completed', $request->is_completed);
        }

        // Sort by due date or created date
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if ($sortBy === 'due_date') {
            $query->orderByRaw('due_date IS NULL, due_date ' . $sortOrder);
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        $todos = $query->get();

        return TodoResource::collection($todos);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTodoRequest $request)
    {
         $todo = Todo::create([
            'title' => $request->title,
            'description' => $request->description,
            'is_completed' => $request->is_completed ?? false,
            'due_date' => $request->due_date,
            'category_id' => $request->category_id,
            'user_id' => $request->user()->id,
        ]);

        $todo->load('category');

        return response()->json([
            'data' => new TodoResource($todo),
            'message' => 'Todo created successfully',
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Todo $todo)
    {
         // Check if todo belongs to user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $todo->load('category');

        return new TodoResource($todo);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Todo $todo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTodoRequest $request, Todo $todo)
    {
         // Check if todo belongs to user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $todo->update($request->validated());
        $todo->load('category');

        return response()->json([
            'data' => new TodoResource($todo),
            'message' => 'Todo updated successfully',
        ]);
    }

     // Toggle todo completion status
    public function toggle(Request $request, Todo $todo)
    {
        // Check if todo belongs to user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $todo->update([
            'is_completed' => !$todo->is_completed,
        ]);

        $todo->load('category');

        return response()->json([
            'data' => new TodoResource($todo),
            'message' => 'Todo status updated',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Todo $todo)
    {
        // Check if todo belongs to user
        if ($todo->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully',
        ]);
    }
}
