<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Documents extends Model
{
    use SoftDeletes;

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
