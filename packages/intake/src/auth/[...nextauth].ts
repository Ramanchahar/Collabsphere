import NextAuth from "next-auth";
import { notionProvider } from "./notion-provider";

const handler = NextAuth(notionProvider);

export { handler as GET, handler as POST }; 