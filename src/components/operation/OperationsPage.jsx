// OperationsPage.js
import React, { useState } from "react";
import OperationsComponent from "../../container/login/operations/operations";
import { useNavigate } from "react-router-dom";

export default function OperationsPage() {
  const [showOperations, setShowOperations] = useState(true);
  const navigate = useNavigate();

  const closeOperations = () => {
    setShowOperations(false);
    navigate("/dashboard");
  };

  return (
    <div>
      {showOperations && (
        <OperationsComponent
          isAdmin={localStorage.getItem("type") === "admin"}
          open={showOperations}
          close={closeOperations}
        />
      )}
    </div>
  );
}
