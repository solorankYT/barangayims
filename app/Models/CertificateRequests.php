<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CertificateRequests extends Model
{
    protected $table = 'certificate_requests';
    protected $primaryKey = 'certificateRequestID';
    protected $fillable = [
        'userID',
        'certificateType',
        'status',
        'purpose',
        'remarks',
        'certificateID',
    ];

    protected $attributes = [
        'certificateID' => null, 
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'id');
    }

    public function certificate()
    {
        return $this->belongsTo(Certificates::class, 'certificateID', 'certificateID');
    }
}
