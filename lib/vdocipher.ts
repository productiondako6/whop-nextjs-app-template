export async function generateVdoCipherOtp(discordUsername: string) {
  const annotate = JSON.stringify([
    {
      type: "rtext",
      text: `Discord: ${discordUsername}`,
      alpha: "0.6",
      color: "0xFF0000",
      size: "15",
      interval: "5000",
      skip: "15000",
    },
  ]);

  const response = await fetch(
    `https://dev.vdocipher.com/api/videos/${process.env.VDOCIPHER_VIDEO_ID}/otp`,
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
    throw new Error("Failed to generate OTP");
  }

  return response.json();
}
