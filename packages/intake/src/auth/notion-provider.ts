import { NextAuthOptions } from "next-auth";
import { NotionAdapter } from "./notion-adapter";

export const notionProvider: NextAuthOptions = {
    providers: [
        {
            id: "notion",
            name: "Notion",
            type: "oauth",
            authorization: {
                url: "https://api.notion.com/v1/oauth/authorize",
                params: {
                    client_id: process.env.NOTION_CLIENT_ID,
                    response_type: "code",
                    owner: "user",
                },
            },
            token: {
                url: "https://api.notion.com/v1/oauth/token",
                params: {
                    client_id: process.env.NOTION_CLIENT_ID,
                    client_secret: process.env.NOTION_CLIENT_SECRET,
                    grant_type: "authorization_code",
                },
            },
            userinfo: {
                url: "https://api.notion.com/v1/users/me",
                async request({ tokens }) {
                    const response = await fetch("https://api.notion.com/v1/users/me", {
                        headers: {
                            Authorization: `Bearer ${tokens.access_token}`,
                            "Notion-Version": "2022-06-28",
                        },
                    });
                    return response.json();
                },
            },
            profile(profile) {
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.person?.email,
                    image: profile.avatar_url,
                };
            },
        },
    ],
    adapter: NotionAdapter(),
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
                session.user.accessToken = token.accessToken as string;
            }
            return session;
        },
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
    },
}; 