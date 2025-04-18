<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function validateUser(Request $request)
    {
        
        $request->validate([
            'id' => 'required|exists:users,id',
            'is_verified' => 'required|boolean',
        ]);
        
        try{
            $user = User::find($request->id);
    
            $user->update([
                'is_verified' => $request->is_verified,
            ]);
    
            return response()->json(['message' => 'User Updated Successfully.'], 200);
        }catch(\Exception $e){
            return response()->json(['message' => 'User Not Updated.'], 401);
        }
    }
}
