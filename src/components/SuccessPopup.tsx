import React, { useEffect } from 'react';
import './SuccessPopup.scss'; // Import your SCSS file for styling

interface SuccessPopupProps {
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ setIsSubmitted }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset the submission state after a delay
      setIsSubmitted(false);
    }, 5000); // Change the delay as needed

    return () => {
      clearTimeout(timer);
    };
  }, [setIsSubmitted]);

  return (
    <div className="success-popup">
      <div className="success-content">
        <h2>Successfully Submitted!</h2>
        <p>Your form has been submitted successfully.</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
