import { getEmbedding } from "../services/jina.js";
import { deleteCollection, ensureCollection, insertToQdrant } from "../services/qdrant.js";

// Seed Course Details (catalog + prerequisites)
const courseDetails = [
  {
    id: 200,
    code: "CMPE 200",
    title: "Computer Architecture",
    units: 3,
    description: "Advanced study of computer design, focusing on processor instruction set architecture and microarchitecture. Topics include instruction-level parallelism, memory hierarchy design, storage and I/O systems, multicore/multiprocessor architectures, and data/thread-level parallelism. Includes an introduction to parallel programming paradigms.",
    prerequisites: ["CMPE 180D", "Instructor consent"],
    ge: null
  },
  {
    id: 202,
    code: "CMPE 202",
    title: "Software Systems Engineering",
    units: 3,
    description: "Focuses on the architecture, design, and lifecycle of large-scale software systems. Covers software engineering methodologies, design patterns, requirements engineering, software validation, and deployment. Students learn to tackle complex engineering problems using contemporary principles and tools.",
    prerequisites: ["Graduate standing"],
    ge: null
  },
  {
    id: 206,
    code: "CMPE 206",
    title: "Computer Network Design",
    units: 3,
    description: "In-depth analysis and design of computer networks. Topics include network architecture, protocols, performance evaluation, routing algorithms, and congestion control. Emphasis on the design of reliable and scalable network systems.",
    prerequisites: ["CMPE 148", "Equivalent"],
    ge: null
  },
  {
    id: 207,
    code: "CMPE 207",
    title: "Network Programming and Application",
    units: 3,
    description: "Design and implementation of distributed network applications. Covers socket programming, Remote Procedure Calls (RPC), and other distributed computing technologies. Students build robust network applications dealing with concurrency and protocol implementation.",
    prerequisites: ["CMPE 206"],
    ge: null
  },
  {
    id: 208,
    code: "CMPE 208",
    title: "Network Architecture and Protocols",
    units: 3,
    description: "Advanced study of network architectures and communication protocols. Examines the principles of protocol design, routing, flow control, and error recovery in complex network environments, including TCP/IP and next-generation internet protocols.",
    prerequisites: ["CMPE 206"],
    ge: null
  },
  {
    id: 209,
    code: "CMPE 209",
    title: "Network Security and Applications",
    units: 3,
    description: "Comprehensive study of network security principles. Topics include cryptography (symmetric and public key), authentication protocols, digital signatures, network security applications (IPsec, SSL/TLS), and firewalls. analyzing security vulnerabilities and countermeasures.",
    prerequisites: ["CMPE 206"],
    ge: null
  },
  {
    id: 210,
    code: "CMPE 210",
    title: "Software-defined Networks and Network Functions Virtualization",
    units: 3,
    description: "Explores the paradigm shift to Software-Defined Networking (SDN) and Network Functions Virtualization (NFV). Covers SDN architectures, OpenFlow, network virtualization, and the design of programmable network services.",
    prerequisites: ["CMPE 206"],
    ge: null
  },
  {
    id: 211,
    code: "CMPE 211",
    title: "Advanced Network Security in IoT",
    units: 3,
    description: "Focuses on security challenges specific to the Internet of Things (IoT). Topics include secure communication in constrained environments, device authentication, lightweight cryptography, and securing IoT data pipelines.",
    prerequisites: ["CMPE 209"],
    ge: null
  },
  {
    id: 212,
    code: "CMPE 212",
    title: "System Verification",
    units: 3,
    description: "Methodologies for verifying hardware and software systems to ensure correctness. Covers simulation, emulation, and formal verification techniques. Includes logic simulation, coverage analysis, and assertion-based verification.",
    prerequisites: ["CMPE 200"],
    ge: null
  },
  {
    id: 213,
    code: "CMPE 213",
    title: "Parallel Computing",
    units: 3,
    description: "Study of parallel computing architectures and programming models. Topics include shared memory and message passing systems, parallel algorithms, synchronization, scalability analysis, and high-performance computing techniques.",
    prerequisites: ["CMPE 200"],
    ge: null
  },
  {
    id: 214,
    code: "CMPE 214",
    title: "GPU Architecture and Programming",
    units: 3,
    description: "Architecture and programming of Graphics Processing Units (GPUs) for general-purpose computing (GPGPU). Covers the CUDA programming model, memory hierarchy optimization, and parallel algorithms for massive data processing.",
    prerequisites: ["CMPE 200"],
    ge: null
  },
  {
    id: 217,
    code: "CMPE 217",
    title: "Human AI Interaction",
    units: 3,
    description: "Explores the design, implementation, and evaluation of systems where humans interact with Artificial Intelligence. Focuses on usability, interpretability, trust, and the ethical implications of AI systems in human contexts.",
    prerequisites: ["Graduate standing"],
    ge: null
  },
  {
    id: 219,
    code: "CMPE 219",
    title: "Cybersecurity Clinics with HCI",
    units: 3,
    description: "Interdisciplinary course combining cybersecurity with Human-Computer Interaction (HCI). Students work on real-world security problems, focusing on the human factors of security, usability of security tools, and social engineering defenses.",
    prerequisites: ["CMPE 209"],
    ge: null
  },
  {
    id: 220,
    code: "CMPE 220",
    title: "System Software",
    units: 3,
    description: "Advanced concepts in operating system design and implementation. Topics include process management, thread scheduling, memory management, virtual memory, file systems, I/O subsystems, and protection mechanisms.",
    prerequisites: ["CMPE 180C"],
    ge: null
  },
  {
    id: 226,
    code: "CMPE 226",
    title: "Database Systems",
    units: 3,
    description: "Design and implementation of database systems. Covers data modeling (ER diagrams), relational database theory, SQL, transaction management, concurrency control, recovery, and query optimization techniques.",
    prerequisites: ["CMPE 180B"],
    ge: null
  },
  {
    id: 235,
    code: "CMPE 235",
    title: "Mobile Software System Design",
    units: 3,
    description: "Comprehensive study of mobile software systems. Topics include mobile OS architectures (Android/iOS), application development frameworks, user interface design for mobile, sensor integration, and mobile data management.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 240,
    code: "CMPE 240",
    title: "Advanced Computer Design",
    units: 3,
    description: "Advanced topics in computer hardware design. Focuses on high-performance processor design, superscalar architectures, branch prediction, cache coherence, and hardware support for virtualization and security.",
    prerequisites: ["CMPE 200"],
    ge: null
  },
  {
    id: 242,
    code: "CMPE 242",
    title: "Embedded Hardware Design",
    units: 3,
    description: "Design and analysis of embedded hardware systems. Covers microcontroller architectures, interfacing with sensors and actuators, bus protocols (I2C, SPI, UART), power management, and hardware-software co-design principles.",
    prerequisites: ["CMPE 180D"],
    ge: null
  },
  {
    id: 243,
    code: "CMPE 243",
    title: "Embedded Systems Applications",
    units: 3,
    description: "Development of complex embedded applications. Focuses on real-time constraints, system integration, device drivers, and the implementation of specific applications such as robotics, consumer electronics, or automotive systems.",
    prerequisites: ["CMPE 242"],
    ge: null
  },
  {
    id: 244,
    code: "CMPE 244",
    title: "Embedded Software",
    units: 3,
    description: "Software engineering for embedded systems. Topics include real-time operating systems (RTOS), task scheduling, interrupt handling, firmware design patterns, and optimizing software for resource-constrained environments.",
    prerequisites: ["CMPE 242"],
    ge: null
  },
  {
    id: 245,
    code: "CMPE 245",
    title: "Embedded Wireless Architecture",
    units: 3,
    description: "Study of wireless communication protocols and architectures within embedded systems. Covers Bluetooth, ZigBee, Wi-Fi, and cellular technologies, focusing on their integration into embedded designs and power efficiency.",
    prerequisites: ["CMPE 242"],
    ge: null
  },
  {
    id: 246,
    code: "CMPE 246",
    title: "Interface Design in Embedded Systems",
    units: 3,
    description: "Design of hardware and software interfaces for embedded systems. Topics include human-machine interfaces (HMI), sensor interfacing, signal conditioning, and standard interface protocols used in industrial and consumer applications.",
    prerequisites: ["CMPE 242"],
    ge: null
  },
  {
    id: 249,
    code: "CMPE 249",
    title: "Intelligent Autonomous Systems",
    units: 3,
    description: "Design and control of intelligent autonomous systems, such as self-driving cars and autonomous robots. Covers perception, localization, mapping, path planning, and control algorithms using AI and sensor fusion.",
    prerequisites: ["CMPE 257"],
    ge: null
  },
  {
    id: 252,
    code: "CMPE 252",
    title: "Artificial Intelligence and Data Engineering",
    units: 3,
    description: "Focuses on the engineering aspects of AI and data pipelines. Topics include data ingestion, processing, and storage architectures for AI, scalable machine learning pipelines, and the deployment of AI models in production.",
    prerequisites: ["CMPE 255"],
    ge: null
  },
  {
    id: 255,
    code: "CMPE 255",
    title: "Data Mining",
    units: 3,
    description: "Algorithms and techniques for discovering patterns in large datasets. Covers classification, clustering, association rule mining, anomaly detection, and data preprocessing. Includes practical applications using modern data mining tools.",
    prerequisites: ["CMPE 180A"],
    ge: null
  },
  {
    id: 256,
    code: "CMPE 256",
    title: "Recommender Systems",
    units: 3,
    description: "Study of algorithms and techniques for building recommender systems. Topics include collaborative filtering, content-based filtering, matrix factorization, and deep learning approaches to personalization and recommendation.",
    prerequisites: ["CMPE 255"],
    ge: null
  },
  {
    id: 257,
    code: "CMPE 257",
    title: "Machine Learning",
    units: 3,
    description: "Comprehensive introduction to machine learning algorithms. Covers supervised learning (regression, classification), unsupervised learning (clustering, dimensionality reduction), and evaluation metrics. Emphasis on practical implementation and application.",
    prerequisites: ["CMPE 255"],
    ge: null
  },
  {
    id: 258,
    code: "CMPE 258",
    title: "Deep Learning",
    units: 3,
    description: "In-depth study of deep neural networks. Topics include convolutional neural networks (CNNs), recurrent neural networks (RNNs), generative models, and optimization techniques for training deep models. Applications in vision and NLP.",
    prerequisites: ["CMPE 257"],
    ge: null
  },
  {
    id: 259,
    code: "CMPE 259",
    title: "Natural Language Processing",
    units: 3,
    description: "Techniques for processing and understanding human language data. Covers text processing, sentiment analysis, machine translation, named entity recognition, and language modeling using traditional and deep learning methods.",
    prerequisites: ["CMPE 257"],
    ge: null
  },
  {
    id: 260,
    code: "CMPE 260",
    title: "Reinforcement Learning",
    units: 3,
    description: "Study of reinforcement learning algorithms where agents learn to make decisions. Topics include Markov Decision Processes (MDPs), Q-learning, policy gradients, and deep reinforcement learning architectures.",
    prerequisites: ["CMPE 257"],
    ge: null
  },
  {
    id: 264,
    code: "CMPE 264",
    title: "Advanced Digital and Computing System Design",
    units: 3,
    description: "Advanced topics in the design of digital systems. Focuses on system-on-chip (SoC) design, FPGA prototyping, high-level synthesis, and optimizing digital designs for performance, power, and area.",
    prerequisites: ["CMPE 124"],
    ge: null
  },
  {
    id: 265,
    code: "CMPE 265",
    title: "High Speed Digital System Design",
    units: 3,
    description: "Design challenges and techniques for high-speed digital circuits. Covers signal integrity, transmission lines, crosstalk, timing analysis, clock distribution, and packaging considerations for high-frequency systems.",
    prerequisites: ["CMPE 124"],
    ge: null
  },
  {
    id: 266,
    code: "CMPE 266",
    title: "Big Data Engineering and Analytics",
    units: 3,
    description: "Technologies and architectures for processing massive datasets. Covers distributed computing frameworks (Hadoop, Spark), NoSQL databases, stream processing, and techniques for analyzing big data at scale.",
    prerequisites: ["CMPE 255"],
    ge: null
  },
  {
    id: 270,
    code: "CMPE 270",
    title: "Information Engineering",
    units: 3,
    description: "Principles of information engineering and management. Topics include information retrieval, knowledge representation, data integration, and the design of information systems for organizations.",
    prerequisites: ["Graduate standing"],
    ge: null
  },
  {
    id: 272,
    code: "CMPE 272",
    title: "Enterprise Software Platforms",
    units: 3,
    description: "Architecture and technologies for enterprise-scale software platforms. Covers middleware, service-oriented architecture (SOA), microservices, containerization, and the integration of heterogeneous enterprise systems.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 273,
    code: "CMPE 273",
    title: "Enterprise Distributed Systems",
    units: 3,
    description: "Design and implementation of distributed enterprise systems. Topics include consistency models, distributed transactions, fault tolerance, replication, and scalability in distributed databases and application servers.",
    prerequisites: ["CMPE 272"],
    ge: null
  },
  {
    id: 274,
    code: "CMPE 274",
    title: "Business Intelligence Technologies",
    units: 3,
    description: "Technologies for business intelligence and data analytics. Covers data warehousing, OLAP, dashboard design, key performance indicators (KPIs), and using data to drive business decision-making.",
    prerequisites: ["CMPE 255"],
    ge: null
  },
  {
    id: 275,
    code: "CMPE 275",
    title: "Enterprise Application Development",
    units: 3,
    description: "Hands-on development of enterprise-grade applications. Focuses on full-stack development, frameworks (e.g., Spring, Java EE), RESTful APIs, database integration, and best practices for maintainable code.",
    prerequisites: ["CMPE 272"],
    ge: null
  },
  {
    id: 277,
    code: "CMPE 277",
    title: "Smartphone Application Development",
    units: 3,
    description: "Development of applications for smartphones and mobile devices. Covers mobile UI/UX principles, native development (iOS/Android), cross-platform frameworks, background processing, and mobile cloud integration.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 279,
    code: "CMPE 279",
    title: "Software Security Technologies",
    units: 3,
    description: "Security technologies and practices for software systems. Topics include secure coding practices, vulnerability analysis (buffer overflows, injection attacks), web application security, and security testing methodologies.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 280,
    code: "CMPE 280",
    title: "Web UI Design and Development",
    units: 3,
    description: "Design and development of modern web user interfaces. Covers HTML5, CSS3, JavaScript frameworks (React, Angular, Vue), responsive design, and single-page application (SPA) architectures.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 281,
    code: "CMPE 281",
    title: "Intelligent Cloud Platform",
    units: 3,
    description: "Architecture and design of cloud computing platforms. Covers Infrastructure as a Service (IaaS), Platform as a Service (PaaS), cloud storage, elasticity, load balancing, and designing cloud-native applications.",
    prerequisites: ["CMPE 272"],
    ge: null
  },
  {
    id: 282,
    code: "CMPE 282",
    title: "Cloud Services",
    units: 3,
    description: "Design, implementation, and management of cloud services. Topics include API design, serverless computing, cloud security, monitoring, and the orchestration of cloud resources.",
    prerequisites: ["CMPE 281"],
    ge: null
  },
  {
    id: 283,
    code: "CMPE 283",
    title: "Virtualization Technologies",
    units: 3,
    description: "In-depth study of virtualization technologies. Covers hypervisor architectures, hardware-assisted virtualization, containerization (Docker, Kubernetes), network virtualization, and storage virtualization.",
    prerequisites: ["CMPE 281"],
    ge: null
  },
  {
    id: 284,
    code: "CMPE 284",
    title: "Storage and Network Virtualization",
    units: 3,
    description: "Technologies for virtualizing storage and network resources. Covers software-defined storage (SDS), storage area networks (SAN), network virtualization protocols (VXLAN), and data center networking.",
    prerequisites: ["CMPE 283"],
    ge: null
  },
  {
    id: 285,
    code: "CMPE 285",
    title: "Software Engineering Processes",
    units: 3,
    description: "Study of software engineering processes and methodologies. Topics include Agile, Scrum, DevOps, continuous integration/continuous deployment (CI/CD), software metrics, and process improvement frameworks.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 286,
    code: "CMPE 286",
    title: "Internet of Things",
    units: 3,
    description: "Comprehensive overview of the Internet of Things (IoT). Covers IoT architectures, protocols (MQTT, CoAP), sensor networks, edge computing, and end-to-end IoT system design.",
    prerequisites: ["CMPE 206"],
    ge: null
  },
  {
    id: 287,
    code: "CMPE 287",
    title: "Intelligent System Quality Validation",
    units: 3,
    description: "Validation and verification of intelligent and complex software systems. Topics include automated testing, static analysis, model checking, quality assurance metrics, and testing AI/ML components.",
    prerequisites: ["CMPE 202"],
    ge: null
  },
  {
    id: 292,
    code: "CMPE 292",
    title: "International Program Studies",
    units: 3,
    description: "Study abroad program offering international perspectives on computer engineering. Students engage in academic and cultural activities at a partner institution abroad.",
    prerequisites: ["Department consent"],
    ge: null
  },
  {
    id: 294,
    code: "CMPE 294",
    title: "Computer Engineering Seminar",
    units: 3,
    description: "Seminar on current research and topics in computer engineering. Students develop research, writing, and presentation skills. Satisfies the Graduation Writing Assessment Requirement (GWAR).",
    prerequisites: ["Graduate standing"],
    ge: "GWAR"
  },
  {
    id: 295,
    code: "CMPE 295A",
    title: "Master Project I",
    units: 3,
    description: "First phase of the master's project. Students propose a project, conduct literature review, define requirements, and begin the design and implementation of a significant engineering project.",
    prerequisites: ["Admission to candidacy", "GWAR"],
    ge: null
  },
  {
    id: 296,
    code: "CMPE 295B",
    title: "Master Project II",
    units: 3,
    description: "Second phase of the master's project. Students complete the implementation, testing, and evaluation of their project, and present their findings in a final report and oral presentation.",
    prerequisites: ["CMPE 295A"],
    ge: null
  },
  {
    id: 297,
    code: "CMPE 295W",
    title: "Master's Project",
    units: 3,
    description: "Culminating master's project experience. Students undertake a comprehensive engineering project demonstrating their ability to apply advanced knowledge to solve complex problems.",
    prerequisites: ["Admission to candidacy"],
    ge: null
  },
  {
    id: 298,
    code: "CMPE 297",
    title: "Special Topics in Computer/Software Engineering",
    units: 3,
    description: "Advanced course covering specialized and emerging topics in computer or software engineering that are not covered in the regular curriculum. Topics vary by semester.",
    prerequisites: ["Consent of instructor"],
    ge: null
  },
  {
    id: 299,
    code: "CMPE 298",
    title: "Special Problems",
    units: 1,
    description: "Individual study or research on a special problem in computer engineering under the supervision of a faculty member. Allows for in-depth exploration of specific interests.",
    prerequisites: ["Consent of instructor"],
    ge: null
  },
  {
    id: 300,
    code: "CMPE 298I",
    title: "Computer/Software Engineering Internship",
    units: 1,
    description: "Professional internship experience in the computer or software engineering field. Students gain practical industry experience and apply academic knowledge in a professional setting.",
    prerequisites: ["Consent of department"],
    ge: null
  },
  {
    id: 301,
    code: "CMPE 299A",
    title: "Master Thesis I",
    units: 3,
    description: "First phase of the master's thesis research. Students define a research problem, conduct a literature search, formulation a hypothesis, and begin experimental work.",
    prerequisites: ["Admission to candidacy", "GWAR"],
    ge: null
  },
  {
    id: 302,
    code: "CMPE 299B",
    title: "Master Thesis II",
    units: 3,
    description: "Second phase of the master's thesis. Students complete their research, analyze results, write the thesis dissertation, and defend their work before a committee.",
    prerequisites: ["CMPE 299A"],
    ge: null
  }
];

