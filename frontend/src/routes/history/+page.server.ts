import { db } from "$lib/server/db"
import { matches } from "$lib/server/db/schema"
import { validateSessionToken } from "$lib/auth"
import { eq } from "drizzle-orm"

export async function load({ cookies }) {
    const token = cookies.get("session")
    const message = ""
    if (token === undefined) {
            console.log("error: Cookie not found")
            return {
                matchRecords: [],
                message: "Log in to view stats"
            }
        }
        
    const { session, user } = await validateSessionToken(token)
    if (!session) {
        console.log("Session invalid")
        return {
            matchRecords: [],
            message: "Log in to view stats"
        } 
    }
    if (!user) {
        console.log("User not found")
        return {
            matchRecords: [],
            message: "User not found"
        }
    }

    const matchRecords: MatchRecord[] = await db
        .select()
        .from(matches)
        .where(eq(matches.userID, user.id))
    
    
    return {
        matchRecords : matchRecords.reverse(),
        message: "success"
    }
}