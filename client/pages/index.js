import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <div className={styles.landingContainer}>
        <video autoPlay loop muted className={styles.videoBackground}>
          <source src="/landingPage.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroContent}>
          <h1>Welcome to ModelForge</h1>
          <p>Manage, track, and refine your AI models with ease.</p>
          <Link href="/models">
            <button>Get Started</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
