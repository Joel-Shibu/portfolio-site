import { RobotScrollytelling } from "@/components/robot/RobotScrollytelling";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Interactive Cinematic 3D Robot Scrollytelling Experience */}
      <RobotScrollytelling />

      {/* Accessible & Search Engine Semantic Profile (Prerendered for Googlebot, Perplexity, & AI Crawlers) */}
      <section className="sr-only" aria-label="Joel Shibu Engineering Portfolio Summary">
        <header>
          <h1>Joel Shibu (Joel) — AI Generalist &amp; Full Stack Developer</h1>
          <p>
            Joel Shibu (professionally known as Joel) is an AI Generalist, Full Stack Developer, and AI Engineering student at APJ Abdul Kalam Technological University and Baselios Mathews II College of Engineering, residing in Adoor, Kerala, India.
          </p>
          <p>
            Transforming AI research into production systems across healthcare diagnostics, autonomous robotics, and agentic LLM integration.
          </p>
        </header>

        <section aria-label="Featured Engineering Projects">
          <h2>Featured AI &amp; Robotics Projects</h2>
          
          <article>
            <h3>NeuroSight: On-Device Neurological Screening Platform</h3>
            <p>
              Browser-based AI platform for neurological health screening using real-time eye-movement tracking. Built with TensorFlow.js and React to process all inference on-device for 100% patient data privacy.
            </p>
            <ul>
              <li>Accuracy: 94% diagnostic screening accuracy</li>
              <li>Latency: 47ms edge inference latency</li>
              <li>Data Privacy: 100% on-device client processing</li>
              <li>Technologies: TensorFlow.js, React 19, FastAPI, Python, WebGL</li>
              <li>Repository: https://github.com/MedBotix/NeuroSight</li>
            </ul>
          </article>

          <article>
            <h3>RESP-AI: Real-Time Pulmonary Acoustic Monitoring</h3>
            <p>
              Real-time respiratory health monitoring system utilizing deep convolutional neural network (CNN) acoustic analysis with a two-stage cascade architecture and continuous 48 kHz WebSocket audio streaming.
            </p>
            <ul>
              <li>Accuracy: 97.3% diagnostic classification accuracy</li>
              <li>Latency: 94ms end-to-end processing latency</li>
              <li>Audio Stream: 48 kHz continuous uncompressed audio</li>
              <li>Technologies: Convolutional Neural Networks (CNNs), Flutter, Python, WebSockets</li>
              <li>Repository: https://github.com/MedTechHealth/RESP-AI</li>
            </ul>
          </article>

          <article>
            <h3>AirGuardian: Autonomous Indoor Drone for Environmental Intelligence</h3>
            <p>
              Autonomous indoor drone navigation system for industrial safety, gas hazard detection, and environmental mapping. Fuses 8-sensor IoT telemetry with OpenCV visual processing and ROS SLAM mapping.
            </p>
            <ul>
              <li>Coverage: 500m² operational area capacity</li>
              <li>Sensor Fusion: 8-sensor IoT environmental telemetry fusion</li>
              <li>Navigation: Real-time autonomous SLAM and obstacle avoidance</li>
              <li>Technologies: OpenCV, ESP32 (C++), ROS / ROS2, SLAM, Arduino</li>
              <li>Repository: https://github.com/Joel-Shibu</li>
            </ul>
          </article>
        </section>

        <section aria-label="Technical Arsenal and Frameworks">
          <h2>Technical Skills &amp; Arsenal</h2>
          <p><strong>AI &amp; Machine Learning:</strong> PyTorch, TensorFlow, TensorFlow.js, OpenCV, Convolutional Neural Networks (CNNs), Prompt Design in Vertex AI.</p>
          <p><strong>Systems &amp; Robotics:</strong> ROS / ROS2, ESP32 (C++), Arduino, SLAM (Simultaneous Localization &amp; Mapping), Multi-Sensor Fusion, WebSockets.</p>
          <p><strong>Full-Stack &amp; Cloud:</strong> Next.js 16, React 19, TypeScript, Tailwind CSS, FastAPI, Flutter, Docker, Google Cloud Platform (GCP), CI/CD.</p>
        </section>

        <section aria-label="Education, Location &amp; Contact">
          <h2>Education &amp; Location</h2>
          <p><strong>Primary Home Location:</strong> Adoor, Kerala, India (09.1530° N, 76.7356° E).</p>
          <p><strong>College Affiliation:</strong> Baselios Mathews II College of Engineering, Sasthamcotta, Kerala, India.</p>
          <p><strong>University:</strong> APJ Abdul Kalam Technological University, Kerala, India.</p>
          <p><strong>Direct Email:</strong> joelshibuadoor@gmail.com</p>
          <p><strong>LinkedIn Profile:</strong> https://www.linkedin.com/in/joel-shibu-b6bb54352/</p>
          <p><strong>GitHub Profile:</strong> https://github.com/Joel-Shibu</p>
        </section>
      </section>
    </main>
  );
}