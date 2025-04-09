import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequestWithAuth } from "next-auth/middleware";

export async function authMiddleware(req: NextRequestWithAuth) {
    const token = await getToken({ req });
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");

    if (isApiRoute) {
        if (!token) {
            return new NextResponse(
                JSON.stringify({ error: "Authentication required" }),
                { status: 401 }
            );
        }

        // Add user ID to request headers for downstream use
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", token.sub as string);

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    }

    return NextResponse.next();
} 