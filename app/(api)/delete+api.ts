import { supabase } from "@/lib/supabase";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return Response.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    console.log("Deleting account for user:", userId);

    // Test Supabase connection first
    // try {
    //   const { data: testData, error: testError } = await supabase
    //     .from("users")
    //     .select("count")
    //     .limit(1);
      
    //   if (testError) {
    //     console.error("Supabase connection test failed:", testError);
    //     return Response.json(
    //       { error: "Database connection failed" },
    //       { status: 500 }
    //     );
    //   }
    //   console.log("Supabase connection test successful");
    // } catch (connectionError) {
    //   console.error("Exception testing Supabase connection:", connectionError);
    //   return Response.json(
    //     { error: "Database connection failed" },
    //     { status: 500 }
    //   );
    // }

    // Get the supabase user ID first before deleting from clerk
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return Response.json(
        { error: "Failed to fetch user data" },
        { status: 500 }
      );
    }

    if (!userData) {
      console.log("User not found in database, proceeding with Clerk deletion only");
    } else {
      const supabaseUserId = userData.id;
      console.log("Found user in database with ID:", supabaseUserId);

      // Check if the user has any notes
      const { data: notesData, error: notesError } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", supabaseUserId);

      if (notesData && notesData.length > 0) {
        console.log("User has notes, deleting notes...");
        
        // Delete the account from the notes table in the database if there are any
        try {
          console.log("Attempting to delete notes for user:", supabaseUserId);
          const { error: notesError } = await supabase
            .from("notes")
            .delete()
            .eq("user_id", supabaseUserId);

          if (notesError) {
            console.error("Error deleting notes:", notesError);
            return Response.json(
              { error: "Failed to delete user notes" },
              { status: 500 }
            );
          }
          console.log("Notes deleted from database");
        } catch (notesError) {
          console.error("Exception deleting notes:", notesError);
          return Response.json(
            { error: "Failed to delete user notes" },
            { status: 500 }
          );
        }
      } else {
        console.log("User has no notes, skipping notes deletion...");
      }

      // Delete the account from the users table in the database
      try {
        console.log("Attempting to delete user from database:", userId);
        const { error: dbError } = await supabase
          .from("users")
          .delete()
          .eq("clerk_id", userId);

        if (dbError) {
          console.error("Error deleting user:", dbError);
          return Response.json(
            { error: "Failed to delete user from database" },
            { status: 500 }
          );
        }
        console.log("User deleted from database");
      } catch (dbError) {
        console.error("Exception deleting user:", dbError);
        return Response.json(
          { error: "Failed to delete user from database" },
          { status: 500 }
        );
      }
    }

    // Delete the account from clerk (do this last to avoid orphaned data)
    try {
      console.log("Attempting to delete user from Clerk:", userId);
      await clerkClient.users.deleteUser(userId);
      console.log("Account deleted from clerk");
    } catch (clerkError) {
      console.error("Error deleting from clerk:", clerkError);
      return Response.json(
        { error: "Failed to delete account from Clerk" },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 