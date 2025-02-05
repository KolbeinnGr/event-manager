"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
	const { data: session } = useSession();

	return (
		<div style={{ textAlign: "center", marginTop: "50px" }}>
			<h1>GitHub OAuth with NextAuth.js</h1>
			{!session ? (
				<>
					<p>You are not signed in.</p>
					<button onClick={() => signIn("github")}>Sign in with GitHub</button>
				</>
			) : (
				<>
					<p>Welcome, {session.user?.name}!</p>
					<img
						src={session.user?.image || ""}
						alt="Profile"
						style={{ borderRadius: "50%", width: "100px" }}
					/>
					<p>Email: {session.user?.email}</p>
					<Link href="/create-event">
						<button className="btn bg-blue-600 p-1 rounded-md hover:shadow-sm">Create Event</button>
					</Link>
					<p></p>
					<button onClick={() => signOut()}>Sign Out</button>
				</>
			)}
		</div>
	);
}
