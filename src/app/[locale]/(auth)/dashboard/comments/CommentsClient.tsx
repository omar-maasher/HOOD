'use client';

import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  RefreshCw,
  Send,
  Trash2,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { cn } from '@/utils/Helpers';

import { saveAiSettings } from '../ai-settings/actions';

type PostItem = {
  id: string;
  caption: string;
  mediaUrl?: string;
};

type AllCommentItem = {
  messageId: number;
  conversationId: number;
  text: string | null;
  createdAt: string | Date;
  customerName: string | null;
  externalId: string;
  isUnread: string | null;
  displayName: string;
  metaMediaId?: string;
  metaCommentId?: string;
  lastReply?: {
    text: string;
    createdAt: string | Date;
    senderType: string;
  } | null;
};

// Instagram-style round avatar
const IgAvatar = ({ name, size = 32 }: { name: string; size?: number }) => {
  const colors = [
    'from-[#833AB4] to-[#FD1D1D]',
    'from-[#405DE6] to-[#5851DB]',
    'from-[#E1306C] to-[#F77737]',
    'from-[#FCAF45] to-[#F77737]',
    'from-[#833AB4] to-[#405DE6]',
    'from-[#C13584] to-[#E1306C]',
  ];
  const colorIdx = (name || 'U').charCodeAt(0) % colors.length;

  return (
    <div
      className={cn('shrink-0 rounded-full bg-gradient-to-br p-[2px]', colors[colorIdx])}
      style={{ width: size, height: size }}
    >
      <div
        className="flex size-full items-center justify-center rounded-full bg-[#121212] font-bold text-white"
        style={{ fontSize: size * 0.38 }}
      >
        {(name || 'U')[0]!.toUpperCase()}
      </div>
    </div>
  );
};

