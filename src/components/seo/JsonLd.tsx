export function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfolio-site-self-eta.vercel.app";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    "name": "Joel Shibu",
    "givenName": "Joel",
    "familyName": "Shibu",
    "additionalName": "Joel",
    "alternateName": [
      "Joel",
      "Joel Shibu",
      "JoelShibu",
      "Joel Shibu Adoor",
      "Joel AI Generalist",
      "Joel Full Stack Developer"
    ],
    "jobTitle": "AI Generalist & Full Stack Developer",
    "description": "AI Generalist and Full Stack Developer transforming research into real-world systems across healthcare diagnostics, autonomous robotics, and agentic LLM integration.",
    "url": baseUrl,
    "image": `${baseUrl}/images/joel-shibu.jpeg`,
    "email": "mailto:joelshibuadoor@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Adoor",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 9.1530,
      "longitude": 76.7356
    },
    "alumniOf": [
      {
        "@type": "CollegeOrUniversity",
        "name": "APJ Abdul Kalam Technological University",
        "url": "https://ktu.edu.in/"
      },
      {
        "@type": "CollegeOrUniversity",
        "name": "Baselios Mathews II College of Engineering",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Sasthamcotta",
          "addressRegion": "Kerala",
          "addressCountry": "IN"
        }
      }
    ],
    "sameAs": [
      "https://www.linkedin.com/in/joel-shibu-b6bb54352/",
      "https://github.com/Joel-Shibu",
      "https://github.com/MedBotix/NeuroSight",
      "https://github.com/MedTechHealth/RESP-AI"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Healthcare AI",
      "Autonomous Robotics",
      "Deep Learning",
      "Full Stack Development",
      "Next.js",
      "React 19",
      "TensorFlow.js",
      "PyTorch",
      "Robot Operating System (ROS)",
      "SLAM Navigation",
      "ESP32 IoT Systems",
      "Edge Computing"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    "url": baseUrl,
    "name": "Joel Shibu — AI Generalist & Full Stack Developer",
    "alternateName": [
      "Joel Portfolio",
      "Joel Shibu Portfolio",
      "Joel AI Portfolio"
    ],
    "description": "Official interactive 3D scrollytelling portfolio of Joel Shibu (Joel), featuring NeuroSight, RESP-AI, and AirGuardian.",
    "publisher": {
      "@id": `${baseUrl}/#person`
    }
  };

  const profilePageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${baseUrl}/#webpage`,
    "url": baseUrl,
    "name": "Joel Shibu (Joel) | AI Generalist & Full Stack Developer",
    "isPartOf": {
      "@id": `${baseUrl}/#website`
    },
    "mainEntity": {
      "@id": `${baseUrl}/#person`
    }
  };

  const projectsSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "NeuroSight",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Web Browser",
        "description": "Browser-based AI platform for neurological health screening using real-time eye-movement tracking with 94% accuracy and 47ms edge latency for 100% patient privacy.",
        "author": {
          "@id": `${baseUrl}/#person`
        },
        "url": "https://github.com/MedBotix/NeuroSight"
      },
      {
        "@type": "SoftwareApplication",
        "name": "RESP-AI",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Cross-Platform",
        "description": "Real-time acoustic pulmonary monitoring system utilizing a two-stage CNN cascade architecture and 48 kHz continuous WebSocket audio streaming with 97.3% accuracy and 94ms latency.",
        "author": {
          "@id": `${baseUrl}/#person`
        },
        "url": "https://github.com/MedTechHealth/RESP-AI"
      },
      {
        "@type": "SoftwareApplication",
        "name": "AirGuardian",
        "applicationCategory": "RoboticsApplication",
        "operatingSystem": "ROS / Embedded",
        "description": "Autonomous indoor drone for environmental intelligence and industrial safety with 500m² coverage, 8-sensor IoT fusion, and real-time SLAM navigation.",
        "author": {
          "@id": `${baseUrl}/#person`
        },
        "url": "https://github.com/Joel-Shibu"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Who is Joel Shibu (Joel)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Joel Shibu (known as Joel) is an AI Generalist, Full Stack Developer, and AI Engineering student at APJ Abdul Kalam Technological University and Baselios Mathews II College of Engineering, based in Adoor, Kerala, India."
        }
      },
      {
        "@type": "Question",
        "name": "What AI and robotics projects has Joel engineered?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Joel has engineered NeuroSight (browser-based neurological screening with 94% accuracy and 47ms latency), RESP-AI (acoustic pulmonary health monitoring with 97.3% accuracy and 48 kHz audio streaming), and AirGuardian (autonomous indoor drone SLAM over 500m² coverage with 8-sensor fusion)."
        }
      },
      {
        "@type": "Question",
        "name": "Where is Joel Shibu located?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Joel Shibu resides in Adoor, Kerala, India (09.1530° N, 76.7356° E) and studies at Baselios Mathews II College of Engineering in Sasthamcotta, Kerala, India."
        }
      },
      {
        "@type": "Question",
        "name": "What are Joel's primary technical skills?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Joel specializes in AI/ML (PyTorch, TensorFlow, TensorFlow.js, OpenCV, CNNs), Autonomous Systems & Robotics (ROS/ROS2, ESP32 C++, SLAM, Multi-Sensor Fusion), and Full-Stack Engineering (Next.js 16, React 19, TypeScript, FastAPI, Flutter, Docker, GCP)."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
