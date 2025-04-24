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
            'isVerifying' => 'required|boolean',
            'rejectionReason' => 'nullable|string|max:255',
        ]);
        
        try{
            if($request->isVerifying == true){
                $user = User::find($request->id);
        
                $user->update([
                    'is_verified' => $request->isVerifying,
                ]);
            }else if ($request->isVerifying == false){
                $user = User::find($request->id);
        
                $user->update([
                    'is_verified' => $request->isVerifying,
                ]);
            }
            return response()->json(['message' => 'User Updated Successfully.'], 200);
        }catch(\Exception $e){
            return response()->json(['message' => 'User Not Updated.'], 401);
        }
    }
}
