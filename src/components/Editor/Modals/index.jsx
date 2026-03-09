// src/components/Editor/Modals/index.jsx
import React from 'react';
import { useEditor } from '../EditorContext';
import LayoutPicker from './LayoutPicker';
import FontPicker from './FontPicker';
import ColorPicker from './ColorPicker';
import TableModal from './TableModal';
import SearchReplaceDialog from './SearchReplaceDialog';
import SizeModal from './SizeModal';
import BackgroundPanel from './BackgroundPanel';


export const Modals = {
  LayoutPicker: () => {
    const { showLayoutPicker } = useEditor();
    return showLayoutPicker ? <LayoutPicker /> : null;
  },
  
  FontPicker: () => {
    const { showFontPicker } = useEditor();
    return showFontPicker ? <FontPicker /> : null;
  },
  
  ColorPicker: () => {
    const { showColorPicker } = useEditor();
    return showColorPicker ? <ColorPicker /> : null;
  },
  
  TableModal: () => {
    const { showTableModal, addTable } = useEditor();
    return showTableModal ? <TableModal onInsert={addTable} /> : null;
  },
  
  SearchReplace: () => {
    const { showSearchDialog } = useEditor();
    return showSearchDialog ? <SearchReplaceDialog /> : null;
  },
  
  SizeModal: ({ onClose }) => {
    return <SizeModal onClose={onClose} />;
  },
  
  BackgroundPanel: ({ onClose }) => {
    return <BackgroundPanel onClose={onClose} />;
  },

 

};