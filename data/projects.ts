import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'mech-001',
    title: 'Quadruped Robot "K-9"',
    category: 'ROBOTICS',
    description: 'A 12-DOF spot-micro style quadruped robot built from scratch to study inverse kinematics and gait generation in unstructured environments.',
    challenge: 'The primary challenge was implementing a stable trot gait on limited hardware (Raspberry Pi 4) while maintaining a control loop frequency >50Hz. Mechanical backlash in 3D printed parts also introduced significant error in the end-effector positioning.',
    solution: 'I developed a custom Python-based kinematic solver optimized for the Pi\'s ARM architecture. To mitigate mechanical slop, I implemented a closed-loop feedback system using IMU data to adjust foot placement dynamically. Power distribution was handled by a custom PCB to separate logic (5V) and servo (6V) power rails, preventing brownouts during high-torque demands.',
    specs: ['DOF: 12 (3 per leg)', 'Payload: 2kg', 'Battery: 3S LiPo 2200mAh', 'Controller: RPi4 + PCA9685'],
    tech: ['Python', 'Inverse Kinematics', 'Fusion 360', 'KiCAD', 'ROS2'],
    status: 'PROTOTYPE',
    // Boston Dynamics Spot / Robot Dog
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=2000&auto=format&fit=crop', 
    date: '2023.11'
  },
  {
    id: 'mech-002',
    title: 'Smart Sorting Line (PLC)',
    category: 'AUTOMATION',
    description: 'An industrial automation simulation using a Siemens S7-1200 PLC to sort materials based on metallic properties and height.',
    challenge: 'Syncing the pneumatic actuator timing with variable conveyor belt speeds. The system needed to handle a throughput of 30 items/minute with zero false negatives for metallic detection.',
    solution: 'Utilized Siemens TIA Portal to write optimized Ladder Logic. I implemented a high-speed counter (HSC) for the encoder feedback to track precise belt position. An inductive sensor triggered an interrupt routine to log the object\'s position in a shift register, firing the pneumatic ejector at the exact encoder count required.',
    specs: ['Cycle Time: <2s', 'Input: 24VDC', 'Comm: PROFINET', 'Logic: Ladder'],
    tech: ['Siemens TIA Portal', 'Ladder Logic', 'HMI Design', 'Pneumatics', 'Industrial Ethernet'],
    status: 'ACADEMIC',
    // Factory Automation / Conveyor
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2000&auto=format&fit=crop',
    date: '2023.05'
  },
  {
    id: 'mech-003',
    title: 'CV Quality Control System',
    category: 'AI / VISION',
    description: 'A non-destructive testing (NDT) system using Computer Vision to detect layer shifts and surface defects on 3D printed parts in real-time.',
    challenge: 'Lighting conditions in the lab varied significantly, causing traditional thresholding algorithms to fail. The inference time for defect detection needed to be under 100ms to keep up with the production line.',
    solution: 'Trained a custom YOLOv8 nano model on a dataset of 500 labeled images of defective prints. The model runs on a Jetson Nano via TensorRT optimization. I designed a custom LED lightbox to ensure consistent illumination, improving detection accuracy from 76% to 98%.',
    specs: ['Accuracy: 98.5%', 'Inference: 45ms', 'Platform: Jetson Nano', 'Camera: IMX219'],
    tech: ['OpenCV', 'Python', 'YOLOv8', 'TensorRT', 'UART'],
    status: 'RESEARCH',
    // Circuit board / Matrix style screen
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2000&auto=format&fit=crop',
    date: '2024.01'
  },
  {
    id: 'mech-004',
    title: 'Flight Controller Firmware',
    category: 'EMBEDDED',
    description: 'A custom-written flight controller for a quadcopter, running on an STM32F4 microcontroller without the use of pre-existing flight stack libraries.',
    challenge: 'Understanding the complex mathematics behind sensor fusion (Complementary Filter) and PID tuning for a naturally unstable system. Dealing with I2C bus noise from the ESCs.',
    solution: 'Wrote bare-metal C++ drivers for the MPU6050 IMU and IBUS receiver. Implemented a 1kHz control loop with a cascaded PID controller (Rate and Angle loops). Added software low-pass filtering on the gyroscope data to smooth out motor vibrations.',
    specs: ['Loop Rate: 1kHz', 'MCU: STM32F401', 'Protocol: IBUS', 'Weight: 450g'],
    tech: ['C++', 'STM32 HAL', 'Control Theory', 'PID', 'I2C/SPI'],
    status: 'DEPLOYED',
    // Drone close up
    imageUrl: 'https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=2000&auto=format&fit=crop',
    date: '2022.09'
  },
   {
    id: 'mech-005',
    title: '6-Axis Arm Digital Twin',
    category: 'SIMULATION',
    description: 'A digital twin of a FANUC industrial robot created in Unity, connected to physical hardware via MQTT for real-time telemetry.',
    challenge: 'Reducing the latency between the physical arm movement and the digital representation to allow for accurate remote monitoring.',
    solution: 'Developed a C# middleware to parse serial data from the robot controller and publish to an MQTT broker. The Unity client subscribes to these topics to update joint angles. Achieved end-to-end latency of <50ms over local WiFi.',
    specs: ['Latency: 45ms', 'Engine: Unity 3D', 'Protocol: MQTT', 'Lang: C# / C++'],
    tech: ['Unity', 'C#', 'MQTT', 'IoT', 'Digital Twin'],
    status: 'RESEARCH',
    // Industrial Robot Arm
    imageUrl: 'https://images.unsplash.com/photo-1612831197310-ff5cf7a211b6?q=80&w=2000&auto=format&fit=crop',
    date: '2024.02'
  }
];