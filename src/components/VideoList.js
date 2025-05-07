import React from 'react';

export default function VideoList({ videos }) {
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
                </div>
            ))}
        </div>
    );
}
