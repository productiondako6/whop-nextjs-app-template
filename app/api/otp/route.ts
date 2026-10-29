import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { videoId } = await request.json();
  const name = session.user.name;

  const annotate = JSON.stringify([
    {
      type: "rtext",
      text: `Discord: ${name}`,
      alpha: "0.6",
      color: "0xFF0000",
      size: "15",
      interval: "5000",
      skip: "15000",
    },
  ]);

  const response = await fetch(
    `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
    {
      method: "POST",
      headers: {
        Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ annotate }),
    }
  );

  if (!response.ok) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }

  return NextResponse.json(await response.json());
}
