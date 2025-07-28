import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        console.log("POST request received");
        const { name, email, clerkId } = await request.json();

        if (!name || !email || !clerkId) {
            return Response.json(
                { error: "Missing required fields" }, 
                { status: 400 }
            );
        }

        console.log("Inserting user data:", { name, email, clerkId });

        const { data, error } = await supabase.from("users").insert({
            // TODO: Generate UUID based on clerkId
            name: name,
            email: email,
            clerk_id: clerkId,
        });
        
        if (error) {
            console.error("Supabase error:", error);
            return Response.json({ error: error.message }, { status: 500 });
        }

        console.log("User created successfully:", data);

        return Response.json({ data: data }, { status: 200 });
    } catch (error) {
        console.error("API error:", error);
        return Response.json({ 
            error: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}