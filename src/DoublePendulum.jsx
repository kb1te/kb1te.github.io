import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DoublePendulum = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    // Define constants
    const width = 400; // Width of SVG container (pixels)
    const height = 400; // Height of SVG container (pixels)
    const g = 9.81; // Acceleration due to gravity (m/s^2)
    const L1 = 20; // Length of first pendulum arm (pixels)
    const L2 = 30; // Length of second pendulum arm (pixels)
    const m1 = 10; // Mass of first pendulum bob (kg)
    const m2 = 10; // Mass of second pendulum bob (kg)
    const dt = 0.01; // Time step (seconds)
    const scale = 3; // Scale factor for adjusting pendulum lengths
    const damping1 = 0; // Damping coefficient for first pendulum
    const damping2 = 0; // Damping coefficient for second pendulum

    // Define initial conditions
    let theta1 = Math.PI / 2; // Initial angle of first pendulum (radians)
    let theta2 = Math.PI ; // Initial angle of second pendulum (radians)
    let omega1 = 0; // Initial angular velocity of first pendulum (radians/second)
    let omega2 = 0; // Initial angular velocity of second pendulum (radians/second)

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Function to update pendulum positions
    function update() {
      // Compute accelerations using Runge-Kutta method
      const k1 = omega1Dot(theta1, theta2, omega1, omega2);
      const l1 = omega2Dot(theta1, theta2, omega1, omega2);
      const k2 = omega1Dot(theta1 + 0.5 * dt * k1, theta2 + 0.5 * dt * l1, omega1 + 0.5 * dt * k1, omega2 + 0.5 * dt * l1);
      const l2 = omega2Dot(theta1 + 0.5 * dt * k1, theta2 + 0.5 * dt * l1, omega1 + 0.5 * dt * k1, omega2 + 0.5 * dt * l1);
      const k3 = omega1Dot(theta1 + 0.5 * dt * k2, theta2 + 0.5 * dt * l2, omega1 + 0.5 * dt * k2, omega2 + 0.5 * dt * l2);
      const l3 = omega2Dot(theta1 + 0.5 * dt * k2, theta2 + 0.5 * dt * l2, omega1 + 0.5 * dt * k2, omega2 + 0.5 * dt * l2);
      const k4 = omega1Dot(theta1 + dt * k3, theta2 + dt * l3, omega1 + dt * k3, omega2 + dt * l3);
      const l4 = omega2Dot(theta1 + dt * k3, theta2 + dt * l3, omega1 + dt * k3, omega2 + dt * l3);

      // Update angles and angular velocities
      theta1 += omega1 * dt + 0.5 * omega1Dot(theta1, theta2, omega1, omega2) * dt * dt;
      theta2 += omega2 * dt + 0.5 * omega2Dot(theta1, theta2, omega1, omega2) * dt * dt;
      const k1_new = omega1Dot(theta1, theta2, omega1, omega2);
      const l1_new = omega2Dot(theta1, theta2, omega1, omega2);
      omega1 += 0.5 * (k1 + k1_new) * dt;
      omega2 += 0.5 * (l1 + l1_new) * dt;
    
      // Calculate pendulum endpoints
      const x1 = L1 * scale * Math.sin(theta1);
      const y1 = L1 * scale * Math.cos(theta1);
      const x2 = x1 + L2 * scale * Math.sin(theta2);
      const y2 = y1 + L2 * scale * Math.cos(theta2);

      // Update pendulum
      svg.selectAll("*").remove(); // Clear previous frame
      svg.append("line")
        .attr("x1", width/2) // Center of SVG
        .attr("y1", (height/2)) // Center of SVG
        .attr("x2", x1 + (width/2)) // Center of SVG
        .attr("y2", y1 + (height/2)) // Center of SVG
        .attr("stroke", "#596594")
        .attr("stroke-width", 2);
        svg.append("line")
        .attr("x1", x1 + (width/2)) // Center of SVG
        .attr("y1", y1 + (height/2)) // Center of SVG
        .attr("x2", x2 + (width/2)) // Center of SVG
        .attr("y2", y2 + (height/2)) // Center of SVG
        .attr("stroke", "#596594")
        .attr("stroke-width", 2);
      svg.append("circle")
          .attr("cx", x1 + (width/2)) // Center of SVG
          .attr("cy", y1 + (height/2)) // Center of SVG
          .attr("r", 10)
          .attr("fill", "#596594");
      svg.append("circle")
        .attr("cx", x2 + (width/2)) // Center of SVG
        .attr("cy", y2 + (height/2)) // Center of SVG
        .attr("r", 10)
        .attr("fill", "#596594");
    }

    // Function to compute angular acceleration of first pendulum
    function omega1Dot(theta1, theta2, omega1, omega2) {
      const num1 = -g * (2 * m1 + m2) * Math.sin(theta1);
      const num2 = -m2 * g * Math.sin(theta1 - 2 * theta2);
      const num3 = -2 * Math.sin(theta1 - theta2) * m2;
      const num4 = omega2 * omega2 * L2 + omega1 * omega1 * L1 * Math.cos(theta1 - theta2);
      const den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
      return (num1 + num2 + num3 * num4) / den;
    }

    // Function to compute angular acceleration of second pendulum
    function omega2Dot(theta1, theta2, omega1, omega2) {
      const num1 = 2 * Math.sin(theta1 - theta2);
      const num2 = (omega1 * omega1 * L1 * (m1 + m2));
      const num3 = g * (m1 + m2) * Math.cos(theta1);
      const num4 = omega2 * omega2 * L2 * m2 * Math.cos(theta1 - theta2);
      const den = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * theta1 - 2 * theta2));
      return (num1 * (num2 + num3 + num4)) / den;
    }

    // Run animation
    const interval = setInterval(update, dt * 1000); // Update every dt seconds

    // Cleanup function to clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Run effect only once on component mount

  return <svg ref={svgRef}></svg>;
};

export default DoublePendulum;
