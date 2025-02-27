<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentTypes extends Model
{
    use SoftDeletes;

    protected $table = 'document_types';
    protected $primaryKey = 'documentTypeID';
    protected $fillable = [
        'name',
        'category',
        'description',
    ];

    public function documentRequests()
    {
        return $this->hasMany(DocumentRequests::class, 'documentTypeID', 'documentTypeID');
    }
}
