"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  X, 
  Clock, 
  ArrowRight, 
  Command,
  Filter,
  Hash
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  VisuallyHidden,
} from '@/components/ui/dialog';
import {
  SearchItem,
  SearchResult,
  SearchCategory,
  QuickSearchProps
} from '@/types/search';
import {
  searchItems,
  saveRecentSearch,
  getRecentSearches,
  clearRecentSearches,
  filterByCategory
} from '@/lib/search-utils';

const categoryLabels: Record<SearchCategory, string> = {
  menu: 'Menu',
  customers: 'Khách hàng',
  'parking-lots': 'Bãi đỗ xe',
  tickets: 'Vé đỗ xe',
  reports: 'Báo cáo',
  settings: 'Cài đặt',
  recent: 'Gần đây'
};

const categoryColors: Record<SearchCategory, string> = {
  menu: 'bg-blue-100 text-blue-700',
  customers: 'bg-green-100 text-green-700',
  'parking-lots': 'bg-purple-100 text-purple-700',
  tickets: 'bg-orange-100 text-orange-700',
  reports: 'bg-indigo-100 text-indigo-700',
  settings: 'bg-gray-100 text-gray-700',
  recent: 'bg-yellow-100 text-yellow-700'
};

export default function QuickSearch({ 
  isCollapsed = false,
  onItemSelect,
  onClose,
  placeholder = "Tìm kiếm nhanh... (Ctrl+K)",
  maxResults = 8
}: QuickSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<SearchCategory[]>([]);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Helper function to safely render icon
  const renderIcon = (IconComponent: any, className: string = "w-4 h-4") => {
    if (!IconComponent) {
      return <Search className={className} />;
    }
    
    // Check if it's a valid Lucide icon (function)
    if (typeof IconComponent === 'function') {
      try {
        return <IconComponent className={className} />;
      } catch (error) {
        console.warn('Invalid icon component:', error);
        return <Search className={className} />;
      }
    }
    
    // Fallback to search icon
    return <Search className={className} />;
  };

  // Load recent searches
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Keyboard shortcut (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search functionality
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const searchResults = searchItems(searchQuery, undefined, maxResults);
      const filteredResults = selectedCategories.length > 0 
        ? searchResults.filter(result => selectedCategories.includes(result.item.category))
        : searchResults;
      
      setResults(filteredResults);
      setSelectedIndex(filteredResults.length > 0 ? 0 : -1);
      setIsLoading(false);
    }, 100);
  }, [maxResults, selectedCategories]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  // Handle item selection
  const handleItemSelect = (item: SearchItem) => {
    saveRecentSearch(item);
    setRecentSearches(getRecentSearches());
    
    if (onItemSelect) {
      onItemSelect(item);
    }
    
    if (item.href) {
      router.push(item.href);
    }
    
    setIsOpen(false);
    setQuery('');
    setResults([]);
    
    if (onClose) {
      onClose();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const maxIndex = (results.length || recentSearches.length) - 1;
          return prev < maxIndex ? prev + 1 : 0;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const maxIndex = (results.length || recentSearches.length) - 1;
          return prev > 0 ? prev - 1 : maxIndex;
        });
        break;
        
      case 'Enter':
        e.preventDefault();
        const currentResults = results.length > 0 ? results : recentSearches.map(item => ({ item, score: 0, matchedFields: [] }));
        if (selectedIndex >= 0 && currentResults[selectedIndex]) {
          handleItemSelect(currentResults[selectedIndex].item);
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  // Toggle category filter
  const toggleCategory = (category: SearchCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Clear recent searches
  const handleClearRecent = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  // Render search result item
  const renderResultItem = (result: SearchResult, index: number) => {
    const { item } = result;
    const isSelected = index === selectedIndex;

    return (
      <div
        key={item.id}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
          ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'}`}
        onClick={() => handleItemSelect(item)}
      >
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
          {renderIcon(item.icon, "w-5 h-5 text-gray-500")}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 truncate">{item.title}</p>
            <Badge 
              variant="secondary" 
              className={`text-xs ${categoryColors[item.category]}`}
            >
              {categoryLabels[item.category]}
            </Badge>
          </div>
          {item.subtitle && (
            <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
          )}
          {item.description && (
            <p className="text-xs text-gray-400 truncate mt-1">{item.description}</p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    );
  };

  // Render recent search item
  const renderRecentItem = (item: SearchItem, index: number) => {
    const isSelected = index === selectedIndex;

    return (
      <div
        key={`recent_${item.id}`}
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors
          ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'}`}
        onClick={() => handleItemSelect(item)}
      >
        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {renderIcon(item.icon, "w-4 h-4 text-gray-500")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{item.title}</p>
          {item.subtitle && (
            <p className="text-sm text-gray-500 truncate">{item.subtitle}</p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    );
  };

  const currentResults = results.length > 0 ? results : recentSearches.map(item => ({ item, score: 0, matchedFields: [] }));

  return (
    <>
      {/* Trigger Button */}
      {!isCollapsed ? (
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-4 h-4 mr-2" />
          <span className="truncate">{placeholder}</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="w-full p-2 hover:bg-gray-50"
          onClick={() => setIsOpen(true)}
        >
          <Search className="w-4 h-4" />
        </Button>
      )}

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0">
          <VisuallyHidden>
            <DialogTitle>Tìm kiếm nhanh</DialogTitle>
          </VisuallyHidden>
          <DialogHeader className="px-4 py-3 border-b">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-500" />
              <Input
                ref={inputRef}
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Tìm kiếm menu, khách hàng, bãi đỗ xe..."
                className="border-0 shadow-none focus-visible:ring-0 text-base"
              />
              {query && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    inputRef.current?.focus();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto">
            {/* Category Filters */}
            {query && (
              <div className="px-4 py-3 border-b bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Lọc theo danh mục:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryLabels).map(([category, label]) => {
                    if (category === 'recent') return null;
                    const isSelected = selectedCategories.includes(category as SearchCategory);
                    return (
                      <Button
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCategory(category as SearchCategory)}
                        className="h-7 text-xs"
                      >
                        {label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">Đang tìm kiếm...</span>
              </div>
            ) : (
              <div ref={resultsRef}>
                {/* Search Results */}
                {results.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b">
                      <span className="text-sm font-medium text-gray-700">
                        Kết quả tìm kiếm ({results.length})
                      </span>
                    </div>
                    {results.map((result, index) => renderResultItem(result, index))}
                  </div>
                )}

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                  <div>
                    <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Tìm kiếm gần đây</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearRecent}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                    {recentSearches.map((item, index) => renderRecentItem(item, index))}
                  </div>
                )}

                {/* No Results */}
                {query && results.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Không tìm thấy kết quả</p>
                    <p className="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác</p>
                  </div>
                )}

                {/* Empty State */}
                {!query && recentSearches.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Command className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">Tìm kiếm nhanh</p>
                    <p className="text-gray-400 text-sm">Nhập từ khóa để tìm kiếm menu, khách hàng, bãi đỗ xe...</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border rounded">↑↓</kbd>
                  <span>điều hướng</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border rounded">Enter</kbd>
                  <span>chọn</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white border rounded">Esc</kbd>
                  <span>đóng</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>GoPark Quick Search</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
