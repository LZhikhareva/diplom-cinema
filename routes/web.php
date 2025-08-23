<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HallController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\SeanceController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::get('login', [LoginController::class, 'form'])->name('login');
    Route::post('login', [LoginController::class, 'authenticate']);

    Route::group(['middleware' => 'auth'], function () {
        Route::get('index', [AdminController::class, 'index'])->name('index');
        Route::post('add-hall', [HallController::class, 'create'])->name('add-hall');

        Route::post('add-movie', [AdminController::class, 'createMovie'])->name('add-movie');

        Route::post('delete-hall/{id}', [HallController::class, 'delete']);
        Route::post('delete-movie/{id}', [AdminController::class, 'deleteMovie']);

        Route::post('seances', [SeanceController::class, 'update'])->name('seance-update');
        Route::post('add-seance/{id}', [SeanceController::class, 'update'])->name('add-seance');

        Route::post('halls/{id}', [HallController::class, 'update'])->name('halls-update');
        Route::post('seats/{id}', [HallController::class, 'updateSeats'])->name('seats-update');
        //Route::post('seance', function () {return view('welcome');});        

    });
});

Route::prefix('client')->group(function () {
    Route::get('index', [ClientController::class, 'index']);
    Route::get('hall/{id}', [ClientController::class, 'hall'])->name('client-hall');
    Route::get('payment/{id}', [ClientController::class, 'payment']);
    Route::get('ticket/{id}', [ClientController::class, 'ticket']);
});

Route::name('user.')->group(function () {

    //Route::get('/admin_main', [TodoController::class, 'showAdminMain'])->middleware('auth')->name('private');

    Route::get('/auth/app-login', [LoginController::class, 'loginGet'])->name('login');
    Route::post('/auth/app-login', [LoginController::class, 'login']);
    Route::get('/auth/logout', [LoginController::class, 'logout'])->name('logout');
});

Route::get('/login', [LoginController::class, 'adminLogin'])->name('admin-login');
Route::get('/admin/cancel/{section}', [AdminController::class, 'cancelSection']);