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

  // Get the user
  const user = await whopsdk.users.retrieve(userId);

  // Try to get Discord username
  let discordUsername = user.username || "Unknown";
  try {
    const socials = await (whopsdk as any).socialAccounts?.list?.({ user_id: userId, platform: "discord" });
    if (socials?.data?.[0]?.username) {
      discordUsername = socials.data[0].username;
    }
  } catch (e) {
    // Fall back to Whop username if Discord lookup fails
    console.log("Could not fetch Discord username");
  }

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
