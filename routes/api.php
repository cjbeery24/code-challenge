<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});*/

Route::post('/logout', function(Request $request) {
    $user = Auth::user();
    $user->tokens()->delete();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
});

/*Route::prefix('tasks')->controller(\App\Http\Controllers\TaskController::class)->group(function() {
    Route::get('/', 'index');
    Route::post('/', 'store');
    Route::get('/{id}', 'show');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});*/

Route::apiResource('tasks', \App\Http\Controllers\TaskController::class);
