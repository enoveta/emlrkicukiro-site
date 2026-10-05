import React, { useState, useEffect } from 'react';
import { FaPlay, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import img1 from '../../assets/emlr/amateraniro.jpg';
import img2 from '../../assets/emlr/ijambo.jpg';
import img3 from '../../assets/emlr/ibitaramo.jpg';
import img4 from '../../assets/emlr/indirimbo.jpg';
import img5 from '../../assets/emlr/ubuhamya.jpg';

const TV = () => {
  const API_KEY = "REMOVED_YOUTUBE_API_KEY"; // Replace with your API key

  // Updated playlists with requested titles and corresponding images
  const playlists = [
    { id: "PL2S6YdqHKn5GUYIGmy6rIUevKGQvD2PRe", title: "AMATERANIRO (Online services)", image: img1 },
    { id: "PL2S6YdqHKn5Eb5dCN9Y__Om-L8itC_J3J", title: "Ijambo ry'Imana", image: img2 },
    { id: "PL2S6YdqHKn5F_hC_zh4l-_fVzM-5-1_3p", title: "Ibitaramo (Concert)", image: img3 },
    { id: "PL2S6YdqHKn5GgReX_TBKUPyDwknWAAU_r", title: "Indirimbo (Songs)", image: img4 },
    { id: "PL2S6YdqHKn5E-SpE2HoKudQnMTNIlYRGv", title: "Ubuhamya", image: img5 }
  ];

  const [currentView, setCurrentView] = useState('playlists');
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Show playlist cards
  const showPlaylists = () => {
    setCurrentView('playlists');
    setCurrentPlaylist(null);
    setVideos([]);
    setError(null);
  };

  // Get a safe thumbnail URL with fallbacks
  const getThumbnailUrl = (thumbnails) => {
    if (thumbnails.medium && thumbnails.medium.url) return thumbnails.medium.url;
    if (thumbnails.high && thumbnails.high.url) return thumbnails.high.url;
    if (thumbnails.standard && thumbnails.standard.url) return thumbnails.standard.url;
    if (thumbnails.default && thumbnails.default.url) return thumbnails.default.url;
    return "https://img.youtube.com/vi/VAWVyzSbJ7s/mqdefault.jpg"; // Fallback image
  };

  // Show videos inside a playlist (latest first)
  const showVideos = async (playlistId, playlistTitle) => {
    setLoading(true);
    setError(null);
    
    try {
      setCurrentView('videos');
      setCurrentPlaylist({ id: playlistId, title: playlistTitle });

      // Get all videos from the playlist
      let allVideos = [];
      let nextPageToken = "";
      
      do {
        const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}&pageToken=${nextPageToken}`;
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`YouTube API error: ${res.status}`);
        }
        
        const data = await res.json();
        
        // Process items to ensure they have proper thumbnails
        const processedItems = data.items.map(item => {
          // Ensure the item has a valid thumbnail
          if (!item.snippet.thumbnails) {
            item.snippet.thumbnails = {
              default: { url: "https://img.youtube.com/vi/VAWVyzSbJ7s/mqdefault.jpg" }
            };
          }
          return item;
        });
        
        allVideos = [...allVideos, ...processedItems];
        nextPageToken = data.nextPageToken || "";
      } while (nextPageToken);

      // Sort videos by published date (newest first)
      allVideos.sort((a, b) => {
        return new Date(b.snippet.publishedAt) - new Date(a.snippet.publishedAt);
      });

      setVideos(allVideos);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(`Failed to load videos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (videoId) => {
    setCurrentVideo(videoId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVideo('');
  };

  // Start by showing playlists
  useEffect(() => {
    showPlaylists();
  }, []);

  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
    
          <h2 className="text-4xl md:text-5xl font-bold text-[#003366] mb-6">
            EMLR Kicukiro <span className="text-[#5fb9e2]">TV</span>
          </h2>
     
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 text-center">
            {error}
          </div>
        )}

        {currentView === 'videos' && (
          <div className="mb-8 flex items-center justify-between">
            <button 
              className="flex items-center text-[#003366] hover:text-[#5fb9e2] font-medium transition-colors"
              onClick={showPlaylists}
            >
              <FaArrowLeft className="mr-2" /> Back to Playlists
            </button>
            <h3 className="text-2xl font-bold text-[#003366]">
              {currentPlaylist?.title}
            </h3>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        )}
        
        {loading && (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Loading videos...</span>
          </div>
        )}
        
        {/* Playlist grid with ministry-style cards */}
        {currentView === 'playlists' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {playlists.map((playlist, index) => (
              <div 
                key={playlist.id}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100 cursor-pointer"
                onClick={() => showVideos(playlist.id, playlist.title)}
              >
                {/* Image with overlay */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={playlist.image}
                    alt={playlist.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-[#fae924] text-[#003366] p-2 rounded-full">
                    <FaPlay className="text-lg" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#001d3a] mb-3">{playlist.title}</h3>
                  <div className="inline-flex items-center font-medium text-[#5fb9e2] group-hover:text-[#003366] transition-colors">
                    Browse videos
                    <FaArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
                
                {/* Accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#fae924] to-[#5fb9e2]"></div>
              </div>
            ))}
          </div>
        )}
        
        {/* Video grid */}
        {currentView === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map(item => {
              const videoId = item.snippet.resourceId.videoId;
              const title = item.snippet.title;
              const thumbUrl = getThumbnailUrl(item.snippet.thumbnails);
              const publishedAt = new Date(item.snippet.publishedAt).toLocaleDateString();
              
              return (
                <div
                  key={item.id}
                  className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer border border-gray-100"
                  onClick={() => openModal(videoId)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={thumbUrl} 
                      alt={title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/30 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-[#fae924] text-[#003366] p-2 rounded-full">
                      <FaPlay className="text-lg" />
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h4 className="font-medium text-gray-800 line-clamp-2 group-hover:text-[#001d3a] transition-colors mb-2">
                      {title}
                    </h4>
                    <p className="text-xs text-gray-500">Published: {publishedAt}</p>
                  </div>
                  
                  {/* Accent */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#fae924] to-[#5fb9e2]"></div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50 p-4">
          <div className="relative w-full max-w-4xl">
            <span 
              className="absolute -top-12 right-0 text-3xl text-white cursor-pointer z-10 hover:text-[#fae924] transition-colors"
              onClick={closeModal}
            >
              &times;
            </span>
            <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <iframe 
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="YouTube video player"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TV;