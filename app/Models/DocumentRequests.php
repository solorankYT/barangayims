<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentRequests extends Model
{
    protected $table = 'document_requests';
    protected $primaryKey = 'documentRequestID';
    protected $fillable = [
        'userID',
        'documentTypeID',
        'status',
        'pickupOption',
        'purpose',
        'remarks',
    ];

    
    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'id');
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentTypes::class, 'documentTypeID', 'documentTypeID');
    }

    public function document()
    {
        return $this->hasOne(Documents::class, 'documentID', 'documentID');
    }
}
