<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleController extends Controller
{
    public function viewAllRoles()
    {
        $roles = Role::all();
        return view('roles', compact('roles'));
    }
}
