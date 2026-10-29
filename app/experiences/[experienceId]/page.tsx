import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { generateVdoCipherOtp } from "@/lib/vdocipher";

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const { userId } = await whopsdk.verifyUserToken(await headers());

  // Get the user with any type to access extra fields
  const user = await whopsdk.users.retrieve(userId) as any;

  // Look for Discord in social links or other fields
  let discordUsername = user.username || "Unknown";

  if (user.social_links) {
    const discord = user.social_links.find((link: any) => 
      link.website === "discord" || link.platform === "discord" || link.url?.includes("discord")
    );
    if (discord?.username) discordUsername = discord.username;
  }

  // Alternative: check if Discord username is stored elsewhere
  if (user.discord_username) discordUsername = user.discord_username;

  const { otp, playbackInfo } = await generateVdoCipherOtp(discordUsername);

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2>Watching as: {discordUsername}</h2>
      <div style={{ paddingTop: "56.25%", position: "relative" }}>
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
          style={{
            border: 0,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          allow="encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
}
