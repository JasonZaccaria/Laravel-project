<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;

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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['cors'])->group(function () {
    Route::post("/createuser", [UserController::class, 'createuser'])->name('createuser');
    Route::post("/signin", [UserController::class, 'authenticateuser'])->name('authenticateuser');
    Route::post("/createblog", [BlogController::class, 'createBlogPost'])->name('createBlogPost');
    Route::get("/getblogs", [BlogController::class, 'getBlogs'])->name('getBlogs');
    Route::delete("/deleteblog/{id}", [BlogController::class, 'deleteBlog'])->name('deleteBlog');
    Route::put("/editblog/{id}", [BlogController::class, 'editBlog'])->name('editBlog');
});

