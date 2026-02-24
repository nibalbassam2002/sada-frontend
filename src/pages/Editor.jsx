import React, { useState } from 'react';
import {
  ChevronLeft, Play, Eye, Share2, Download, Copy, Save, CheckCircle2, MoreVertical, Search,
  PlusSquare, Layout, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, ChevronDown, List, ListOrdered, CaseSensitive, Palette, ChevronUp, RotateCcw,
  Columns, Eraser, Baseline, Highlighter, ArrowLeftRight, PaintBucket, Layers,
  Sparkles, Mic, Replace, Table, Image, Video, Music, Square, Smile,
  Cloud, MessageSquare, CheckSquare, Trophy, Zap, BarChart2, PieChart, Timer, HelpCircle,
  Languages, MessageSquarePlus, ZoomIn, Maximize2, Monitor, Grid, Ruler, EyeOff,
  CheckCircle, Globe, Accessibility, Trash2, Plus,
  Clipboard, Scissors, PaintRoller, Outdent, Indent, MousePointer2,
  Link, Hash, Sigma, PenTool, ArrowUp, ArrowDown, Settings2, Users, Target, Activity, Award,
  Settings, Sliders, Lightbulb, FileQuestion, TrendingUp, ImagePlus, ListChecks, ChevronRight, Lock,
  BookOpen, LayoutTemplate, Printer, StickyNote, AppWindow, PanelRight, PanelLeft, QrCode,
  Presentation, MonitorPlay, Airplay
} from 'lucide-react';
import '../styles/Editor.css';

