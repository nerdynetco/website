import { ORG_DOMAIN } from "@/project.config";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { IDENTITY_KEY } from './project.config';



export async function middleware(request: NextRequest) {
    const identityKey = request.headers.get("X-IDENTITY-KEY") || "";
    if (identityKey !== IDENTITY_KEY) {
        //  log this in logger database or whatever you use for logging
        console.log(
            "Missing or invalid SERVER_IDENTITY",
            "received:",
            identityKey
        )
        return NextResponse.json({
            error: "Missing or invalid SERVER_IDENTITY",
            data: null,
        }, { status: 403 });
    }
    if (request.method === "GET"){
        return NextResponse.redirect(new URL("/",ORG_DOMAIN));
    }
    return NextResponse.next();
}
// the following code has been copied from https://nextjs.org/docs/advanced-features/middleware#matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - manifest.manifest (manifest file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
