export function getSessionCookieOptions(req: any) { return { httpOnly: true, path: "/", sameSite: "none", secure: true }; }