const Editor = () => {
  // 1. تعريف الـ State
  const [slides, setSlides] = useState([{ id: 1 }]);
  const [activeSlideId, setActiveSlideId] = useState(1);
  const [title, setTitle] = useState("First Presentation");
  const [activeTab, setActiveTab] = useState("Home");
  const [isCollapsed, setIsCollapsed] = useState(true);

  // 2. دوال المساعدة
  const addNewSlide = () => {
    const newId = slides.length > 0 ? Math.max(...slides.map(s => s.id)) + 1 : 1;
    setSlides([...slides, { id: newId }]);
    setActiveSlideId(newId);
  };

  const deleteSlide = (e, id) => {
    e.stopPropagation();
    if (slides.length > 1) {
      const newSlides = slides.filter(slide => slide.id !== id);
      setSlides(newSlides);
      if (activeSlideId === id) setActiveSlideId(newSlides[0].id);
    }
  };

  // 3. تعريف هيكل بيانات الـ Ribbon (بدون فقدان أي عنصر)
  const ribbonGroups = {
    Home: [
      {
        id: 'clipboard',
        label: 'Clipboard',
        type: 'mega-with-stack',
        megaIcon: Clipboard,
        megaText: 'Paste',
        stackButtons: [
          { icon: Scissors, text: 'Cut' },
          { icon: Copy, text: 'Copy' },
          { icon: PaintRoller, text: 'Format Painter' }
        ]
      },
      {
        id: 'slides',
        label: 'Slides',
        type: 'mega-with-stack',
        megaIcon: PlusSquare,
        megaColor: '#d83b01',
        megaText: ['New', 'Slide'],
        onClick: addNewSlide,
        stackButtons: [
          { icon: Layout, text: 'Layout' },
          { icon: RotateCcw, text: 'Reset' }
        ]
      },
      {
        id: 'font',
        label: 'Font',
        type: 'font-controls',
        families: ['Calibri (Body)'],
        sizes: ['60']
      },
      {
        id: 'paragraph',
        label: 'Paragraph',
        type: 'paragraph-controls'
      },
      {
        id: 'drawing',
        label: 'Drawing',
        type: 'drawing-controls'
      },
      {
        id: 'editing',
        label: 'Editing',
        type: 'editing-controls'
      }
    ],
    Insert: [
      {
        id: 'tables',
        label: 'Tables',
        type: 'simple-mega',
        icon: Table,
        text: 'Table',
        hasDropdown: true
      },
      {
        id: 'images',
        label: 'Images',
        type: 'mega-with-stack',
        megaIcon: Image,
        megaColor: '#059669',
        megaText: ['Pictures'],
        hasDropdown: true,
        stackButtons: [
          { icon: Search, text: 'Stock Images' },
          { icon: Copy, text: 'Screenshot' }
        ]
      },
      {
        id: 'illustrations',
        label: 'Illustrations',
        type: 'illustrations-grid'
      },
      {
        id: 'links-comments',
        label: 'Links & Comments',
        type: 'vertical-buttons',
        buttons: [
          { icon: Link, text: 'Link', color: '#2563eb' },
          { icon: MessageSquare, text: 'Comment', color: '#f59e0b' }
        ]
      },
      {
        id: 'text',
        label: 'Text',
        type: 'mega-with-stack',
        megaIcon: Type,
        megaColor: '#2563eb',
        megaText: 'Text Box',
        stackButtons: [
          { icon: PenTool, text: 'WordArt', color: '#db2777' },
          { icon: Hash, text: 'Slide Number' }
        ]
      },
      {
        id: 'symbols',
        label: 'Symbols',
        type: 'vertical-buttons',
        buttons: [
          { icon: Sigma, text: 'Equation', color: '#475569' },
          { icon: Smile, text: 'Symbol' }
        ]
      },
      {
        id: 'media',
        label: 'Media',
        type: 'vertical-buttons',
        buttons: [
          { icon: Video, text: 'Video', color: '#ef4444' },
          { icon: Music, text: 'Audio', color: '#3b82f6' }
        ]
      }
    ],
    Design: [
      {
        id: 'themes',
        label: 'Themes',
        type: 'themes-gallery'
      },
      {
        id: 'variants',
        label: 'Variants',
        type: 'variants-gallery'
      },
      {
        id: 'customize',
        label: 'Customize',
        type: 'customize-controls'
      },
      {
        id: 'designer',
        label: 'Designer',
        type: 'designer-ideas'
      }
    ],
    Transitions: [
      {
        id: 'preview',
        label: 'Preview',
        type: 'preview-button'
      },
      {
        id: 'transition-gallery',
        label: 'Transition to This Slide',
        type: 'transition-gallery'
      },
      {
        id: 'effect',
        label: 'Effect',
        type: 'effect-options'
      },
      {
        id: 'timing',
        label: 'Timing',
        type: 'timing-controls'
      }
    ],
    Animations: [
      {
        id: 'preview',
        label: 'Preview',
        type: 'preview-button'
      },
      {
        id: 'animation-gallery',
        label: 'Animation',
        type: 'animation-gallery'
      },
      {
        id: 'advanced',
        label: 'Advanced',
        type: 'advanced-animation'
      },
      {
        id: 'timing',
        label: 'Timing',
        type: 'animation-timing'
      }
    ],
    Questions: [
      {
        id: 'basic-polls',
        label: 'Basic Polls',
        type: 'polls-basic'
      },
      {
        id: 'advanced',
        label: 'Advanced',
        type: 'polls-advanced'
      },
      {
        id: 'gaming',
        label: 'Gaming',
        type: 'polls-gaming'
      },
      {
        id: 'privacy',
        label: 'Privacy',
        type: 'polls-privacy'
      },
      {
        id: 'config',
        label: 'Config',
        type: 'polls-config'
      }
    ],
    Session: [
      {
        id: 'live-access',
        label: 'Live Access',
        type: 'session-live'
      },
      {
        id: 'audience-control',
        label: 'Audience Control',
        type: 'session-audience'
      },
      {
        id: 'atmosphere',
        label: 'Atmosphere',
        type: 'session-atmosphere'
      }
    ],
    Review: [
      {
        id: 'proofing',
        label: 'Proofing',
        type: 'proofing-controls'
      },
      {
        id: 'insights',
        label: 'Insights',
        type: 'insights-button'
      },
      {
        id: 'language',
        label: 'Language',
        type: 'language-controls'
      },
      {
        id: 'comments',
        label: 'Comments',
        type: 'comments-controls'
      },
      {
        id: 'protect',
        label: 'Protect',
        type: 'protect-controls'
      }
    ],
    'Slide Show': [
      {
        id: 'start',
        label: 'Start',
        type: 'slideshow-start'
      },
      {
        id: 'setup',
        label: 'Set Up',
        type: 'slideshow-setup'
      },
      {
        id: 'monitors',
        label: 'Monitors',
        type: 'slideshow-monitors'
      }
    ],
    View: [
      {
        id: 'presentation-views',
        label: 'Presentation Views',
        type: 'presentation-views'
      },
      {
        id: 'master-views',
        label: 'Master Views',
        type: 'master-views'
      },
      {
        id: 'show',
        label: 'Show',
        type: 'show-controls'
      },
      {
        id: 'zoom',
        label: 'Zoom',
        type: 'zoom-controls'
      },
      {
        id: 'window',
        label: 'Window',
        type: 'window-controls'
      }
    ]
  };

  // 4. مكونات مساعدة لعرض مجموعات الـ Ribbon
  const renderRibbonGroup = (group) => {
    switch (group.type) {
      case 'mega-with-stack':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" onClick={group.onClick}>
                <group.megaIcon size={28} color={group.megaColor || "#475569"} />
                {Array.isArray(group.megaText) ? (
                  <div className="btn-label-stack">
                    {group.megaText.map((text, i) => <span key={i}>{text}</span>)}
                  </div>
                ) : (
                  <span>{group.megaText}</span>
                )}
                {group.hasDropdown && <ChevronDown size={10} />}
              </button>
              {group.stackButtons && (
                <div className="mini-tools-stack">
                  {group.stackButtons.map((btn, i) => (
                    <button key={i} className="btn-mini-wide">
                      <btn.icon size={14} color={btn.color} /> {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'font-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <select className="font-fam-select">
                  {group.families.map(fam => <option key={fam}>{fam}</option>)}
                </select>
                <select className="font-size-select">
                  {group.sizes.map(size => <option key={size}>{size}</option>)}
                </select>
                <div className="v-sep"></div>
                <button className="btn-icon-s"><Type size={14} />+</button>
                <button className="btn-icon-s"><Type size={12} />-</button>
                <button className="btn-icon-s"><Eraser size={14} /></button>
              </div>
              <div className="tool-row">
                <button className="btn-icon-s bold">B</button>
                <button className="btn-icon-s italic">I</button>
                <button className="btn-icon-s underline">U</button>
                <button className="btn-icon-s"><Baseline size={14} /></button>
                <button className="btn-icon-s"><Palette size={14} color="red" /></button>
                <button className="btn-icon-s"><Highlighter size={14} /></button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'paragraph-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <button className="btn-icon-s"><List size={14} /></button>
                <button className="btn-icon-s"><ListOrdered size={14} /></button>
                <div className="v-sep"></div>
                <button className="btn-icon-s"><Outdent size={14} /></button>
                <button className="btn-icon-s"><Indent size={14} /></button>
              </div>
              <div className="tool-row">
                <button className="btn-icon-s"><AlignLeft size={14} /></button>
                <button className="btn-icon-s"><AlignCenter size={14} /></button>
                <button className="btn-icon-s"><AlignRight size={14} /></button>
                <button className="btn-icon-s"><AlignJustify size={14} /></button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'drawing-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <div className="shapes-grid-mini">
                <div className="shape-box"></div>
                <div className="shape-box circle"></div>
                <div className="shape-box tri"></div>
              </div>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide"><Layers size={14} /> Arrange</button>
                <button className="btn-mini-wide"><PaintBucket size={14} /> Shape Fill</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'editing-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><Search size={14} /> Find</button>
              <button className="btn-mini-wide"><Replace size={14} /> Replace</button>
              <button className="btn-mini-wide"><MousePointer2 size={14} /> Select</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'simple-mega':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <group.icon size={28} color="#475569" />
                <div className="btn-label-stack">
                  <span>{group.text}</span>
                  {group.hasDropdown && <ChevronDown size={10} />}
                </div>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'illustrations-grid':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <button className="btn-icon-s"><Square size={16} /> Shapes</button>
                <button className="btn-icon-s"><Smile size={16} /> Icons</button>
              </div>
              <div className="tool-row">
                <button className="btn-icon-s"><Layers size={16} /> SmartArt</button>
                <button className="btn-icon-s"><BarChart2 size={16} /> Chart</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'vertical-buttons':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              {group.buttons.map((btn, i) => (
                <button key={i} className="btn-mini-wide">
                  <btn.icon size={16} color={btn.color} /> {btn.text}
                </button>
              ))}
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'themes-gallery':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <div className="themes-gallery-mini">
                <div className="theme-item active" style={{ background: '#2563eb' }}>Aa</div>
                <div className="theme-item" style={{ background: '#d83b01' }}>Aa</div>
                <div className="theme-item" style={{ background: '#059669', color: '#fff' }}>Aa</div>
              </div>
              <button className="icon-btn-ribbon"><ChevronDown size={14} /></button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'variants-gallery':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <div className="variants-grid">
                <div className="variant-box" style={{ background: '#3b82f6' }}></div>
                <div className="variant-box" style={{ background: '#60a5fa' }}></div>
                <div className="variant-box" style={{ background: '#93c5fd' }}></div>
                <div className="variant-box" style={{ background: '#bfdbfe' }}></div>
              </div>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide"><Palette size={14} /> Colors</button>
                <button className="btn-mini-wide"><RotateCcw size={14} /> Reset</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'customize-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <Columns size={28} color="#475569" />
                <div className="btn-label-stack"><span>Slide Size</span><ChevronDown size={10} /></div>
              </button>
              <button className="btn-mega">
                <PaintBucket size={28} color="#059669" />
                <span>Format Background</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'designer-ideas':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <Sparkles size={32} color="#8b5cf6" />
                <span>Design Ideas</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'preview-button':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <Play size={28} color="#475569" />
                <span>Preview</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'transition-gallery':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <div className="transition-gallery-mini">
                <div className="trans-item active">
                  <div className="trans-box none"></div>
                  <span>None</span>
                </div>
                <div className="trans-item">
                  <div className="trans-box morph"></div>
                  <span>Morph</span>
                </div>
                <div className="trans-item">
                  <div className="trans-box fade"></div>
                  <span>Fade</span>
                </div>
                <div className="trans-item">
                  <div className="trans-box push"></div>
                  <span>Push</span>
                </div>
              </div>
              <div className="mini-tools-stack">
                <button className="icon-btn-ribbon"><ChevronDown size={14} /></button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'effect-options':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <Settings2 size={28} color="#475569" />
                <span>Effect Options</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'timing-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <Music size={14} color="#64748b" />
                <span className="ribbon-text-s">Sound:</span>
                <select className="ribbon-select" style={{ width: '80px' }}><option>[No Sound]</option></select>
              </div>
              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <span className="ribbon-text-s">Duration:</span>
                <input type="number" className="ribbon-select" style={{ width: '55px' }} defaultValue="01.00" />
              </div>
              <button className="btn-mini-wide"><CheckCircle size={14} color="#059669" /> Apply To All</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'animation-gallery':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <div className="animation-gallery-mini">
                <div className="anim-item active"><span style={{ color: '#10b981' }}>★</span><span>Appear</span></div>
                <div className="anim-item"><span style={{ color: '#eab308' }}>★</span><span>Pulse</span></div>
                <div className="anim-item"><span style={{ color: '#ef4444' }}>★</span><span>Fly Out</span></div>
              </div>
              <button className="icon-btn-ribbon"><ChevronDown size={14} /></button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'advanced-animation':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col" style={{ minWidth: '120px' }}>
              <button className="btn-mini-wide"><PlusSquare size={14} color="#f59e0b" /> Add Animation</button>
              <button className="btn-mini-wide"><Layers size={14} color="#2563eb" /> Animation Pane</button>
              <button className="btn-mini-wide"><PaintRoller size={14} color="#db2777" /> Animation Painter</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'animation-timing':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <span className="ribbon-text-s" style={{ width: '55px' }}>Duration:</span>
                <input type="number" className="ribbon-select" style={{ width: '60px' }} defaultValue="0.50" step="0.25" />
              </div>
              <div className="tool-row">
                <span className="ribbon-text-s" style={{ width: '55px' }}>Delay:</span>
                <input type="number" className="ribbon-select" style={{ width: '60px' }} defaultValue="0.00" step="0.25" />
              </div>
              <div className="tool-row" style={{ marginTop: '4px', gap: '5px' }}>
                <div className="reorder-btns">
                  <button className="btn-icon-s"><ArrowUp size={12} /></button>
                  <button className="btn-icon-s"><ArrowDown size={12} /></button>
                </div>
                <span className="ribbon-text-s">Reorder</span>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-basic':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <List size={28} color="#f59e0b" />
                <span>Multiple Choice</span>
              </button>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide"><Cloud size={14} color="#3b82f6" /> Word Cloud</button>
                <button className="btn-mini-wide"><MessageSquare size={14} color="#10b981" /> Open Ended</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-advanced':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <button className="btn-icon-s"><TrendingUp size={16} color="#8b5cf6" /> Ranking</button>
                <button className="btn-icon-s"><Sliders size={16} color="#06b6d4" /> Scales</button>
              </div>
              <div className="tool-row">
                <button className="btn-icon-s"><ImagePlus size={16} color="#db2777" /> Images</button>
                <button className="btn-icon-s"><Lightbulb size={16} color="#fbbf24" /> Ideas</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-gaming':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <FileQuestion size={28} color="#ef4444" />
                <span>Quiz Mode</span>
              </button>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide"><Target size={14} color="#f97316" /> True / False</button>
                <button className="btn-mini-wide"><Award size={14} color="#eab308" /> Leaderboard</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-privacy':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide active-tool"><Eye size={14} color="#10b981" /> Public Results</button>
              <button className="btn-mini-wide"><EyeOff size={14} color="#64748b" /> Private View</button>
              <button className="btn-mini-wide"><Users size={14} color="#6366f1" /> Count: On</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'polls-config':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <Timer size={14} color="#64748b" />
                <select className="ribbon-select" style={{ width: '65px' }}><option>30s</option><option>60s</option></select>
              </div>
              <div className="tool-row" style={{ marginTop: '5px' }}>
                <button className="btn-icon-s" title="Reset"><RotateCcw size={16} /></button>
                <button className="btn-icon-s" title="Report"><Download size={16} /></button>
                <button className="btn-icon-s" title="Settings"><Settings size={16} /></button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'session-live':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega" style={{ border: '1px solid #f59e0b' }}>
                <Zap size={28} color="#f59e0b" /><span>Live Now</span>
              </button>
              <button className="btn-mega"><QrCode size={28} /><span>Show QR</span></button>
              <button className="btn-mega"><Trash2 size={24} color="#ef4444" /><span>End Session</span></button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'session-audience':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <label className="btn-mini-wide"><input type="checkbox" defaultChecked /> Names Required</label>
              <label className="btn-mini-wide"><input type="checkbox" defaultChecked /> Show Leaderboard</label>
              <button className="btn-mini-wide"><MessageSquare size={14} /> Chat: Enabled</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'session-atmosphere':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><Music size={14} color="#6366f1" /> BG Music</button>
              <button className="btn-mini-wide"><Palette size={14} color="#f59e0b" /> Theme for All</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'proofing-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <CheckCircle size={28} color="#059669" />
                <span>Spelling</span>
              </button>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide"><Search size={14} /> Thesaurus</button>
                <button className="btn-mini-wide"><Accessibility size={14} /> Check Accessibility</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'insights-button':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <Search size={28} color="#6366f1" />
                <span>Smart Lookup</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'language-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><Languages size={16} color="#2563eb" /> Translate</button>
              <button className="btn-mini-wide"><Globe size={16} color="#64748b" /> Language Preference</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'comments-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <MessageSquarePlus size={28} color="#f59e0b" />
                <span>New Comment</span>
              </button>
              <div className="mini-tools-stack">
                <div className="tool-row">
                  <button className="btn-icon-s"><ChevronLeft size={14} /> Prev</button>
                  <button className="btn-icon-s">Next <ChevronRight size={14} /></button>
                </div>
                <button className="btn-mini-wide"><Trash2 size={14} color="#ef4444" /> Delete All</button>
                <button className="btn-mini-wide"><Eye size={14} /> Show Comments</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'protect-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><Lock size={16} color="#475569" /> Protect Presentation</button>
              <button className="btn-mini-wide"><CheckSquare size={16} color="#059669" /> Mark as Final</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'slideshow-start':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega"><Presentation size={28} color="#d83b01" /><span>Beginning</span></button>
              <button className="btn-mega"><MonitorPlay size={28} color="#475569" /><span>Current</span></button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'slideshow-setup':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><EyeOff size={14} color="#ef4444" /> Hide Slide</button>
              <button className="btn-mini-wide"><Timer size={14} /> Rehearse Timings</button>
              <button className="btn-mini-wide"><Mic size={14} color="#ef4444" /> Record Show</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'slideshow-monitors':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <div className="tool-row">
                <span className="ribbon-text-s">Monitor:</span>
                <select className="ribbon-select"><option>Auto</option></select>
              </div>
              <label className="btn-mini-wide cursor-p">
                <input type="checkbox" defaultChecked /> Presenter View
              </label>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'presentation-views':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega active-tool">
                <Monitor size={28} color="#475569" />
                <span>Normal</span>
              </button>
              <div className="mini-tools-stack">
                <button className="btn-mini-wide"><List size={14} /> Outline View</button>
                <button className="btn-mini-wide"><Layers size={14} /> Slide Sorter</button>
                <button className="btn-mini-wide"><BookOpen size={14} /> Reading View</button>
              </div>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'master-views':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><LayoutTemplate size={16} color="#2563eb" /> Slide Master</button>
              <button className="btn-mini-wide"><Printer size={16} color="#64748b" /> Handout Master</button>
              <button className="btn-mini-wide"><StickyNote size={16} color="#f59e0b" /> Notes Master</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'show-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <label className="btn-mini-wide cursor-p"><input type="checkbox" defaultChecked /> Ruler</label>
              <label className="btn-mini-wide cursor-p"><input type="checkbox" /> Gridlines</label>
              <label className="btn-mini-wide cursor-p"><input type="checkbox" /> Guides</label>
              <button className="btn-mini-wide"><PanelRight size={14} /> Notes</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'zoom-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-flex">
              <button className="btn-mega">
                <ZoomIn size={28} color="#64748b" />
                <span>Zoom</span>
              </button>
              <button className="btn-mega">
                <Maximize2 size={28} color="#64748b" />
                <span>Fit to Window</span>
              </button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      case 'window-controls':
        return (
          <div className="ribbon-group" key={group.id}>
            <div className="group-content-col">
              <button className="btn-mini-wide"><AppWindow size={16} color="#2563eb" /> New Window</button>
              <button className="btn-mini-wide"><Layout size={16} /> Arrange All</button>
              <button className="btn-mini-wide"><ArrowLeftRight size={16} /> Switch Windows</button>
            </div>
            <div className="group-label">{group.label}</div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="editor-page">
      {/* --- 1. TOP NAVBAR (ثابت لا يتغير) --- */}
      <nav className="top-nav-bar">
        <div className="nav-left">
          <button className="btn-back"><ChevronLeft size={22} /></button>
          <div className="title-status-wrapper">
            <input className="inline-title-input" value={title} onChange={(e) => setTitle(e.target.value)} />
            <div className="save-status"><CheckCircle2 size={12} /><span>Changes saved</span></div>
          </div>
        </div>
        <div className="nav-right">
          <button className="action-btn"><Save size={18} /></button>
          <button className="action-btn"><Copy size={18} /></button>
          <div className="v-divider"></div>
          <button className="action-btn"><Eye size={18} /></button>
          <button className="action-btn"><Share2 size={18} /></button>
          <button className="action-btn"><Download size={18} /></button>
          <div className="v-divider"></div>
          <button className="more-btn"><Search size={18} /></button>
          <button className="more-btn"><MoreVertical size={20} /></button>
          <button className="action-btn btn-present"><Play size={18} fill="currentColor" /><span>Present</span></button>
        </div>
      </nav>

      {/* --- 2. RIBBON AREA (يتغير حسب التبويب) --- */}
      <div className={`ribbon-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="ribbon-tabs">
          <div className="tabs-list">
            {['Home', 'Insert', 'Design', 'Transitions', 'Animations', 'Slide Show', 'Questions', 'Session', 'Review', 'View'].map(tab => (
              <button
                key={tab}
                className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab); setIsCollapsed(false) }}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="collapse-toggle" onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="ribbon-content">
            {activeTab === 'Home' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Home.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Home.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Insert' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Insert.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Insert.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Design' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Design.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Design.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Transitions' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Transitions.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Transitions.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Animations' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Animations.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Animations.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Questions' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Questions.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Questions.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Session' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Session.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Session.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Review' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.Review.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.Review.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'Slide Show' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups['Slide Show'].map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups['Slide Show'].length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}

            {activeTab === 'View' && (
              <div className="tab-pane active fade-in">
                {ribbonGroups.View.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {renderRibbonGroup(group)}
                    {index < ribbonGroups.View.length - 1 && <div className="v-divider-slim"></div>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <main className="editor-main-body">
        {/* اليسار: قائمة مصغرات الشرائح */}
        <aside className="slides-list-sidebar">
          <div className="sidebar-label">SLIDES</div>
          <div className="slides-container">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`slide-item ${activeSlideId === slide.id ? 'active' : ''}`}
                onClick={() => setActiveSlideId(slide.id)}
              >
                <span className="slide-num">{index + 1}</span>
                <div className="slide-preview-box">
                  <div className="mini-content-preview">
                    <div className="mini-line"></div>
                    <div className="mini-line short"></div>
                  </div>
                </div>
                <button className="btn-delete-slide" onClick={(e) => deleteSlide(e, slide.id)}><Trash2 size={12} /></button>
              </div>
            ))}
            <button className="btn-add-slide-ghost" onClick={addNewSlide}><Plus size={16} /> Add Slide</button>
          </div>
        </aside>

        {/* الوسط: شاشة العمل (Canvas) */}
        <section className="canvas-workspace">
          <div className="slide-canvas-container shadow-premium">
            <div className="powerpoint-layout">
              {/* مربع العنوان الرئيسي */}
              <div
                className="dashed-placeholder title-placeholder"
                contentEditable
                data-placeholder="Click to add title"
              ></div>

              {/* مربع العنوان الفرعي */}
              <div
                className="dashed-placeholder subtitle-placeholder"
                contentEditable
                data-placeholder="Click to add subtitle"
              ></div>
            </div>
          </div>

          {/* فوتر صغير تحت الشريحة */}
          <footer className="canvas-footer">
            <span>Slide {slides.findIndex(s => s.id === activeSlideId) + 1} of {slides.length}</span>
            <div className="footer-controls">
              <button><Languages size={12} /> English</button>
              <button><Monitor size={12} /> Notes</button>
              <input type="range" style={{ width: '80px' }} />
            </div>
          </footer>
        </section>

        {/* اليمين: الخصائص */}
        <aside className="properties-panel-sidebar">
          <div className="sidebar-label">PROPERTIES</div>
          <div className="empty-properties">
            <Sparkles size={32} color="#e2e8f0" />
            <p>Select an element to edit</p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default Editor;