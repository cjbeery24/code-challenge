<?php

namespace App\Rules;

use App\Models\Task;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;

class ParentTaskExists implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value) {
            $task = Task::find($value);
            if (!$task || $task->user_id !== Auth::user()->id) {
                $fail('The :attribute does not exist.');
            }
        }
    }
}
