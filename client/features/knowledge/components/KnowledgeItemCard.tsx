/**
 * KnowledgeItemCard - Knowledge Base Item Display Component
 *
 * Renders wiki articles, precedents, or Q&A items based on category.
 */

import React from 'react';
import { Book, Lightbulb, FileText, MessageCircle } from 'lucide-react';
import { Card, Badge } from '@/components/common';
import { ensureTagsArray } from '@/utils/type-transformers';
import type { KnowledgeItem, KnowledgeTab } from '../api/knowledge.types';

interface KnowledgeItemCardProps {
  item: KnowledgeItem;
  type: KnowledgeTab;
  onClick?: (item: KnowledgeItem) => void;
}

export const KnowledgeItemCard: React.FC<KnowledgeItemCardProps> = ({ item, type, onClick }) => {
  if (type === 'wiki') {
    return <WikiCard item={item} onClick={onClick} />;
  }
  if (type === 'precedents') {
    return <PrecedentCard item={item} onClick={onClick} />;
  }
  return <QACard item={item} onClick={onClick} />;
};

// Wiki Article Card
const WikiCard: React.FC<{ item: KnowledgeItem; onClick?: (item: KnowledgeItem) => void }> = ({ item, onClick }) => (
  <Card 
    className="hover:border-blue-300 cursor-pointer group transition-all"
    onClick={() => onClick?.(item)}
  >
    <div className="flex items-center justify-between mb-2">
      {item.metadata.icon === 'Book' ? (
        <Book className="h-5 w-5 text-purple-500" />
      ) : (
        <Lightbulb className="h-5 w-5 text-amber-500" />
      )}
      <Badge 
        variant={item.metadata.color === 'purple' ? 'category-purple' : 'category-amber'} 
        size="sm"
      >
        {item.category}
      </Badge>
    </div>
    <h3 className="font-bold text-slate-900 group-hover:text-blue-600">{item.title}</h3>
    <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
  </Card>
);

// Precedent Card
const PrecedentCard: React.FC<{ item: KnowledgeItem; onClick?: (item: KnowledgeItem) => void }> = ({ item, onClick }) => (
  <Card 
    className="hover:border-blue-300 cursor-pointer transition-all"
    onClick={() => onClick?.(item)}
  >
    <div className="flex items-center justify-between mb-2">
      <FileText className="h-5 w-5 text-blue-500" />
      <span className="text-xs text-slate-500">{item.metadata.similarity}% Similarity</span>
    </div>
    <h3 className="font-bold text-slate-900">{item.title}</h3>
    <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
    <div className="mt-3 flex gap-2 flex-wrap">
      {ensureTagsArray(item.tags).map(tag => (
        <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded">
          {tag}
        </span>
      ))}
    </div>
  </Card>
);

// Q&A Card
const QACard: React.FC<{ item: KnowledgeItem; onClick?: (item: KnowledgeItem) => void }> = ({ item, onClick }) => (
  <Card 
    className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
    onClick={() => onClick?.(item)}
  >
    <div className="flex gap-3">
      <div className="mt-1">
        <MessageCircle className="h-5 w-5 text-slate-400" />
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{item.summary}</p>
        {item.metadata.topAnswer && (
          <div className="mt-3 bg-green-50 p-3 rounded text-sm text-slate-700 border border-green-100">
            <span className="font-bold text-green-700 block mb-1">Top Answer (Partner Verified)</span>
            {item.metadata.topAnswer}
          </div>
        )}
      </div>
    </div>
  </Card>
);

export default KnowledgeItemCard;
