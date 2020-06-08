import React from "react";
import ProtectionCard from "./ProtectionCard";

export default ({ testResults, webcamCoordinates }) => (
  <div className="people-container">
    {testResults.map((person) => (
      <ProtectionCard
        key={person.id}
        person={person}
        webcamCoordinates={webcamCoordinates}
      />
    ))}
  </div>
);
