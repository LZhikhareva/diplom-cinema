<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movie;
use App\Models\Session;
use App\Models\Seat;

class SeanceController extends Controller
{
    public function update(Request $request)
    {
        $seances = Session::all();
        Session::query()->delete();
        $seancesIn = $request->json();
        foreach ($seancesIn as $seanceIn) {
            $s = 0;
            foreach ($seances as $seance) {
                if ($seanceIn['id'] === $seance->id) {
                    Session::query()->create($seanceIn);
                    $s++;
                }
            }
            if ($s == 0) {
                $seance = Session::query()->create($seanceIn);
                $seats = Seat::query()->where(['hall_id' => $seance->hall_id])->get();
                $seance->seance_seats = json_encode($seats);
                $seance->save();
            }
        }
        $seancesOut = Session::all();
        return response()->json($seancesOut);
    }

    public function addSeance(Request $request, int $id)
    {
        $seances = Session::all();
        Session::query()->delete();
        $seancesIn = $request->json();
        foreach ($seancesIn as $seanceIn) {
            $s = 0;
            foreach ($seances as $seance) {
                if ($seanceIn['id'] === $seance->id) {
                    Session::query()->create($seanceIn);
                    $s++;
                }
            }
            if ($s == 0)
                Session::query()->create($seanceIn);
        }
        $seancesOut = Session::all();
        return response()->json($seancesOut);
    }

    public function addSeats(Request $request, Session $seance)
    {
        $seance->selected_seats = $request->input('selected_seats');
        $seance->seance_seats = $request->input('seance_seats');
        $seance->save();
    }
}