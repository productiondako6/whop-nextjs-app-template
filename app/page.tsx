"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

const videos = [
  { id: "6bdd4eb7c3d9403b82d691891fe9fd2d", title: "Faye! (God of War)" },
  { id: "5a75bb58f9774fd398767e38c7a2d10b", title: "Night Stalker" },
  { id: "4462579597784f638cb50044aadf6894", title: "Up The Ladder" },
];

export default function Page() {
  const { data: session, status } = useSession();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [otpData, setOtpData] = useState<{ otp: string; playbackInfo: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function playVideo(videoId: string) {
    setLoading(true);
    setSelectedVideo(videoId);
    try {
      const res = await fetch("/api/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });
      const data = await res.json();
      setOtpData(data);
    } catch (e) {
      alert("Failed to load video");
    }
    setLoading(false);
  }

  if (status === "loading") return <div style={{ padding: "40px" }}>Loading...</div>;

  if (!session) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Videos</h1>
        <button onClick={() => signIn("discord")} style={{ padding: "12px 24px", fontSize: "16px" }}>
          Login with Discord
        </button>
      </div>
    );
  }

  if (selectedVideo && otpData) {
    const video = videos.find((v) => v.id === selectedVideo);
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
        <button onClick={() => { setSelectedVideo(null); setOtpData(null); }}>← Back</button>
        <h2>{video?.title}</h2>
        <p>Watching as: {session.user?.name}</p>
        <div style={{ paddingTop: "56.25%", position: "relative" }}>
          <iframe
            src={`https://player.vdocipher.com/v2/?otp=${otpData.otp}&playbackInfo=${otpData.playbackInfo}`}
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Videos</h1>
        <button onClick={() => signOut()}>Logout</button>
      </div>
      <p>Logged in as: {session.user?.name}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
        {videos.map((v) => (
          <button
            key={v.id}
            onClick={() => playVideo(v.id)}
            disabled={loading}
            style={{ padding: "16px", textAlign: "left", cursor: "pointer" }}
          >
            {v.title}
          </button>
        ))}
      </div>
    </div>
  );
}
