import React from 'react';

export default function VideoList({ videos, onDelete, user }) {
    return (
        <div className="row">
            {videos.map((video) => (
                <div className="col-md-4 mb-3" key={video.id}>
                    <div className="ratio ratio-16x9">
                        <iframe
                            src={`https://www.youtube.com/embed/${video.youtubeId}`}
                            title={`Video ${video.youtubeId}`}
                            allowFullScreen
                        />
                    </div>
                    {user && video.username === user.username && onDelete && (
                        <div className="text-end mt-1">
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this video?')) {
                                        onDelete(video.id);
                                    }
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
