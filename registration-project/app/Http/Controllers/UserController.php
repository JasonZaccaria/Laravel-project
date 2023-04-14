<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\User;

class UserController extends Controller
{
    public function createuser(Request $request) {
        \Log::info($request);
        try {
            $newUser = new User;
            $newUser->firstname = $request->user["firstname"];
            $newUser->lastname = $request->user["lastname"];
            $newUser->email = $request->user["email"];
            $newUser->password = $request->user["password"];
            $newUser->save();
            return "success";
        } catch (Exception $e) {
            \Log::error("could not save user");
        }
    }

    public function authenticateuser(Request $request) {
        \Log::info($request);
        try {
            $findUser = User::where('email', $request->signInCredentials['email'])->get();
            if ($request->signInCredentials['password'] == $findUser[0]['password']) {
                \Log::info("successful signin");
                return "success";
            }
        } catch (Exception $e) {
            \Log::error("Could not authenticate user");
            return "failure";
        }
    }
}
