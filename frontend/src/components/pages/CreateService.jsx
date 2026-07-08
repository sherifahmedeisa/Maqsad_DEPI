import { useState } from "react";
import "./CreateService.css";

function CreateService() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    requestTitle: "",
    serviceCategory: "",
  });

  const steps = [
    { number: 1, label: "Title & Category" },
    { number: 2, label: "Details" },
    { number: 3, label: "Budget & Time" },
    { number: 4, label: "Review" },
  ];

  const categories = [
    "Select a category",
    "Consulting",
    "Development",
    "Design",
    "Marketing",
    "Finance",
    "Legal",
    "HR",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (formData.requestTitle && formData.serviceCategory !== "Select a category") {
      setCurrentStep(currentStep + 1);
      setFormData({ requestTitle: "", serviceCategory: "" });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <div className="create-service-container">
      <div className="create-service-content">
        {/* Header */}
        <div className="create-service-header">
          <h1 className="create-service-title">Create New Service</h1>
          <p className="create-service-subtitle">
            Detail your needs to connect with the right service providers.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {steps.map((step) => (
            <div key={step.number} className="step-container">
              <div
                className={`step-circle ${
                  currentStep === step.number ? "active" : ""
                } ${currentStep > step.number ? "completed" : ""}`}
              >
                {currentStep > step.number ? (
                  <span className="step-check">✓</span>
                ) : (
                  <span className="step-number">{step.number}</span>
                )}
              </div>
              <span className="step-label">{step.label}</span>
              {step.number < steps.length && <div className="step-line"></div>}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="form-container">
          <div className="form-card">
            <h2 className="form-section-title">Basic Information</h2>

            <div className="form-group">
              <label htmlFor="requestTitle" className="form-label">
                Request Title
              </label>
              <input
                type="text"
                id="requestTitle"
                name="requestTitle"
                className="form-input"
                placeholder="e.g., Financial Audit for Q3"
                value={formData.requestTitle}
                onChange={handleInputChange}
              />
              <p className="form-helper-text">
                A clear, concise title helps providers understand your need
                quickly.
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="serviceCategory" className="form-label">
                Service Category
              </label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                className="form-select"
                value={formData.serviceCategory}
                onChange={handleInputChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn-next-step" onClick={handleNextStep}>
              Next Step
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateService;
