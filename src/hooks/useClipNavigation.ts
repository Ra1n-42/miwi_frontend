// src/hooks/useClipNavigation.ts
import { useState, useEffect } from 'react';
import { Clip } from '@/types/ClipTypes';

const LOCAL_STORAGE_KEYS = {
  CURRENT_INDEX: 'shorts_currentClipIndex',
  ACTIVE_TAB: 'shorts_activeTab',
} as const;

export function useClipNavigation(clips: Clip[]) {
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    const savedIndex = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_INDEX);
    const savedTab = localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB);

    if (savedIndex) setCurrentClipIndex(Number(savedIndex));
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_INDEX, currentClipIndex.toString());
  }, [currentClipIndex]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const nextClip = () => {
    setSelectedClip(null);
    if (currentClipIndex < clips.length - 1) {
      setCurrentClipIndex(prev => prev + 1);
    }
  };

  const prevClip = () => {
    setSelectedClip(null);
    if (currentClipIndex > 0) {
      setCurrentClipIndex(prev => prev - 1);
    }
  };

  const selectClip = (clip: Clip) => {
    setSelectedClip(clip);
  };

  return {
    currentClipIndex,
    selectedClip,
    activeTab,
    setActiveTab,
    nextClip,
    prevClip,
    selectClip,
  };
}