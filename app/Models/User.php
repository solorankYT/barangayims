<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'birthday',
        'gender',
        'email',
        'contact_number',
        'address',
        'city',
        'zip_code',
        'household_head',
        'household_id',
        'is_verified',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birthday' => 'date:Y-m-d',
            'password' => 'hashed',
            'household_head' => 'boolean',
            'is_verified' => 'boolean',
            'household_id' => 'integer',
        ];
    }

    public function incidentReports()
    {
        return $this->hasMany(IncidentReport::class, 'residentID', 'id');
    }

    public function documentRequests()
    {
        return $this->hasMany(DocumentRequests::class, 'userID', 'id');
    }

    public function household()
    {
        return $this->belongsTo(Household::class);
    }

    public function residentFiles()
    {
        return $this->hasOne(ResidentFile::class, 'resident_id', 'id');
    }
}