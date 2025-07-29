import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        console.log("POST request received for notes");
        const { userId, title, content, date, isStarred } = await request.json();

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "Missing field: userId" }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate that the user exists
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        if (userError || !userData) {
            console.error("User not found:", userError);
            return new Response(
                JSON.stringify({ error: "User not found" }), 
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log("Processing note for user:", userId, "date:", date);

        // Check if a note already exists for this user and date
        const { data: existingNote, error: checkError } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", userData.id)
            .eq("date", date)
            .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
            console.error("Error checking existing note:", checkError);
            return new Response(
                JSON.stringify({ error: "Error checking existing note" }), 
                { 
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        let result;
        let operation;

        if (existingNote) {
            // Update existing note
            console.log("Updating existing note for date:", date);
            
            const { data, error } = await supabase
                .from("notes")
                .update({
                    title: title || "",
                    content: content || "",
                    is_starred: isStarred || false,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", existingNote.id)
                .select();
            
            if (error) {
                console.error("Supabase update error:", error);
                return new Response(
                    JSON.stringify({ error: error.message }), 
                    { 
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
            
            result = data[0];
            operation = "updated";
            console.log("Note updated successfully:", result);
        } else {
            // Create new note
            console.log("Creating new note for date:", date);
            
            const noteData = {
                user_id: userData.id,
                title: title || "",
                content: content || "",
                date: date || new Date().toISOString().split('T')[0],
                is_starred: isStarred || false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await supabase
                .from("notes")
                .insert(noteData)
                .select();
            
            if (error) {
                console.error("Supabase insert error:", error);
                return new Response(
                    JSON.stringify({ error: error.message }), 
                    { 
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }
            
            result = data[0];
            operation = "created";
            console.log("Note created successfully:", result);
        }

        return new Response(
            JSON.stringify({ 
                data: result,
                message: `Note ${operation} successfully`,
                operation: operation
            }), 
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error("API error:", error);
        return new Response(
            JSON.stringify({ 
                error: error instanceof Error ? error.message : "Unknown error" 
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const date = searchParams.get('date');

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "userId parameter is required" }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        console.log("Fetching notes for user:", userId, "date:", date);

        // Validate that the user exists
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("clerk_id", userId)
            .single();

        if (userError || !userData) {
            console.error("User not found:", userError);
            return new Response(
                JSON.stringify({ error: "User not found" }), 
                { 
                    status: 404,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        let query = supabase
            .from("notes")
            .select("*")
            .eq("user_id", userData.id);

        // If date is provided, filter by date
        if (date) {
            query = query.eq("date", date);
            const { data, error } = await query.single();
            
            if (error) {
                if (error.code === 'PGRST116') { // No rows returned
                    console.log("No note found for date:", date);
                    return new Response(
                        JSON.stringify({ data: null }), 
                        { 
                            status: 200,
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                }
                console.error("Supabase error:", error);
                return new Response(
                    JSON.stringify({ error: error.message }), 
                    { 
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            console.log("Note fetched successfully:", data);
            return new Response(
                JSON.stringify({ 
                    data: data
                }), 
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        } else {
            // Get all notes for user
            const { data, error } = await query.order("created_at", { ascending: false });
            
            if (error) {
                console.error("Supabase error:", error);
                return new Response(
                    JSON.stringify({ error: error.message }), 
                    { 
                        status: 500,
                        headers: { 'Content-Type': 'application/json' }
                    }
                );
            }

            console.log("Notes fetched successfully:", data);

            return new Response(
                JSON.stringify({ 
                    data: data,
                    count: data.length
                }), 
                { 
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    } catch (error) {
        console.error("API error:", error);
        return new Response(
            JSON.stringify({ 
                error: error instanceof Error ? error.message : "Unknown error" 
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

