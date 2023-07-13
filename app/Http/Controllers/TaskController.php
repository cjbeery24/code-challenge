<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Jobs\NotifyOverdueTask;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends BaseApiController
{

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Auth::user()->tasks()
            ->whereNull('parent_id')
            ->with('allChildren');
        $perPage = $this->getPerPage($request);

        return $query->paginate($perPage, ['*'], 'page', $request->input('page', 1));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $validated = $request->validated();
        return Task::create([
            'user_id' => Auth::user()->id,
            ...$validated
        ])->load('allChildren');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        if ($task->user_id !== Auth::user()->id) {
            abort(404);
        }
        return $task->load('allChildren');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $validated = $request->validated();
        $task->fill($validated);
        $task->save();
        if ($task->started_at && !$task->completed_at) {
            // Could also handle this in a model observer
            NotifyOverdueTask::dispatch($task)
                ->delay(now()->addDay());
        }
        return $task;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Could handle this validation in a DeleteTaskRequest
        if ($task->user_id !== Auth::user()->id) {
            abort(404);
        }
        $task->delete();
    }
}
