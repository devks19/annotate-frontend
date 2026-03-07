import React, { memo, useState } from 'react';
import { Trash2, Play, Key, Clock } from 'lucide-react';
import { api } from '../../services/api';
import AccessCodeModal from './AccessCodeModal';

const VideoCard = memo(({ video, user, onDelete, onClick }) => {
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);

  const canDelete =
    user &&
    (user.userId === video.creator?.id ||
      user.role === 'ADMIN');

  const isCreator = user && user.userId === video.creator?.id;

  const handleDelete = async (e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Delete "${video.title}"? This cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await api.videos.delete(video.id);
      onDelete?.(video.id);
      alert('Video deleted successfully!');
    } catch (err) {
      console.error('Failed to delete video', err);
      alert('Failed to delete: ' + err.message);
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(video);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="app-card app-card-hover cursor-pointer relative overflow-hidden group transition-all"
      >
        {/* Subtle top accent bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-400 via-sky-400 to-purple-400 opacity-70" />

        {/* Floating soft gradient blob */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/15 blur-3xl group-hover:bg-sky-500/20 transition-colors" />

        {/* Access Code button (creator-only) */}
        {isCreator && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAccessCodeModal(true);
            }}
            className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:bg-slate-800/90 transition-colors z-10"
            title="Manage Access Code"
          >
            <Key className="w-3 h-3" />
            <span>Access</span>
          </button>
        )}

        {/* Thumbnail area */}
        <div className="relative aspect-video rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden mb-3">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity bg-radial from-sky-500/20 via-transparent to-transparent" />
          <Play className="w-10 h-10 text-slate-400 group-hover:text-slate-200 transition-colors" />

          {/* Duration pill */}
          {video.durationSeconds && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 flex items-center gap-1 text-[11px] text-slate-100">
              <Clock className="w-3 h-3" />
              <span>{Math.round(video.durationSeconds)}s</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm md:text-base text-slate-50 truncate">
                {video.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {video.creator?.name || 'Unknown creator'}
              </p>
            </div>

            {/* Delete Button */}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="flex-shrink-0 inline-flex items-center justify-center rounded-lg p-2 text-rose-400 hover:text-rose-200 hover:bg-rose-500/15 transition-colors"
                title="Delete video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <span
                className={`badge-pill ${
                  video.isPublished
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {video.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            {video.createdAt && (
              <span className="text-[11px] text-slate-500">
                {new Date(video.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Access Code Modal */}
      {showAccessCodeModal && (
        <AccessCodeModal
          video={video}
          onClose={() => setShowAccessCodeModal(false)}
        />
      )}
    </>
  );
});

VideoCard.displayName = 'VideoCard';

export default VideoCard;