// Ensure collections exist before seeding
console.log("Ensuring Qdrant collections exist...");
await ensureCollection("CourseDetails");
await ensureCollection("CourseSchedule");

console.log("Seeding CourseDetails...");
for (const course of courseDetails) {
  const vector = await getEmbedding(
    `${course.code} ${course.title}. ${course.description}. Prerequisites: ${course.prerequisites.join(", ")}`
  );
  await insertToQdrant("CourseDetails", course.id, vector, course);
}
console.log(`Seeded ${courseDetails.length} course details.`);

// Seed Course Schedule (sections with day/time/term)
const courseSchedule = [
  {
    "id": 200,
    "code": "CMPE 200",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "15:00-16:15",
    "location": "ENG 325",
    "instructor": "Haonan Wang"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Fri"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Gopinath Vinodh",
    "note": "Regular Session"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Fall 2024",
    "section": "02",
    "days": ["Thu"],
    "time": "18:00-20:45",
    "location": "BBC 224",
    "instructor": "Gopinath Vinodh",
    "note": "Regular Session"
  },
  {
    "id": 206,
    "code": "CMPE 206",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue"],
    "time": "18:00-20:45",
    "location": "BBC 203",
    "instructor": "Yalda Edalat"
  },
  {
    "id": 207,
    "code": "CMPE 207",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Ben Reed"
  },
  {
    "id": 208,
    "code": "CMPE 208",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "Online",
    "instructor": "Shai Silberman"
  },
  {
    "id": 209,
    "code": "CMPE 209",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Fri"],
    "time": "13:30-15:45",
    "location": "ENG 403",
    "instructor": "Younghee Park"
  },
  {
    "id": 210,
    "code": "CMPE 210",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "16:30-17:45",
    "location": "ENG 337",
    "instructor": "Younghee Park"
  },
  {
    "id": 212,
    "code": "CMPE 212",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "19:30-20:45",
    "location": "ENG 301",
    "instructor": "Staff"
  },
  {
    "id": 213,
    "code": "CMPE 213",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "16:30-17:45",
    "location": "ENG 329",
    "instructor": "Magdalena Balazinska"
  },
  {
    "id": 214,
    "code": "CMPE 214",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "13:30-14:45",
    "location": "ENG 288",
    "instructor": "Haonan Wang"
  },
  {
    "id": 217,
    "code": "CMPE 217",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Online"],
    "time": "TBD",
    "location": "Online",
    "instructor": "Yu Chen"
  },
  {
    "id": 219,
    "code": "CMPE 219",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "Online",
    "instructor": "TBD",
    "note": "Cybersecurity Clinics with HCI"
  },
  {
    "id": 220,
    "code": "CMPE 220",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon"],
    "time": "18:00-20:45",
    "location": "ENG 337",
    "instructor": "Kaikai Liu"
  },
  {
    "id": 226,
    "code": "CMPE 226",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "13:30-14:45",
    "location": "ENG 325",
    "instructor": "Staff"
  },
  {
    "id": 235,
    "code": "CMPE 235",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "ENG 303",
    "instructor": "Staff"
  },
  {
    "id": 240,
    "code": "CMPE 240",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "15:00-17:45",
    "location": "ENG 325",
    "instructor": "Ahmet Bindal"
  },
  {
    "id": 242,
    "code": "CMPE 242",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "18:00-19:15",
    "location": "ENG 337",
    "instructor": "Harry Li"
  },
  {
    "id": 244,
    "code": "CMPE 244",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "16:30-17:45",
    "location": "ENG 395",
    "instructor": "Bhawandeep Singh Harsh"
  },
  {
    "id": 245,
    "code": "CMPE 245",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "18:00-19:15",
    "location": "ENG 329",
    "instructor": "Staff"
  },
  {
    "id": 249,
    "code": "CMPE 249",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "13:30-14:45",
    "location": "ENG 331",
    "instructor": "Hyeran Jeon"
  },
  {
    "id": 252,
    "code": "CMPE 252",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Fri"],
    "time": "18:00-20:45",
    "location": "ENG 337",
    "instructor": "Wencen Wu"
  },
  {
    "id": 255,
    "code": "CMPE 255",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "12:00-13:15",
    "location": "ENG 325",
    "instructor": "Magdalena Balazinska"
  },
  {
    "id": 255,
    "code": "CMPE 255",
    "term": "Fall 2024",
    "section": "02",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online",
    "instructor": "Staff",
    "note": "Special Session Cohort"
  },
  {
    "id": 256,
    "code": "CMPE 256",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "10:30-11:45",
    "location": "ENG 341",
    "instructor": "Staff"
  },
  {
    "id": 257,
    "code": "CMPE 257",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "15:00-16:15",
    "location": "BBC 202",
    "instructor": "Staff"
  },
  {
    "id": 257,
    "code": "CMPE 257",
    "term": "Fall 2024",
    "section": "02",
    "days": ["Mon", "Wed"],
    "time": "19:30-20:45",
    "location": "ENG 325",
    "instructor": "Staff"
  },
  {
    "id": 258,
    "code": "CMPE 258",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "18:00-19:15",
    "location": "ENG 341",
    "instructor": "Haonan Wang"
  },
  {
    "id": 260,
    "code": "CMPE 260",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Fri"],
    "time": "17:30-20:15",
    "location": "Online",
    "instructor": "Staff"
  },
  {
    "id": 264,
    "code": "CMPE 264",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "18:00-19:15",
    "location": "ENG 329",
    "instructor": "Staff"
  },
  {
    "id": 265,
    "code": "CMPE 265",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon"],
    "time": "18:00-20:45",
    "location": "ENG 301",
    "instructor": "Staff"
  },
  {
    "id": 272,
    "code": "CMPE 272",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue"],
    "time": "18:00-20:45",
    "location": "DMH 227",
    "instructor": "Rakesh Ranjan"
  },
  {
    "id": 272,
    "code": "CMPE 272",
    "term": "Fall 2024",
    "section": "02",
    "days": ["Thu"],
    "time": "18:00-20:45",
    "location": "ENG 343",
    "instructor": "Staff"
  },
  {
    "id": 272,
    "code": "CMPE 272",
    "term": "Fall 2024",
    "section": "Cohort 16",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online",
    "instructor": "Staff",
    "note": "Enterprise Track"
  },
  {
    "id": 273,
    "code": "CMPE 273",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "BBC 202",
    "instructor": "Siamak Aram"
  },
  {
    "id": 274,
    "code": "CMPE 274",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue"],
    "time": "18:00-20:45",
    "location": "ENG 403",
    "instructor": "Staff"
  },
  {
    "id": 275,
    "code": "CMPE 275",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon", "Wed"],
    "time": "12:00-13:15",
    "location": "ENG 337",
    "instructor": "Staff"
  },
  {
    "id": 277,
    "code": "CMPE 277",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon"],
    "time": "18:00-20:45",
    "location": "ENG 341",
    "instructor": "Staff"
  },
  {
    "id": 279,
    "code": "CMPE 279",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "Clark 238",
    "instructor": "Mark Ammar Rayes"
  },
  {
    "id": 280,
    "code": "CMPE 280",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Thu"],
    "time": "18:00-20:45",
    "location": "ENG 331",
    "instructor": "Chandrasekar Vuppalapati"
  },
  {
    "id": 281,
    "code": "CMPE 281",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Staff"
  },
  {
    "id": 281,
    "code": "CMPE 281",
    "term": "Fall 2024",
    "section": "Cohort 16",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online",
    "instructor": "Staff",
    "note": "Cloud Track"
  },
  {
    "id": 283,
    "code": "CMPE 283",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue"],
    "time": "18:00-20:45",
    "location": "ENG 329",
    "instructor": "Staff"
  },
  {
    "id": 283,
    "code": "CMPE 283",
    "term": "Fall 2024",
    "section": "Cohort 16",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online",
    "instructor": "Staff",
    "note": "Cloud Track"
  },
  {
    "id": 285,
    "code": "CMPE 285",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Thu"],
    "time": "18:00-20:45",
    "location": "ENG 401",
    "instructor": "Staff"
  },
  {
    "id": 287,
    "code": "CMPE 287",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "ENG 343",
    "instructor": "Staff"
  },
  {
    "id": 294,
    "code": "CMPE 294",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Mon"],
    "time": "18:00-20:45",
    "location": "ENG 331",
    "instructor": "Magdalena Balazinska"
  },
  {
    "id": 295,
    "code": "CMPE 295A",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Fri"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Dan Harkey"
  },
  {
    "id": 295,
    "code": "CMPE 295A",
    "term": "Fall 2024",
    "section": "02",
    "days": ["Fri"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Staff"
  },
  {
    "id": 296,
    "code": "CMPE 295B",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Fri"],
    "time": "15:00-17:45",
    "location": "ENG 325",
    "instructor": "Staff"
  },
  {
    "id": 297,
    "code": "CMPE 297",
    "term": "Fall 2024",
    "section": "01",
    "days": ["Tue"],
    "time": "18:00-20:45",
    "location": "ENG 331",
    "instructor": "Staff",
    "note": "Special Topics: Emerging Software"
  },
  {
    "id": 299,
    "code": "CMPE 298",
    "term": "Fall 2024",
    "section": "01",
    "days": ["TBD"],
    "time": "TBD",
    "location": "TBD",
    "instructor": "Instructor Consent"
  },
  {
    "id": 300,
    "code": "CMPE 298I",
    "term": "Fall 2024",
    "section": "01",
    "days": ["TBD"],
    "time": "TBD",
    "location": "TBD",
    "instructor": "Department Consent"
  },
  {
    "id": 257,
    "code": "CMPE 257",
    "term": "Summer 2025",
    "section": "Cohort 3",
    "days": ["Tue", "Thu"],
    "time": "18:00-20:45",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "dates": "06/17/2025 - 09/04/2025"
  },
  {
    "id": 294,
    "code": "CMPE 294",
    "term": "Summer 2025",
    "section": "Cohort 2",
    "days": ["TBD"],
    "time": "TBD",
    "location": "TBD",
    "instructor": "TBD",
    "note": "Listed in Cohort 2 schedule"
  },
  {
    "id": 300,
    "code": "CMPE 298I",
    "term": "Summer 2025",
    "section": "01",
    "days": ["TBD"],
    "time": "TBD",
    "location": "TBD",
    "instructor": "Department Consent",
    "note": "Internship courses are typically available in Summer"
  },
  {
    "id": 297,
    "code": "CMPE 295W",
    "term": "Summer 2025",
    "section": "01",
    "days": ["TBD"],
    "time": "TBD",
    "location": "TBD",
    "instructor": "Department Consent",
    "note": "Culminating experience courses are often available in Summer"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Spring 2025",
    "section": "01",
    "days": ["Tue", "Thu"],
    "time": "15:00-16:15",
    "location": "ENG 325",
    "instructor": "Staff",
    "note": "Regular Session"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Spring 2025",
    "section": "02",
    "days": ["Mon", "Wed"],
    "time": "18:00-19:15",
    "location": "ENG 325",
    "instructor": "Staff",
    "note": "Regular Session"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Spring 2025",
    "section": "Cohort 2",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/24/25 - 05/13/25"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Spring 2025",
    "section": "Cloud Cohort",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/24/25 - 05/13/25"
  },
  {
    "id": 202,
    "code": "CMPE 202",
    "term": "Spring 2025",
    "section": "Data Science Cohort",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/23/25 - 05/23/25"
  },
  {
    "id": 252,
    "code": "CMPE 252",
    "term": "Spring 2025",
    "section": "MSAI Cohort",
    "days": ["Thu"],
    "time": "17:30-21:30",
    "location": "TBD",
    "instructor": "Staff",
    "note": "Dates: 01/02/25 - 03/13/25 (Session 1)"
  },
  {
    "id": 255,
    "code": "CMPE 255",
    "term": "Spring 2025",
    "section": "MSAI Cohort",
    "days": ["Thu"],
    "time": "17:30-21:30",
    "location": "TBD",
    "instructor": "Staff",
    "note": "Dates: 03/27/25 - 06/05/25 (Session 2)"
  },
  {
    "id": 256,
    "code": "CMPE 256",
    "term": "Spring 2025",
    "section": "Cohort 3",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 03/18/25 - 05/27/25"
  },
  {
    "id": 257,
    "code": "CMPE 257",
    "term": "Spring 2025",
    "section": "Data Science Cohort",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/23/25 - 05/23/25"
  },
  {
    "id": 258,
    "code": "CMPE 258",
    "term": "Spring 2025",
    "section": "Data Science Cohort",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/23/25 - 05/23/25"
  },
  {
    "id": 275,
    "code": "CMPE 275",
    "term": "Spring 2025",
    "section": "Cohort 2",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/24/25 - 05/13/25"
  },
  {
    "id": 277,
    "code": "CMPE 277",
    "term": "Spring 2025",
    "section": "Cloud Cohort",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/24/25 - 05/13/25"
  },
  {
    "id": 279,
    "code": "CMPE 279",
    "term": "Spring 2025",
    "section": "Cohort 2",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/24/25 - 05/13/25"
  },
  {
    "id": 279,
    "code": "CMPE 279",
    "term": "Spring 2025",
    "section": "01",
    "days": ["Wed"],
    "time": "18:00-20:45",
    "location": "Clark 234",
    "instructor": "Mark Ammar Rayes"
  },
  {
    "id": 280,
    "code": "CMPE 280",
    "term": "Spring 2025",
    "section": "01",
    "days": ["Thu"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Chandrasekar Vuppalapati"
  },
  {
    "id": 282,
    "code": "CMPE 282",
    "term": "Spring 2025",
    "section": "Cloud Cohort",
    "days": ["TBD"],
    "time": "TBD",
    "location": "Online/Hybrid",
    "instructor": "Staff",
    "note": "Dates: 01/24/25 - 05/13/25"
  },
  {
    "id": 294,
    "code": "CMPE 294",
    "term": "Spring 2025",
    "section": "06",
    "days": ["Tue", "Thu"],
    "time": "15:00-16:15",
    "location": "Industrial Studies 113",
    "instructor": "Tridha Chatterjee"
  },
  {
    "id": 295,
    "code": "CMPE 295A",
    "term": "Spring 2025",
    "section": "01",
    "days": ["Fri"],
    "time": "18:00-20:45",
    "location": "Science Building",
    "instructor": "Dan Harkey"
  },
  {
    "id": 296,
    "code": "CMPE 295B",
    "term": "Spring 2025",
    "section": "01",
    "days": ["Fri"],
    "time": "18:00-20:45",
    "location": "ENG 325",
    "instructor": "Staff"
  }
]

console.log("Seeding CourseSchedule...");
// Ensure unique IDs for CourseSchedule entries during upsert
for (let i = 0; i < courseSchedule.length; i++) {
  const section = courseSchedule[i];
  const uniqueId = 3000 + i; // generate unique numeric ID per entry
  const vector = await getEmbedding(
    `${section.code} ${section.term} ${section.days.join("/")} ${section.time} ${section.instructor}`
  );
  await insertToQdrant("CourseSchedule", uniqueId, vector, { ...section, id: uniqueId });
}
console.log(`Seeded ${courseSchedule.length} course schedule entries.`);

console.log("✅ Seeding completed: CourseDetails, CourseSchedule.");