export const CommentsClient = ({
  isAr,
  botName,
  initialPostId,
  aiSettings,
}: {
  isAr: boolean;
  botName: string;
  initialPostId?: string | null;
  aiSettings?: any;
}) => {
  const t = useTranslations('Comments');

  const [commentsLoading, setCommentsLoading] = useState(true);
  const [isBotActive, setIsBotActive] = useState(aiSettings?.isCommentsActive === 'true' || aiSettings?.isCommentsActive === true || !aiSettings);
  const [allComments, setAllComments] = useState<AllCommentItem[]>([]);
  const [postsDict, setPostsDict] = useState<Record<string, PostItem>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState<number | null>(null);
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const l = <T,>(arContent: T, enContent: T): T => (isAr ? arContent : enContent);

  const lang = {
    search: l('بحث...', 'Search...'),
    noComments: l('لا توجد تعليقات بعد', 'No comments yet'),
    refresh: l('تحديث', 'Refresh'),
    reply: l('الرد', 'Reply'),
    replyPlaceholder: l('أضف رد...', 'Add a reply...'),
    post: l('نشر', 'Post'),
    loading: l('جاري التحميل...', 'Loading...'),
    viewReplies: l('عرض الردود', 'View replies'),
    liked: l('أعجبني', 'Liked'),
    delete: l('حذف', 'Delete'),
    deleting: l('جاري الحذف...', 'Deleting...'),
  };

  const loadEverything = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const postsRes = await fetch('/api/meta/posts?platform=instagram&limit=100', { cache: 'no-store' });
      const pd: Record<string, PostItem> = {};
      if (postsRes.ok) {
        const pData = await postsRes.json();
        const items = Array.isArray(pData?.items) ? pData.items : [];
        items.forEach((p: any) => {
          if (p.id) {
            pd[p.id.toString()] = { id: p.id, caption: p.caption, mediaUrl: p.mediaUrl };
          }
        });
        setPostsDict(pd);
      }

      const comRes = await fetch('/api/comments/all', { cache: 'no-store' });
      if (comRes.ok) {
        const cData = await comRes.json();
        setAllComments(cData.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  const handleToggleBot = async () => {
    const newState = !isBotActive;
    setIsBotActive(newState);
    try {
      await saveAiSettings({
        ...aiSettings,
        isActive: aiSettings?.isActive ?? 'true',
        isCommentsActive: newState ? 'true' : 'false',
      });
    } catch (e) {
      console.error(e);
      setIsBotActive(!newState);
    }
  };

  useEffect(() => {
    loadEverything();
  }, [loadEverything]);

  useEffect(() => {
    if (initialPostId) {
      setSearchQuery(initialPostId);
    }
  }, [initialPostId]);

  // Group comments by post
  const groupedByPost = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const filtered = q
      ? allComments.filter(c =>
        (c.customerName || '').toLowerCase().includes(q)
        || (c.text || '').toLowerCase().includes(q))
      : allComments;

    const groups: Record<string, AllCommentItem[]> = {};
    filtered.forEach((c) => {
      const key = c.metaMediaId || '_no_post';
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key]!.push(c);
    });
    return groups;
  }, [allComments, searchQuery]);

  const handleReply = async (comment: AllCommentItem, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !comment.metaCommentId || sendingReply) {
      return;
    }

    setSendingReply(comment.messageId);
    try {
      const res = await fetch('/api/inbox/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: comment.conversationId,
          platform: 'instagram',
          externalId: comment.externalId,
          text: replyText,
          commentId: comment.metaCommentId,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setActiveReplyId(null);
        await loadEverything();
      }
    } catch (error) {
      console.error('Failed to send reply', error);
    } finally {
      setSendingReply(null);
    }
  };

  const toggleLike = (id: number) => {
    setLikedComments((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const timeAgo = (date: string | Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: false, locale: l(ar, enUS) });
    } catch {
      return '';
    }
  };

  const handleDelete = async (comment: AllCommentItem) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا التعليق فقط؟' : 'Are you sure you want to delete this specific comment?')) {
      return;
    }

    try {
      const res = await fetch('/api/inbox/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: comment.messageId }),
      });

      if (res.ok) {
        setAllComments(prev => prev.filter(c => c.messageId !== comment.messageId));
        setActiveReplyId(null);
      }
    } catch (error) {
      console.error('Failed to delete', error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-0 pb-16" dir={isAr ? 'rtl' : 'ltr'}>

      {/* ─── HEADER BAR (Instagram-style) ──────────────────── */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#121212]/95 px-4 py-3 backdrop-blur-xl">
        <h1 className="text-base font-bold text-white">{t('title')}</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleBot}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold transition-all border',
              isBotActive
                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400'
                : 'bg-white/5 border-white/10 text-white/40',
            )}
          >
            <Zap size={10} className={cn(isBotActive ? 'text-indigo-400' : 'text-white/20')} />
            {isBotActive ? botName : l('البوت متوقف', 'Bot Stopped')}
          </button>
          <button
            type="button"
            onClick={loadEverything}
            className="flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <RefreshCw size={16} className={cn(commentsLoading && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* ─── SEARCH ────────────────────────────────────────── */}
      <div className="border-b border-white/5 px-4 py-2">
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={lang.search}
          className="h-9 w-full rounded-lg bg-[#262626] px-3 text-sm text-white outline-none placeholder:text-[#8E8E8E] focus:ring-1 focus:ring-white/20"
        />
      </div>

      {/* ─── LOADING ───────────────────────────────────────── */}
      {(() => {
        if (commentsLoading) {
          return (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="size-8 animate-spin text-white/30" />
              <span className="mt-3 text-xs text-[#8E8E8E]">{lang.loading}</span>
            </div>
          );
        }

        const postIds = Object.keys(groupedByPost);

        if (postIds.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <MessageCircle className="mb-3 size-12 text-[#363636]" />
              <span className="text-sm font-semibold text-[#8E8E8E]">{lang.noComments}</span>
            </div>
          );
        }

        return postIds.map((postId) => {
          const post = postsDict[postId];
          const comments = groupedByPost[postId]!;

          return (
            <div key={postId} className="border-b border-white/10">
              {/* ─── Post Header (Instagram-style) ─── */}
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="relative size-8 overflow-hidden rounded-full border border-white/10">
                  {post?.mediaUrl
                    ? (
                        <Image src={post.mediaUrl} alt="" fill className="object-cover" unoptimized />
                      )
                    : (
                        <div className="flex size-full items-center justify-center bg-[#262626]">
                          <ImageIcon className="size-3.5 text-[#555]" />
                        </div>
                      )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-semibold text-white">
                    {post?.caption || <span className="text-[#8E8E8E]">Post</span>}
                  </p>
                </div>
                <button type="button" className="text-white/40 hover:text-white">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* ─── Post Image ─── */}
              {post?.mediaUrl && (
                <div className="relative aspect-square w-full bg-black">
                  <Image
                    src={post.mediaUrl}
                    alt={post.caption || 'Post'}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {/* ─── Action Bar ─── */}
              <div className="flex items-center gap-4 px-4 py-2.5">
                <MessageCircle size={22} className="text-white" />
                <Send size={20} className={cn('text-white', isAr && 'rotate-180')} />
                <div className="ml-auto text-xs font-semibold text-[#8E8E8E]">
                  {comments.length}
                  {' '}
                  {l('تعليق', 'comments')}
                </div>
              </div>

              {/* ─── Comments List (Instagram-style) ─── */}
              <div className="flex flex-col gap-0 px-4 pb-3">
                {comments.map((comment) => {
                  const name = comment.displayName || comment.externalId;
                  const isLiked = likedComments.has(comment.messageId);
                  const isReplying = activeReplyId === comment.messageId;

                  return (
                    <div key={comment.messageId} className="py-2">
                      {/* Main Comment */}
                      <div className="flex gap-3">
                        <IgAvatar name={name} size={32} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-relaxed text-white">
                            <span className="font-bold">{name}</span>
                            {' '}
                            <span className="text-[#E0E0E0]">{comment.text}</span>
                          </p>
                          <div className="mt-1 flex items-center gap-4">
                            <span className="text-[11px] text-[#8E8E8E]">{timeAgo(comment.createdAt)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReplyId(isReplying ? null : comment.messageId);
                                setReplyText('');
                              }}
                              className="text-[11px] font-bold text-[#8E8E8E] hover:text-white"
                            >
                              {lang.reply}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(comment)}
                              className="flex items-center gap-1 text-[11px] font-bold text-red-500/60 hover:text-red-500"
                            >
                              <Trash2 size={10} />
                              {lang.delete}
                            </button>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleLike(comment.messageId)}
                          className="mt-1 shrink-0"
                        >
                          <Heart
                            size={12}
                            className={cn(
                              'transition-all',
                              isLiked ? 'fill-red-500 text-red-500' : 'text-[#8E8E8E] hover:text-white',
                            )}
                          />
                        </button>
                      </div>

                      {/* Bot Reply (shown as threaded reply — Instagram-style) */}
                      {comment.lastReply && (
                        <div className={cn('mt-2 flex gap-3', isAr ? 'mr-10' : 'ml-10')}>
                          <div className="relative flex shrink-0 items-center justify-center">
                            <div className={cn(
                              'absolute -top-4 h-4 w-px',
                              isAr ? '-right-[13px]' : '-left-[13px]',
                              'bg-[#363636]',
                            )}
                            />
                            <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 ring-1 ring-black">
                              {comment.lastReply.senderType === 'bot'
                                ? <Zap size={10} className="text-white" />
                                : <span className="text-[8px] font-black text-white">A</span>}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-relaxed text-white">
                              <span className="font-bold text-indigo-400">
                                {comment.lastReply.senderType === 'bot' ? botName : l('المتجر', 'Store')}
                              </span>
                              {' '}
                              <span className="text-[#E0E0E0]">{comment.lastReply.text}</span>
                            </p>
                            <div className="mt-1 flex items-center gap-3">
                              <span className="text-[11px] text-[#8E8E8E]">{timeAgo(comment.lastReply.createdAt)}</span>
                              <span className={cn(
                                'rounded px-1.5 py-0.5 text-[9px] font-bold uppercase',
                                comment.lastReply.senderType === 'bot'
                                  ? 'bg-indigo-500/20 text-indigo-400'
                                  : 'bg-[#363636] text-[#8E8E8E]',
                              )}
                              >
                                {comment.lastReply.senderType === 'bot' ? 'AI' : l('يدوي', 'Manual')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Inline Reply Input (Instagram-style) */}
                      {isReplying && (
                        <form
                          onSubmit={e => handleReply(comment, e)}
                          className={cn('mt-3 flex items-center gap-2', isAr ? 'mr-10' : 'ml-10')}
                        >
                          <IgAvatar name={botName} size={24} />
                          <input
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder={lang.replyPlaceholder}
                            className="h-9 flex-1 rounded-full border border-[#363636] bg-transparent px-3 text-sm text-white outline-none placeholder:text-[#8E8E8E] focus:border-white/30"
                          />
                          <button
                            type="submit"
                            disabled={!replyText.trim() || sendingReply === comment.messageId || !comment.metaCommentId}
                            className="text-sm font-bold text-[#0095F6] transition-opacity disabled:opacity-30"
                          >
                            {sendingReply === comment.messageId
                              ? <Loader2 className="size-4 animate-spin" />
                              : lang.post}
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
};
