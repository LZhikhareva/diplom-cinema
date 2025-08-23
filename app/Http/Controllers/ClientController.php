<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Hall;
use App\Models\Movie;
use App\Models\Session;
use App\Models\Seat;

class ClientController extends Controller
{
    public function index()
    {
        $halls = Hall::query()->where(['is_open' => true])->get();
        $movies = Movie::with('sessions')->get();
        $seances = Session::all();
        $isOpen = $halls->isNotEmpty();

        return view('client.index', [
            'halls' => $halls,
            'movies' => $movies,
            'seances' => $seances,
            'isOpen' => $isOpen,
        ]);
    }

    public function hall(int $id)
    {
        $seance = Session::with(['movie', 'hall'])->findOrFail($id);
        $seats = Seat::query()->where(['hall_id' => $seance->hall_id])->get();
        $hall = $seance->hall;
        $movie = $seance->movie;
        return view('client.hall', compact('seance', 'seats', 'hall', 'movie'));
    }

    public function payment(Request $request, int $id)
    {
        $seance = Session::with(['movie', 'hall'])->get()->find($id);
        return view('client.payment', ['seance' => $seance]);
    }

    public function ticket(Request $request, int $id)
    {
        $seance = Session::with(['movie', 'hall'])->get()->find($id);
        return view('client.ticket', ['seance' => $seance]);
    }
}
