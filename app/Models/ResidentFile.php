<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResidentFile extends Model
{
    protected $table = 'resident_files';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';

    protected $fillable = [
        'resident_id',
        'fileName',
        'filePath',
    ];

    protected $casts = [
        'resident_id' => 'int',
        'fileName' => 'string',
        'filePath' => 'string',
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id', 'id');
    }
}
