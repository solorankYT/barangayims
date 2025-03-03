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
        'purpose',
        'remarks',
        'documentID',
    ];

    protected $attributes = [
        'documentID' => null, // Default to NULL when creating a request
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
        return $this->belongsTo(Documents::class, 'documentID', 'documentID');
    }
}
