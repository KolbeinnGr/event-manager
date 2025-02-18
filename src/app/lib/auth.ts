import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { DatabaseManager } from "../server/database/databaseManager";

const dbManager = new DatabaseManager();

export const authOptions: NextAuthOptions = {
	providers: [
		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		}),
	],
	secret: process.env.NEXTAUTH_SECRET,
	callbacks: {
		async jwt({ token, account, profile }) {
			if (account && profile && profile.email) {
				let user = await dbManager.getUserByEmail(profile.email);

				if (!user) {
					user = await dbManager.createUser(
						profile.name || "Unknown",
						profile.email
					);
				}

				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as number;
			}
			console.log(session.user);
			return session;
		},
	},
};
