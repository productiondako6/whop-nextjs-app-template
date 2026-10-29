import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { generateVdoCipherOtp } from "@/lib/vdocipher";

const videos = [
  { id: "6bdd4eb7c3d9403b82d691891fe9fd2d", title: "Faye! (God of War)" },
  { id: "5a75bb58f9774fd398767e38c7a2d10b", title: "Night Stalker" },
  { id: "4462579597784f638cb50044aadf6894", title: "Up The Ladder" },
];

export default async function ExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ experienceId: string }>;
  searchParams: Promise<{ video?: string }>;
}) {
  const { experienceId } = await params;
  const { video } = await searchParams;
  const { userId } = await whopsdk.verifyUserToken(await headers());

  const user = await whopsdk.users.retrieve(userId);
  const discordUsername = user.username || "Unknown";

  if (video) {
    const selected = videos.find((v) => v.id === video);
    if (!selected) return <div>Video not found</div>;

    const { otp, playbackInfo } = await generateVdoCipherOtp(discordUsername, selected.id);

    return (
      <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <a href="?" style={{ display: "inline-block", marginBottom: "16px" }}>← Back to videos</a>
        <h2>{selected.title}</h2>
        <p>Watching as: {discordUsername}</p>
        <div style={{ paddingTop: "56.25%", position: "relative" }}>
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
            style={{ border: 0, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            allow="encrypted-media"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Videos</h1>
      <p>Watching as: {discordUsername}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
        {videos.map((v) => (
          <a
            key={v.id}
            href={`?video=${v.id}`}
            style={{
              display: "block",
              padding: "16px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            {v.title}
          </a>
        ))}
      </div>
    </div>
  );
}
