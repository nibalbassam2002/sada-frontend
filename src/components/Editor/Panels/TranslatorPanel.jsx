// src/components/Editor/Panels/TranslatorPanel.js
import React from 'react';
import { Copy } from 'lucide-react';
import { LANGUAGES } from '../EditorConstants';

const TranslatorPanel = ({ results, onClose, onLanguageChange, targetLanguage, onInsert }) => {
  return (
    <div className="translator-panel">
      <div className="translator-header">
        <h4>Translator</h4>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="translator-content">
        <div className="language-selector">
          <label>Translate to:</label>
          <select
            value={targetLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            {LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {results.map((result, index) => (
          <div key={index} className="translation-result">
            <div className="original-text">
              <span className="label">Original:</span>
              <p>{result.original}</p>
            </div>
            <div className="translated-text">
              <span className="label">Translated:</span>
              <p>{result.translated}</p>
            </div>
            <button className="insert-btn" onClick={() => onInsert(result.translated)}>
              <Copy size={12} /> Insert
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslatorPanel;