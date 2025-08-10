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

        return view('client.index', [
            'halls' => $halls,
            'movies' => $movies,
            'seances' => $seances,
        ]);
    }

    public function hall(int $id)
    {
        $seance = Session::with(['movie', 'hall'])->get()->find($id);
        $seats = Seat::query()->where(['hall_id' => $seance->hall_id])->get();
        $hall = Hall::query()->find($seance->movie_id);
        $movie = Movie::query()->find($seance->hall_id);
        return view('client.hall', ['seance' => $seance, 'seats' => $seats, 'hall' => $hall, 'movie' => $movie]);
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
