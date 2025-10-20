import React, { useState } from 'react';
import { PhoneCall, PhoneCallOption } from '../../data/phoneCalls';
import { PhoneCallSystem, PhoneCallEffect } from '../../systems/phoneCallSystem';
import './PhoneCallModal.css';

interface PhoneCallModalProps {
  call: PhoneCall;
  onSelectOptions: (selectedOptions: PhoneCallOption[]) => void;
  onClose: () => void;
  phoneCallSystem: PhoneCallSystem;
}

const PhoneCallModal: React.FC<PhoneCallModalProps> = ({
  call,
  onSelectOptions,
  onClose,
  phoneCallSystem
}) => {
  const handleOptionClick = (option: PhoneCallOption) => {
    // Immediately apply the effect and close the modal
    onSelectOptions([option]);
  };

  const getOptionTypeColor = (type: 'positive' | 'negative' | 'neutral'): string => {
    switch (type) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#f59e0b';
      default: return '#9ca3af';
    }
  };

  const getCallTypeColor = (): string => {
    return phoneCallSystem.getCallTypeColor(call.type);
  };

  const getCallTypeIcon = (): string => {
    return phoneCallSystem.getCallTypeIcon(call.type);
  };

  return (
    <div className="phone-call-overlay">
      <div className="phone-call-modal">
        <div className="phone-call-header" style={{ borderColor: getCallTypeColor() }}>
          <div className="call-type">
            <span className="call-icon">{getCallTypeIcon()}</span>
            <span className="call-title">{call.title}</span>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="phone-call-content">
          <div className="call-description">
            <p>{call.description}</p>
            <p className="call-instruction">
              Click an option to apply it:
            </p>
          </div>

          <div className="options-grid">
            {call.options.map(option => (
              <div
                key={option.id}
                className={`option-card ${option.type}`}
                onClick={() => handleOptionClick(option)}
                style={{
                  borderColor: getOptionTypeColor(option.type),
                  cursor: 'pointer'
                }}
              >
                <div className="option-header">
                  <span className="option-text">{option.text}</span>
                  <span className="option-type">{option.type.toUpperCase()}</span>
                </div>
                <div className="option-effect">{option.effect}</div>
              </div>
            ))}
          </div>

          <div className="phone-call-actions">
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneCallModal;
