<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certificates extends Model
{
    protected $table = 'certificates';
    protected $primaryKey = 'certificateID';
    protected $fillable = [
        'certificateRequestID',
        'fileName',
        'filePath',
    ];

    public function certificateRequests()
    {
        return $this->belongsTo(CertificateRequests::class, 'certificateRequestID', 'certificateRequestID');
    }
}
