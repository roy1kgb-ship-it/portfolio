import { Article } from '../types';

export const articles: Article[] = [
  {
    id: 'note-001',
    title: 'Non-Linear Control in Soft Robotics',
    date: '2024.03.15',
    readTime: '12 MIN',
    tag: 'CONTROL_THEORY',
    excerpt: 'Traditional PID controllers struggle with the stochastic nature of soft actuators. Exploring Model Predictive Control (MPC) as a viable alternative.',
    content: [
      "Soft robotics presents a unique challenge to control engineers. Unlike rigid bodies, where kinematics can be calculated with high precision using the Denavit-Hartenberg parameters, soft actuators (like McKibben muscles or silicone chambers) exhibit infinite degrees of freedom and significant hysteresis.",
      "In my recent experiments with a pneumatic silicone gripper, I found that standard PID loops failed to account for the material's relaxation over time. The P-term would oscillate aggressively, while the I-term saturated due to the nonlinear pressure-volume relationship. The graph below illustrates the oscillation problem I encountered during step response tests.",
      "The solution I am currently investigating is Model Predictive Control (MPC). By approximating the soft actuator as a series of linear models at different operating points, MPC can predict the future state of the system over a finite horizon and optimize the control input accordingly.",
      "I modeled the pneumatic chamber using the Arruda-Boyce hyperelastic material model, which was then linearized around three distinct pressure operating points (10psi, 20psi, 30psi). This allowed me to generate a State-Space representation (A, B, C, D matrices) for the controller.",
      "Early simulation results in MATLAB suggest that MPC can reduce overshoot by 40% compared to a tuned PID controller. However, the computational cost is significantly higher. The solver requires approximately 15ms per iteration on a standard microcontroller, which introduces a delay in the control loop. I am currently migrating the solver to an edge device closer to a Raspberry Pi 4 to handle the matrix operations."
    ]
  },
  {
    id: 'note-002',
    title: 'Bridging ROS2 and Microcontrollers',
    date: '2024.02.10',
    readTime: '15 MIN',
    tag: 'EMBEDDED',
    excerpt: 'Implementing micro-ROS on an ESP32 to communicate directly with a DDS agent, reducing latency in edge-computing robotics.',
    content: [
      "The Robot Operating System (ROS) has traditionally been the domain of full-fledged computers running Linux. However, micro-ROS is changing the landscape by bringing ROS 2 semantics to microcontrollers, bridging the gap between high-level path planning and low-level actuation.",
      "I successfully flashed micro-ROS onto an ESP32 to act as a wireless sensor node for a mobile robot. The setup involves a micro-ROS Agent running on the host machine (laptop/Jetson) via Docker, and the Client running on the ESP32 FreeRTOS kernel via UART or WiFi transport.",
      "The biggest hurdle was memory management. The XRCE-DDS middleware consumes a significant amount of RAM (approx 20KB static + dynamic buffers). The ESP32 only has around 520KB SRAM, but much of that is used by the WiFi stack.",
      "I had to tune the resource limits in the colcon.meta file to restrict the number of publishers and subscribers to fit within the ESP32's limitations. Specifically, I reduced the MTU size to 512 bytes and limited the history depth of the reliability QoS to 1.",
      "The result is a sensor node that publishes IMU data directly to a `/imu/data` topic over WiFi, with a latency of around 12ms. This allows for modular robot design where sensors don't need to be physically wired to the main computer, significantly simplifying cable management in complex humanoid builds."
    ]
  },
  {
    id: 'note-003',
    title: 'Generative Design for End-Effectors',
    date: '2024.01.22',
    readTime: '8 MIN',
    tag: 'MECHANICAL',
    excerpt: 'Using topology optimization in Fusion 360 to reduce the weight of a robotic gripper by 40% while maintaining structural rigidity.',
    content: [
      "Weight is the enemy of speed in robotics. The heavier the end-effector, the lower the payload capacity of the arm and the higher the moment of inertia, requiring more torque from the wrist motors.",
      "I utilized Autodesk Fusion 360's Generative Design extension to optimize a custom gripper finger. The constraints were: hold a 5kg load, withstand a gripping force of 50N, and interface with a standard Servo bracket. I defined the 'Preserve Geometry' as the bolt holes and the gripping surface, and the 'Obstacle Geometry' as the range of motion of the closing mechanism.",
      "The software generated 20 iterations. I selected a localized organic mesh that removed material from the neutral axis of bending. The visualization showed stress concentrations accumulating near the root of the finger, so I manually thickened that section in the final T-Spline edit.",
      "The final design was printed in carbon-fiber-reinforced PLA (CF-PLA) on a Prusa MK3S. The optimized part weighed 12g compared to the original 28g, a reduction of over 50%, with no measurable loss in stiffness during operation. This reduction allowed me to increase the arm's acceleration profile by 15% without stalling the servos."
    ]
  },
  {
    id: 'note-004',
    title: 'Kalman Filters: A Practical Primer',
    date: '2023.12.05',
    readTime: '20 MIN',
    tag: 'ALGORITHMS',
    excerpt: 'Demystifying the math behind sensor fusion. How to combine noisy accelerometer data with drifting gyroscope data.',
    content: [
      "Every mechatronics student eventually encounters the Kalman Filter. It's the gold standard for state estimation. But the matrix math can be intimidating. In essence, a Kalman Filter is a recursive algorithm that works in two steps: Predict and Update.",
      "1. **Predict:** The algorithm estimates the current state based on the previous state and a physical model (e.g., if velocity is V, position should increase by V*dt). It also estimates the uncertainty (Covariance P).",
      "2. **Update:** The algorithm takes a measurement from a sensor. It compares the measured value to the predicted value (Innovation). It calculates the Kalman Gain (K), which decides how much to trust the measurement vs. the prediction.",
      "For my self-balancing robot, I used a Complementary Filter first. This is computationally cheaper and conceptually simpler: `Angle = 0.98 * (Angle + Gyro * dt) + 0.02 * Accel`. It acts as a high-pass filter on the gyro (removing drift) and a low-pass on the accelerometer (removing vibration noise).",
      "However, moving to an Extended Kalman Filter (EKF) allowed me to linearize the non-linear dynamics of the inverted pendulum using Jacobian matrices. While the Complementary filter had a phase lag of about 20ms, the EKF provided near-instantaneous state estimation, allowing the robot to recover from pushes much faster and stand still with less jitter."
    ]
  }
];