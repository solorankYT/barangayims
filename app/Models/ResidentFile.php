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
        'user_id',
        'fileName',
        'filePath',
    ];

    protected $casts = [
        'user_id' => 'int',
        'fileName' => 'string',
        'filePath' => 'string',
    ];

    public function resident()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
