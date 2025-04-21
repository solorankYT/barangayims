<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Household extends Model
{
    protected $fillable = [
        'name',
    ];

    protected $table = 'households';
    protected $primaryKey = 'id';

    public function members()
    {
        return $this->hasMany(User::class);
    }
}