<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SmsController extends Controller
{
    protected $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function sendGroupMessage(Request $request)
    {
        $request->validate([
            'message' => 'sometimes|string'
        ]);

        // Get all users with contact numbers
        $users = User::whereNotNull('contact_number')->get();
        
        Log::info('Users with contact numbers:', $users->toArray());

        if ($users->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No users with contact numbers found'
            ], 404);
        }

        // Prepare messages
        $messages = [];
        $messageText = $request->input('message',
         'This is a notification from your Barangay. A disaster situation is occurring in your area. 
         Please stay calm and follow evacuation instructions immediately. 
         For your safety, proceed to the nearest evacuation center. Stay updated for more information.'); // Default message
        
        foreach ($users as $user) {
            $messages[] = [
                'number' => $user->contact_number,
                'message' => $messageText
            ];
        }

        try {
            // Send messages using all available devices
            $result = $this->smsService->sendBulkMessages(
                $messages,
                SmsService::USE_ALL_DEVICES
            );
            
            return response()->json([
                'success' => true,
                'message' => 'Messages sent successfully',
                'data' => $result
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send messages: ' . $e->getMessage()
            ], 500);
        }
    }
}
