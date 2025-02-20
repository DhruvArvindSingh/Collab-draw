"use client"
import styles from "./page.module.css";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  
  return (
    <div className={styles.page}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <h2>ChatRooms</h2>
        </div>
        <div className={styles.authButtons}>
          <button className={styles.secondary} onClick={() => router.push("/signin")}>Sign In</button>
          <button className={`${styles.primary}`} onClick={() => router.push("/signup")}>Sign Up</button>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.joinRoom}>
          <h1>Join a Room</h1>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Enter room code"
              className={styles.roomInput}
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
            />
            <button className={styles.primary} onClick={() => router.push(`/room/${roomCode}`)}>Join</button>
          </div>
        </div>
      </main>
    </div>
  );
}
