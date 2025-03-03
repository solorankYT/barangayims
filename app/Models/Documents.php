<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documents extends Model
{

    protected $table = 'documents';
    protected $primaryKey = 'documentID';
    protected $fillable = [
        'documentRequestID',
        'fileName',
        'filePath',
    ];

    public function documentRequest()
    {
        return $this->belongsTo(DocumentRequests::class, 'documentRequestID', 'documentRequestID');
    }
    
}
