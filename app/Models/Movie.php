<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Session;

class Movie extends Model
{
    use HasFactory;
    public $timestamps = false;
    public $fillable = ['title', 'duration', 'description', 'country', 'poster_path'];

    public function sessions()
    {
        return $this->hasMany(Session::class)->orderBy('start');
    }
}
