// src/components/Editor/Modals/SearchReplaceDialog.js
import React, { useState, useEffect, useRef } from 'react';
import { Search, Replace, ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { useEditor } from '../EditorContext';

const SearchReplaceDialog = ({ onClose }) => {
  const dialogRef = useRef(null);
  const [activeTab, setActiveTab] = useState('find');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [matchWholeWord, setMatchWholeWord] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  
  const { selectedField, activeSlideId, setSlides, showToast } = useEditor();

  useEffect(() => { 
    const handleClickOutside = (event) => { 
      if (dialogRef.current && !dialogRef.current.contains(event.target)) onClose(); 
    }; 
    document.addEventListener('mousedown', handleClickOutside); 
    return () => document.removeEventListener('mousedown', handleClickOutside); 
  }, [onClose]);

  const highlightResult = (start, length) => { 
    const element = document.querySelector('.active-editing'); 
    if (!element) return; 
    const range = document.createRange(); 
    const textNode = element.firstChild; 
    if (textNode) { 
      range.setStart(textNode, start); 
      range.setEnd(textNode, start + length); 
      const selection = window.getSelection(); 
      selection.removeAllRanges(); 
      selection.addRange(range); 
      element.scrollIntoView({ behavior: 'smooth', block: 'center' }); 
    } 
  };

  const handleFind = () => { 
    if (!selectedField) { 
      showToast("Please select a text field first"); 
      return; 
    } 
    
    const element = document.querySelector('.active-editing'); 
    if (!element) return; 
    
    const text = element.innerText; 
    let searchText = text; 
    let query = findText; 
    
    if (!matchCase) { 
      searchText = searchText.toLowerCase(); 
      query = query.toLowerCase(); 
    } 
    
    const results = []; 
    let index = -1; 
    
    do { 
      index = searchText.indexOf(query, index + 1); 
      if (index !== -1) { 
        if (matchWholeWord) { 
          const beforeChar = index > 0 ? text[index - 1] : ' '; 
          const afterChar = index + findText.length < text.length ? text[index + findText.length] : ' '; 
          const isWordBoundary = !/[a-zA-Z0-9]/.test(beforeChar) && !/[a-zA-Z0-9]/.test(afterChar); 
          if (!isWordBoundary) continue; 
        } 
        results.push(index); 
      } 
    } while (index !== -1); 
    
    setSearchResults(results); 
    
    if (results.length > 0) { 
      setCurrentIndex(0); 
      highlightResult(results[0], findText.length); 
      showToast(`Found ${results.length} matches`); 
    } else showToast("No matches found"); 
  };

  const navigateResult = (direction) => { 
    if (searchResults.length === 0) return; 
    let newIndex; 
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % searchResults.length; 
    } else { 
      newIndex = currentIndex - 1; 
      if (newIndex < 0) newIndex = searchResults.length - 1; 
    } 
    
    setCurrentIndex(newIndex); 
    highlightResult(searchResults[newIndex], findText.length); 
  };

  const handleReplace = () => { 
    if (!selectedField || currentIndex === -1) return; 
    
    const element = document.querySelector('.active-editing'); 
    if (!element) return; 
    
    const selection = window.getSelection(); 
    if (selection.rangeCount > 0) { 
      const range = selection.getRangeAt(0); 
      range.deleteContents(); 
      range.insertNode(document.createTextNode(replaceText)); 
      
      const newText = element.innerText; 
      setSlides(prev => prev.map(s => 
        s.id === activeSlideId ? { ...s, [selectedField]: newText } : s
      )); 
      
      handleFind(); 
      showToast("Replaced"); 
    } 
  };

  const handleReplaceAll = () => { 
    if (!selectedField || searchResults.length === 0) return; 
    
    const element = document.querySelector('.active-editing'); 
    if (!element) return; 
    
    let text = element.innerText; 
    let newText = text; 
    const sortedResults = [...searchResults].sort((a, b) => b - a); 
    
    sortedResults.forEach(start => { 
      newText = newText.substring(0, start) + replaceText + newText.substring(start + findText.length); 
    }); 
    
    element.innerText = newText; 
    setSlides(prev => prev.map(s => 
      s.id === activeSlideId ? { ...s, [selectedField]: newText } : s
    )); 
    
    setSearchResults([]); 
    setCurrentIndex(-1); 
    showToast(`Replaced ${searchResults.length} occurrences`); 
  };

  return (
    <div className="search-dialog-overlay">
      <div className="search-dialog-modern" ref={dialogRef}>
        <div className="search-dialog-header-modern">
          <div className="search-tabs">
            <button 
              className={`search-tab ${activeTab === 'find' ? 'active' : ''}`} 
              onClick={() => setActiveTab('find')}
            >
              <Search size={14} />Find
            </button>
            <button 
              className={`search-tab ${activeTab === 'replace' ? 'active' : ''}`} 
              onClick={() => setActiveTab('replace')}
            >
              <Replace size={14} />Replace
            </button>
          </div>
          <button className="close-btn-modern" onClick={onClose}>✕</button>
        </div>
        
        <div className="search-dialog-content-modern">
          <div className="search-field-group">
            <Search size={16} className="field-icon" />
            <input 
              type="text" 
              placeholder="Find what" 
              value={findText} 
              onChange={(e) => setFindText(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleFind()} 
              autoFocus 
            />
          </div>
          
          {activeTab === 'replace' && (
            <div className="search-field-group">
              <Replace size={16} className="field-icon" />
              <input 
                type="text" 
                placeholder="Replace with" 
                value={replaceText} 
                onChange={(e) => setReplaceText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleReplace()} 
              />
            </div>
          )}
          
          <div className="search-options-modern">
            <label className="search-option">
              <input 
                type="checkbox" 
                checked={matchCase} 
                onChange={(e) => setMatchCase(e.target.checked)} 
              />
              <span>Match case</span>
            </label>
            <label className="search-option">
              <input 
                type="checkbox" 
                checked={matchWholeWord} 
                onChange={(e) => setMatchWholeWord(e.target.checked)} 
              />
              <span>Whole word only</span>
            </label>
          </div>
          
          {searchResults.length > 0 && (
            <div className="search-results-info-modern">
              {currentIndex + 1} of {searchResults.length} matches
            </div>
          )}
          
          <div className="search-actions-modern">
            <div className="search-nav-modern">
              <button 
                className="nav-btn-modern" 
                onClick={() => navigateResult('prev')} 
                disabled={searchResults.length === 0}
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button 
                className="nav-btn-modern" 
                onClick={() => navigateResult('next')} 
                disabled={searchResults.length === 0}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="action-buttons-modern">
              <button className="find-btn-modern" onClick={handleFind}>
                <Search size={14} /> Find
              </button>
              
              {activeTab === 'replace' && (
                <>
                  <button 
                    className="replace-btn-modern" 
                    onClick={handleReplace} 
                    disabled={searchResults.length === 0}
                  >
                    <Replace size={14} /> Replace
                  </button>
                  <button 
                    className="replace-all-btn-modern" 
                    onClick={handleReplaceAll} 
                    disabled={searchResults.length === 0}
                  >
                    <Copy size={14} /> All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchReplaceDialog;